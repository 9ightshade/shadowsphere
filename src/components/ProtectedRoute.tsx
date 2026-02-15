// components/ProtectedRoute.tsx

import { useWallet } from "@provablehq/aleo-wallet-adaptor-react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { connected, connecting } = useWallet();

  if (connecting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Connecting wallet...
      </div>
    );
  }

  if (!connected) {
    return <Navigate to="/" replace />;
  }

  return children;
}
