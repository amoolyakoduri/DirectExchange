import React, { Component, Fragment } from "react";
import './offer-details-mo.css';
import { Card, CardBody,
} from 'reactstrap';
class OfferDetailsMO extends Component {

    constructor() {
        super();
        this.state = {
            offerDetails : {
                id : 1 ,
                amount : 1000,
                sourceCountry : "USA",
                sourceCurrency : "USD",
                destinationCountry : "IND",
                destinationCurrency : "INR",
                exchangeRate : 74.24,
                expirationDate : "",
                allowCounterOffers : true,
                allowSplitExchange : true,
                offerStatus : "Open"
            }

        };
      }

      ratingChanged = (newRating) => {
        console.log(newRating);
      };

    render() {
        return (
            <Fragment>
                <Card className="shadow od-container">
                <CardBody>
                    <div class=" profile">
                        <div className="profile-container">
                            <div>
                                <h1> Offer Details</h1>
                                </div>
                            <div className="p-name-container ">
                                <div className="p-attr">
                                    Offer Id : {this.props.offerDetails.id}
                                </div>
                                <div className="p-attr">
                                    Offer Status : {this.props.offerDetails.offerStatus}
                                </div>
                                <div className="p-attr">
                                    Source Country : {this.props.offerDetails.sourceCountry}
                                </div>
                                <div className="p-attr">
                                    Source Currency : {this.props.offerDetails.sourceCurrency}
                                </div>
                            </div>
                            <div className="p-name-container">
                                <div className="p-attr">
                                    Amount : {this.props.offerDetails.amount}
                                </div>
                                <div className="p-attr">
                                    Exchange Rate : {this.props.offerDetails.exchangeRate}
                                </div>
                                <div className="p-attr">
                                    Destination Country : {this.props.offerDetails.destinationCountry}
                                </div>
                                <div className="p-attr">
                                    Destination Currency : {this.props.offerDetails.destinationCurrency}
                                </div>
                            </div>
                        </div>
                    </div>
                </CardBody>
                </Card>
            </Fragment>
        );
    }
}

export default OfferDetailsMO;