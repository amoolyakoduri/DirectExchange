import { BANK_SETUP } from '../../action-types';

const defaultState = {
    id:"",
    isLogin:false,
    username:"",
    nickname:'',
    out_id:"",
    rating:"",
    accounts:"",
    offers:[]
}



export default (state = defaultState,action) => {
    let newState = JSON.parse(JSON.stringify(state))
    switch(action.type){
        case 'login':
            delete action.type;
            delete action.password;
            return action;

        case 'logout':

            return {};
        case BANK_SETUP:
            return {
                ...state,
                accounts: [...state.accounts, action.payload]
            }

        // case 'signupByLocal':
            // delete action.type;
            // delete action.password;
            // return action;


        default:
            return state;
    }
}