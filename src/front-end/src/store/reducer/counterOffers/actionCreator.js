import {
    GET_COUNTER_OFFERS_RECEIVED,
    GET_COUNTER_OFFERS_MADE
 } from '../../action-types';
import axios from 'axios';
import config from '../../../config/basicConfig'
let backend_url = config.host+":"+config.back_end_port

export const createCounterOffer = (counterOfferRequest) => dispatch => {
    axios({
        method:"POST",
        url:backend_url+"/matchingOffers/createCounterOffer",
        headers: {
            'Content-Type': 'application/json'
          },
        data: counterOfferRequest
    })
    .then(function (response) {
        if(response.status === 200 && response.data.message === 'success'){
            let data = response.data.payload;
            alert("Counter Offer proposed!");
        }
        else{
            let jsonRes = response.data;
            alert("Couldn't create counter offers! Please try again!\n" + "Status Code: "+ jsonRes.code + "\n"+
            "Message: " +jsonRes.debugMessage);
            return;
        }
    }).catch(function (error) {
        console.log(JSON.stringify(error));
    });
}

export const getCounterOffersReceived = (offerId) => dispatch => {
    axios({
        method:"GET",
        url:backend_url+"/matchingOffers/getCounterOffersReceived?offerId="+offerId,
        headers: {
            'Content-Type': 'application/json'
          }
    }).then(function (response) {
        if(response.status === 200 && response.data.message === 'success'){
            let data = response.data.payload;
            dispatch( {
                type: GET_COUNTER_OFFERS_RECEIVED,
                payload: data
            })
        }
        else{
            let jsonRes = response.data;
            alert("Couldn't fetch counter offers! Please try again!\n" + "Status Code: "+ jsonRes.code + "\n"+
            "Message: " +jsonRes.debugMessage);
            return;
        }
    }).catch(function (error) {
        console.log(JSON.stringify(error));
    });
}

export const getCounterOffersMade = (userId) => dispatch => {
    axios({
        method:"GET",
        url:backend_url+"/matchingOffers/getCounterOffersMade?userId="+userId,
        headers: {
            'Content-Type': 'application/json'
          }
    }).then(function (response) {
        if(response.status === 200 && response.data.message === 'success'){
            let data = response.data.payload;
            dispatch( {
                type: GET_COUNTER_OFFERS_MADE,
                payload: data
            })
        }
        else{
            let jsonRes = response.data;
            alert("Couldn't fetch counter offers made! Please try again!\n" + "Status Code: "+ jsonRes.code + "\n"+
            "Message: " +jsonRes.debugMessage);
            return;
        }
    }).catch(function (error) {
        console.log(JSON.stringify(error));
    });
}

export const acceptCounterOffer = (counterOfferId) => dispatch => {
    axios({
        method:"PUT",
        url:backend_url+"/matchingOffers/acceptCounterOffer?counterOfferId="+counterOfferId,
        headers: {
            'Content-Type': 'application/json'
          }
    }).then(function (response) {
        if(response.status === 200 && response.data.message === 'success'){
            let data = response.data.payload;
            alert("Counter Offer Accepted! Please complete the transaction from transactions page!");
        }
        else{
            let jsonRes = response.data;
            alert("Couldn't accept counter offer! Please try again!\n" + "Status Code: "+ jsonRes.code + "\n"+
            "Message: " +jsonRes.debugMessage);
            return;
        }
    }).catch(function (error) {
        console.log(JSON.stringify(error));
    });
}

export const rejectCounterOffer = (counterOfferId) => dispatch => {
    axios({
        method:"PUT",
        url:backend_url+"/matchingOffers/rejectCounterOffer?counterOfferId="+counterOfferId,
        headers: {
            'Content-Type': 'application/json'
          }
    }).then(function (response) {
        if(response.status === 200 && response.data.message === 'success'){
            let data = response.data.payload;
            alert("Counter Offer Rejected!");
        }
        else{
            let jsonRes = response.data;
            alert("Couldn't reject counter offer! Please try again!\n" + "Status Code: "+ jsonRes.code + "\n"+
            "Message: " +jsonRes.debugMessage);
            return;
        }
    }).catch(function (error) {
        console.log(JSON.stringify(error));
    });
}
