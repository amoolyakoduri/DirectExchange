import { GET_MATCHING_OFFERS, SET_FILTER, SET_CUR_OFFER } from '../../action-types';

const initialState = {
    excludeSplit : false
}

const matchingOffers =  (state = initialState,action) => {
    switch(action.type){
    case GET_MATCHING_OFFERS:
        return {
            ...state,
            ...action.payload
          };
    case SET_FILTER:
        return Object.assign({}, state,
            { excludeSplit : action.payload});
    case SET_CUR_OFFER:
        return Object.assign({}, state,
            { curOffer : action.payload});
    default:
        return state;
    }
}

export default matchingOffers;