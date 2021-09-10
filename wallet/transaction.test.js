//use to test transaction obj
const Transaction=require('./transaction');
const Wallet=require('./index');
const { MINING_REWARD }=require('../config');

//use describe function to describe this test

describe(
    'Transaction',()=>{
        let transaction, wallet,reciever,amount;

        beforeEach(()=>{
            wallet =new Wallet();
            amount=50;
            reciever='r3c1p1nt';

            transaction=Transaction.newTransaction(wallet,reciever,amount);

            //exe for every it()
        });

        it('it outputs the `amount` subtract from wallet balance',()=>{
            
            expect(transaction.outputs.find(output=>output.address ===wallet.publicKey).amount).toEqual(wallet.balance-amount);
        });

        it('output the `amount` added to reciever',()=>{
            expect(transaction.outputs.find(output=> output.address==reciever).amount ).toEqual(amount);
        });

        it('it inputs the balance of wallet',()=>{
            expect(transaction.input.amount).toEqual(wallet.balance);
        });

        it('validates a valid transaction',()=>{
            expect(Transaction.verifyTransaction(transaction)).toBe(true);
        });

        it('it invalide a corrupt transaction',()=>{
            transaction.outputs[0].amount=50000;
            expect(Transaction.verifyTransaction(transaction)).toBe(false);
        });
    
        //a new situation
describe('a situation when transaction exceed the balance',()=>{
    beforeEach(()=>{
        wallet =new Wallet();
            amount=500000;
            reciever='r3c1p1nt';

            transaction=Transaction.newTransaction(wallet,reciever,amount);
            //return transaction obj
    });

    it('it not make transaction if amount is more that available balance',()=>{
        expect(transaction).toEqual(undefined);
    });
});

describe('update a transaction',()=>{
    let nextAmount, nextReciever;

    beforeEach(()=>{
        nextAmount=20;
        nextReciever='n3xt-4ddr355';
        transaction=transaction.update(wallet,nextReciever,nextAmount);
    });

    it(`it subtract amount from sender's output`,()=>{
        expect(transaction.outputs.find(output=>output.address===wallet.publicKey).amount).toEqual(wallet.balance - amount -nextAmount);
    });

    it('it output an amount for next reciever',()=>{
        expect(transaction.outputs.find(output=>output.address===nextReciever).amount).toEqual(nextAmount);
    });
});

    describe('create a reward transaction',()=>{
        beforeEach(()=>{
            transaction=Transaction.rewardTranasaction(wallet,Wallet.blockchainWallet());
        });

    it(`generate reward for miner's wallet`,()=>{
            expect(transaction.outputs.find(output=>output.address === wallet.publicKey).amount).toEqual(MINING_REWARD);
        });
    });
});


