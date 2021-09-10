const ChainUtil=require('../chain-util');
const {MINING_REWARD}=require('../config');

class Transaction
{
    constructor()
    {
        //every obj have 3 field
        this.id=ChainUtil.id();
        this.input=null;
        this.outputs=[];//has info how much currency sender is sending and 2nd output is how much currency left

    }

    update(senderWallet,receiver,amount)
    {
        //generate a new output when we send again
        const senderOutput=this.outputs.find(output=>output.address === senderWallet.publicKey);

        if(amount>senderOutput.amount){
            console.log(`Amount:${amount} is exceeds balance`);
            return;
        }

        senderOutput.amount=senderOutput.amount - amount;
        //push it to outputs array
        this.outputs.push({amount, address:receiver});

        //now new transaction made we need to generate signature again.
        Transaction.signTransaction(this,senderWallet);

        return this;
    }

    //outputs have how much currency we send and 2nd output is how much currency left

    static transactionWithOutputs(senderWallet,outputs)
    {
        const transaction=new this();
        transaction.outputs.push(...outputs);

        Transaction.signTransaction(transaction,senderWallet);

        return transaction;
    }

    static newTransaction(senderWallet,receiverAddress,amount)
    {
        //return obj of Transaction
        
        if(amount>senderWallet.balance)
        {
            console.log(`Amount:${amount} is exceeds balance`);
            return;
        }
        
        //es6 spread operator : create array of two obj it push each element in array
        //sign out transaction

        //each output obj has address and amount field
        return Transaction.transactionWithOutputs(senderWallet,

            [

                {amount: senderWallet.balance-amount, address:senderWallet.publicKey},
    
                {amount, address:receiverAddress}
            ]);
    }

    static rewardTranasaction(minerWallet,blockchainWallet)
    {
        //special wallet generate sig to confirm reward transaction blc implementation is responsible

        return Transaction.transactionWithOutputs(blockchainWallet,[{
            amount:MINING_REWARD,
            address:minerWallet.publicKey
        }]);
    }

    //create a method to sign a transaction base on wallet
    static signTransaction(transaction,senderWallet)
    {
        transaction.input={
            timestamp:Date.now(),
            
            amount:senderWallet.balance,
            
            address:senderWallet.publicKey,
            
            signature:senderWallet.sign(ChainUtil.hash(transaction.outputs))
            //need to pash hash use SHA256
        };
    }

    static verifyTransaction(transaction)
    {
        //return true or false
        return ChainUtil.verifySignatur(
            transaction.input.address,transaction.input.signature,ChainUtil.hash(transaction.outputs));
    }
}

module.exports=Transaction;