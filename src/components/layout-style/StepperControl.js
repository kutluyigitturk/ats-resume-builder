"use client";

export default function StepperControl({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}) {
  const isMin = value <= min;
  const isMax = value >= max;

  const handleDecrease = () => {
    const newVal = Math.max(min, parseFloat((value - step).toFixed(2)));
    onChange(newVal);
  };

  const handleIncrease = () => {
    const newVal = Math.min(max, parseFloat((value + step).toFixed(2)));
    onChange(newVal);
  };

  const displayValue = Number.isInteger(value) ? value : value.toFixed(2).replace(/0$/, "");

  return (
    <div className="mb-5">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      <div className="flex items-center justify-center gap-2">
        <button
          onClick={handleDecrease}
          disabled={isMin}
          className={`w-8 h-8 flex items-center justify-center rounded-md border text-sm font-medium transition-colors ${
            isMin
              ? "border-gray-200 text-gray-300 cursor-not-allowed"
              : "border-gray-300 text-gray-600 hover:bg-gray-100"
          }`}
        >
          −
        </button>

        <div className="w-20 h-8 flex items-center justify-center rounded-md border border-gray-200 bg-gray-50 text-sm font-medium text-gray-700">
          {displayValue}{unit}
        </div>

        <button
          onClick={handleIncrease}
          disabled={isMax}
          className={`w-8 h-8 flex items-center justify-center rounded-md border text-sm font-medium transition-colors ${
            isMax
              ? "border-gray-200 text-gray-300 cursor-not-allowed"
              : "border-gray-300 text-gray-600 hover:bg-gray-100"
          }`}
        >
          +
        </button>
      </div>

      <p className="text-xs text-gray-400 text-center mt-1">
        {min}{unit} – {max}{unit}
      </p>
    </div>
  );
}