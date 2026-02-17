// ─── RequestCard.jsx ──────────────────────────────────────────────────────────
import { useFriendsStore } from "../../../store/useFriendsStore";
import { Check, X, Clock } from "lucide-react";
import { useState } from "react";

export default function RequestCard({ request, type }) {
  const { acceptRequest, rejectRequest } = useFriendsStore();
  const [status, setStatus] = useState(null); // "accepted" | "rejected"

  const alias = request.from?.alias ?? request.username ?? "Unknown";
  const initials = alias
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleAccept = async () => {
    setStatus("accepted");
    await new Promise((r) => setTimeout(r, 400));
    acceptRequest(request.id);
  };

  const handleReject = async () => {
    setStatus("rejected");
    await new Promise((r) => setTimeout(r, 400));
    rejectRequest(request.id);
  };

  return (
    <div
      className={`
      group relative flex items-center gap-4 p-4 rounded-2xl border
      bg-[var(--color-surface-2)] transition-all duration-300 overflow-hidden
      ${
        status === "accepted"
          ? "border-green-500/30 bg-green-500/5 opacity-60 scale-[0.99]"
          : status === "rejected"
            ? "border-rose-500/30 bg-rose-500/5 opacity-40 scale-[0.98]"
            : type === "incoming"
              ? "border-[var(--color-border)] hover:border-indigo-500/25 hover:bg-indigo-500/5"
              : "border-[var(--color-border)] hover:border-amber-500/20 hover:bg-amber-500/3"
      }
    `}>
      {/* Top glow */}
      {type === "incoming" && (
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      )}

      {/* Avatar */}
      <div className="relative flex-shrink-0">
        {request.avatar ? (
          <img
            src={request.avatar}
            alt={alias}
            className="w-11 h-11 rounded-xl object-cover border border-[var(--color-border)]"
          />
        ) : (
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-600/30 to-purple-600/30 border border-indigo-500/20 flex items-center justify-center text-sm font-bold text-indigo-300">
            {initials}
          </div>
        )}

        {/* Type indicator dot */}
        <span
          className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[var(--color-surface-2)] ${
            type === "incoming" ? "bg-indigo-500" : "bg-amber-400"
          }`}
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[var(--color-text-primary)] truncate">
          {alias}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5">
          {type === "incoming" ? (
            <>
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              <span className="text-[10px] text-indigo-400 font-medium">
                Wants to connect
              </span>
            </>
          ) : (
            <>
              <Clock size={9} className="text-amber-400" />
              <span className="text-[10px] text-amber-400 font-medium">
                Awaiting response
              </span>
            </>
          )}
          {request.username && (
            <span className="text-[10px] text-[var(--color-text-secondary)]">
              · @{request.username}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      {type === "incoming" ? (
        <div className="flex items-center gap-2">
          <button
            onClick={handleAccept}
            disabled={!!status}
            className="group/btn flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white
              bg-gradient-to-r from-green-600 to-emerald-600
              hover:from-green-500 hover:to-emerald-500
              shadow-md shadow-green-500/25 hover:shadow-green-500/40
              active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-300">
            <Check
              size={13}
              className="group-hover/btn:scale-110 transition-transform duration-200"
            />
            Accept
          </button>
          <button
            onClick={handleReject}
            disabled={!!status}
            className="group/btn flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold
              border border-rose-500/30 text-rose-400 bg-rose-500/10
              hover:bg-rose-500/20 hover:border-rose-500/50
              active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-300">
            <X
              size={13}
              className="group-hover/btn:scale-110 transition-transform duration-200"
            />
            Decline
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <Clock size={12} className="text-amber-400 animate-pulse" />
          <span className="text-xs font-semibold text-amber-400">Pending</span>
        </div>
      )}
    </div>
  );
}
