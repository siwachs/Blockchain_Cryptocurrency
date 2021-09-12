const webSocket=require('ws');

const P2P_PORT=process.env.P2P_PORT || 5001;

const peers=process.env.PEERS ?process.env.PEERS.split(','):[]; //add peers which are run in our network

const MESSAGE_TYPES={
    chain:'CHAIN',
    transaction:'TRANSACTION',
    clear_transactions:'CLEAR_TRANSACTIONS'
    //when we send use msg type which type of msg we handle
};

class P2pServer
{
    constructor(blockchain,transactionPool)
    {
        this.blockchain=blockchain;
        this.sockets=[];//store list of connected sockets in our network
        this.transactionPool=transactionPool;
    }
//star web server
    listen()
    {
        const server=new webSocket.Server( {port:P2P_PORT});

        server.on('connection',
        socket=>this.connectSocket(socket));
        //use event connection with on method
        
        this.connectToPeers();

        console.log(`listning on peer-to-peer port: ${P2P_PORT}`);
    }

    connectToPeers()
    {
        peers.forEach(peer=>{ 
            //peer we get-> ws://localhost:5001
            const socket=new webSocket(peer);
            
            socket.on('open',()=>this.connectSocket(socket));
        });
    }

    connectSocket(socket)
    {
        this.sockets.push(socket);
        console.log('socket connected');

        this.messageHandle(socket);

        this.sendChain(socket);
    }

    sendChain(socket)
    {
        socket.send(JSON.stringify({type:MESSAGE_TYPES.chain,chain:this.blockchain.chain}));
    }

    sendTransaction(socket,transaction)
    {
        socket.send(JSON.stringify({type:MESSAGE_TYPES.transaction,transaction}));
    }

    broadcastTransaction(transaction)
    {
        this.sockets.forEach(socket=>this.sendTransaction(socket,transaction));
    }

    messageHandle(socket)
    {
        socket.on('message',message=>{

            const data=JSON.parse(message);
            //it change back to JS obj

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

    //when new block is mined and we have to update it all PEERS
    syncChains()
    {
        //goal is to send updted Blc of this current instance to all sockets
        this.sockets.forEach(socket=>this.sendChain(socket));

    }

    broadcastClearTransactions()
    {
        this.sockets.forEach(socket=>socket.send(JSON.stringify({
            type:MESSAGE_TYPES.clear_transactions
        })));
    }
}

module.exports=P2pServer;
