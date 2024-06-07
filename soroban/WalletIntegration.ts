'use client'
import {
    requestAccess,
    isConnected,
    signTransaction,
    setAllowed,
} from "@stellar/freighter-api"

async function checkConnection() {
    const isAllowed = await setAllowed();
    console.log(isAllowed)
    if (isAllowed) {
        console.log("Reached here in isAllowed function")
        return isAllowed
    }
}
const testFunction = () => {
    return "Hello world"
}
const retrievePublicKey = async () => {
    let publicKey = "";
    let error = "";

    try {
        publicKey = await requestAccess();
    } catch (e) {
        console.log(e);
    }

    if (error) {
        return error;
    }

    return publicKey;
};

const userSignTransaction = async (xdr: string, network: string, signWith: string) => {
    let signedTransaction = "";
    let error = "";

    try {
        signedTransaction = await signTransaction(xdr, {
            network,
            accountToSign: signWith,
        });
    } catch (e) {
        console.log(e);
    }

    if (error) {
        return error;
    }

    return signedTransaction;
};

export { checkConnection, testFunction, retrievePublicKey, userSignTransaction }