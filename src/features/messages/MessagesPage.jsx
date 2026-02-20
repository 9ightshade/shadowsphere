// ─── MessagesPage.jsx ────────────────────────────────────────────────────────
import { useState } from "react";
import ChatList from "./components/ChatList";
import ChatWindow from "./components/ChatWindow";
import NewMessageModal from "./components/NewMessageModal";
import { MessageSquarePlus } from "lucide-react";

export default function MessagesPage() {
  const [newMessageOpen, setNewMessageOpen] = useState(false);

  return (
    <>
      <div className="relative flex h-full overflow-hidden messages-root">
        {/* Ambient glows */}
        <div className="absolute top-0 left-72 w-96 h-64 bg-indigo-500/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-64 bg-purple-500/5 blur-3xl pointer-events-none" />

        {/* Left panel */}
        <div className="relative w-80 flex-shrink-0 border-r border-[var(--color-border)] flex flex-col">
          {/* Gradient right edge */}
          <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-indigo-500/30 to-transparent pointer-events-none" />
          <ChatList />
        </div>

        {/* Right panel */}
        <div className="relative flex-1 flex flex-col min-w-0">
          <ChatWindow />
        </div>

        {/* FAB — New Message */}
        <button
          onClick={() => setNewMessageOpen(true)}
          className="group fixed bottom-8 cursor-pointer right-8 z-50
            w-14 h-14 rounded-2xl
            bg-gradient-to-br from-indigo-600 to-purple-600
            hover:from-indigo-500 hover:to-purple-500
            active:scale-95 hover:scale-105
            shadow-xl shadow-indigo-500/40 hover:shadow-indigo-500/60
            transition-all duration-300
            flex items-center justify-center
            fab-btn"
          aria-label="New message">
          {/* Ping ring */}
          <span className="absolute inset-0 rounded-2xl bg-indigo-500/30 animate-ping opacity-60 pointer-events-none" />
          <MessageSquarePlus
            size={22}
            className="text-white relative z-10 transition-transform duration-300 group-hover:scale-110"
          />
        </button>

        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes fabIn {
            from {
              opacity: 0;
              transform: scale(0.6) translateY(20px);
            }
            to {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }
          .messages-root {
            animation: fadeIn 0.4s ease-out both;
          }
          .fab-btn {
            animation: fabIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s both;
          }
        `}</style>
      </div>

      <NewMessageModal
        open={newMessageOpen}
        onClose={() => setNewMessageOpen(false)}
      />
    </>
  );
}
