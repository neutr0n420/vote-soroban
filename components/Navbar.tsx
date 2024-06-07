import { retrievePublicKey } from "@/soroban/WalletIntegration";
import { isConnected, setAllowed } from "@stellar/freighter-api";
import { useState } from "react"

const Navbar = () => {
    async function checkConncection() {
        const connected = await isConnected()
        return connected
    }
    const isWalletConnected = checkConncection()
    const [walletConnected, setWalletConnected] = useState(isWalletConnected)
    const [publicKey, setPublicKey] = useState('')
    async function connectWallet() {
        const isAllowed = await setAllowed();
        const connected = await isConnected();
        console.log("Wallet Connected", connected)
        if (connected) {
            //@ts-ignore
            setWalletConnected(true)
            const key = await retrievePublicKey()
            setPublicKey(key)
        }
    }
    return (
        <div className="border py-4 px-6 flex items-center justify-between">
            <div className="text-2xl font-semibold">Vote Application</div>
            <div>
                <div className="flex ">
                    {
                        //@ts-ignore
                        walletConnected ?
                            <button className="border px-8 py-3 rounded-xl hover:bg-black hover:text-white">Connected</button>
                            : <button onClick={connectWallet} className="border px-8 py-3 rounded-xl hover:bg-black hover:text-white ">Connect Wallet</button>
                    }
                    {/* {
                        walletConnected ? <div className="truncate max-w-xs">wallet Address: {publicKey}</div> : <div>Wallet Not connected</div>
                    } */}

                </div>
            </div>
        </div>
    )
}

export default Navbar