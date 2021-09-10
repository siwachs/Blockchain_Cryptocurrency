//set initial balance get it from config file
const {INITIAL_BALANCE}=require('../config');
const ChainUtil=require('../chain-util');

//generate a unique id fot transaction obj
const Transaction = require('./transaction');

class Wallet
{
    constructor()
    {
        this.balance=INITIAL_BALANCE;
        this.keyPair=ChainUtil.genKeyPair();
        this.publicKey=this.keyPair.getPublic().encode('hex');
        //conver public key into its hex form
    }

    toString()
    {
        //use a template string
        return `Wallet-
            publicKey:${this.publicKey.toString()}
            balance  :${this.balance}
            `
     }

    sign(dataHash)
    {
        //it take hash representation of data
        return this.keyPair.sign(dataHash);
    }

    //crerate transaction create transaction in wallet also check if transaction is already exist in pool if it replace it with updated transaction

    createTransaction(receiver,amount,blockChain,transactionPool)
    {
        this.balance=this.calculateBalance(blockChain );
        if(amount > this.balance)
        {
            console.log(`amount ${amount} is exceed the current balance ${this.balance}`);
            return;
        }

        let transaction=transactionPool.existingTransaction(this.publicKey);

        if(transaction)
        {
            //already in pool
        transaction.update(this,receiver,amount);
        }else
        {
        transaction=Transaction.newTransaction(this,receiver,amount);

        transactionPool.updateOrAddTransaction(transaction);
        }

        return transaction;
    }

    static blockchainWallet()
    {
        const blockchainWallet=new this();
        //to make it blockchain wallet change its address to blockchain wallet
        blockchainWallet.address='blockchain-wallet';
        return blockchainWallet;
    }

    calculateBalance(blockchain)
    {
        let balance=this.balance;
        //we want to look at each transaction that on block and remove added layer of blocks

        let transactions=[];

        //run a loop on each block within chain
        blockchain.chain.forEach(block=>block.data.forEach(transaction=>{
            transactions.push(transaction);
            //push to transaction
        }));

        //sum up most recent output amounts
        //search transaction whose input is made by this wallet
        const walletInputTs=transactions.filter(transaction=>transaction.input.address===this.publicKey);

        //most resent search for highest timestamp
        let startTime=0;
        
        if(walletInputTs.length >0)
        {
            const resentInputT=walletInputTs.reduce((prev,current)=>prev.input.timestamp>current.input.timestamp ?prev : current);

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
    }

}

//to share this class
module.exports=Wallet;