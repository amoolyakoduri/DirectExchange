import React, {Component, Fragment} from 'react';
import '@fortawesome/fontawesome-free/css/all.css';
import { connect } from 'react-redux';
import './match-offer.css';
import {Button } from 'reactstrap';
import { matchOfferAction } from '../../store/reducer/matchingOffers/actionCreator';
import { withRouter } from 'react-router-dom';

class MatchOffer extends Component {

    constructor() {
        super();
        this.state = {

        }
    }

    matchOffer = ()  => {
        let matchOfferRequest = {
            offerId : this.props.myOffer.id,
            offerId1 : this.props.offerId1,
            offerId2 : this.props.offerId2,
            amount : this.props.newAmt,
            timeStamp : Date.now()
        }
        this.props.matchOfferAction(matchOfferRequest);
        this.props.history.push("/home");
    }

    calculateForignCurrency = (amt,exRate) => {
        let forex = Math.round(((amt*exRate)+Number.EPSILON)*100)/100;
        return forex;
    }

    render(){
        let newAmt = this.props.newAmt;
        let myOffer = this.props.myOffer;
        let newExRate = this.props.newExRate;
        let newCurrency = this.props.newCurrency;
        console.log("new amt: ",newAmt);
        console.log("new exRate: ",newExRate);
        console.log("new cur: ",newCurrency);
        return <Fragment>
            <div className="m-container">
                <div className="m-col">
                    <h2>Modify My Offer</h2>
                </div>
                <div className="m-col">
                    <div className="m-heading">
                        <h3>My Current Offer</h3>
                    </div>
                    <div className="m-line">
                        <div>
                        Amount: {myOffer.amount} {myOffer.sourceCurrency} | {this.calculateForignCurrency(myOffer.amount,myOffer.exchangeRate)} {myOffer.destinationCurrency}
                        </div>
                    </div>
                    <div className="m-line">
                        <div>
                        Exchange Rate: {myOffer.exchangeRate}
                        </div>
                    </div>
                    <div className="m-line">
                        <div>
                        {myOffer.sourceCountry}
                            <i class="fas fa-arrow-right pad-icon"></i>
                        {myOffer.destinationCountry}
                        </div>
                    </div>
                    <div className="m-line">
                        <div>
                        {myOffer.sourceCurrency}
                            <i class="fas fa-arrow-right pad-icon"></i>
                        {myOffer.destinationCurrency}
                        </div>
                    </div>
                </div>
                <div className="m-col">
                    <div className="ao-heading">
                    <h3>My New Offer</h3>
                    </div>
                    <div className="m-line">
                        <div className="m-highlight">
                            New Amount: {newAmt} {myOffer.sourceCurrency} | {this.calculateForignCurrency(newAmt,newExRate)} {newCurrency}
                        </div>
                    </div>
                    <div className="m-line">
                        <div>
                        Exchange Rate: {myOffer.exchangeRate}
                        </div>
                    </div>
                    <div className="m-line">
                        <div>
                            {myOffer.sourceCountry}
                                <i class="fas fa-arrow-right pad-icon"></i>
                            {myOffer.destinationCountry}
                        </div>
                    </div>
                    <div className="m-line">
                        <div>
                            {myOffer.sourceCurrency}
                                <i class="fas fa-arrow-right pad-icon"></i>
                            {myOffer.destinationCurrency}
                        </div>
                    </div>
                </div>
                <div className="m-heading">
                <Button size="lg" color="primary" onClick={this.matchOffer}>Modify My Order</Button>
                </div>
            </div>
        </Fragment>
    }

}

const mapStateToProps = (state) => {
    const isLoggedIn = state.userinfo.isLogin;
    const userId = state.userinfo.id;
    const  myOffer = state.matchingOffers.offerDetails ;
    return { isLoggedIn, userId, myOffer };
  }

  const mapDispatchToProps = (dispatch) => ({
    matchOfferAction(matchOfferRequest) {
        dispatch(matchOfferAction(matchOfferRequest));
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(MatchOffer));
