import React, { Component, Fragment } from "react";
import { connect } from 'react-redux';
import ScrollArea from 'react-scrollbar';
import { getMatchingOffers } from '../../store/reducer/matchingOffers/actionCreator';
import SingleMO from '../SingleMO/single-mo';
import './offers-list-mo.css';
import SplitMO from "../SplitMO/split-mo";

class OffersListMO extends Component {

    constructor(){
        super();
        this.state = {
            matchingOffers : {}
        }
    }

    componentDidMount(){
        this.props.getMatchingOffers(this.props.offerId);
    }

    render(){
        let matchingOffers = this.props.matchingOffers;
        return <Fragment>
            <div class="ol-container shadow">
            <ScrollArea
                    speed={0.8}
                    className="area"
                    contentClassName="content"
                    horizontal={false}
                    smoothScrolling={true}
                    >
                <div class="r-cards-container">
                {   matchingOffers && matchingOffers.singles
                    && matchingOffers.singles.map( match => {
                        return <SingleMO details={match.offer} difference={match.amountDifferencePercentage}
                        curOffer={matchingOffers.offerDetails} />;
                    })
                }
                {   matchingOffers && matchingOffers.offerDetails &&
                        matchingOffers.offerDetails.splitOffers &&
                        matchingOffers.split && !matchingOffers.excludeSplit &&
                        matchingOffers.split.map( match => {
                        return <SplitMO offer1={match.offer1} offer2={match.offer2}
                        curOffer={matchingOffers.offerDetails}
                        difference={match.amountDifferencePercentage}
                         curAmt={matchingOffers.offerDetails.amount}/>;
                    })
                }
                {
                    matchingOffers && matchingOffers.offerDetails &&
                    ( matchingOffers.split==null ||
                        matchingOffers.split.length==0) &&
                        ( matchingOffers.singles==null ||
                            matchingOffers.singles.length==0) &&
                        <div class="ol-msg-container">
                            Sorry, no matching offers found for this offer.
                        </div>
                }
                </div>
            </ScrollArea>
            </div>
        </Fragment>
    }
}

const mapStateToProps = (state) => {
    const isLoggedIn = state.userinfo.isLogin;
    const userId = state.userinfo.id;
    const matchingOffers = state.matchingOffers;
    return { isLoggedIn, userId, matchingOffers };
  }

  const mapDispatchToProps = (dispatch) => ({
    getMatchingOffers(offerId) {
        dispatch(getMatchingOffers(offerId));
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(OffersListMO);