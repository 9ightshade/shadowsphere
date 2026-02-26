// ─── MessageBubble.jsx ────────────────────────────────────────────────────────
import { Check, CheckCheck, Lock } from "lucide-react";
import { useWallet } from "@provablehq/aleo-wallet-adaptor-react";
const STATUS_ICONS = {
  sent: <Check size={10} className="text-white/40" />,
  delivered: <CheckCheck size={10} className="text-white/50" />,
  read: <CheckCheck size={10} className="text-indigo-300" />,
};

export default function MessageBubble({ message }) {
  const time = new Date(message.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const { address } = useWallet();

  const isOwn = message?.sender === address;

  console.log("message", message);

  return (
    <div
      className={`flex items-end gap-2 ${isOwn ? "justify-end" : "justify-start"} bubble-root`}>
      {/* Avatar — only for incoming */}
      {!isOwn && (
        <div className="w-7 h-7 flex-shrink-0 rounded-lg bg-gradient-to-br from-indigo-600/30 to-purple-600/30 border border-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-300 mb-0.5">
          {message.senderId?.[0]?.toUpperCase() ?? "?"}
        </div>
      )}

      <div
        className={`group flex flex-col gap-1 max-w-xs ${isOwn ? "items-end" : "items-start"}`}>
        {/* Bubble */}
        <div
          className={`
            relative px-4 py-2.5 break-words text-sm leading-relaxed
            transition-all duration-200
            ${
              isOwn
                ? `bg-gradient-to-br from-indigo-600 to-purple-600
                 text-white rounded-3xl rounded-br-md
                 shadow-lg shadow-indigo-500/25
                 hover:shadow-indigo-500/40`
                : `bg-[var(--color-surface-2)] border border-[var(--color-border)]
                 text-[var(--color-text-primary)] rounded-3xl rounded-bl-md
                 hover:border-indigo-500/20`
            }
          `}>
          {/* Encrypted badge */}
          {message.encrypted && (
            <div className="flex items-center gap-1 mb-1.5">
              <Lock
                size={9}
                className={isOwn ? "text-indigo-200/60" : "text-indigo-400/60"}
              />
              <span
                className={`text-[9px] font-semibold tracking-wider uppercase ${
                  isOwn ? "text-indigo-200/50" : "text-indigo-400/50"
                }`}>
                Encrypted
              </span>
            </div>
          )}

          {message.content}

          {/* Time + status */}
          <div
            className={`flex items-center gap-1 mt-1.5 ${isOwn ? "justify-end" : "justify-start"}`}>
            <span
              className={`text-[10px] tabular-nums ${
                isOwn ? "text-white/40" : "text-[var(--color-text-secondary)]"
              }`}>
              {time}
            </span>
            {isOwn && STATUS_ICONS[message.status ?? "sent"]}
          </div>

          {/* Tail for own messages — subtle inner glow */}
          {isOwn && (
            <div className="absolute inset-0 rounded-3xl rounded-br-md bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes bubblePop {
          from {
            opacity: 0;
            transform: scale(0.88) translateY(6px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .bubble-root {
          animation: bubblePop 0.25s cubic-bezier(0.34, 1.4, 0.64, 1) both;
        }
      `}</style>
    </div>
  );
}
