const Block=require('./block');

class BlockChain
{
    constructor()
    {
        this.chain=[Block.genesis()];
        //first block in chain is always genesis
    }

    addBlock(data)
    {
        //add block to last of chain by using its prev block
        const block=Block.mineBlock(this.chain[this.chain.length-1],data);

        this.chain.push(block);
        return block;
    }

    isValidChain(chain)
    {
        //for valid incoming chain must have a genesis block
        if(JSON.stringify(chain[0]) !==JSON.stringify(Block.genesis())) return false;
        
        for (let i=1;i<chain.length;i++)
        {
            //get last block hash and use it to verify its next block
            const block=chain[i];
            const last_block=chain[i-1];

            if(block.last_hash !==last_block.hash || block.hash !== Block.blockHash(block)) 
            return false;
            //let assume data is tempered
        }
        return true;
    }

    replaceChain(newChain)
    {
        //replace with chain which is longer among all its peers
        if(newChain.length <=this.chain.length)
        {
            console.log('Recieved chain is less than or equal to current chain');
            return;
        }else if(!this.isValidChain(newChain)){
            console.log('Not a Valid chain');
            return;
        }
        console.log('replacing blockchian with new chain');
        this.chain=newChain;
    }
}
module.exports=BlockChain;
