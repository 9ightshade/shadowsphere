import { useWallet } from "@provablehq/aleo-wallet-adaptor-react";
import { useState } from "react";

export default function RegisterUser() {
  const { connected, address, executeTransaction } = useWallet();
  const [userName, setUserName] = useState("");

  const handleRegister = async () => {
    if (!connected) {
      console.log("connect wallet first");
      return;
    }

try {
    const tx= await executeTransaction({
        program:"shadowsphere_social.aleo",
        function:"register",
        inputs:[]
    })

} catch (error) {
    
}

  };
}
