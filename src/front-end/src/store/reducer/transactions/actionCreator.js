import {
    SET_PENDING_TXNS,
    SET_AWAITING_TXNS,
    SET_FULFILLED_TXNS,
    SET_CANCELLED_TXNS,
 } from '../../action-types';
import axios from 'axios';
import config from '../../../config/basicConfig'
let backend_url = config.host+":"+config.back_end_port

export const getPendingTransactions = (userId) =>  dispatch => {
    axios({
        method:"GET",
        url:backend_url+"/transaction/getPendingTransactions?userId="+userId,
        headers: {
            'Content-Type': 'application/json'
          }
    }).then(function (response) {
        if(response.status === 200 && response.data.message === 'success'){
            let data = response.data.payload;
            dispatch( {
                type: SET_PENDING_TXNS,
                payload: data.txns
            })
        }
        else{
            let jsonRes = response.data;
            alert("Couldn't fetch pending txns! Please try again!\n" + "Status Code: "+ jsonRes.code + "\n"+
            "Message: " +jsonRes.debugMessage);
            return;
        }
    }).catch(function (error) {
        console.log(JSON.stringify(error));
    });
}

export const getAwaitingTransactions = (userId) =>  dispatch => {
    axios({
        method:"GET",
        url:backend_url+"/transaction/getAwaitingTransactions?userId="+userId,
        headers: {
            'Content-Type': 'application/json'
          }
    }).then(function (response) {
        if(response.status === 200 && response.data.message === 'success'){
            let data = response.data.payload;
            dispatch( {
                type: SET_AWAITING_TXNS,
                payload: data.txns
            })
        }
        else{
            let jsonRes = response.data;
            alert("Couldn't fetch awaiting txns! Please try again!\n" + "Status Code: "+ jsonRes.code + "\n"+
            "Message: " +jsonRes.debugMessage);
            return;
        }
    }).catch(function (error) {
        console.log(JSON.stringify(error));
    });
}

export const getFulfilledTransactions = (userId) =>  dispatch => {
    axios({
        method:"GET",
        url:backend_url+"/transaction/getFulfilledTransactions?userId="+userId,
        headers: {
            'Content-Type': 'application/json'
          }
    }).then(function (response) {
        if(response.status === 200 && response.data.message === 'success'){
            let data = response.data.payload;
            dispatch( {
                type: SET_FULFILLED_TXNS,
                payload: data.txns
            })
        }
        else{
            let jsonRes = response.data;
            alert("Couldn't fetch fulfilled txns! Please try again!\n" + "Status Code: "+ jsonRes.code + "\n"+
            "Message: " +jsonRes.debugMessage);
            return;
        }
    }).catch(function (error) {
        console.log(JSON.stringify(error));
    });
}

export const getCancelledTransactions = (userId) =>  dispatch => {
    axios({
        method:"GET",
        url:backend_url+"/transaction/getCancelledTransactions?userId="+userId,
        headers: {
            'Content-Type': 'application/json'
          }
    }).then(function (response) {
        if(response.status === 200 && response.data.message === 'success'){
            let data = response.data.payload;
            dispatch( {
                type: SET_CANCELLED_TXNS,
                payload: data.txns
            })
        }
        else{
            let jsonRes = response.data;
            alert("Couldn't fetch cancelled txns! Please try again!\n" + "Status Code: "+ jsonRes.code + "\n"+
            "Message: " +jsonRes.debugMessage);
            return;
        }
    }).catch(function (error) {
        console.log(JSON.stringify(error));
    });
}

export const confirmPayment = (txnId,offerId) => dispatch => {
    return axios({
        method:"PUT",
        url:backend_url+"/transaction/confirmPayment?txnId="+txnId+"&offerId="+offerId,
        headers: {
            'Content-Type': 'application/json'
          }
    }).then(function (response) {
        if(response.status === 200 && response.data.message === 'success'){
            let data = response.data.payload;
            alert("Payment successful!!");
        }
        else{
            let jsonRes = response.data;
            alert("Couldn't confirm payment! Please try again!\n" + "Status Code: "+ jsonRes.code + "\n"+
            "Message: " +jsonRes.debugMessage);
            return;
        }
    }).catch(function (error) {
        console.log(JSON.stringify(error));
    });
}
