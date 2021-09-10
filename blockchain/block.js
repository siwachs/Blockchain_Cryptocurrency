//import crypto-js module
const SHA256 = require('crypto-js/sha256');
//add level of difficulty export it from other file
const {DIFFICULTY,MINE_RATE}=require('../config');

class Block
{
    constructor(timestamp, last_hash, hash,data,nonce,difficulty){
        //our constructor need a attribute timestamp, last block hash and its own hash finally the data we want to store in block
        //Now bind our attribute to class using this
        
        //this is object which represent unique instance to the class
        this.timestamp=timestamp;
        this.last_hash=last_hash;
        this.hash=hash;
        this.data=data;
        this.nonce=nonce; //include to SHA
        
        //include dynamic difficulty based on timestamp difference in each block
        this.difficulty=difficulty || DIFFICULTY;
        //for first block
    }

    //add nonce value include as part of cal of Hash by change this value miners can add Hash of leading zeroes
    


    toString()
        {
            //use backtick 
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
    
    //Create a static genesis function
    static genesis()
    {
        return new this('genesis Block','-----','fir57-h45h',[],0,DIFFICULTY);
        //This refer to the class itself
        //put default value Dummy value and a default Nonce value And default difficulty value
    }

    static mineBlock(lastBlock,data)
    {
        //every time we gen new hast have to calculate timestamp
        const lastHash=lastBlock.hash;

        //now to create new instance we now use nonce to genearat hash
        //it create hash base on nonce value we give now we can ... that it satisy our difficulty or proof of work condition
        let timestamp,hash;
        let {difficulty}=lastBlock;
        //ES6 declaration use to define a local variable
        //use last block difficulty to set next block difficulty
        //we calculate the difficulty base on last block
        let nonce=0;
        do{
            nonce++;
            timestamp=Date.now();

            difficulty=Block.adjustDifficulty(lastBlock,timestamp); 

            hash=Block.hash(timestamp,lastHash,data,nonce,difficulty);
        }while(hash.substring(0,difficulty) !== '0'.repeat(difficulty));
        //we have that in our block check the diff provided to use by last block

        return new this(timestamp,lastHash,hash,data,nonce,difficulty);
        //add nonce in creation of Block
    }

    

    static hash(timestamp, last_hash,data,nonce,difficulty)
    {
        //include difficulty in hash

        //we use our sha function put all our parameters in one using backtick U-6 templete string
        return SHA256(`${timestamp}${last_hash}${data}${nonce}${difficulty}`).toString();
        //it return a object but we want string representation

    }

    static adjustDifficulty(lastBlock,currentTime)
    {
        let{difficulty}=lastBlock;//get this block difficulty
        //adjust diff based on timestamp of last block and current time
        difficulty=lastBlock.timestamp+MINE_RATE > currentTime ? difficulty+1 :difficulty-1;

        return difficulty;
    }

    static blockHash(block)
    {
        const {timestamp,last_hash,data,nonce,difficulty}=block;
        return Block.hash(timestamp,last_hash,data,nonce,difficulty);

        //check if data change use to get attributes of block use to create hash
    }
    
}

module.exports =Block;
//Make shure that class is shared from a file a file by exporting it as a module
//it only export class not var outside it
//make to access to both constant and block file make new file to config constant
//in root of project