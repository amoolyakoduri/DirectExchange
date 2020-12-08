import React, {Component, Fragment} from 'react';
import {
     Button, Collapse
  } from 'reactstrap';
import './split-mo.css';
import '@fortawesome/fontawesome-free/css/all.css';
import Modal from 'react-awesome-modal';
import AcceptSplitOffer from '../AcceptSplitOffer/accept-split-offer';
import CounterOffer from '../CounterOffer/counter-offer';
import MatchOffer from '../MatchOffer/match-offer';
import counterOffer from '../CounterOffer/counter-offer';

class SplitMO extends Component {

    constructor(props){
        super(props);
        this.state = {
            isOpen1 : false,
            isOpen2 : false,
            acceptOfferModal : false,
            matchOfferModal : false,
            counterOfferModal : false,
        }
    }

    toggle1 = () => {
        this.setState((state) => {
            return {isOpen1: !state.isOpen1};
          });
    }

    toggle2 = () => {
        this.setState((state) => {
            return {isOpen2: !state.isOpen2};
          });
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
        let forex = Math.round(((amt*exRate)+Number.EPSILON)*100)/100;
        return forex;
    }

    calculateCounterOfferDifference = () => {
        let a = (this.props.difference*this.props.curOffer.amount)/100;
        let counterOfferAmt = a*this.props.curOffer.exchangeRate;
        return Math.round(counterOfferAmt*100)/100;
    }

    calculateMatchingAmount = () => {
        let offer1 = this.props.offer1;
        let offer2 = this.props.offer2;
        let curOffer = this.props.curOffer;
        let matchingNewAmt = 0.0;
        if(offer1.sourceCurrency === offer2.sourceCurrency){
            matchingNewAmt = this.calculateForignCurrency(offer1.amount,offer1.exchangeRate) + this.calculateForignCurrency(offer2.amount,offer2.exchangeRate);
        }
        else if(offer1.sourceCurrency != offer2.sourceCurrency && offer1.sourceCurrency == curOffer.sourceCurrency){
            matchingNewAmt = this.calculateForignCurrency(offer2.amount,offer2.exchangeRate) - offer1.amount;//Math.round(((offer1.amount+Number.EPSILON)*100.0)/100.0);
        }
        else {
            matchingNewAmt = this.calculateForignCurrency(offer1.amount,offer1.exchangeRate) - offer2.amount;//Math.round(((offer2.amount+Number.EPSILON)*100.0)/100.0);
        }
        return matchingNewAmt;
    }

    getExRate = () => {
        let offer1 = this.props.offer1;
        let offer2 = this.props.offer2;
        let curOffer = this.props.curOffer;
        if(offer1.sourceCurrency === offer2.sourceCurrency)
            return curOffer.exchangeRate;
        else if(offer1.sourceCurrency != offer2.sourceCurrency && offer1.sourceCurrency == curOffer.sourceCurrency)
            return offer1.exchangeRate;
        else
            return offer2.exchangeRate;
    }

    getNewCurrency = () => {
        let offer1 = this.props.offer1;
        let offer2 = this.props.offer2;
        let curOffer = this.props.curOffer;
        if(offer1.sourceCurrency === offer2.sourceCurrency)
            return offer1.sourceCurrency;
        else if(offer1.sourceCurrency != offer2.sourceCurrency && offer1.sourceCurrency == curOffer.sourceCurrency)
            return offer2.sourceCurrency;
        else
            return offer1.sourceCurrency;
    }

