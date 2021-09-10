//everone in our network can act as miner

const Wallet = require("../wallet");
const Transaction = require("../wallet/transaction");

class Miner
{
    //need blockchain and pool evry miner has a indvidual wallet and server refrence to communicae with other miners
    constructor(blockchain,transactionPool,wallet,p2pServer)
    {
        this.blockchain=blockchain;
        this.transactionPool=transactionPool;
        this.wallet=wallet;
        this.p2pServer=p2pServer;
    }

    mine()
    {
        //we use all functionalties ...
        //it grab transaction from the pool ,then take .. and create a block , then it sync the chain include new block.
        //and clear all transaction since they all include in blockchain.

        const validTransactions=this.transactionPool.validTransactions();
        //it not have corrupt data

        //include a reward for miner
        validTransactions.push(Transaction.rewardTranasaction(this.wallet,Wallet.blockchainWallet()));
        //we want to reward the miner and blockchain wallet instance to verify reward.


        //create a block consist of valid transaction
        const block=this.blockchain.addBlock(validTransactions);


        //sync chain in P2P server
        this.p2pServer.syncChains();


        //cleer Transaction pool of everyminer in system and local to this miner
        this.transactionPool.clear();

        this.p2pServer.broadcastClearTransactions()

        return block;
    }
}

module.exports=Miner;