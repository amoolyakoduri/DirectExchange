import { BANK_SETUP } from '../../action-types';
import axios from 'axios';
import config from '../../../config/basicConfig'
let backend_url = config.host+":"+config.back_end_port

export const bankSetup = (accountDetails, history) =>  dispatch => {
        axios({
            method:"POST",
            url:backend_url+"/bank/setup",
            headers: {
                'Content-Type': 'application/json'
              },
            data: accountDetails
        }).then(function (response) {
            if(response.status === 200 && response.data.message === 'success'){
                alert("Account successfully added!");
                let data = response.data.payload;
                dispatch( {
                    type: BANK_SETUP,
                    payload: data
                })
                // history.push("/home");
            }
            else{
                let jsonRes = response.data;
                alert("Account not added! Please try again!\n" + "Status Code: "+ jsonRes.code + "\n"+
                "Message: " +jsonRes.debugMessage);
                return;
            }
        }).catch( (error) =>  {
            console.log(error);
            alert("Account not added! Please try again!\n");
        });
}