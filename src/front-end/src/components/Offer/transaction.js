import React, {Component} from 'react';
import '../../App.css';
import config from '../../config/basicConfig'
import currency from '../../config/currency'
import rate from '../../config/rate'
import axios from 'axios';
import { Redirect } from 'react-router';
import {connect} from "react-redux";
import {actionCreators} from "../../store/reducer/userinfo";

let host = config.host;
let port = config.back_end_port;
let url = host + ':' + port;


class transaction extends Component{
    constructor(props){
        super(props);
        this.state = {
            offer:''
        }
        this.confirmTransfer= this.confirmTransfer.bind(this)
    }
    componentWillMount(){
        console.log('this.props.offerthis.props.offer',this.props.history.location.state.offer)
        let offer = this.props.history.location.state.offer
        if(offer){
            this.setState({
                offer:offer
            })
        }
    }
    confirmTransfer(){
        let timezone = -8;
        let offset_GMT = new Date().getTimezoneOffset();
        let nowDate = new Date().getTime()
        let timeStamp = nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000;

        axios.put(url + '/transaction/confirmTransfer?offer_id='+Number(this.state.offer.offerId)+
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
        return (

            <div>{redirectVar}
                <div class="img">
                    <div class = "cprofile_card img" style = {{'width':'100%'}}>
                        <h3 class='img center'>offer detail</h3>
                        <div className="education_box">
                        <p style={{}}>Source Country:<h4 className='inline'>{this.state.offer.SCountry}</h4></p>
                        <p style={{}}>Source Currency:<h4 className='inline'>{this.state.offer.SCurrency}</h4></p>
                        <p style={{}}>Destination Country:<h4 className='inline'>{this.state.offer.DCountry}</h4></p>
                        <p style={{}}>Destination Currency:<h4 className='inline'>{this.state.offer.DCurrency}</h4></p>
                        <p style={{}}>Amount:<h4 className='inline'>{this.state.offer.Amount}</h4></p>
                        <p style={{}}>Rate:<h4 className='inline'>{this.state.offer.Rate}</h4></p>
                        </div>
                            <button onClick={this.confirmTransfer}>confirm to transfer</button>
                    </div>
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
    }
})
export default connect(mapStateToProps, mapDispatchToProps) (transaction);