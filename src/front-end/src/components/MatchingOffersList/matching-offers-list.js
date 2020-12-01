import React, { Component, Fragment } from "react";
import { connect } from 'react-redux';
import Navbar from "../Nav/navBar";
import OfferDetailsMO from '../OfferDetailsMO/offer-details-mo';
import './matching-offers-list.css';
import OffersListMO from '../OffersListMO/offers-list-mo';
import FiltersMO from '../FiltersMO/filters-mo';

class MatchingOffers extends Component {

    constructor(){
        super();
    }

    componentDidMount(){
        if(!this.props.isLoggedIn )
        this.props.history.push("/login");
        if(!this.props.offerDetails){
            alert("Please select offer first");
            this.props.history.push("/home/myOffer");
        }
    }

    render(){

        let given = this.props.offerDetails;
        let offerDetails = null;
        if(given!=null || given!=undefined) {
         offerDetails = {
            id : given.offerId ,
            amount : given.Amount,
            sourceCountry : given.SCountry,
            sourceCurrency : given.SCurrency,
            destinationCountry : given.DCountry,
            destinationCurrency : given.DCurrency,
            exchangeRate : given.Rate,
            expirationDate : given.expire,
            counterOffers :  given.CounterOffer==="true",
            splitExchange : given.SplitExchange==="true",
            offerStatus : given.OfferStatus,
            rating : given.owner_rating
        }
    }
        return <Fragment>
            <Navbar/>
            {
                offerDetails &&
                <div className="db-container">
                <div className="mo-container">
                    <h2 className="mo-container">Matching Offers</h2>
                </div>
                <OfferDetailsMO offerDetails={offerDetails}/>
                <FiltersMO />
                <OffersListMO offerId={offerDetails.id}/>
            </div>
            }

        </Fragment>
    }
}

const mapStateToProps = (state) => {
    const isLoggedIn = state.userinfo.isLogin;
    const userId = state.userinfo.id;
    const offerDetails = state.matchingOffers.curOffer;
    return { isLoggedIn, userId, offerDetails };
  }

  const mapDispatchToProps = (dispatch) => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(MatchingOffers);