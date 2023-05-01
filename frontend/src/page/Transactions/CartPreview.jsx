export default function ({ cartItems, onRemoveFromCart }) {
  return (
    <div className="cartPreview">
      <h3>Cart Preview</h3>
      {cartItems.map((item) => (
        <div key={item._id} className="cartItem">
          <span>{item.name}</span>
          <button
            onClick={() => {
              onRemoveFromCart(item);
            }}
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}
