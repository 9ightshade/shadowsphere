// main.tsx or main.jsx

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";

import { AleoWalletProvider } from "@provablehq/aleo-wallet-adaptor-react";

import { WalletModalProvider } from "@provablehq/aleo-wallet-adaptor-react-ui";
import "@provablehq/aleo-wallet-adaptor-react-ui/dist/styles.css";

import { LeoWalletAdapter } from "@provablehq/aleo-wallet-adaptor-leo";
import { FoxWalletAdapter } from "@provablehq/aleo-wallet-adaptor-fox";
import { SoterWalletAdapter } from "@provablehq/aleo-wallet-adaptor-soter";
import { PuzzleWalletAdapter } from "@provablehq/aleo-wallet-adaptor-puzzle";
import { ShieldWalletAdapter } from "@provablehq/aleo-wallet-adaptor-shield";

import { DecryptPermission } from "@provablehq/aleo-wallet-adaptor-core";

const network = "testnet";

const wallets = [
  new ShieldWalletAdapter({ appName: "ShadowSphere" }),
  new LeoWalletAdapter({ appName: "ShadowSphere" }),
  new FoxWalletAdapter({ appName: "ShadowSphere" }),
  new SoterWalletAdapter({ appName: "ShadowSphere" }),
  new PuzzleWalletAdapter({
    appName: "ShadowSphere",
    programIdPermissions: {
      AleoTestnet: [],
    },
  }),
];

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AleoWalletProvider
        wallets={wallets}
        network={network}
        decryptPermission={DecryptPermission.UponRequest}
        autoConnect>
        <WalletModalProvider>
          <App />
        </WalletModalProvider>
      </AleoWalletProvider>
    </BrowserRouter>
  </StrictMode>,
);
