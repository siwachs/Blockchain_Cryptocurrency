const TransactionPool=require('./transaction-pool');
const Wallet=require('./index');
const BlockChain=require('../blockchain');

describe('Transaction pool',()=>{
    let trp,wallet,transaction,blockchain;
    beforeEach(()=>{
        trp=new TransactionPool();
        wallet=new Wallet();
        blockchain=new BlockChain();
        //transaction=Transaction.newTransaction(wallet,'r4nd-4ddr335',100);

        //add our transaction to pool
        //trp.updateOrAddTransaction(transaction); 
        //it add it to its transaction array every test now have a transaction pool

        transaction=wallet.createTransaction('r4nd-4ddr335',30,blockchain,trp);
    });

    it('it adds a transaction to the pool',()=>{
        //we look in pool array and find transaction that match id field and must be eqauto our created..

        expect(trp.transactions.find(t=>t.id === transaction.id)).toEqual(transaction);
    });

    it('it updates a existing transaction in pool when it recieve a transaction with similar id',()=>{
        //use callback arrow
        const oldTransaction=JSON.stringify(transaction);

        const newTransaction=transaction.update(wallet,'fxx-4ddr35',60);

        trp.updateOrAddTransaction(newTransaction);

        expect(JSON.stringify(trp.transactions.find(t=>t.id === newTransaction.id))).not.toEqual(oldTransaction);
    });

    it('clears transactions',()=>{
        trp.clear();
        expect(trp.transactions).toEqual([]);
    });

    describe('mixing valid and corrupt transactions',()=>{
        let validTransactions;

        beforeEach(()=>{
            validTransactions=[...trp.transactions];

            for(let i=0;i<6;i++){
                wallet=new Wallet();
                transaction=wallet.createTransaction('r4nd-4dr355',30,blockchain,trp);
                if(i%2 ==0){
                    transaction.input.amount=5000;
                }else{
                    validTransactions.push(transaction);
                }
            }
        });

        it('it shows a difference btween valid and corrupt transactions',()=>{
            expect(JSON.stringify(trp.transactions)).not.toEqual(JSON.stringify(validTransactions));
        });

        it('grabs valid transactions',()=>{
            expect(trp.validTransactions()).toEqual(validTransactions);
        });
    });
});