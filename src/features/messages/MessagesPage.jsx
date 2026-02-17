// ─── MessagesPage.jsx ────────────────────────────────────────────────────────
import ChatList from "./components/ChatList";
import ChatWindow from "./components/ChatWindow";

export default function MessagesPage() {
  return (
    <div className="relative flex h-screen overflow-hidden messages-root">
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
        .messages-root {
          animation: fadeIn 0.4s ease-out both;
        }
      `}</style>
    </div>
  );
}
