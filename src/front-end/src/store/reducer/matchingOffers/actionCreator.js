import {
        GET_MATCHING_OFFERS,
        SET_FILTER,
        SET_CUR_OFFER
     } from '../../action-types';
import axios from 'axios';
import config from '../../../config/basicConfig'
let backend_url = config.host+":"+config.back_end_port

export const getMatchingOffers = (offerId) =>  dispatch => {
        axios({
            method:"GET",
            url:backend_url+"/matchingOffers/all?offerId="+offerId,
            headers: {
                'Content-Type': 'application/json'
              }
        }).then(function (response) {
            if(response.status === 200 && response.data.message === 'success'){
                let data = response.data.payload;
                dispatch( {
                    type: GET_MATCHING_OFFERS,
                    payload: data
                })
            }
            else{
                let jsonRes = response.data;
                alert("Couldn't fetch matching offers! Please try again!\n" + "Status Code: "+ jsonRes.code + "\n"+
                "Message: " +jsonRes.debugMessage);
                return;
            }
        }).catch(function (error) {
            console.log(JSON.stringify(error));
        });
}

export const acceptOfferAction = (acceptOfferRequest) => dispatch => {
    axios({
        method:"POST",
        url:backend_url+"/matchingOffers/acceptOffer",
        headers: {
            'Content-Type': 'application/json'
          },
        data: acceptOfferRequest
    }).then(function (response) {
        if(response.status === 200 && response.data.message === 'success'){
            let data = response.data.payload;
            alert("Offer Accepted! Please complete the transaction from transactions page!");
        }
        else{
            let jsonRes = response.data;
            alert("Couldn't accept offer! Please try again!\n" + "Status Code: "+ jsonRes.code + "\n"+
            "Message: " +jsonRes.debugMessage);
            return;
        }
    }).catch(function (error) {
        console.log(JSON.stringify(error));
    });
}

export const matchOfferAction = (matchOfferRequest) => dispatch => {
    axios({
        method:"PUT",
        url:backend_url+"/matchingOffers/matchOffer",
        headers: {
            'Content-Type': 'application/json'
          },
        data: matchOfferRequest
    }).then(function (response) {
        if(response.status === 200 && response.data.message === 'success'){
            let data = response.data.payload;
            alert("Offer Matched! Please complete the transaction from transactions page!");
        }
        else{
            let jsonRes = response.data;
            alert("Couldn't match offer! Please try again!\n" + "Status Code: "+ jsonRes.code + "\n"+
            "Message: " +jsonRes.debugMessage);
            return;
        }
    }).catch(function (error) {
        console.log(JSON.stringify(error));
    });
}

export const setFilter = (excludeSetup) => dispatch => {
    return dispatch( {
        type: SET_FILTER,
        payload: excludeSetup
    })
}

export const setCurOffer = (offerDetails) => dispatch => {
    return dispatch( {
        type: SET_CUR_OFFER,
        payload: offerDetails
    })
}
