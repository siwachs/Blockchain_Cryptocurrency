const express=require('express'); //to create api
const Miner=require('./miner');
const BlockChain=require('../blockchain');
const P2pServer =require('./p2p-server');
const Wallet=require('../wallet');
const TransactionPool=require('../wallet/transaction-pool');

const HTTP_PORT=process.env.HTTP_PORT || 3001;
const wallet=new Wallet();
const trp=new TransactionPool();
const app=express();
const blc=new BlockChain();
const p2pServer=new P2pServer(blc,trp);
const miner=new Miner(blc,trp,wallet,p2pServer);  

app.use(express.json());//for data transformation

//define endpoint
app.get('/blocks',(request,response)=>{
    response.json(blc.chain);
});

app.get('/transactions',(req,res)=>{
    res.json(trp.transactions);
});

app.post('/transact',(req,res)=>{
    const {receiver,amount} =req.body;
    const transaction =wallet.createTransaction(receiver,amount,blc,trp);

    p2pServer.broadcastTransaction(transaction);res.redirect('/transactions');
});

app.get('/public-key',(req,res)=>{
    res.json({publicKey:wallet.publicKey});
});

app.post('/mine',(request,response)=>{
    const block=blc.addBlock(request.body.data);
    p2pServer.syncChains();
    console.log(`New Block Added: ${block.toString()}`);

    response.redirect('/blocks');
});

app.get('/mine-transactions',(req,res)=>{
    const block=miner.mine();
    console.log(`new block is addes ${block.toString()}`);

    res.redirect('/blocks');
});

app.listen(HTTP_PORT,()=>console.log(`listen on port ${HTTP_PORT}`));

p2pServer.listen(); 



