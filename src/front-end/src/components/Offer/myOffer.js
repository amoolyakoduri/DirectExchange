import React, {Component, Fragment} from 'react';
import '../../App.css';
import config from '../../config/basicConfig'
import axios from 'axios';
import { Redirect } from 'react-router';
import {connect} from "react-redux";
import {actionCreators} from "../../store/reducer/userinfo";
import {Button } from 'reactstrap';
import { setCurOffer } from '../../store/reducer/matchingOffers/actionCreator';
import { getCounterOffersReceived } from '../../store/reducer/counterOffers/actionCreator';
import { getCounterOffersMade } from '../../store/reducer/counterOffers/actionCreator';
import './myOffer.css';

let host = config.host;
let port = config.back_end_port;
let url = host + ':' + port;


class MyOffer extends Component{
    constructor(props){
        super(props);
        this.state = {
            offerList:[]
        }
        this.acceptOffer=this.acceptOffer.bind(this)
    }
    componentWillMount(){
        let id = this.props.id
        axios.get(url + '/offer/getByUserId?user_id='+id)
            .then(res => {
                if(res.status === 200 && res.data.message === 'success'){
                    let payload_arr = res.data.payload_arr
                    if(payload_arr.length != 0){
                        this.setState({
                            offerList:payload_arr
                        })

                    }else{
                        alert("there is no offers")
                    }

                }
            })
    }


    getMatchingOffers = (offer) => {
        this.props.setCurOffer(offer);
        this.props.history.push("/matchingOffers");
    }

    getCounterOffersReceived = (offer) => {
        this.props.setCurOffer(offer);
        this.props.getCounterOffersReceived(offer.offerId)
        this.props.history.push("/counterOffersReceived");
    }

    getCounterOffersMade = (offer) => {
        this.props.setCurOffer(offer);
        this.props.getCounterOffersMade(this.props.id);
        this.props.history.push("/counterOffersMade");
    }
    acceptOffer = (offer)=>{
        let timezone = -8;
        let offset_GMT = new Date().getTimezoneOffset();
        let nowDate = new Date().getTime()
        let timeStamp = nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000;

        axios.put(url + '/transaction/confirmTransfer?offer_id='+Number(offer.offerId)+
            "&user_id="+Number(this.props.id)+"&timeStamp="+Number(timeStamp)).then(res=>{
            if(res.status === 200 && res.data.message === 'aborted') {
                alert("sorry,the transaction is aborted because of overtime")
            }else{
                if(res.data.message === 'compeleted'){
                    alert("this transaction is compeleted,")
                }
                if(res.data.message === 'comfirmed'){
                    alert("your transfer is confirmed! you got wait other people to complete this transaction")
                }
            }
        })
    }

    render(){
        let redirectVar = null;
        if(this.props.isLogin){

        }else{
            redirectVar=<Redirect to="/login"/>
        }


        return ( <div class="col-md-12 ">
                {redirectVar}
                <h3 className="center">My Offers List </h3>
                    <div className='profile_card' style={{'margin-left': '0px'}}>

                        {this.state.offerList.map( (offer,index) => (
                            <div class = "education_box" >
                                <p style=  {{}}>Amount:<h4 className='inline'>{offer.Amount}</h4></p>
                                <p style=  {{}}>Offer Status:<h4 className='inline'>{offer.OfferStatus}</h4></p>
                                {/*<button type="button" style={{}} onClick={()=>this.acceptOffer(offer)}*/}
                                {/*        className="glyphicon glyphicon-triangle-right edit-right">confirm*/}
                                {/*</button>*/}
                                <p style = {{}}>Source Country:<h4 class='inline'>{offer.SCountry}</h4></p>
                                <p style=  {{}}>Source Currency:<h4 className='inline'>{offer.SCurrency}</h4></p>
                                <p style=  {{}}>Destination Country:<h4 className='inline'>{offer.DCountry}</h4></p>
                                <p style=  {{}}>Destination Currency:<h4 className='inline'>{offer.DCurrency}</h4></p>
                                <p style=  {{}}>Rate:<h4 className='inline'>{offer.Rate}</h4></p>
                                <p style=  {{}}>Allow Counter Offer:<h4 className='inline'>{offer.CounterOffer}</h4></p>
                                <p style=  {{}}>Allow Split Offer:<h4 className='inline'>{offer.SplitExchange}</h4></p>
                                <p style=  {{}}>Expire Date:<h4 className='inline'>{offer['expire']}</h4></p>
                                <p style=  {{}}>owner_name:<h4 className='inline'>{offer.owner_name}</h4></p>
                                <p style=  {{}}>owner_rating:<h4 className='inline'>{offer.owner_rating}</h4></p>

                                {
                                    offer.OfferStatus==="Open" &&
                                    <div>
                                    <Button size="lg" outline color="primary" className="mo-btn" onClick={()=> this.getMatchingOffers(offer)}>Matching Offers</Button>
                                    <Button size="lg" outline color="primary" className="mo-btn" onClick={()=> this.getCounterOffersReceived(offer)}>Counter Offers Received</Button>
                                    <Button size="lg" outline color="primary" className="mo-btn" onClick={()=> this.getCounterOffersMade(offer)}>Counter Offers Made</Button>
                                    </div>
                                }
                                {
                                    offer.OfferStatus==="CounterMade" &&
                                    <div>
                                    <Button size="lg" color="primary" onClick={()=> this.getCounterOffersMade(offer)}>Counter Offers Made</Button>
                                    </div>
                                }

                            </div>
                        ))}
                    </div>
                </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        id: state.userinfo.id,
        isLogin: state.userinfo.isLogin,
    }
}

const mapDispatchToProps = (dispatch) => ({

    signupByOutId(out_id){
        dispatch(actionCreators.signupByOutId(out_id));
    },
    connectLocalAccount(out_id,emailId,pwd,nickName){
        dispatch(actionCreators.connectLocalAccount(out_id,emailId,pwd,nickName));
    },
    setCurOffer(offerDetails){
        dispatch(setCurOffer(offerDetails));
    },
    getCounterOffersReceived(offerId){
        dispatch(getCounterOffersReceived(offerId));
    },
    getCounterOffersMade(userId){
        dispatch(getCounterOffersMade(userId));
    }
})
export default connect(mapStateToProps, mapDispatchToProps)(MyOffer);