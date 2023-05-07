import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import EmptyCart from "../../assets/empty-cart.png";

export default function ({ cartItems, onRemoveFromCart, onConfirmPurchase }) {
  const [modalOpen, setModalOpen] = useState(false);

  const handleConfirmPurchase = () => {
    onConfirmPurchase();
    setModalOpen(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h3 style={{ textAlign: "center", fontSize: "24px", marginTop: "20px" }}>
        Cart Preview
      </h3>
      {cartItems && cartItems.length > 0 ? (
        cartItems.map((item) => (
          <div
            key={item._id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              margin: "20px 0",
            }}
          >
            <div>
              <div style={{ fontSize: "20px", fontWeight: "bold" }}>
                {item.name}
              </div>
              <div style={{ color: "grey" }}>{item.description}</div>
              <div style={{ fontSize: "16p", marginTop: "10px" }}>
                ₱{item.price}
              </div>
              <div style={{ marginTop: "10px" }}>
                <button
                  style={{ color: "red", border: "none", background: "none" }}
                  onClick={() => onRemoveFromCart(item)}
                >
                  <FontAwesomeIcon icon={faTrashAlt} />
                </button>
              </div>
            </div>
            <div>
              {item.image.map((imageItem, index) => (
                <img
                  key={index}
                  src={imageItem.url}
                  alt={imageItem.alt}
                  style={{ width: "70px", height: "70px", margin: "5px" }}
                />
              ))}
            </div>
          </div>
        ))
      ) : (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <img
            src={EmptyCart}
            alt="Empty Cart"
            style={{ width: "200px", height: "200px" }}
          />
        </div>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "20px",
        }}
      >
        {cartItems && cartItems.length > 0 ? (
          <button
            style={{
              backgroundColor: "#2c3e50",
              borderRadius: "30px",
              fontSize: "20px",
              padding: "10px 30px",
              color: "white",
            }}
            onClick={() => setModalOpen(true)}
          >
            Confirm Purchase
          </button>
        ) : null}
      </div>

      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        maxWidth="sm"
        PaperProps={{
          style: {
            fontSize: "16px",
          },
        }}
      >
        <DialogTitle>Confirm Purchase</DialogTitle>
        <DialogContent style={{ padding: "20px" }}>
          <DialogContentText
            style={{
              fontSize: "18px",
              lineHeight: "1.5",
            }}
          >
            Are you sure you want to purchase the selected items?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleConfirmPurchase} color="info">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
