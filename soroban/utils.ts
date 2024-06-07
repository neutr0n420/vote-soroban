import {
    Contract,
    SorobanRpc,
    TransactionBuilder,
    Networks,
    BASE_FEE,
    nativeToScVal,
    Address
} from "@stellar/stellar-sdk"
import { userSignTransaction } from "./WalletIntegration"
import { getPublicKey } from "@stellar/freighter-api"

const rpcUrl = "https://soroban-testnet.stellar.org";
let contractAddress = 'CB2LFGW6JEGQ6WQUJ76SS5OUZYNETTDCBO4SYLGRD57L5MZJL5W4NMTQ';

let params = {
    fee: BASE_FEE,
    networkPassphrase: Networks.TESTNET,
}

async function contractInit(caller: any, functionName: string) {
    const provider = new SorobanRpc.Server(rpcUrl, { allowHttp: true });
    const sourceAccount = await provider.getAccount(caller);
    const contract = new Contract(contractAddress)
    const buildTx = new TransactionBuilder(sourceAccount, params)
        .addOperation(contract.call(functionName))
        .setTimeout(30)
        .build();
    let _buildTx = await provider.prepareTransaction(buildTx)
    let prepareTx = await _buildTx.toXDR()
    let signedTx = await userSignTransaction(prepareTx, "TESTNET", caller);
    let tx = TransactionBuilder.fromXDR(signedTx, Networks.TESTNET)
    try {
        let sendTx = await provider.sendTransaction(tx).catch(function (err) {
            return err;
        });
        if (sendTx.errorResult) {
            throw new Error("Unable to submit transaction");
        }
        if (sendTx.status === "PENDING") {
            console.log("Reached here")
            let txResponse = await provider.getTransaction(sendTx.hash);
            while (txResponse.status === "NOT_FOUND") {
                txResponse = await provider.getTransaction(sendTx.hash);
                await new Promise((resolve) => setTimeout(resolve, 100));
            }
            if (txResponse.status === "SUCCESS") {
                let result = txResponse.returnValue;
                return result;
            }
        }
    } catch (err) {
        return err;
    }
}
async function upVote(caller: any) {
    const increaseVote = await contractInit(caller, "up_vote")
    console.log(increaseVote)
    return increaseVote
}

async function downVote(caller: any) {
    const decreaseVote = await contractInit(caller, "down_vote")
    console.log(decreaseVote)
    return decreaseVote
}

export { upVote, downVote };