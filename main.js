
const SHA256 = require('crypto-js/sha256');
const myLog = require('./Log');
const msg = require('./utility/Message');

class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Block {
    constructor(timestamp, transactions, previousHash = '') {
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
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransaction = [];
        this.miningReward = 100;
    }

    createGenesisBlock() {
        return new Block("01/01/2017", "Genesis Block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions(miningRewardAddress) {
        let block = new Block(Date.now(), this.pendingTransaction,this.getLatestBlock().hash);
        block.mineBlock(this.difficulty);

        console.log('Block successfully mined!');
        this.chain.push(block);
        
        this.pendingTransaction = [
            new Transaction(null, miningRewardAddress, this.miningReward),
        ];
    }

    createTransaction(transaction) {
        this.pendingTransaction.push(transaction)
    }


    getBalanceOfAddress(address) {
        let balance = 0;

        for(const block of this.chain) {
            for(const trans of block.transactions) {
                if(trans.fromAddress === address) {
                    blance -= trans.amount;
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
            const previousBlock = this.chain[i-1];

            if (currentBlock.hash !==  currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }
}



/* console.log(JSON.stringify(fuCoin, null, 4));
fuCoin.chain[1].data = {amount: 1000};
console.log("Mining block 1...");
fuCoin.addBlock(new Block(1, "10/07/2017", {amount: 4}));

console.log("Mining block 2...");
fuCoin.addBlock(new Block(2, "12/07/2017", {amount: 10}));
console.log('Is blockchain valid? ', fuCoin.isChainValid()); */

const fuCoin = new Blockchain();

fuCoin.createTransaction(new Transaction('address1', 'address2', 100));
fuCoin.createTransaction(new Transaction('address2', 'address1', 50));

console.log('\nStarting the miner...');
fuCoin.minePendingTransactions('Wenkui-address');

console.log('\nBalance of Wenkui Fu is', fuCoin.getBalanceOfAddress('Wenkui-address'));

console.log('\nStarting the miner again...');
fuCoin.minePendingTransactions('Wenkui-address');
console.log('\nBalance of Wenkui Fu is', fuCoin.getBalanceOfAddress('Wenkui-address'));