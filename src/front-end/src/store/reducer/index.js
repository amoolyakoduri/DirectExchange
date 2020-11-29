import { combineReducers } from 'redux'
import { reducer as userinfo } from './userinfo';
import  bankSetup  from './bankSetup/reducer';
import getMatchingOffers from './matchingOffers/reducer'
import getCounterOffers from './counterOffers/reducer'
import txns from './transactions/reducer';

const reducer =  combineReducers({
    userinfo:userinfo,
    bankSetup,
    matchingOffers:getMatchingOffers,
    counterOffers:getCounterOffers,
    txns : txns
});

export default reducer;