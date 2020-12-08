import React, {Component, Fragment} from 'react';
import './counter-offer-made.css';
import '@fortawesome/fontawesome-free/css/all.css'
import { connect } from 'react-redux';
import OfferDetailsMO from '../OfferDetailsMO/offer-details-mo';
import {
    Button, Collapse
 } from 'reactstrap';


class CounterOfferMade extends Component {

    constructor() {
        super();
        this.state = {
            isOpen2 : false,
        }
    }

    toggle2 = () => {
        this.setState((state) => {
            return {isOpen2: !state.isOpen2};
          });
    }

    acceptOffer = () => {
        this.props.acceptCounterOffer(this.props.details.id);
        this.props.history.push("/home/myTransaction");
    }

    rejectOffer = () => {
        this.props.rejectCounterOffer(this.props.details.id);
    }

    calculateForignCurrency = (amt,exRate) => {
        return Math.round(((amt*exRate)+Number.EPSILON)*100)/100;
    }

    render() {
        let details = this.props.details;
        return (
            <Fragment>
                <div class=" profile">
                        <div className="com-container">
                            <div className="com-row">
                                {/* <div className="com-col"> */}
                                <div className="com-name-container ">
                                    <div className="com-attr">
                                        Counter Offer Id : {details.id}
                                    </div>
                                    <div className="com-attr">
                                        New Amount : {details.newAmount}
                                    </div>
                                    <div className="com-attr">
                                        Status : {details.status}
                                    </div>
                                </div>
                                <div className="com-name-container">
                                    <div className="com-attr">
                                        <Button color="link" size="lg" onClick={this.toggle2} style={{ marginBottom: '1rem' }}>Original Offer</Button>
                                        <Collapse isOpen={this.state.isOpen2}>
                                            <OfferDetailsMO offerDetails={details.originalOffer}/>
                                        </Collapse>
                                    </div>
                                </div>
                                {/* </div> */}
                            </div>
                        </div>
                    </div>
                    <hr/>
            </Fragment>
        )
    }
}

const mapStateToProps = (state) => {}

const mapDispatchToProps = (dispatch) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(CounterOfferMade);