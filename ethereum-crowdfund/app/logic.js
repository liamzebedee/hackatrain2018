import Web3 from 'web3';
// const provider = new Web3.providers.HttpProvider("http://localhost:7545");
const provider = new Web3.providers.WebsocketProvider('ws://localhost:7545')
// const provider = new Web3.providers.WebsocketProvider('ws://10.1.128.194:7545')
export const web3 = new Web3(provider);

// web3.setProvider(eventProvider)

web3.eth.defaultAccount = web3.eth.accounts[0]

export const TransportMarket = require('../../blockchain/build/contracts/TransportMarket.json');
export const TransportOffer = require('../../blockchain/build/contracts/TransportOffer.json');
export const TransportRequest = require('../../blockchain/build/contracts/TransportRequest.json');

let instance = new web3.eth.Contract(TransportMarket.abi, '0x36290b244cf18168ec4c953d5ed178529decbd8c');

export function getContract() {
    return instance
}

const addrs = `
0xccf348455Dc11b15cbC5FE0E54a165603b522950
0x3f3A20D6112E22BfFc2D902a69956252A4Eb7D09
0xB9743Bb9235294C75242300DAEF76F23B25C9927
0x4Dc3C674A5CCB3b7c5d3292e46A350d93d69d0dC
0x092DE0Ea80bE2deD00A4D3599F54397bfD549044
0x974D7ADD4b6B97B5Fdb3C2610e94245589786454
`.split('\n').filter(Boolean);