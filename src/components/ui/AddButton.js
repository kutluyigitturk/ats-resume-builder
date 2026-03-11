// Standard "+ Add ..." button used at the top of each section's item list
export default function AddButton({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 mb-4 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
    >
      <span className="text-lg leading-none">+</span>
      {label}
    </button>
  );
}