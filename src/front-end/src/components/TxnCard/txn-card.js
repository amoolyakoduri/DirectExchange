import React, {Component, Fragment} from 'react';
import {
     Collapse, Button,
  } from 'reactstrap';
import './txn-card.css';
import '@fortawesome/fontawesome-free/css/all.css'
import { withRouter } from 'react-router-dom';


class TxnCard extends Component {

    constructor() {
        super();
        this.state = {
            isOpen1 : false,
        }
    }

    toggle1 = () => {
        this.setState((state) => {
            return {isOpen1: !state.isOpen1};
          });
    }



    render() {
        let txn = this.props.details;
        let offer2 = this.props.details.offer;
        const dateTime = new Date(txn.createdAt.time);
        return <Fragment>
            <div class=" profile">
                        <div className="single-container">
                            <div className="p-row">
                                <div className="p-col">

                                <div className="txn-name-container ">
                                    <div className="single-attr">
                                        <h4>Txn Id: {txn.id}</h4>
                                    </div>
                                    <div className="single-attr">
                                        Amount  : {txn.amount}
                                    </div>
                                    <div className="single-attr">
                                        <Button color="link" size="lg" onClick={this.toggle1} style={{ marginBottom: '1rem' }}>Offer</Button>
                                        <Collapse isOpen={this.state.isOpen1}>
                                        <div class="col-style">
                                            <div className="split-profile ">
                                                {/* <div className="txn-name-container ">
                                                    <div className="split-attr">
                                                        <h4>Offer</h4>
                                                    </div>
                                                </div> */}
                                                <div className="txn-name-container ">
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
                                                <div className="txn-name-container">
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
                                    </div>
                                </div>
                                <div className="txn-name-container">
                                    <div className="single-attr">
                                        Created At : {`${dateTime.toDateString()} ${dateTime.toTimeString()}`}
                                    </div>
                                    <div className="single-attr">
                                        Service Fee : {txn.serviceFee}
                                    </div>
                                    <div className="single-attr">
                                        Currency : {txn.currency}
                                    </div>
                                </div>
                            </div>
                                <div className="p-col">
                                    {
                                        this.props.pending &&
                                        <div className="single-attr">
                                            <Button size="lg" color="primary" onClick={() => {
                                                this.props.confirmPayment(txn.id,offer2.id)
                                                .then(()=>{
                                                    this.props.history.push('/home/myOffer');
                                                })
                                                }}>Confirm Payment</Button>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
        </Fragment>
    }
}

export default withRouter(TxnCard);
