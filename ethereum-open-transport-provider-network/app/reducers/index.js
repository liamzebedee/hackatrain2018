const initialState = {
    offers: [],
    requests: []
}

function reduce(state = initialState, action) {
    switch(action.type) {
        case "NewOffer":
            return {
                ...state,
                offers: [...state.offers, action.event]
            };
        
        case "NewRequest":
            return {
                ...state,
                requests: [...state.requests, action.event]
            };  
        default: 
            return state;
    }
}

export default reduce;