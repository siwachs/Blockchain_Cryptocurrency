const Block=require('./block');
//need block class because blockchain use chain of blocks

class BlockChain
{
    constructor()
    {
        //give this class a chain
        this.chain=[Block.genesis()]; //give it the genesis or Dummy block
        //that way that chain get started with some values

    }

    addBlock(data)
    {
        //aceess last block from chain
        //const last_block=this.chain[this.chain.length-1];
        //create a block and add it to the chain
        
        //add it to chain array
        const block=Block.mineBlock(this.chain[this.chain.length-1],data);
        this.chain.push(block);
        
        return block;
    }

    isValidChain(chain)
    {
        //check incoming chain start with genesis block
        if(JSON.stringify(chain[0]) !==JSON.stringify(Block.genesis())) return false;
        
        //it means incoming genesis block is not valid so chain is not valid
        for (let i=1;i<chain.length;i++)
        {
            const block=chain[i];
            const last_block=chain[i-1];

            if(block.last_hash !==last_block.hash || block.hash !== Block.blockHash(block)) 
            return false;
            //let assume data is tempered
        }

    // if it pass all test then block is valid
    return true;
    }

    replaceChain(newChain)
    {
        if(newChain.length <=this.chain.length)
        {
            console.log('Recieved chain is less than or equal to current chain');
            return;
        }else if(!this.isValidChain(newChain)){
            console.log('Not a Valid chain');
            return;
        }

        //if pass both then we can add our chain
        console.log('replacing blockchian with new chain');
        this.chain=newChain;
    }
}

module.exports=BlockChain;
//so that other files can acess this class we just created