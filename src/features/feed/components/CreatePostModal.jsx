import { useState } from "react";
import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";
import { X, Lock, Unlock, Shield, Hash, Send, ChevronDown } from "lucide-react";

const categories = [
  "Whistleblowing",
  "Private Communities",
  "Finance",
  "General",
  "Technology",
  "Governance",
  "Security",
  "Other",
];

const MAX_CHARS = 500;

export default function CreatePostModal({ open, onClose }) {
  const [content, setContent] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [encrypted, setEncrypted] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [done, setDone] = useState(false);

  if (!open) return null;

  const charCount = content.length;
  const charLeft = MAX_CHARS - charCount;
  const overLimit = charLeft < 0;
  const nearLimit = charLeft <= 60 && !overLimit;
  const fillPct = Math.min((charCount / MAX_CHARS) * 100, 100);

  const handlePublish = async () => {
    if (!content.trim() || overLimit) return;
    setPublishing(true);
    await new Promise((r) => setTimeout(r, 1000));
    setPublishing(false);
    setDone(true);
    setTimeout(() => {
      setDone(false);
      setContent("");
      setCategory(categories[0]);
      setEncrypted(false);
      onClose();
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 modal-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

      {/* Panel */}
      <div className="modal-panel relative w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl shadow-black/60 border border-gray-800/60">
        {/* Ambient top glow */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent pointer-events-none" />
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-32 bg-indigo-500/15 blur-3xl pointer-events-none" />

        {/* Background */}
        <div className="relative z-10 bg-[var(--color-surface)] p-6 flex flex-col gap-5">
          {/* ── Header ───────────────────────────────── */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Shield size={17} className="text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[var(--color-text-primary)] leading-tight">
                  Create Post
                </h2>
                <p className="text-[10px] text-[var(--color-text-secondary)] leading-tight mt-0.5">
                  Anonymous · Zero-knowledge
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="group p-2 rounded-xl border border-transparent hover:border-gray-700/60 hover:bg-gray-800/50 active:scale-95 transition-all duration-300">
              <X
                size={16}
                className="text-[var(--color-text-secondary)] group-hover:text-white transition-colors duration-300"
              />
            </button>
          </div>

          {/* ── Textarea ─────────────────────────────── */}
          <div className="relative">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              placeholder="Share something anonymously..."
              className={`
                w-full bg-[var(--color-surface-2)] border rounded-2xl p-4 text-sm
                resize-none focus:outline-none transition-all duration-300
                text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)]/40
                ${
                  overLimit
                    ? "border-rose-500/60 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                    : "border-[var(--color-border)] focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/15"
                }
              `}
            />

            {/* Char progress bar */}
            <div className="absolute bottom-3 left-4 right-4 flex items-center gap-2">
              <div className="flex-1 h-0.5 rounded-full bg-gray-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    overLimit
                      ? "bg-rose-500"
                      : nearLimit
                        ? "bg-amber-400"
                        : "bg-indigo-500"
                  }`}
                  style={{ width: `${fillPct}%` }}
                />
              </div>
              <span
                className={`text-[10px] font-mono tabular-nums transition-colors duration-300 ${
                  overLimit
                    ? "text-rose-400"
                    : nearLimit
                      ? "text-amber-400"
                      : "text-[var(--color-text-secondary)]"
                }`}>
                {charLeft}
              </span>
            </div>
          </div>

          {/* ── Category ─────────────────────────────── */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-widest flex items-center gap-1.5">
              <Hash size={11} />
              Category
            </label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full appearance-none bg-[var(--color-surface-2)] border border-[var(--color-border)] hover:border-indigo-500/40 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/15 focus:outline-none rounded-xl px-4 py-3 text-sm text-[var(--color-text-primary)] transition-all duration-300 cursor-pointer pr-10">
                {categories.map((c) => (
                  <option className="bg-[#0f0f0f]" key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={15}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] pointer-events-none"
              />
            </div>
          </div>

          {/* ── Encryption Toggle ────────────────────── */}
          <button
            type="button"
            onClick={() => setEncrypted(!encrypted)}
            className={`
              group flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl border
              transition-all duration-300 active:scale-[0.98] text-left
              ${
                encrypted
                  ? "bg-gradient-to-r from-indigo-600/15 to-purple-600/15 border-indigo-500/30 hover:border-indigo-500/50"
                  : "bg-[var(--color-surface-2)] border-[var(--color-border)] hover:border-indigo-500/20 hover:bg-indigo-500/5"
              }
            `}>
            {/* Toggle pill */}
            <div
              className={`relative w-10 h-5.5 rounded-full flex-shrink-0 transition-all duration-300 ${
                encrypted
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 shadow-md shadow-indigo-500/30"
                  : "bg-gray-700"
              }`}
              style={{ height: "22px", minWidth: "40px" }}>
              <span
                className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300 ${
                  encrypted ? "left-[22px]" : "left-0.5"
                }`}
              />
            </div>

            {/* Icon */}
            {encrypted ? (
              <Lock
                size={15}
                className="text-indigo-400 drop-shadow-[0_0_6px_rgba(99,102,241,0.6)] flex-shrink-0"
              />
            ) : (
              <Unlock
                size={15}
                className="text-[var(--color-text-secondary)] group-hover:text-indigo-400 flex-shrink-0 transition-colors duration-300"
              />
            )}

            <div className="flex-1">
              <p
                className={`text-sm font-semibold leading-tight transition-colors duration-300 ${
                  encrypted
                    ? "text-indigo-300"
                    : "text-[var(--color-text-primary)]"
                }`}>
                {encrypted ? "Encryption enabled" : "Encrypt this post"}
              </p>
              <p className="text-[10px] text-[var(--color-text-secondary)] mt-0.5 leading-tight">
                {encrypted
                  ? "Only verified recipients can decrypt"
                  : "Make content readable only with a key"}
              </p>
            </div>
          </button>

          {/* ── Submit ───────────────────────────────── */}
          <button
            type="button"
            onClick={handlePublish}
            disabled={!content.trim() || overLimit || publishing}
            className={`
              group relative w-full py-3.5 rounded-2xl font-semibold text-sm text-white
              overflow-hidden flex items-center justify-center gap-2
              transition-all duration-300 active:scale-[0.98]
              ${
                !content.trim() || overLimit
                  ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                  : done
                    ? "bg-gradient-to-r from-green-600 to-emerald-600 shadow-lg shadow-green-500/30"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50"
              }
            `}>
            {/* Hover shimmer */}
            {!done && content.trim() && !overLimit && (
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
            )}

            {publishing ? (
              <>
                <svg
                  className="animate-spin h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Publishing...
              </>
            ) : done ? (
              <>
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Published!
              </>
            ) : (
              <>
                <Send
                  size={15}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
                Publish Post
              </>
            )}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes backdropIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes panelIn {
          from {
            opacity: 0;
            transform: scale(0.94) translateY(16px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .modal-backdrop {
          animation: backdropIn 0.2s ease-out both;
        }
        .modal-panel {
          animation: panelIn 0.3s cubic-bezier(0.34, 1.26, 0.64, 1) both;
        }
      `}</style>
    </div>
  );
}
