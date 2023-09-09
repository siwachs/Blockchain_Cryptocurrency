# Blockchain_Cryptocurrency

This project is built using earlier white paper on bitcoin.
Its backend has the same functionality just like the earlier version of bitcoin.

A user can use the following endpoints for:
###
GET http://localhost:3001/public-key
###
GET http://localhost:3001/mine-transactions
###
GET http://localhost:3002/public-key
###
GET http://localhost:3001/blocks
###
GET http://localhost:3001/transactions
###
POST http://localhost:3001/transact
content-type: application/json

{
    "receiver":"fyy-4ddrr55",
    "amount":50
}

###
POST http://localhost:3002/transact
content-type: application/json

{
    "receiver":"fxx-4ddrr55",
    "amount":60
}
###
GET http://localhost:3002/blocks
###
GET http://localhost:3001/transactions

###
POST http://localhost:3001/mine
content-type: application/json

{
    "data":"send message 3 to test replacement"
}

###
