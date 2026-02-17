// ─── CategorySelect.jsx ───────────────────────────────────────────────────────
// Drop-in replacement for the native <select> in CreatePostModal.
// Usage:

import { useState, useRef, useEffect } from "react";
import { Hash, ChevronDown, Check } from "lucide-react";

export default function CategorySelect({ value, onChange, categories }) {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(null); // keyboard nav
  const containerRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!containerRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Keyboard nav
  const handleKeyDown = (e) => {
    if (!open) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        setOpen(true);
        setFocused(categories.indexOf(value));
      }
      return;
    }
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocused((f) => Math.min((f ?? -1) + 1, categories.length - 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocused((f) => Math.max((f ?? categories.length) - 1, 0));
    }
    if (e.key === "Enter" && focused !== null) {
      e.preventDefault();
      onChange(categories[focused]);
      setOpen(false);
    }
  };

  const select = (cat) => {
    onChange(cat);
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-widest flex items-center gap-1.5">
        <Hash size={11} />
        Category
      </label>

      <div ref={containerRef} className="relative" onKeyDown={handleKeyDown}>
        {/* ── Trigger ──────────────────────────── */}
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className={`
            w-full flex items-center justify-between
            px-4 py-3 rounded-xl text-sm text-left
            bg-[var(--color-surface-2)] border transition-all duration-300
            focus:outline-none active:scale-[0.99]
            ${
              open
                ? "border-indigo-500/60 ring-2 ring-indigo-500/15 shadow-lg shadow-indigo-500/10"
                : "border-[var(--color-border)] hover:border-indigo-500/40"
            }
          `}>
          <span className="text-[var(--color-text-primary)] font-medium">
            {value}
          </span>

          <ChevronDown
            size={15}
            className={`text-[var(--color-text-secondary)] transition-transform duration-300 flex-shrink-0 ${
              open ? "rotate-180 text-indigo-400" : ""
            }`}
          />
        </button>

        {/* ── Dropdown ─────────────────────────── */}
        {open && (
          <div
            className="absolute z-50 left-0 right-0 mt-2 dropdown-panel
            bg-[var(--color-surface)] border border-gray-800/60
            rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">
            {/* Top glow line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent pointer-events-none" />

            <ul
              role="listbox"
              className="py-1.5 max-h-56 overflow-y-auto dropdown-scroll">
              {categories.map((cat, i) => {
                const isSelected = cat === value;
                const isFocused = focused === i;

                return (
                  <li
                    key={cat}
                    role="option"
                    aria-selected={isSelected}
                    onMouseEnter={() => setFocused(i)}
                    onMouseLeave={() => setFocused(null)}
                    onClick={() => select(cat)}
                    className={`
                      relative flex items-center justify-between
                      mx-1.5 px-3 py-2.5 rounded-xl text-sm
                      cursor-pointer select-none
                      transition-all duration-150
                      option-item
                      ${
                        isSelected
                          ? "bg-gradient-to-r from-indigo-600/20 to-purple-600/15 text-indigo-300 font-semibold"
                          : isFocused
                            ? "bg-indigo-500/10 text-[var(--color-text-primary)]"
                            : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                      }
                    `}
                    style={{ animationDelay: `${i * 25}ms` }}>
                    <span>{cat}</span>

                    {isSelected && (
                      <Check
                        size={13}
                        className="text-indigo-400 drop-shadow-[0_0_6px_rgba(99,102,241,0.5)] flex-shrink-0"
                      />
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>    

      <style jsx>{`
        @keyframes dropdownIn {
          from {
            opacity: 0;
            transform: translateY(-6px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes optionIn {
          from {
            opacity: 0;
            transform: translateX(-6px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .dropdown-panel {
          animation: dropdownIn 0.2s cubic-bezier(0.34, 1.3, 0.64, 1) both;
        }
        .option-item {
          animation: optionIn 0.2s ease-out both;
        }
        .dropdown-scroll::-webkit-scrollbar {
          width: 3px;
        }
        .dropdown-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .dropdown-scroll::-webkit-scrollbar-thumb {
          background: rgba(99, 102, 241, 0.25);
          border-radius: 99px;
        }
        .dropdown-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.45);
        }
      `}</style>
    </div>
  );
}
