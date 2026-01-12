function FavoriteButton({ isFav, onClick }) {
  return (
    <button className="fav-btn" onClick={onClick}>
      {isFav ? " 🤍Remove" : "❤️ Add"}
    </button>
  );
}

export default FavoriteButton;