    render() {
        let offer1 = this.props.offer1;
        let offer2 = this.props.offer2;
        let curOffer = this.props.curOffer;
        let amtDiff = this.props.difference;
        let newAmt = this.calculateMatchingAmount();
        let newExRate = this.getExRate();
        let newCurrency = this.getNewCurrency();
        let biggerOffer =null;
        let smallerOffer = null;
        if(offer1.sourceCurrency==offer2.sourceCurrency) {
            biggerOffer = offer1.amount > offer2.amount ? offer1 : offer2;
            smallerOffer = offer1.amount < offer2.amount ? offer1 : offer2;
        }
        else if(offer1.amount > this.calculateForignCurrency(offer2.amount,offer2.exchangeRate)){
            biggerOffer =  offer1;
            smallerOffer = offer2;
        }
        else {
            biggerOffer = offer2;
            smallerOffer = offer1;
        }
        let counterOfferAmt = biggerOffer.amount+this.calculateCounterOfferDifference();
        return (
            <Fragment>

                <div className="profile">
                <div className="profile-container">
                    <div className="sp-name-container ">
                            <div >
                                <h4>
                                { offer1.sourceCurrency === offer2.sourceCurrency &&
                                    <Fragment>
                                        {curOffer.amount} <i class="fas fa-arrows-alt-h pad-icon"></i> {this.calculateForignCurrency(offer1.amount,offer1.exchangeRate)} + {this.calculateForignCurrency(offer2.amount,offer2.exchangeRate)}
                                    </Fragment>
                                }
                                { offer1.sourceCurrency != offer2.sourceCurrency && offer1.sourceCurrency == curOffer.sourceCurrency &&
                                    <Fragment>
                                        {curOffer.amount} + {offer1.amount} <i class="fas fa-arrows-alt-h pad-icon"></i> {this.calculateForignCurrency(offer2.amount,offer2.exchangeRate)}
                                    </Fragment>
                                }
                                { offer1.sourceCurrency != offer2.sourceCurrency && offer2.sourceCurrency == curOffer.sourceCurrency &&
                                    <Fragment>
                                        {curOffer.amount} + {offer2.amount} <i class="fas fa-arrows-alt-h pad-icon"></i> {this.calculateForignCurrency(offer1.amount,offer1.exchangeRate)}
                                    </Fragment>
                                }
                                </h4>
                            </div>
                            <div >
                                <h4>
                                Amt Difference: {amtDiff} %
                                </h4>
                            </div>
                        </div>
                </div>
                {/* <div className="profile-container" > */}
                    <div className="sp-offer-container ">
                    <Button color="link" size="lg" onClick={this.toggle1} style={{ marginBottom: '1rem' }}>Offer1</Button>
                    <Collapse isOpen={this.state.isOpen1}>
                        <div class="col-style">
                            <div className="split-profile ">
                                <div className="p-name-container ">
                                    <div className="split-attr">
                                        <h4>Offer 1</h4>
                                    </div>
                                    <div className="split-attr">
                                        Amount:
                                    </div>
                                    <div className="split-attr">
                                        {offer1.amount} {offer1.sourceCurrency} | {this.calculateForignCurrency(offer1.amount,offer1.exchangeRate)} {offer1.destinationCurrency}
                                    </div>
                                </div>
                                <div className="p-name-container ">
                                    <div className="split-attr">
                                        Offer Id : {offer1.id}
                                    </div>
                                    <div className="split-attr">
                                        Owner : {offer1.userNickname}
                                    </div>
                                    <div className="split-attr">
                                        Exchange Rate : {offer1.exchangeRate}
                                    </div>
                                </div>
                                <div className="p-name-container">
                                    <div className="split-attr">
                                        {offer1.sourceCountry}
                                        <i class="fas fa-arrow-right pad-icon"></i>
                                        {offer1.destinationCountry}
                                    </div>
                                    <div className="split-attr">
                                        {offer1.sourceCurrency}
                                        <i class="fas fa-arrow-right pad-icon"></i>
                                        {offer1.destinationCurrency}
                                    </div>
                                    {/* <div className="split-attr">
                                    <Button >Exchange!</Button>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </Collapse>
                    {/* </div> */}
                </div>
                {/* <div className="profile-container"> */}
                    <div className="sp-offer-container ">
                    <Button color="link" size="lg" onClick={this.toggle2} style={{ marginBottom: '1rem' }}>Offer2</Button>
                    <Collapse isOpen={this.state.isOpen2}>
                    <div class="col-style">
                        <div className="split-profile ">
                            <div className="p-name-container ">
                                <div className="split-attr">
                                    <h4>Offer 2</h4>
                                </div>
                                <div className="split-attr">
                                    Amount:
                                </div>
                                <div className="split-attr">
                                    {offer2.amount} {offer2.sourceCurrency} | {this.calculateForignCurrency(offer2.amount,offer2.exchangeRate)} {offer2.destinationCurrency}
                                </div>
                            </div>
                            <div className="p-name-container ">
                                <div className="split-attr">
                                    Offer Id : {offer2.id}
                                </div>
                                <div className="split-attr">
                                    Owner : {offer2.userNickname}
                                </div>
                                <div className="split-attr">
                                    Exchange Rate : {offer2.exchangeRate}
                                </div>
                            </div>
                            <div className="p-name-container">
                                <div className="split-attr">
                                    {offer2.sourceCountry}
                                    <i class="fas fa-arrow-right pad-icon"></i>
                                    {offer2.destinationCountry}
                                </div>
                                <div className="split-attr">
                                    {offer2.sourceCurrency}
                                    <i class="fas fa-arrow-right pad-icon"></i>
                                    {offer2.destinationCurrency}
                                </div>
                                {/* <div className="split-attr">
                                <Button >Exchange!</Button>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </Collapse>
                {/* </div> */}
                </div>
                <div class="sp-offer-btn-container ">
                            {
                                amtDiff==0 &&
                                <div className="split-profile-button ">
                                    <div className="split-attr">
                                    <Button size="lg" color="primary" onClick={this.acceptOfferToggle}>Accept Offer</Button>
                                    </div>
                                </div>
                            }
                            {
                                amtDiff!=0 &&
                                <div className="split-profile-button ">
                                    <div className="split-attr">
                                        <Button size="lg" color="primary" onClick={this.matchOfferToggle}>Modify My Offer</Button>
                                    </div>
                                    {
                                        curOffer.counterOffers &&
                                        <div className="split-attr">
                                            <Button size="lg" color="primary" onClick={this.counterOfferToggle}>Counter Offer</Button>
                                        </div>
                                    }
                                </div>
                            }
                </div>
                </div>
                <hr/>
                <Modal visible={this.state.acceptOfferModal} width="400" height="650" effect="fadeInUp" onClickAway={this.acceptOfferToggle}>
                    <AcceptSplitOffer offer1={offer1} offer2={offer2}/>
                    </Modal>
                    <Modal visible={this.state.matchOfferModal} width="400" height="500" effect="fadeInUp" onClickAway={this.matchOfferToggle}>
                    <MatchOffer  newAmt={newAmt} newExRate={newExRate} newCurrency={newCurrency} offerId1={offer1.id} offerId2={offer2.id}/>
                    </Modal>
                    <Modal visible={this.state.counterOfferModal} width="400" height="550" effect="fadeInUp" onClickAway={this.counterOfferToggle}>
                    <CounterOffer otherOffer={biggerOffer} newAmt={counterOfferAmt} thirdOffer={smallerOffer}/>
                    </Modal>
            </Fragment>
        )
    }
}

export default SplitMO;