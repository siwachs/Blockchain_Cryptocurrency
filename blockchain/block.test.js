const Block =require('./block');

describe('Block',()=>{
    let data,last_block,block;

    //use beforeEach allow us to run same code before each test
    beforeEach(()=>
    {
        data='data';
        last_block=Block.genesis();
        block=Block.mineBlock(last_block,data);
    });
    it('set `data` to match the input',()=>{
        expect(block.data).toEqual(data);
    });
    it('set the `lastHash` to match hash of last block',()=>{
        expect(block.last_hash).toEqual(last_block.hash);
    });
    
    it('generate a hash that mathes our difficulty with leading zeroes',()=>{
        expect(block.hash.substring(0,block.difficulty)).toEqual('0'.repeat(block.difficulty));

        console.log(block.toString());
    });

    it('it lower difficulty for slowly mined blocks',()=>{
        expect(Block.adjustDifficulty(block,block.timestamp+360000)).toEqual(block.difficulty-1);
    });

    it('it raise difficulty for quickly mined block',()=>{
        expect(Block.adjustDifficulty(block,block.timestamp+1)).toEqual(block.difficulty+1);
        //it add mine rate too
    });
});