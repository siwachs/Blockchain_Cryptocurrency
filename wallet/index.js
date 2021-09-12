const {INITIAL_BALANCE}=require('../config');
const ChainUtil=require('../chain-util');
const Transaction = require('./transaction');

class Wallet
{
    constructor()
    {
        this.balance=INITIAL_BALANCE;
        this.keyPair=ChainUtil.genKeyPair();
        this.publicKey=this.keyPair.getPublic().encode('hex');
    }

    toString()
    {
        return `Wallet-
            publicKey:${this.publicKey.toString()}
            balance  :${this.balance}
            `
     }

    sign(dataHash)
    {
        return this.keyPair.sign(dataHash);
    }

    //it generate transaction and check if transaction already in pool then we update it
    createTransaction(receiver,amount,blockChain,transactionPool)
    {
        this.balance=this.calculateBalance(blockChain );
        if(amount > this.balance)
        {
            console.log(`amount ${amount} is exceed the current balance ${this.balance}`);
            return;
        }

        let transaction=transactionPool.existingTransaction(this.publicKey);

        if(transaction){
            //if already in pool
            transaction.update(this,receiver,amount);
        }else{
            transaction=Transaction.newTransaction(this,receiver,amount);

            transactionPool.updateOrAddTransaction(transaction);
        }

        return transaction;
        }

    static blockchainWallet()
    {
        const blockchainWallet=new this();
        
        blockchainWallet.address='blockchain-wallet';
        return blockchainWallet;
    }

    calculateBalance(blockchain)
    {
        let balance=this.balance;

        let transactions=[];

        blockchain.chain.forEach(block=>block.data.forEach(transaction=>{
            transactions.push(transaction);
            //get transaction from block
        }));

        //sum up most recent output amounts and whose input is made by this wallet
        const walletInputTs=transactions.filter(transaction=>transaction.input.address===this.publicKey);

        //most resent search for highest timestamp
        let startTime=0;
        
        if(walletInputTs.length > 0)
        {
            const resentInputT=walletInputTs.reduce((prev,current)=>prev.input.timestamp > current.input.timestamp ?prev : current);

            balance=resentInputT.outputs.find(output=>output.address === this.publicKey).amount;

            startTime=resentInputT.input.timestamp;
            //find to add up those that comes after most resent transactions 
        }

        transactions.forEach(transaction=>{
            if(transaction.input.timestamp > startTime){
                transaction.outputs.find(output=>{
                    if(output.address===this.publicKey){
                        balance=balance+output.amount;
                    }
                });
            }
        });
        return balance;
    }//end of calculate balance

}

//to share this class
module.exports=Wallet;