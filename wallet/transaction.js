const ChainUtil=require('../chain-util');
const {MINING_REWARD}=require('../config');

class Transaction
{
    constructor()
    {
        this.id=ChainUtil.id();
        this.input=null;
        this.outputs=[];
        //how much currency sender sending and how much curerency left in his/her wallet output is array of obj having 2 elements 
    }

    update(senderWallet,receiver,amount)
    {
        const senderOutput=this.outputs.find(output=>output.address === senderWallet.publicKey);//use address key

        if(amount>senderOutput.amount){
            console.log(`Amount:${amount} is exceeds balance`);
            return;
        }

        senderOutput.amount=senderOutput.amount - amount;

        this.outputs.push({amount, address:receiver});

        Transaction.signTransaction(this,senderWallet);

        return this;
    }

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
        return Transaction.transactionWithOutputs(blockchainWallet,[{
            amount:MINING_REWARD,
            address:minerWallet.publicKey
        }]);
    }

    static signTransaction(transaction,senderWallet)
    {
        transaction.input={
            timestamp:Date.now(),
            
            amount:senderWallet.balance,
            
            address:senderWallet.publicKey,
            
            signature:senderWallet.sign(ChainUtil.hash(transaction.outputs))
        };
    }

    static verifyTransaction(transaction)
    {
        return ChainUtil.verifySignatur(
            transaction.input.address,transaction.input.signature,ChainUtil.hash(transaction.outputs));
    }
}

module.exports=Transaction;