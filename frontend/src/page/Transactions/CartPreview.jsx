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
import EmptyCart from "@assets/empty-cart.png";
import { RESOURCE } from "@/constants";

export default function ({ cartItems, onRemoveFromCart, onConfirmPurchase }) {
  const [modalOpen, setModalOpen] = useState(false);

  const handleConfirmPurchase = () => {
    onConfirmPurchase();
    setModalOpen(false);
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h3
        style={{ textAlign: "center", fontSize: "1.25rem", marginTop: "1rem" }}
      >
        Cart Preview
      </h3>
      {cartItems && cartItems.length > RESOURCE.NUMBER.ZERO ? (
        cartItems?.map((item) => (
          <div
            key={item?._id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              margin: "1rem 0",
            }}
          >
            <div style={{ marginRight: "1rem" }}>
              <div style={{ fontSize: "1rem", fontWeight: "bold" }}>
                {item.name}
              </div>
              <div style={{ color: "grey" }}>{item.description}</div>
              <div style={{ fontSize: "16p", marginTop: ".5rem" }}>
                {item.price}
                {RESOURCE.PHP}
              </div>
              <div style={{ marginTop: ".5rem" }}>
                <button
                  style={{ color: "red", border: "none", background: "none" }}
                  onClick={() => onRemoveFromCart(item)}
                >
                  <FontAwesomeIcon icon={faTrashAlt} />
                </button>
              </div>
            </div>
            <div>
              {item?.image?.map((imageItem, index) => (
                <img
                  key={index}
                  src={imageItem?.url}
                  alt={imageItem?.alt}
                  style={{ width: "5rem", height: "5rem", margin: ".2rem" }}
                />
              ))}
            </div>
          </div>
        ))
      ) : (
        <div style={{ marginTop: "3.5rem" }}>
          <img
            src={EmptyCart}
            alt="Empty Cart"
            style={{ width: "15rem", height: "15rem" }}
          />
        </div>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "1rem",
        }}
      >
        {cartItems && cartItems.length > RESOURCE.NUMBER.ZERO ? (
          <button
            style={{
              backgroundColor: "#2c3e50",
              borderRadius: "1.25rem",
              fontSize: "1rem",
              padding: ".5rem 1.25rem",
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
            fontSize: "1rem",
          },
        }}
      >
        <DialogTitle>Confirm Purchase</DialogTitle>
        <DialogContent style={{ padding: "1.25rem" }}>
          <DialogContentText
            style={{
              fontSize: "1.25rem",
              lineHeight: "1.5",
            }}
          >
            Are you sure you want to purchase the selected items?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)} color="error">
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
