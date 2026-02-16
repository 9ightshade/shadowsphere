import { WalletMultiButton } from "@provablehq/aleo-wallet-adaptor-react-ui";
import { useWallet } from "@provablehq/aleo-wallet-adaptor-react";
import { useState, useEffect } from "react";
import { stringToField } from "../../../lib/stringToField";

export default function HeroSection() {
  const {
    connected,
    address,
    requestRecords,
    executeTransaction,
    transactionStatus,
  } = useWallet();
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [secret, setSecret] = useState("");
  const [hashedData, setHashedData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isFetchingRecords, setIsFetchingRecords] = useState(false);

  const fetchUserRecords = async () => {
    // 1. Safety Guard: Ensure wallet is connected and publicKey is ready
    if (!connected || !address) {
      console.error("Wallet not connected");
      return;
    }

    setIsFetchingRecords(true);
    try {
      setIsFetchingRecords(!isFetchingRecords);
      // 2. The Async Call
      // requestRecords is provided by the useWallet() hook
      const records = await requestRecords("shadowsphere_social.aleo");

      console.log("Records:", records);

      // Optional: Filter for unspent records if needed
      // const unspent = records.filter(r => !r.spent);

      return records;
    } catch (error) {
      console.error("Error fetching Aleo records:", error);
    } finally {
      setIsFetchingRecords(false);
    }
  };

  useEffect(() => {
    if (!connected && !address) {
      setHashedData(null);
      setUsername("");
      setSecret("");
      setShowSuccess(false);
    } else {
      fetchUserRecords();
    }
  }, [connected, address]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!address && connected) {
      console.error("Wallet connected but public key not yet available.");
      return;
    }
    console.log("pubkey", address);

    // if (!publicKey) return;

    setIsSubmitting(true);

    try {
      // Production hashing: Salt + Data

      const secretField = await stringToField(secret.trim());
      const usernameField = await stringToField(username.trim().toLowerCase());

      console.log("secret field", secretField);
      console.log("user field", usernameField);

      const txId = await executeTransaction({
        program: "shadowsphere_social.aleo",
        function: "register",
        inputs: [secretField, usernameField],
        fee: 100000,
        privateFee: false,
      });

      // console.log("txId", txId);

      let status;
      let confirmed = false;

      while (!confirmed) {
        await new Promise((r) => setTimeout(r, 3000));

        status = await transactionStatus(txId.transactionId);

        console.log("Current status:", status.status);

        if (status.status === "Accepted") {
          confirmed = true;
          console.log("On-chain TX ID:", status.transactionId);
        }
      }

      setShowSuccess(true);

      setTimeout(async () => {
        const records = await requestRecords("shadowsphere_social.aleo");
        console.log("Updated records:", records);
      }, 12000);
    } catch (error) {
      console.error("registration failed:", error);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
      {/* Animated background gradients */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}></div>
      </div>

      {/* Hero content */}
      <div className="relative z-10 max-w-4xl">
        <div className="mb-8 animate-fadeIn">
          <div className="inline-block mb-4 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-sm font-medium text-indigo-400 backdrop-blur-sm">
            🔒 Privacy-First Social Network
          </div>
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-linear-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">
            ShadowSphere
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Connect your wallet to access your decentralized social dashboard.
            Your identity, your control.
          </p>
        </div>

        {/* Wallet Connection */}
        {!connected && (
          <div className="animate-slideUp">
            <div className="inline-block group">
              <WalletMultiButton className="transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/30" />
            </div>
            <p className="mt-6 text-sm text-gray-500">
              Connect with Aleo wallet to get started
            </p>
          </div>
        )}

        {/* Auth Form */}
        {connected && (
          <div className="w-full max-w-md mx-auto mt-10 animate-slideUp">
            <div className="bg-black/40 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-800/50 overflow-hidden">
              {/* Success notification */}
              {showSuccess && (
                <div className="bg-green-500/10 border-b border-green-500/20 px-6 py-3 text-green-400 text-sm flex items-center gap-2 animate-slideDown">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {mode === "register"
                    ? "Registration successful!"
                    : "Login successful!"}
                </div>
              )}

              <div className="p-8 space-y-6">
                <div className=" border-white/5">
                  <WalletMultiButton />
                </div>
                {/* Mode Toggle */}
                <div className="flex gap-2 p-1 bg-gray-900/50 rounded-2xl">
                  <button
                    onClick={() => setMode("login")}
                    className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                      mode === "login"
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                        : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                    }`}>
                    Login
                  </button>
                  <button
                    onClick={() => setMode("register")}
                    className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                      mode === "register"
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                        : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                    }`}>
                    Register
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5 text-left">
                  <div className="group">
                    <label className="block text-sm mb-2 font-medium text-gray-300 transition-colors group-focus-within:text-indigo-400">
                      Username
                    </label>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-gray-900/50 border border-gray-700/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 hover:border-gray-600"
                      placeholder="Enter your username"
                    />
                  </div>

                  <div className="group">
                    <label className="block text-sm mb-2 font-medium text-gray-300 transition-colors group-focus-within:text-indigo-400">
                      {mode === "register" ? "Secret Phrase" : "Secret Phrase"}
                    </label>
                    <input
                      type="password"
                      required
                      value={secret}
                      onChange={(e) => setSecret(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-gray-900/50 border border-gray-700/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 hover:border-gray-600"
                      placeholder={
                        mode === "register"
                          ? "e.g., your dog's name"
                          : "Enter your secret"
                      }
                    />
                    {mode === "register" && (
                      <p className="mt-2 text-xs text-gray-500">
                        Use something memorable but private
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-500 hover:to-purple-500 active:scale-[0.98] transition-all duration-300 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group">
                    <span className="absolute inset-0 w-full h-full bg-linear-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    <span className="relative flex items-center justify-center gap-2">
                      {isSubmitting ? (
                        <>
                          <svg
                            className="animate-spin h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24">
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        <>
                          {mode === "register" ? "Create Account" : "Sign In"}
                          <svg
                            className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                          </svg>
                        </>
                      )}
                    </span>
                  </button>
                </form>

                {/* Hashed Data Display */}
                {hashedData && (
                  <div className="mt-6 p-4 bg-gray-900/50 rounded-xl border border-gray-800/50 space-y-3 animate-fadeIn">
                    <div className="flex items-center gap-2 text-green-400 text-sm font-medium mb-2">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Credentials Hashed
                    </div>
                    <div className="space-y-2 text-xs">
                      <div>
                        <p className="text-gray-500 mb-1">Username Hash:</p>
                        <p className="text-gray-300 font-mono break-all bg-black/30 p-2 rounded-lg">
                          {hashedData.usernameHash}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Secret Hash:</p>
                        <p className="text-gray-300 font-mono break-all bg-black/30 p-2 rounded-lg">
                          {hashedData.secretHash}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Connected Wallet Info */}
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Connected: {address?.toString().slice(0, 8)}...
                {address?.toString().slice(-6)}
              </span>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.6s ease-out;
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
