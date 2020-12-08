import React, {Component, Fragment} from 'react';
import {
    Card, CardText, CardBody, CardImg,
    CardTitle, CardSubtitle, Button,
  } from 'reactstrap';
import './single-mo.css';
import '@fortawesome/fontawesome-free/css/all.css'
import Modal from 'react-awesome-modal';
import AcceptSingleOffer from '../AcceptSingleOffer/accept-single-offer';
import CounterOffer from '../CounterOffer/counter-offer';
import MatchOffer from '../MatchOffer/match-offer';

class SingleMO extends Component {

    constructor() {
        super();
        this.state = {
            acceptOfferModal : false,
            matchOfferModal : false,
            counterOfferModal : false,
        }
    }

    acceptOfferToggle = (event) => {
        this.setState((state, props) => {
            return {acceptOfferModal: !state.acceptOfferModal};
        });
    }

    matchOfferToggle = (event) => {
        this.setState((state, props) => {
            return {matchOfferModal: !state.matchOfferModal};
        });
    }

    counterOfferToggle = (event) => {
        this.setState((state, props) => {
            return {counterOfferModal: !state.counterOfferModal};
        });
    }

    calculateForignCurrency = (amt,exRate) => {
        return Math.round(((amt*exRate)+Number.EPSILON)*100)/100;
    }

    render() {
        let details = this.props.details;
        let amtDiff = this.props.difference;
        let curOffer = this.props.curOffer;
        let newAmt = this.calculateForignCurrency(details.amount,details.exchangeRate);
        return (
            <Fragment>
                <div class=" profile">
                        <div className="single-container">
                            <div className="p-row">
                                <div className="p-col">
                                <div className="p-name-container ">
                                    <div>
        <h4>Amount: {details.amount} {details.sourceCurrency} | {this.calculateForignCurrency(details.amount,details.exchangeRate)} {details.destinationCurrency} </h4>
                                    </div>
                                    <div>
                                        <h4>Amt Difference: {amtDiff}%</h4>
                                    </div>
                                </div>
                                <div className="p-name-container ">
                                    <div className="single-attr">
                                        Offer Id : {details.id}
                                    </div>
                                    <div className="single-attr">
                                        Owner : {details.userNickname}
                                    </div>
                                    <div className="single-attr">
                                        Exchange Rate : {details.exchangeRate}
                                    </div>
                                </div>
                                <div className="p-name-container">
                                    <div className="single-attr">
                                        {details.sourceCountry}
                                        <i class="fas fa-arrow-right pad-icon"></i>
                                        {details.destinationCountry}
                                    </div>
                                    <div className="single-attr">
                                        {details.sourceCurrency}
                                        <i class="fas fa-arrow-right pad-icon"></i>
                                        {details.destinationCurrency}
                                    </div>

                                </div>
                                </div>
                                <div className="p-col">
                                    {
                                        amtDiff==0 &&
                                        <div className="single-attr">
                                            <Button size="lg" color="primary" onClick={this.acceptOfferToggle}>Accept Offer</Button>
                                        </div>
                                    }
                                    {
                                        amtDiff!=0 &&
                                        <div className="single-attr">
                                                <Button size="lg" color="primary" onClick={this.matchOfferToggle}>Modify My Offer</Button>
                                        </div>
                                    }
                                    {
                                        amtDiff!=0 && curOffer.counterOffers && details.counterOffers &&
                                        <div className="single-attr">
                                            <Button size="lg" color="primary" onClick={this.counterOfferToggle}>Counter Offer</Button>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr/>
                    <Modal visible={this.state.acceptOfferModal} width="400" height="500" effect="fadeInUp" onClickAway={this.acceptOfferToggle}>
                    <AcceptSingleOffer otherOffer={details}/>
                    </Modal>
                    <Modal visible={this.state.matchOfferModal} width="400" height="500" effect="fadeInUp" onClickAway={this.matchOfferToggle}>
                    <MatchOffer newAmt={newAmt} newExRate={curOffer.exchangeRate} newCurrency={curOffer.sourceCurrency} offerId1={details.id} offerId2={null}/>
                    </Modal>
                    <Modal visible={this.state.counterOfferModal} width="400" height="550" effect="fadeInUp" onClickAway={this.counterOfferToggle}>
                    <CounterOffer otherOffer={details} newAmt={newAmt} thirdOffer={null}/>
                    </Modal>
            </Fragment>
        )
    }
}

export default SingleMO;