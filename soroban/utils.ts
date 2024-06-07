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
let contractAddress = 'CDGHULHPM3QA6BPKLUTGSHPMYCNGBXYRW4OOEDGBSNGDYUTQUCP7ICDI';

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
    const increaseVote: any = await contractInit(caller, "up_vote")
    console.log(increaseVote._value)
    return increaseVote
}

async function downVote(caller: any) {
    const decreaseVote: any = await contractInit(caller, "down_vote")
    return decreaseVote
}
async function voteCount(caller: any) {
    const voteCount: any = await contractInit(caller, "current_vote")
    const voteCountToString = voteCount._value.toString()
    // console.log(voteCountToString)
    return voteCountToString
}

export { upVote, downVote, voteCount };