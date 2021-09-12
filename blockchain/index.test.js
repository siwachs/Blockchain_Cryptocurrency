const BlockChain=require('./index');
const Block=require('./block');

describe('BlockChain',()=>{
    let blc,blc2,blc3;
    
    beforeEach(
        ()=>{
            
            blc=new BlockChain();
            blc2=new BlockChain();
            blc3=new BlockChain();
        }
        //use this blocks for very unit test
    );

    it(
        'BlockChain starts with Genesis Block',()=>{
            expect(blc.chain[0]).toEqual(Block.genesis());
        }
    );

    it('adds a new block',()=>{
        const data='data';
        blc.addBlock(data);
        expect(blc.chain[blc.chain.length-1].data).toEqual(data);
    });

    it('Validate a Chain',()=>{
        blc2.addBlock('data');

        expect(blc.isValidChain(blc2.chain)).toBe(true);
    });

    //now validate corrupt chains

    it('it invalidate chainwith corrupt genesis block',()=>{
        //to tes corroupt data
        blc2.chain[0].data='corrupt data';

        //check
        expect(blc.isValidChain(blc2.chain)).toBe(false);
    });

    //Final test it invalid a corrupt chain it invalid a chain that has a bad block that is not a genesis block

    it('invalid a corrupt chain',()=>{
        //make a bad block
        blc2.addBlock('data2');

        //change the data
        blc2.chain[1].data='Change data';

        expect(blc.isValidChain(blc2.chain)).toBe(false);
    });

    //test the functionality of chain replacing.
    //we add two test 1st chain is replaced and 2nd not replaced
    
    it('it replace chain as valid chain',()=>{
        blc2.addBlock('data_x');

        //for 2nd blockchain it should have genesis block and our new block we just added

        blc.replaceChain(blc2.chain);

        //if it replaced bot blc instance must be equal

        expect(blc.chain).toEqual(blc2.chain);
    });

    //now the blockchain replace not occur if length is less than equal to current chain

    it('it not replace with less than or equal to length of current chain',()=>{

        //add some block to blc
        blc.addBlock('data2');
        blc.addBlock('data3');

        //now 1st blc has some length
        //now try to replace it with blockchain of only containing genesis block

        blc.replaceChain(blc3.chain);
        expect(blc.chain).not.toEqual(blc3.chain);
    });


});