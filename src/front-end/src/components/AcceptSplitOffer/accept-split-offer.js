import React, {Component, Fragment} from 'react';
import '@fortawesome/fontawesome-free/css/all.css';
import { connect } from 'react-redux';
import './accept-split-offer.css';
import {Button } from 'reactstrap';
import {acceptOfferAction} from '../../store/reducer/matchingOffers/actionCreator';
import { withRouter } from 'react-router-dom';

class AcceptSingleOffer extends Component {

    constructor() {
        super();
        this.state = {

        }
    }

    acceptOffer = ()  => {
        let acceptOfferRequest = {
            offerId1 : this.props.myOffer.id,
            offerId2 : this.props.offer1.id,
            offerId3 : this.props.offer2.id,
            timeStamp : Date.now()
        }
        this.props.acceptOfferAction(acceptOfferRequest);
        this.props.history.push("/home/myTransaction");
    }

    calculateForignCurrency = (amt,exRate) => {
        return Math.round(((amt*exRate)+Number.EPSILON)*100)/100;
    }

    render(){
        let offer1 = this.props.offer1;
        let offer2 = this.props.offer2;
        let myOffer = this.props.myOffer;
        return <Fragment>
            <div className="aso-container">
                <div className="aso-col">
                    <h2>Accept Offer</h2>
                </div>
                <div className="aso-col">
                    <div className="aso-heading">
                        <h3>My Offer</h3>
                    </div>
                    <div className="aso-line">
                        <div>
                        Amount: {myOffer.amount} {myOffer.sourceCurrency} | {this.calculateForignCurrency(myOffer.amount,myOffer.exchangeRate)} {myOffer.destinationCurrency}
                        </div>
                    </div>
                    <div className="aso-line">
                        <div>
                        Exchange Rate: {myOffer.exchangeRate}
                        </div>
                    </div>
                    <div className="aso-line">
                        <div>
                        {myOffer.sourceCountry}
                            <i class="fas fa-arrow-right pad-icon"></i>
                        {myOffer.destinationCountry}
                        </div>
                    </div>
                    <div className="aso-line">
                        <div>
                        {myOffer.sourceCurrency}
                            <i class="fas fa-arrow-right pad-icon"></i>
                        {myOffer.destinationCurrency}
                        </div>
                    </div>
                </div>
                <div className="aso-col">
                    <div className="aso-heading">
                    <h3>Accepting Offer 1</h3>
                    </div>
                    <div className="aso-line">
                        <div>
                            Amount: {offer1.amount} {offer1.sourceCurrency} | {this.calculateForignCurrency(offer1.amount,offer1.exchangeRate)} {offer1.destinationCurrency}
                        </div>
                    </div>
                    <div className="aso-line">
                        <div>
                        User: {offer1.userNickname}
                        </div>
                    </div>
                    <div className="aso-line">
                        <div>
                        Exchange Rate: {offer1.exchangeRate}
                        </div>
                    </div>
                    <div className="aso-line">
                        <div>
                        {offer1.sourceCountry}
                            <i class="fas fa-arrow-right pad-icon"></i>
                        {offer1.destinationCountry}
                        </div>
                    </div>
                    <div className="aso-line">
                        <div>
                        {offer1.sourceCurrency}
                            <i class="fas fa-arrow-right pad-icon"></i>
                        {offer1.destinationCurrency}
                        </div>
                    </div>
                </div>
                <div className="aso-col">
                    <div className="aso-heading">
                    <h3>Accepting Offer 2</h3>
                    </div>
                    <div className="aso-line">
                        <div>
                            Amount: {offer2.amount} {offer2.sourceCurrency} | {this.calculateForignCurrency(offer2.amount,offer2.exchangeRate)} {offer2.destinationCurrency}
                        </div>
                    </div>
                    <div className="aso-line">
                        <div>
                        User: {offer2.userNickname}
                        </div>
                    </div>
                    <div className="aso-line">
                        <div>
                        Exchange Rate: {offer2.exchangeRate}
                        </div>
                    </div>
                    <div className="aso-line">
                        <div>
                        {offer1.sourceCountry}
                            <i class="fas fa-arrow-right pad-icon"></i>
                        {offer1.destinationCountry}
                        </div>
                    </div>
                    <div className="aso-line">
                        <div>
                        {offer1.sourceCurrency}
                            <i class="fas fa-arrow-right pad-icon"></i>
                        {offer1.destinationCurrency}
                        </div>
                    </div>
                </div>
                <div className="aso-heading">
                <Button size="lg" color="primary" onClick={this.acceptOffer}>Accept!</Button>
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
    acceptOfferAction(acceptOfferRequest) {
        dispatch(acceptOfferAction(acceptOfferRequest));
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AcceptSingleOffer));