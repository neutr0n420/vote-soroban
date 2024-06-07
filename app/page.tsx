'use client'
import { checkConnection, testFunction, retrievePublicKey } from "@/soroban/WalletIntegration"
import { downVote, upVote } from "@/soroban/utils";
import { setAllowed } from "@stellar/freighter-api";
import Image from "next/image";
import { useState } from "react";


export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false)
  const [publicKey, setPublicKey] = useState('')
  async function connectWallet() {
    const isAllowed = await checkConnection();
    if (isAllowed) {
      setWalletConnected(true)
      const key = await retrievePublicKey()
      setPublicKey(key)
    }
    console.log("Wallet not connected")
  }


  return (
    <div>
      {
        walletConnected ? <div>Logout</div> : <div onClick={connectWallet}>Connect Button</div>
      }
      {
        walletConnected ? <div>wallet Address: {publicKey}</div> : <div>Wallet Not connected</div>
      }

      <div onClick={() => upVote(publicKey)} >UpVote</div>
      <div onClick={() => downVote(publicKey)} >DownVote</div>
    </div>
  );
}
