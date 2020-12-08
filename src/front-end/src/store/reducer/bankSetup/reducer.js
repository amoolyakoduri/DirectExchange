import { BANK_SETUP } from '../../action-types';

const initialState = {
    accounts : []
}

const bankSetup =  (state = initialState,action) => {
    switch(action.type){
    case BANK_SETUP:
        return Object.assign({},state,
            {accounts: [action.payload]});
    default:
        return state;
    }
}

export default bankSetup;