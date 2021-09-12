const Wallet=require('./index');
const TransactionPool=require('./transaction-pool');
const BlockChain=require('../blockchain');
const { INITIAL_BALANCE } = require('../config');

//use nestes describes to describe multiple tests
describe('Wallet',()=>{
    let wallet,trp,blockchain;
    beforeEach(()=>{
        wallet=new Wallet();
        trp=new TransactionPool();
        blockchain=new BlockChain();
    });

    describe('wallet is creating a transaction',()=>{
        let transaction,sendAmount,receiver;

        beforeEach(()=>{
            sendAmount=50;
            receiver='r4nd0m-4ddr355';

            transaction=wallet.createTransaction(receiver,sendAmount,blockchain,trp);
        });
        describe('doing same transaction',()=>{
            beforeEach(()=>{
                transaction=wallet.createTransaction(receiver,sendAmount,blockchain,trp);
            });
    
            it('doubles the `sendAmount` subtracted from wallet',()=>{
                
                expect(transaction.outputs.find(output=>output.address === wallet.publicKey).amount).toEqual(wallet.balance -sendAmount*2);
    
                //because transaction is done twice
            });
    
            it('clones the `sendAmount` output for receiver',()=>{
                //since we expect two transactions beacuse we done amount 2 times
                
                expect(transaction.outputs.filter(output=>output.address === receiver).map(output=>output.amount)).toEqual([sendAmount,sendAmount]);
                //map create a array
            });
        });
    });

    describe('calculate the balance for each wallet',()=>{
        let addBalance,repeartAdd,senderWallet;

        beforeEach(()=>{
            senderWallet=new Wallet();
            addBalance=100;
            repeartAdd=3;

            for(let i=0;i<repeartAdd;i++){
                senderWallet.createTransaction(wallet.publicKey,addBalance,blockchain,trp);
            }

            blockchain.addBlock(trp.transactions);
        });

        it('calcultes the balance for blockchain transaction match reciever',()=>{
            expect(wallet.calculateBalance(blockchain)).toEqual(INITIAL_BALANCE+(addBalance * repeartAdd));
        });

        it('calculate balance for blockchain transactions that match the sender',()=>{
            expect(senderWallet.calculateBalance(blockchain)).toEqual(INITIAL_BALANCE - (addBalance * repeartAdd));
        });

        describe('now reciever conduct the transaction ',()=>{
            let subBalance,recieverBalance;

            beforeEach(()=>{

                trp.clear();
                subBalance=60;
                recieverBalance=wallet.calculateBalance(blockchain);

                wallet.createTransaction(senderWallet.publicKey,subBalance,blockchain,trp);

                blockchain.addBlock(trp.transactions);
               
            });

            describe('sender send othe transaction to reciever',()=>{
                beforeEach(()=>{
                    trp.clear();
                    senderWallet.createTransaction(wallet.publicKey,addBalance,blockchain,trp);

                    blockchain.addBlock(trp.transactions);
                });

                it('calculate receiver balance only using most recent one transaction',()=>{
                    expect(wallet.calculateBalance(blockchain)).toEqual(recieverBalance - subBalance +addBalance);
                });
            });
        });
    });
});