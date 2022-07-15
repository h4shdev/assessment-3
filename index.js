const Tx = require('ethereumjs-tx').Transaction;
const Web3 = require('web3');
const Common = require('ethereumjs-common').default;
require('dotenv').config()

const sendTx = async (abi, contractAddress, account, privateKey, rpc, commonOptions) => {
    const web3 = new Web3(rpc);
    const contract = new web3.eth.Contract(abi,contractAddress)
    const id = 1;

    // READ CONTRACT
    const candidates = await contract.methods.candidates(id).call();
    const candidatesCount = await contract.methods.candidatesCount().call();
    const isVoter = await contract.methods.voters(account).call();

    // WRITE CONTRACT 
    let txCount = web3.eth.getTransactionCount(account);
    const data =  contract.methods.vote(id).encodeABI();
    const tx = new Tx({
        nonce:web3.utils.toHex(txCount),
        to:contractAddress,
        gasLimit:web3.utils.toHex(210000),
        gasPrice: web3.utils.toHex(67 * 1e9), 
        value:0,
        data:data,
    },commonOptions);

    tx.sign(privateKey)

    const serializedTx = tx.serialize();
    const raw = "0x" + serializedTx.toString('hex')

    web3.eth.sendSignedTransaction(raw, (err, hash) => {
        console.log({candidates, candidatesCount, isVoter, hash})
    })

    txCount++;
}

const BINANCE_CONTRACT = "0x69c151d021Fca2a2319C73aDFF4381B9902c7945";
const BINANCE_ABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"_candidateId","type":"uint256"}],"name":"votedEvent","type":"event"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"candidates","outputs":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"string","name":"name","type":"string"},{"internalType":"uint256","name":"voteCount","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"candidatesCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_candidateId","type":"uint256"}],"name":"vote","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"voters","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"}]
const BINANCE_ACC = "0x86E088E3b920b4dcec9f4F53c307e3D3C1A3838A"
const BINANCE_RPC = 'https://data-seed-prebsc-1-s1.binance.org:8545'
const BINANCE_KEY = Buffer.from(process.env.BINANCE_KEY,'hex');
const BINANCE_COMMON = {
    common : new Common.forCustomChain(
        'mainnet',{
            name: 'binance smart testnet',
            networkId: 97,
            chainId: 97
          },
          'petersburg'
    )
}

sendTx(BINANCE_ABI, BINANCE_CONTRACT, BINANCE_ACC, BINANCE_KEY, BINANCE_RPC, BINANCE_COMMON)

const ETHEREUM_CONTRACT = '0xaD04E7f15d9105E0AF5e9DBe5CFB56BDC4968a58';
const ETHEREUM_ABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"_candidateId","type":"uint256"}],"name":"votedEvent","type":"event"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"candidates","outputs":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"string","name":"name","type":"string"},{"internalType":"uint256","name":"voteCount","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"candidatesCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_candidateId","type":"uint256"}],"name":"vote","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"voters","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"}]
const ETHEREUM_ACC = "0x86E088E3b920b4dcec9f4F53c307e3D3C1A3838A"
const ETHEREUM_RPC = 'https://ropsten.infura.io/v3/32969cb7cf4a45ba9e77877987383127'
const ETHEREUM_KEY = Buffer.from(process.env.ETHEREUM_KEY,'hex');
const ETHEREUM_COMMON = {chain: 'ropsten'}

sendTx(ETHEREUM_ABI, ETHEREUM_CONTRACT, ETHEREUM_ACC, ETHEREUM_KEY, ETHEREUM_RPC, ETHEREUM_COMMON)