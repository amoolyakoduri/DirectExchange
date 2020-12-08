import React, {Component, Fragment} from 'react';
import { Button } from 'reactstrap';
import './counter-offer-received.css';
import '@fortawesome/fontawesome-free/css/all.css'
import { acceptCounterOffer, rejectCounterOffer } from '../../store/reducer/counterOffers/actionCreator';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

class CounterOfferReceived extends Component {

    constructor() {
        super();
        this.state = {
        }
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
                        <div className="cor-container">
                            <div className="cor-row">
                                <div className="cor-col">
                                <div className="cor-name-container ">
                                    <div className="cor-attr">
                                        Counter Offer Id : {details.id}
                                    </div>
                                    <div className="cor-attr">
                                        From User : {details.user.nickname}
                                    </div>
                                    <div className="cor-attr">
                                        User Rating : {details.user.rating}
                                    </div>
                                </div>
                                <div className="cor-name-container">
                                <div className="cor-attr">
                                        New Amount : {details.newAmount}
                                    </div>
                                    <div className="cor-attr">
                                        Status : {details.status}
                                    </div>

                                </div>
                                </div>
                                    {
                                        details.status==="New" &&
                                        <div className="cor-col-button">
                                        <div className="cor-attr">
                                            <Button size="lg" color="primary" onClick={this.acceptOffer}>Accept</Button>
                                        </div>
                                        <div className="cor-attr">
                                                <Button size="lg" color="primary" onClick={this.rejectOffer}>Reject</Button>
                                        </div>
                                        </div>
                                    }
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
    acceptCounterOffer(offerId) {
        dispatch(acceptCounterOffer(offerId));
    },
    rejectCounterOffer(offerId) {
        dispatch(rejectCounterOffer(offerId));
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(CounterOfferReceived));