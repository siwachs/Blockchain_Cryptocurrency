const Block =require('./block');
//const {DIFFICULTY}=require('../config');
//dont need ...

describe('Block',()=>{
    //use beforeEach allow us to run same code before each test
    //declare member variable outside the scope
    let data,last_block,block; 
    //create but not assign
    beforeEach(()=>
    {
        data='data';
        //use dummy block
        last_block=Block.genesis();
        //to create a block use mine
        block=Block.mineBlock(last_block,data);
    });
    it('set `data` to match the input',()=>{
        expect(block.data).toEqual(data);
    });
    it('set the `lastHash` to match hash of last block',()=>{
        expect(block.last_hash).toEqual(last_block.hash);
    });
    
    it('generate a hash that mathes our difficulty with leading zeroes',()=>{
        //in order to test we have to access our diifficulty var
        expect(block.hash.substring(0,block.difficulty)).toEqual('0'.repeat(block.difficulty));

        console.log(block.toString());

    });

    it('it lower difficulty for slowly mined blocks',()=>{
        expect(Block.adjustDifficulty(block,block.timestamp+360000)).toEqual(block.difficulty-1);
    });

    it('it raise difficulty for quickly mined block',()=>{
        expect(Block.adjustDifficulty(block,block.timestamp+1)).toEqual(block.difficulty+1);
    });
});