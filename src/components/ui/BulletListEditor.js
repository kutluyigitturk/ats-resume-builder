import { inputStyle, labelStyle } from "@/lib/constants";
import { TrashIcon } from "@/icons";

// Editable list of bullet points with add/remove controls
// Used by Experience (responsibilities) and Projects (descriptions)
export default function BulletListEditor({
  label,
  placeholder,
  addLabel,
  bullets,
  onUpdate,
  onAdd,
  onRemove,
}) {
  return (
    <div>
      <label className={labelStyle}>{label}</label>
      {bullets.map((bullet, bIndex) => (
        <div key={bIndex} className="flex gap-2 mb-2">
          <input
            className={`${inputStyle} flex-1`}
            placeholder={placeholder}
            value={bullet}
            onChange={(e) => onUpdate(bIndex, e.target.value)}
          />
          {bullets.length > 1 && (
            <button
              onClick={() => onRemove(bIndex)}
              className="text-gray-400 hover:text-red-500 px-1 transition-colors"
            >
              <TrashIcon size={14} />
            </button>
          )}
        </div>
      ))}
      <button
        onClick={onAdd}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mt-1 transition-colors"
      >
        <span className="text-base leading-none">+</span>
        {addLabel}
      </button>
    </div>
  );
}