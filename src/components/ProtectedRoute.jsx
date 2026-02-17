import { useWallet } from "@provablehq/aleo-wallet-adaptor-react";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { connected, connecting, address, requestRecords } = useWallet();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [hasUserRecord, setHasUserRecord] = useState(false);

  useEffect(() => {
    const verifyUser = async () => {
      if (connecting) return;

      if (!connected || !address) {
        setCheckingAuth(false);
        return;
      }

      try {
        const records = await requestRecords("shadowsphere_social.aleo");

        setHasUserRecord(records?.length > 0);
      } catch (err) {
        console.error("Record check failed:", err);
        setHasUserRecord(false);
      } finally {
        setCheckingAuth(false);
      }
    };

    verifyUser();
  }, [connected, connecting, address, requestRecords]);

  // Loading State
  // We stay here as long as connecting is true OR we haven't finished our record check
  if (connecting || checkingAuth) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-indigo-400">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="animate-pulse font-mono text-sm">
          SCANNING ALEO LEDGER...
        </p>
      </div>
    );
  }

  // Final Redirect Logic
  // Only redirect once we are CERTAIN checkingAuth is finished
  if (!connected) {
    return <Navigate to="/" replace />;
  }

  if (!hasUserRecord) {
    // Optional: You might want to redirect to a /register page
    // instead of home if they have a wallet but no record.
    return <Navigate to="/" replace />;
  }

  return children;
}
