import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CardMedia,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";

export default function ({ cartItems, onRemoveFromCart, onConfirmPurchase }) {
  const [modalOpen, setModalOpen] = useState(false);

  const handleConfirmPurchase = () => {
    onConfirmPurchase();
    setModalOpen(false);
  };

  return (
    <div className="cartPreview" style={{ padding: "20px" }}>
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
            }}
          >
            <span>{item.name}</span>
            <span>{item.price}</span>
            {item.image?.map((imageItem, index) => (
              <CardMedia
                key={index}
                component="img"
                sx={{
                  height: "100px",
                  width: "100px",
                  borderRadius: 2,
                  margin: "1rem",
                }}
                image={imageItem.url}
                alt={imageItem.alt}
              />
            ))}
            <button
              style={{ color: "red" }}
              onClick={() => onRemoveFromCart(item)}
            >
              <FontAwesomeIcon icon={faTrashAlt} />
            </button>
          </div>
        ))
      ) : (
        <div>No items in cart</div>
      )}
      <br />
      {cartItems && cartItems.length > 0 ? (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button
            style={{
              backgroundColor: "blue",
              borderRadius: "10px",
              fontSize: "20px",
              padding: "10px 20px",
              color: "white",
            }}
            onClick={() => setModalOpen(true)}
          >
            Confirm Purchase
          </button>
        </div>
      ) : null}

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
