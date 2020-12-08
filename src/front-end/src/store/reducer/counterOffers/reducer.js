import { GET_COUNTER_OFFERS_RECEIVED, GET_COUNTER_OFFERS_MADE } from '../../action-types';

const initialState = {
}

const counterOffers =  (state = initialState,action) => {
    switch(action.type){
    case GET_COUNTER_OFFERS_RECEIVED:
        return Object.assign({},state,
            {counterOffersReceived: action.payload.counterOffers}
        );
    case GET_COUNTER_OFFERS_MADE:
        return Object.assign({},state,
            {counterOffersMade: action.payload.counterOffers}
        );
    default:
        return state;
    }
}

export default counterOffers;