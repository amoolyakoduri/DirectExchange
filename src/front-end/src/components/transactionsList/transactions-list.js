import React, { Component, Fragment } from "react";
import { connect } from 'react-redux';
import ScrollArea from 'react-scrollbar';
import { getAwaitingTransactions,
        getPendingTransactions,
    getFulfilledTransactions,
getCancelledTransactions,
confirmPayment } from '../../store/reducer/transactions/actionCreator';
import './transactions-list.css';
import TxnCard from '../TxnCard/txn-card';

class TxnList extends Component {

    constructor(){
        super();
        this.state = {

        }
    }

    componentDidMount(){
        this.props.getPendingTransactions(this.props.userId);
        this.props.getAwaitingTransactions(this.props.userId);
        this.props.getCancelledTransactions(this.props.userId);
        this.props.getFulfilledTransactions(this.props.userId);
    }

    render() {
        let txns = this.props.txns;
        let { pendingTxns,awaitingTxns,cancelledTxns,fulfilledTxns } = txns;
        return (
            <Fragment>
                <h3 className="txn-pad-left">Pending Transactions</h3>
                <div class="ol-container shadow">
                    <ScrollArea
                            speed={0.8}
                            className="area"
                            contentClassName="content"
                            horizontal={false}
                            smoothScrolling={true}
                            >
                        <div class="r-cards-container">
                        {   pendingTxns
                            && pendingTxns.map( txn => {
                                return <Fragment><TxnCard details={txn} pending={true} confirmPayment={this.props.confirmPayment} /><hr/></Fragment>;
                            })
                        }
                        {
                            pendingTxns && pendingTxns.length==0 &&
                             <div>No Pending Txns at the moment.</div>

                        }
                        </div>
                    </ScrollArea>
                    </div>
                    <h3 className="txn-pad-left">Awaiting Transactions</h3>
                    <div class="ol-container shadow">
                    <ScrollArea
                            speed={0.8}
                            className="area"
                            contentClassName="content"
                            horizontal={false}
                            smoothScrolling={true}
                            >
                        <div class="r-cards-container">
                        {   awaitingTxns &&
                            awaitingTxns.map( txn => {
                                return <Fragment><TxnCard details={txn} /><hr/></Fragment>;
                            })
                        }
                        {
                            awaitingTxns && awaitingTxns.length==0 &&
                             <div>No Awaiting Txns at the moment.</div>
                        }
                        </div>
                    </ScrollArea>
                    </div>
                    <h3 className="txn-pad-left">Cancelled Transactions</h3>
                    <div class="ol-container shadow">
                    <ScrollArea
                            speed={0.8}
                            className="area"
                            contentClassName="content"
                            horizontal={false}
                            smoothScrolling={true}
                            >
                        <div class="r-cards-container">
                        {   cancelledTxns &&
                            cancelledTxns.map( txn => {
                                return <Fragment><TxnCard details={txn} /><hr/></Fragment>;
                            })
                        }
                        {
                            cancelledTxns && cancelledTxns.length==0 &&
                             <div>No Cancelled Txns at the moment.</div>

                        }
                        </div>
                    </ScrollArea>
                    </div>
                    <h3 className="txn-pad-left">Fulfilled Transactions</h3>
                    <div class="ol-container shadow">
                    <ScrollArea
                            speed={0.8}
                            className="area"
                            contentClassName="content"
                            horizontal={false}
                            smoothScrolling={true}
                            >
                        <div class="r-cards-container">
                        {   fulfilledTxns &&
                            fulfilledTxns.map( txn => {
                                return <Fragment><TxnCard details={txn} /><hr/></Fragment>;
                            })
                        }
                        {
                            fulfilledTxns && fulfilledTxns.length==0 &&
                             <div>No Fulfilled Txns at the moment.</div>

                        }
                        </div>
                    </ScrollArea>
                    </div>
            </Fragment>

        )
    }
}

const mapStateToProps = (state) => {
    const isLoggedIn = state.userinfo.isLogin;
    const userId = state.userinfo.id;
    const txns = state.txns;
    return { isLoggedIn, userId, txns };
  }

  const mapDispatchToProps = (dispatch) => ({
    getAwaitingTransactions(userId) {
        dispatch(getAwaitingTransactions(userId));
    },
    getCancelledTransactions(userId) {
        dispatch(getCancelledTransactions(userId));
    },
    getFulfilledTransactions(userId) {
        dispatch(getFulfilledTransactions(userId));
    },
    getPendingTransactions(userId) {
        dispatch(getPendingTransactions(userId));
    },
    confirmPayment(txnId,offerId) {
        return dispatch(confirmPayment(txnId,offerId))
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(TxnList);