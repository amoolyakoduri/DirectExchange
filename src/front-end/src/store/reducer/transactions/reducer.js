import { SET_CANCELLED_TXNS, SET_AWAITING_TXNS, SET_FULFILLED_TXNS, SET_PENDING_TXNS } from '../../action-types';

const initialState = {
    cancelledTxns : [],
    awaitingTxns : [],
    pendingTxns : [],
    fulfilledTxns : []
}

const matchingOffers =  (state = initialState,action) => {
    switch(action.type){
    case SET_CANCELLED_TXNS:
        return Object.assign({}, state,
            { cancelledTxns : action.payload});
    case SET_AWAITING_TXNS:
        return Object.assign({}, state,
            { awaitingTxns : action.payload});
    case SET_FULFILLED_TXNS:
        return Object.assign({}, state,
            { fulfilledTxns : action.payload});
    case SET_PENDING_TXNS:
        return Object.assign({}, state,
            { pendingTxns : action.payload});
    default:
        return state;
    }
}

export default matchingOffers;