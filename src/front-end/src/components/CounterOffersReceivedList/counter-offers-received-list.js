import React, { Component, Fragment } from "react";
import { connect } from 'react-redux';
import ScrollArea from 'react-scrollbar';
import './counter-offers-received-list.css';
import OfferDetailsMO from '../OfferDetailsMO/offer-details-mo';
import CounterOfferReceived from '../CounterOfferReceived/counter-offer-received';
import { getCounterOffersReceived } from '../../store/reducer/counterOffers/actionCreator';
import '@fortawesome/fontawesome-free/css/all.css';
import {
    Button
 } from 'reactstrap';

class CounterOffersReceivedList extends Component {

    constructor(){
        super();
        this.state = {
        }
    }

    componentDidMount(){
        // this.props.getCounterOffersReceived(this.props.offerDetails.offerId);
    }

    backButton = () => {
        this.props.history.push("/home/myOffer");
    }

    render(){
        let counterOffersReceived = this.props.counterOffersReceived;
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
            <div class="cor-container shadow">
                <div className="corl-button">
                    <i class="fas fa-arrow-left"></i>
                    <Button size="lg" color="link" onClick={this.backButton}>Back</Button>
                </div>
                {
                    offerDetails &&
                    <OfferDetailsMO offerDetails={offerDetails}/>
                }
                {
                    counterOffersReceived &&
                    <ScrollArea
                        speed={0.8}
                        className="area"
                        contentClassName="content"
                        horizontal={false}
                        smoothScrolling={true}
                        >
                    <div class="cor-cards-container">
                    {
                        counterOffersReceived && counterOffersReceived.map( co => {
                            return <CounterOfferReceived details={co}/>;
                        })
                    }
                    </div>
                    </ScrollArea>
                }
                {
                    (counterOffersReceived==null || counterOffersReceived.length==0)  &&
                    <ScrollArea
                        speed={0.8}
                        className="area"
                        contentClassName="content"
                        horizontal={false}
                        smoothScrolling={true}
                        >
                        <div class="coml-msg-container">
                            No Counter Offers Received for this offer.
                        </div>
                    </ScrollArea>
                }
            </div>
        </Fragment>
    }
}

const mapStateToProps = (state) => {
    const isLoggedIn = state.userinfo.isLogin;
    const userId = state.userinfo.id;
    const offerDetails = state.matchingOffers.curOffer;
    const counterOffersReceived = state.counterOffers.counterOffersReceived;
    return { isLoggedIn, userId, offerDetails , counterOffersReceived};
  }

  const mapDispatchToProps = (dispatch) => ({
    getCounterOffersReceived(offerId) {
        dispatch(getCounterOffersReceived(offerId));
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(CounterOffersReceivedList);