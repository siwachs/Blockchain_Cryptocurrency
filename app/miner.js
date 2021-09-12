//everone in our network can act as miner
const Wallet = require("../wallet");
const Transaction = require("../wallet/transaction");

class Miner
{
    constructor(blockchain,transactionPool,wallet,p2pServer)
    {
        this.blockchain=blockchain;
        this.transactionPool=transactionPool;
        this.wallet=wallet;
        this.p2pServer=p2pServer;
    }

    mine()
    {
        const validTransactions=this.transactionPool.validTransactions();

        validTransactions.push(Transaction.rewardTranasaction(this.wallet,Wallet.blockchainWallet()));
        
        const block=this.blockchain.addBlock(validTransactions);

        //after add a new block we need to sync
        this.p2pServer.syncChains();

        //clear Transaction pool of everyminer after add a block so that transaction not add again in blockchain
        this.transactionPool.clear();

        this.p2pServer.broadcastClearTransactions()

        return block;
    }
}
module.exports=Miner;