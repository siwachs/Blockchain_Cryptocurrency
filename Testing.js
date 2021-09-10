const Wallet=require('./wallet');

const wallet =new Wallet();

console.log(wallet.toString()); 











//const Block=require('./block');
//Use to export module

// const obj=new Block('x','y','z','a');
// console.log(obj.toString());
// console.log(Block.genesis().toString());

//const x=Block.mineBlock(Block.genesis(),'data');
//console.log(x.toString());

//now use it to check all blockchain functionality
//and all block added properly according to mine rate

//const BlockChain=require('./blockchain');

//const blc=new BlockChain();

//for(i=0;i<10;i++)
//{
    //console.log(blc.addBlock(`data ${i}`).toString());
//}