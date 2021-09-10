//import express to make a API
//that api is collection of HTTP request
const express=require('express');
const Miner=require('./miner');

// it by default import our index.js which is our blockchain class file
const BlockChain=require('../blockchain');

//require p2p server
const P2pServer =require('./p2p-server');

//body-parser JSON MiddleWare->use to transform outgoing/ingoing data into particular format ()
//const bodyParser=require('body-parser');

//for Api define a port on which our app listen for request 

const Wallet=require('../wallet');
const TransactionPool=require('../wallet/transaction-pool');

const HTTP_PORT=process.env.HTTP_PORT || 3001;
const wallet=new Wallet();
const trp=new TransactionPool(); //to conduct exchanges


const app=express(); //create express app
const blc=new BlockChain();
const p2pServer=new P2pServer(blc,trp);
const miner=new Miner(blc,trp,wallet,p2pServer);  //from pool to blc
//need pool too

//use middleware in app it allow us recieve json within post request
//app.use(bodyParser.json());

//add 1st end point of our api that interact with blc use get and pass 1st endpoint that we want out api to expose it return block of blockchain

app.use(express.json());

app.get('/blocks',(request,response)=>{
    //express auto fill res and req.
    response.json(blc.chain);
    //send chain to user
});

//endpoint to get transactions
app.get('/transactions',(req,res)=>{
    //return transactions using responce
    res.json(trp.transactions);

    //now we get it using http request
});

//end point to sent transaction to poll
app.post('/transact',(req,res)=>{
    //consist of reciever and amount
    //this is given by data that user send
    const {receiver,amount} =req.body;
    const transaction =wallet.createTransaction(receiver,amount,blc,trp);

    p2pServer.broadcastTransaction(transaction); //broadcast when we create a new transaction.

    res.redirect('/transactions');
});

app.get('/public-key',(req,res)=>{
    res.json({publicKey:wallet.publicKey});
});

//endpoint is mine
app.post('/mine',(request,response)=>{
    //add a block
    //var x=JSON.parse(request.body.data);
    const block=blc.addBlock(request.body.data);
    //var x=req.body;
    //console.log(x);

    //sync everytime whenever we mine a new block
    p2pServer.syncChains();

    console.log(`New Block Added: ${block.toString()}`);

    //response with updated chain of blocks that include user new block
    response.redirect('/blocks');
});

app.get('/mine-transactions',(req,res)=>{
    const block=miner.mine();
    console.log(`new block is addes ${block.toString()}`);

    res.redirect('/blocks');
});

app.listen(HTTP_PORT,()=>console.log(`listen on port ${HTTP_PORT}`));

//start server
p2pServer.listen(); 
//it start p2p server on port 5001 anf http server on port 3001



