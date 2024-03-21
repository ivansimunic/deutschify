export default function IconButton({ onClick, icon }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center rounded-full bg-paper text-sm text-wood"
    >
      <span className={icon + " m-1 h-6 w-6 bg-wood"} />
    </button>
  );
}
