const SHA256 = require('crypto-js/sha256');

class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Block {
    constructor(timestamp, transactions, previousHash='') {
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(this.timestamp + this.previousHash + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficulty) {
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Block mined: " + this.hash);
    }
}

class Blockchain {
    constructor () {
        this.chain = [this.createGeneisBlock()];
        this.difficulty = 3;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    createGeneisBlock() {
        return new Block("01/01/2018", "Genesis Block", "0000");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions(miningRewardAddress) {
        let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
        block.mineBlock(this.difficulty);

        console.log('Block successfully mined!');
        this.chain.push(block);
        
        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ]
    }

    createTransaction(transaction) {
        this.pendingTransactions.push(transaction);
    }

    getBlanceOfAddress(address) {
        let balance = 0;

        for(const block of this.chain) {
            for(const trans of block.transactions) {
                if(trans.fromAddress === address) {
                    balance -= trans.amount
                }
                if(trans.toAddress === address) {
                    balance += trans.amount;
                }
            }
        }

        return balance;
    }

    isChainValid() {
         for (let i = 1; i < this.chain.length; i++) {
             const currentBlock = this.chain[i];
             const previousBlock = this.chain[i - 1];
             if (currentBlock.hash !== currentBlock.calculateHash()) {
                 console.log('currentHash wrong');
                 return false;
             }

             if(currentBlock.previousHash !== previousBlock.hash) {
                 console.log('previoushHash wrong');
                 return false;
             }
         }
         return true;
    }
} 

let fuCoin = new Blockchain();

fuCoin.createTransaction(new Transaction('address1', 'address2', 100));
fuCoin.createTransaction(new Transaction('address2', 'address1', 50));

console.log('\nStart the miner...');
fuCoin.minePendingTransactions('WenkuiFu-address');

console.log('\nBalance of Wenkui Fu is', fuCoin.getBlanceOfAddress('WenkuiFu-address'));

console.log('\nStart the miner again  ...');
fuCoin.minePendingTransactions('WenkuiFu-address');

console.log('\nBalance of Wenkui Fu is', fuCoin.getBlanceOfAddress('WenkuiFu-address'));


console.log('\nStart the miner again :-)  ...');
fuCoin.minePendingTransactions('WenkuiFu-address');

console.log('\nBalance of Wenkui Fu is', fuCoin.getBlanceOfAddress('WenkuiFu-address'));


