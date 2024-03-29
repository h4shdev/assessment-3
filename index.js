const AuctionABI = require('./auctionABI.json');
const Tx = require('ethereumjs-tx').Transaction;
const Web3 = require('web3');
const Common = require('ethereumjs-common').default;
require('dotenv').config()

const getEvents = async (transactionContract) => {
    console.log(transactionContract.events)
    // const transactionContract = contract;
    // try {
    //     await transactionContract.getPastEvents('highestBidIncreased',{ fromBlock: 0  },(err,event) => console.log(event));
    //     await transactionContract.getPastEvents('auctionEnded',{ fromBlock: 0 },(err,event) => console.log(event));
        // await transactionContract.getPastEvents('auctionCreated',{},(err,event) => console.log(event));
        // await transactionContract.getPastEvents('bidCreated',{},(err,event) => console.log(event));
        // await transactionContract.getPastEvents('withdrawReq',{},(err,event) => console.log(event));
    // } catch(err) {
    //     console.log(err);
    // }
    const filter6 = await transactionContract.events.allEvents();
    //('Transfer', options, (err:any, events:any) => console.log(err, events))
    // contract.estimateGas.contractFn(args...);
    // console.log(transactionContract)
    // transactionContract.queryFilter('Transfer', block1, block2);
    // transactionContract.queryFilter(, block1, block2);

    return [filter6]
}


const sendTx = async (abi, contractAddress, account, privateKey, rpc, commonOptions) => {
    const web3 = new Web3(rpc);
    const contract = new web3.eth.Contract(abi, contractAddress)
    const id = 1;

    // READ CONTRACT
    const endTimer = await contract.methods.auctionEndTime().call();
    const beneficiary = await contract.methods.beneficiary().call();
    const highestBidder = await contract.methods.highestBidder().call();
    const highestBid = await contract.methods.highestbid().call();

    // WRITE CONTRACT 
    try {
        let txCount = web3.eth.getTransactionCount(account) ;
        const data = contract.methods.bid().encodeABI();
        const data2 = contract.methods.withdraw().encodeABI();
        const tx = new Tx({
            nonce: web3.utils.toHex(txCount),
            to: contractAddress,
            gasLimit: web3.utils.toHex(2100000),
            gasPrice: web3.utils.toHex(80 * 1e9),
            value: 0.001,
            data: data,
        }, commonOptions);
    
        tx.sign(privateKey)
    
        const serializedTx = tx.serialize();
        const raw = "0x" + serializedTx.toString('hex')
    
        await web3.eth.sendSignedTransaction(raw, (err, hash) => {
            console.log({
                endTimer,
                beneficiary,
                highestBidder,
                highestBid,
                hash,
                err
            })
        })    
        txCount++;
    
    } catch(err) {
        console.log(err);
    }
    
    // EVENTS
    await getEvents(contract);

}

// const BINANCE_CONTRACT = "0x69c151d021Fca2a2319C73aDFF4381B9902c7945";
// const BINANCE_ABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"_candidateId","type":"uint256"}],"name":"votedEvent","type":"event"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"candidates","outputs":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"string","name":"name","type":"string"},{"internalType":"uint256","name":"voteCount","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"candidatesCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_candidateId","type":"uint256"}],"name":"vote","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"voters","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"}]
// const BINANCE_ACC = "0x86E088E3b920b4dcec9f4F53c307e3D3C1A3838A"
// const BINANCE_RPC = 'https://data-seed-prebsc-1-s1.binance.org:8545'
// const BINANCE_KEY = Buffer.from(process.env.BINANCE_KEY,'hex');
// const BINANCE_COMMON = {
//     common : new Common.forCustomChain(
//         'mainnet',{
//             name: 'binance smart testnet',
//             networkId: 97,
//             chainId: 97
//           },
//           'petersburg'
//     )
// }

// sendTx(BINANCE_ABI, BINANCE_CONTRACT, BINANCE_ACC, BINANCE_KEY, BINANCE_RPC, BINANCE_COMMON)

// const ETHEREUM_CONTRACT = '0xaD04E7f15d9105E0AF5e9DBe5CFB56BDC4968a58'; // OLD ASSIGNMENT
// const ETHEREUM_ABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"_candidateId","type":"uint256"}],"name":"votedEvent","type":"event"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"candidates","outputs":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"string","name":"name","type":"string"},{"internalType":"uint256","name":"voteCount","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"candidatesCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_candidateId","type":"uint256"}],"name":"vote","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"voters","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"}]
const ETHEREUM_CONTRACT = "0xaD38761b9b9774dc84fEdd2393F8cd53f7A3ee07"
const ETHEREUM_ABI = AuctionABI
const ETHEREUM_ACC = "0x86E088E3b920b4dcec9f4F53c307e3D3C1A3838A"
const ETHEREUM_RPC = 'https://goerli.infura.io/v3/d7311bc57b2f4db49bda8fa6b4d7a862'
const ETHEREUM_KEY = Buffer.from(process.env.GOERLI_KEY, 'hex');
const ETHEREUM_COMMON = { chain: 'goerli' }

// console.log(ETHEREUM_ABI)
sendTx(ETHEREUM_ABI, ETHEREUM_CONTRACT, ETHEREUM_ACC, ETHEREUM_KEY, ETHEREUM_RPC, ETHEREUM_COMMON)