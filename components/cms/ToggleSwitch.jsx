"use client";

export default function ToggleSwitch({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        {label && (
          <p className="font-label text-sm font-bold text-black">{label}</p>
        )}
        {description && (
          <p className="text-xs text-on-surface-variant mt-0.5">{description}</p>
        )}
      </div>
      <button
        onClick={() => onChange?.(!checked)}
        className={`relative w-12 h-6 transition-colors duration-200 ${
          checked ? "bg-primary" : "bg-surface-container-highest border border-white/10"
        }`}
      >
        <span
          className={`absolute top-1 w-4 h-4 transition-all duration-200 ${
            checked
              ? "left-7 bg-on-primary"
              : "left-1 bg-on-surface-variant"
          }`}
        />
      </button>
    </div>
  );
}
