import { useWalletAuthStore } from "../../../store/useWalletAuthStore";
import { useNavigate } from "react-router-dom";


export default function ConnectWalletButton() {
  const { connect, isConnected, address } = useWalletAuthStore();
  const navigate = useNavigate();
  const handleConnect = async () => {
    // 🔌 Replace with real wallet logic (e.g window.ethereum)
    const mockAddress = "0xF9A3...D21E";
    connect(mockAddress);
    navigate("/feed");
  };

  if (isConnected) {
    return (
      <div className="px-6 py-3 rounded-2xl bg-green-600 text-white">
        Connected: {address}
      </div>
    );
  }

  return (
    <button
      onClick={handleConnect}
      className="px-8 py-4 cursor-pointer rounded-2xl bg-[var(--color-primary)]
                 text-white text-lg font-semibold
                 hover:scale-105 transition-transform">
      Connect Wallet
    </button>
  );
}
