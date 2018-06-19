import { 
    getContract,
    getContractForAddr,
    TransportOffer,
    TransportMarket,
    TransportRequest,
    web3
} from '../logic'

export function load() {
    return (dispatch, getState) => {
        let contract = getContract();

        // contract
        // .methods
        // .makeRequest(
        //     // { latitude: 0, longitude: 0, addr: "3 Louwesweg Slotervaart, Amsterdam EC1066" }, 
        //     "3 Louwesweg Slotervaart, Amsterdam EC1066",
        //     "1 Hoegaardsestraat, Louwen, Belgique"
        //     // { latitude: 0, longitude: 0, addr: "1 Hoegaardsestraat, Louwen, Belgique" },
        // )
        // .send({
        //     from: '0xccf348455Dc11b15cbC5FE0E54a165603b522950',
        //     value: web3.utils.toWei("0.05", "ether"),
        //     gas: 10000
        // })
        // .catch(ex => console.log(ex))

        contract
        .getPastEvents("allEvents", { fromBlock: 0 })
        .then(evs => {
            evs.map(ev => {
                switch(ev.event) {
                    case "NewOffer":
                        dispatch(offer(ev))
                        break;
                    case "NewRequest":
                        dispatch(request(ev));
                        break;
                    return;
                }

            })
        })

        contract
        .events
        .NewOffer({ filter: { fromBlock: 0, toBlock: 'latest' } })
        .on('data', function(ev){
            dispatch(offer(ev))
        });

        contract
        .events
        .NewRequest({ filter: { fromBlock: 0, toBlock: 'latest' } })
        .on('data', function(ev){
            dispatch(request(ev))
        });
    }
}

function contractToJson(contract, ignore = []) {
    let props = contract._jsonInterface.filter(func => {
        return func.inputs.length === 0 && func.stateMutability == 'view';
    }).filter(prop => ignore.indexOf(prop.name) === -1)

    let obj = {};
    let names = props.map(prop => prop.name);
    let calls = Promise.all(
        names.map(name => {
            let valPromise = contract.methods[name]().call();
            return valPromise.then(val => {
                return Promise.resolve({name, val});
            })
        })
    )
    return calls
    .then(vals => {
        vals.map(({ name, val }) => {
            obj[name] = val;   
        });
        return Promise.resolve(obj)
    })
}

// function offerToJson(offer) {
//     return Promise.all(
//         offer.minPeople.call(),
//         offer.maxCapacity.call(),
//     )
// }

function offer(event) {
    return (dispatch) => {
        let addr = event.returnValues[0];
        let contract = new web3.eth.Contract(TransportOffer.abi, addr);
        dispatch({
            type: "NewOffer",
            event: contract
        })
    }
}


function request(event) {
    return (dispatch) => {
        let addr = event.returnValues[0];
        let contract = new web3.eth.Contract(TransportRequest.abi, addr);
        dispatch({
            type: "NewRequest",
            event: contract
        })
    }
}