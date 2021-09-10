//use to generate key ,unique Hash
//import elliptic module use ec inner obj is a class
//Bitcoin use: secp256k1 algo SEC is standard of efficient cryptography p for prime and 256 bits Key component to generate curve is a prime number of 256bit

const EC=require('elliptic').ec;
const ec=EC('secp256k1');
const uuidV1=require('uuid/v1');
const SHA256 = require('crypto-js/sha256');


class ChainUtil
{
    static genKeyPair()
    {
        return ec.genKeyPair();
        //use to get public and private key
    }

    //generate unique id for transaction
    static id()
    {
        return uuidV1();
    }

    static hash(data)
    {
        return SHA256(JSON.stringify(data)).toString();
    }

    static verifySignatur(publicKey,signatue,dataHash)
    {
        //dataHash is what data we find after decrypt useing public key use it in Transaction to verify
        return ec.keyFromPublic(publicKey,'hex').verify(dataHash,signatue);
    }
}

module.exports=ChainUtil;