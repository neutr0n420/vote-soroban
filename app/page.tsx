'use client'
import Navbar from "@/components/Navbar";
import { checkConnection, testFunction, retrievePublicKey } from "@/soroban/WalletIntegration"
import { downVote, upVote, voteCount } from "@/soroban/utils";

import { getPublicKey, isAllowed, isConnected, setAllowed } from "@stellar/freighter-api";
import Image from "next/image";
import { useEffect, useState } from "react";


export default function Home() {
  const [publicKey, setPublicKey] = useState('')
  const [revealResult, setRevealResult] = useState(false)
  const [totalVotes, setTotalVotes] = useState('')
  // async function useConnectWallet() {
  //   useEffect(() => {
  //     const connection = async () => {
  //       const isAllowed = await setAllowed();
  //       if (isAllowed) {
  //         setWalletConnected(true)
  //         const key = await retrievePublicKey()
  //         setPublicKey(key)
  //       }
  //     }
  //     connection()
  //   }, [])

  // useEffect(() => {
  //   async function Test() {
  //     const connection = await isConnected()
  //     console.log(connection)
  //   }
  //   Test()
  // }, [])

  const getConnection = async () => {
    const allowed = await isAllowed()
    console.log(allowed)
    if (allowed) {
      const key: string = await retrievePublicKey()
      setPublicKey(key)
    }
  }
  useEffect(() => {
    getConnection()
  }, [])

  // useEffect(() => {
  // }, [downVote, upVote])

  // const currentVoteCount = async () => {
  //   console.log("Reached here in current Vote count function")
  //   const VCount = await voteCount(publicKey)
  //   console.log(VCount)
  // }
  // currentVoteCount()

  const RevealResultFunction = async () => {
    const Vcount = await voteCount(publicKey)
    setRevealResult(true)
    console.log(Vcount)
    setTotalVotes(Vcount)
    console.log("")
  }

  return (
    <div className="">
      <Navbar />
      <div>
        <div className="text-center my-6">Wallet Address: <span className="text-gray-400">{publicKey}</span></div>
      </div>
      <div className="flex justify-center items-center flex-col">
        <div className="text-xl my-6">Will Aryan became a good DevRel?</div>
        <div className="h-32 bg-gray-200 w-32 rounded-lg flex justify-center items-center">
          {revealResult ? <span>{totalVotes}</span> : <span>{":>"}</span>}
        </div>
      </div>
      <div className="flex justify-around items-center mt-16">
        <button onClick={() => upVote(publicKey)} className="border py-2 px-6 rounded-lg hover:bg-black hover:text-white" >UpVote</button>
        <div onClick={() => downVote(publicKey)} className="border py-2 px-6 rounded-lg hover:bg-black hover:text-white" >DownVote</div>
      </div>
      <div className="flex justify-center pt-16 ">

        <button className="justify-center border py-2 px-36 rounded-lg hover:bg-black hover:text-white " onClick={RevealResultFunction}>Reveal Result</button>
      </div>
    </div >
  );
}
