import React, { Component, Fragment } from "react";
import { connect } from 'react-redux';
import ScrollArea from 'react-scrollbar';
import './counter-offers-made-list.css';
import OfferDetailsMO from '../OfferDetailsMO/offer-details-mo';
import CounterOfferMade from '../CounterOfferMade/counter-offer-made';
import { getCounterOffersMade } from '../../store/reducer/counterOffers/actionCreator';
import '@fortawesome/fontawesome-free/css/all.css';
import {
    Button
 } from 'reactstrap';

class CounterOffersMadeList extends Component {

    constructor(){
        super();
        this.state = {
        }
    }

    componentDidMount(){
        // this.props.getCounterOffersMade(this.props.userId);
    }

    backButton = () => {
        this.props.history.push("/home/myOffer");
    }

    render(){
        let counterOffersMade = this.props.counterOffersMade;
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
            <div class="coml-container shadow">
                <div className="coml-button">
                    <i class="fas fa-arrow-left"></i>
                    <Button size="lg" color="link" onClick={this.backButton}>Back</Button>
                </div>
                {
                    offerDetails &&
                    <OfferDetailsMO offerDetails={offerDetails}/>
                }
                {
                    counterOffersMade &&
                    <ScrollArea
                        speed={0.8}
                        className="area"
                        contentClassName="content"
                        horizontal={false}
                        smoothScrolling={true}
                        >
                        <div class="coml-cards-container">
                        {   counterOffersMade &&
                            counterOffersMade.map( co => {
                                return <CounterOfferMade details={co}/>;
                            })
                        }
                        </div>
                    </ScrollArea>
                }
                {
                    (counterOffersMade==null || counterOffersMade.length==0)  &&
                    <ScrollArea
                        speed={0.8}
                        className="area"
                        contentClassName="content"
                        horizontal={false}
                        smoothScrolling={true}
                        >
                        <div class="coml-msg-container">
                            No Counter Offers Made for this offer.
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
    const counterOffersMade = state.counterOffers.counterOffersMade;
    return { isLoggedIn, userId, offerDetails , counterOffersMade};
  }

  const mapDispatchToProps = (dispatch) => ({
    getCounterOffersMade(offerId) {
        dispatch(getCounterOffersMade(offerId));
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(CounterOffersMadeList);