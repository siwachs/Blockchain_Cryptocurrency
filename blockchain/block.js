const SHA256 = require('crypto-js/sha256');

const {DIFFICULTY,MINE_RATE}=require('../config');

class Block
{
    constructor(timestamp, last_hash, hash,data,nonce,difficulty){
        this.timestamp=timestamp;
        this.last_hash=last_hash;
        this.hash=hash;
        this.data=data;
        this.nonce=nonce; 
        this.difficulty=difficulty || DIFFICULTY;
    }

    toString()
        {
            //backtick string
            return `
        Block -
            TimeStamp :${this.timestamp}
            Last_Hash :${this.last_hash.substring(0,10)}
            Hash      :${this.hash.substring(0,10)}
            Nonce     :${this.nonce}
            Difficulty:${this.difficulty}
            Data      :${this.data}
            `
        }
    
    //first default block in blockchain
    static genesis()
    {
        return new this('genesis Block','-----','fir57-h45h',[],0,DIFFICULTY);
    }

    static hash(timestamp, last_hash,data,nonce,difficulty)
    {
        return SHA256(`${timestamp}${last_hash}${data}${nonce}${difficulty}`).toString();
    }

    static mineBlock(lastBlock,data)
    {
        const lastHash=lastBlock.hash;
        let timestamp,hash;
        let {difficulty}=lastBlock;
        //ES6 declaration use to define a local variable
        //cal new Difficulty based on last block
        let nonce=0;
        do{
            nonce++;
            timestamp=Date.now();
            difficulty=Block.adjustDifficulty(lastBlock,timestamp); 
            hash=Block.hash(timestamp,lastHash,data,nonce,difficulty);
        }while(hash.substring(0,difficulty) !== '0'.repeat(difficulty));
        
        return new this(timestamp,lastHash,hash,data,nonce,difficulty);
        //block created
    }

    

    

    static adjustDifficulty(lastBlock,currentTime)
    {
        let{difficulty}=lastBlock;
        //auto get difficulty from obj
    
        difficulty=lastBlock.timestamp+MINE_RATE > currentTime ? difficulty+1 :difficulty-1;
        //means cur time is smaller so increse difficulty

        return difficulty;
    }

    static blockHash(block)
    {
        const {timestamp,last_hash,data,nonce,difficulty}=block;
        return Block.hash(timestamp,last_hash,data,nonce,difficulty);

        //check if data change if data is changed then hash value we get is different from org value
    }
    
}
module.exports =Block;
