//get websocket
const webSocket=require('ws');

//default port number but if process env has a port var in it use it or set to 5001
const P2P_PORT=process.env.P2P_PORT || 5001;



//create a peer constant it has string that contain list of web socket address that this socket connect to as peer
//if address exist split addresses and return as array if not return an empty array
const peers=process.env.PEERS ?process.env.PEERS.split(','):[];

const MESSAGE_TYPES={
    chain:'CHAIN',
    transaction:'TRANSACTION',
    clear_transactions:'CLEAR_TRANSACTIONS'
}; 
//has label for sockets represent types of data

//now P2P server class
class P2pServer
{
    constructor(blockchain,transactionPool)
    {
        this.blockchain=blockchain;
        //each server has a blockchain 
        this.sockets=[];
        //this has list of connected web socket servers
        this.transactionPool=transactionPool;
    }

    //to start server
    listen()
    {
        //create ws server run on a port we define
        const server=new webSocket.Server(
            {port:P2P_PORT});
        server.on('connection',
        socket=>this.connectSocket(socket));
        //later instances of BLC must be connected to org instance we create
        this.connectToPeers();

        //use to listen for icomming messages: listen for connection
        //now whenever a new socket connect ot server we can exe a specfic code socket_obj=>

        console.log(`listning on peer-to-peer port: ${P2P_PORT}`);
    }

    connectToPeers()
    {
        peers.forEach(peer=>{
            //this peer somthing like 
            // ws://localhost:5001
            const socket=new webSocket(peer);
            //it create a socket obj like create in connection listner now open another event listner
            socket.on('open',()=>this.connectSocket(socket));
        });
    }

    connectSocket(socket)
    {
        this.sockets.push(socket);
        console.log('socket connected');

        //now we have message handler attach it to connected socket all socket run througn that function

        this.messageHandle(socket);

        //now we have chain send it to sockets in form of chain we want to send its chain from this instance
        this.sendChain(socket);
    }

    sendChain(socket)
    {
        socket.send(JSON.stringify({type:MESSAGE_TYPES.chain,chain:this.blockchain.chain}));
        //we send a obj.
    }

    //use sync transaction to send transactiuo to all user.

    sendTransaction(socket,transaction)
    {
        socket.send(JSON.stringify({type:MESSAGE_TYPES.transaction,transaction}));

        //when we send msg handler assume we get a chain so it try to replace chain
    }

    broadcastTransaction(transaction)
    {
        //it not send entire pool but one transaction
        this.sockets.forEach(socket=>this.sendTransaction(socket,transaction));
    }

    

    //to sync blockchain to each socket use send method of socket
    messageHandle(socket)
    {
        //use on for event handle a 2nd obj populate because of message event
        socket.on('message',message=>{
            //our message is stringify obj turn back to regular obj
            const data=JSON.parse(message);
            //it change back to JS obj

            //console.log('data:',data);

            //now sync Blc accross peers

            //now since our obj type is change we need to use a switch to exe relevent code

            switch(data.type)
            {
               case MESSAGE_TYPES.chain:
                this.blockchain.replaceChain(data.chain);
                break;

               case MESSAGE_TYPES.transaction:
                   this.transactionPool.updateOrAddTransaction(data.transaction,);
                   break;
               case MESSAGE_TYPES.clear_transactions:
                    this.transactionPool.clear();
                    break;
            }
            
        });
    }

    //when new block is mined and we want to update it all PEERS
    syncChains()
    {
        //goal is to send updted Blc of this current instance to all sockets
        this.sockets.forEach(socket=>this.sendChain(socket));
        //it send this current web socket chain to every sockets

        //add it to app server when everytime we mine
    }

    broadcastClearTransactions()
    {
        this.sockets.forEach(socket=>socket.send(JSON.stringify({
            type:MESSAGE_TYPES.clear_transactions
        })));
    }
}

//export that module
module.exports=P2pServer;
//now it can use it in main index file