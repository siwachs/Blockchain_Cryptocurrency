const Transaction = require('../wallet/transaction');

class TransactionPool
{
    constructor()
    {
        this.transactions=[];
    }

    existingTransaction(address)
    {
        return this.transactions.find(t=>t.input.address === address);
    }

    updateOrAddTransaction(transaction)
    {
        let transactionWithId=this.transactions.find(t=>t.id === transaction.id);
        
        if(transactionWithId){
            this.transactions[this.transactions.indexOf(transactionWithId)] =transaction;
        }
        else
        {
            this.transactions.push(transaction);
        }
    }

    validTransactions()
    {
        //it total output amount matches the org balance specify in input amount
        //verify signature of every transactions

        return this.transactions.filter(transaction=>{
            const outputTotal=transaction.outputs.reduce((total,output)=>{
                return total +output.amount;
            },0);

            if(transaction.input.amount !=outputTotal)
            {
                console.log(`invalid transaction from ${transaction.input.address}`);
                return;
            }

            if(!Transaction.verifyTransaction(transaction))
            {
                console.log(`invalid signature from ${transaction.input.address}`);

                return;
            }

            return transaction;

        });
    }//check if it matches the input amount

    clear()
    {
        this.transactions=[];
    }

    
}

module.exports=TransactionPool;