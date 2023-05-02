import React, { useState } from 'react'
import {
  useGetCamerasQuery,
  useAddTransactionMutation,
  useGetTransactionsQuery,
} from '@/state/api/reducer'
import { PacmanLoader } from 'react-spinners'
import { ERROR } from '../../constants'
import { CameraLayout } from '@/component'
import CartPreview from '../Transactions/CartPreview'
import Navbar from '../../component/Navbar'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export default function () {
  const navigate = useNavigate()
  const { data, isLoading, isError } = useGetCamerasQuery()

  const { refetch: refetchTransactions } = useGetTransactionsQuery()

  const [cartItems, setCartItems] = useState([])
  console.log(cartItems)

  const [open, setOpen] = useState(false)
  const [error, setError] = useState(false)

  const [transactionDate, setTransactionDate] = useState(new Date())

  const [addTransaction] = useAddTransactionMutation()

  const auth = useSelector((state) => state.auth)

  const [cartCount, setCartCount] = useState(0)

  const handleOnAddToCart = (item) => {
    if (!cartItems.some((cartItem) => cartItem._id === item._id)) {
      setCartItems([...cartItems, item])
      setCartCount(cartCount + 1) // Add this line
    }
  }
  const handleOnRemoveFromCart = (itemToRemove) => {
    const newCartItems = cartItems.filter((cartItem, index) => {
      return (
        cartItem._id === itemToRemove._id &&
        cartItems.indexOf(cartItem) !== index
      )
    })
    setCartItems(newCartItems)
  }

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleConfirmPurchase = async () => {
    try {
      const newTransaction = await addTransaction({
        user: auth.user._id,
        cameras: cartItems.map((item) => item._id),
        status: 'pending',
        date: transactionDate,
      })
      await refetchTransactions()
      navigate('/dashboard/comment/create')
      setCartItems([])
      handleClose()
    } catch (err) {
      setError(true)
      console.error(err)
    }
  }

  return (
    <>
      <Navbar
        cartItems={cartItems}
        onRemoveFromCart={handleOnRemoveFromCart}
        onAddToCart={handleOnAddToCart}
        cartCount={cartCount} // Add this line
      />

      {isLoading ? (
        <div className="loader">
          <PacmanLoader color="#2c3e50" loading={true} size={50} />
        </div>
      ) : isError ? (
        <div className="errorMessage">{ERROR.GET_CAMERAS_ERROR}</div>
      ) : (
        <>
          <CameraLayout
            data={data?.details}
            onAddToCart={handleOnAddToCart}
            cartItems={cartItems}
          />

          <CartPreview
            cartItems={cartItems}
            onRemoveFromCart={handleOnRemoveFromCart}
          />
          <Button
            variant="contained"
            onClick={handleOpen}
            disabled={cartItems.length === 0}
          >
            Confirm Purchase
          </Button>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Confirm Purchase</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to purchase the selected items?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={handleConfirmPurchase}>Confirm</Button>
            </DialogActions>
          </Dialog>
          {error && (
            <div className="errorMessage">
              An error occurred while processing your purchase.
            </div>
          )}
        </>
      )}
    </>
  )
}
