import json
import web3
import time

from web3 import Web3
import web3.personal
from web3.contract import ConciseContract



w3 = Web3(web3.providers.rpc.HTTPProvider("http://localhost:7545"))

p = "/Users/liamz/Documents/nextmile/blockchain/build/contracts/TransportMarket.json"
contract_interface = json.loads(open(p, 'r').read())

ContractRequest_int = json.loads(open("/Users/liamz/Documents/nextmile/blockchain/build/contracts/TransportRequest.json", 'r').read())


contract = w3.eth.contract(
    address=Web3.toChecksumAddress('0x36290b244cf18168ec4c953d5ed178529decbd8c'),
    abi=contract_interface['abi'],
)
# contract1 = ConciseContract(contract)R

tx_hash = contract.functions.makeRequest("Amsterdam", "Hoogeveen").transact({'from': w3.eth.accounts[1], 'value': 32 })
# print
tx_receipt = w3.eth.getTransactionReceipt(tx_hash)
logs = contract.events.NewRequest().processReceipt(tx_receipt)

contractAddress = logs[0]['args']['request']

req = w3.eth.contract(
    address=contractAddress,
    abi=ContractRequest_int['abi'],
)
time.sleep(2)
req.functions.cancel().transact({ 'from': w3.eth.accounts[1] })


contract.functions.makeOffer(5, 12, int(time.time() + 200), "Amsterdam", "Hoofdoorp", 30).transact({ 'from': w3.eth.accounts[1] })
contract.functions.makeOffer(10, 25, int(time.time() + 200), "Amsterdam", "Hoogeveen", 10).transact({ 'from': w3.eth.accounts[1] })

from flask import Flask
app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, World!'