import BalanceCard from "./components/BalanceCard";
import WalletStats from "./components/WalletStats";
import TransactionList from "./components/TransactionList";
import { useWallet } from "@provablehq/aleo-wallet-adaptor-react";
// import { Transaction } from "./types";

const mockTransactions = [
  {
    id: "1",
    type: "gift_sent",
    amount: 50,
    timestamp: "2h ago",
    status: "completed",
  },
  {
    id: "2",
    type: "deposit",
    amount: 200,
    timestamp: "1d ago",
    status: "completed",
  },
  {
    id: "3",
    type: "gift_received",
    amount: 75,
    timestamp: "3d ago",
    status: "completed",
  },
];

export default function WalletPage() {
  const { publicKey, connected, disconnect } = useWallet();

  return (
    <div className="flex flex-col gap-8">
      <BalanceCard balance={1245.5} />

      <WalletStats sent={150} received={275} fees={8} />

      <TransactionList transactions={mockTransactions} />
      {connected && (
        <>
          <p>Address:</p>
          <p className="break-all">{publicKey?.toString()}</p>

          <button onClick={disconnect}>Disconnect</button>
        </>
      )}
    </div>
  );
}
