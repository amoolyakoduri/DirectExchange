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


class postOffer extends Component{
    constructor(props){
        super(props);
        this.state = {
            Scountry:'',
            Scurrency:'',
            Dcountry:'',
            Dcurrency:'',
            rate:'',
            flag:''
        }
        this.submit = this.submit.bind(this)
        this.basicCancel = this.basicCancel.bind(this)

        this.ScountryChangeHandler = this.ScountryChangeHandler.bind(this)
        this.DcountryChangeHandler = this.DcountryChangeHandler.bind(this)

    }
    componentWillMount(){
        let accounts = this.props.accounts
        let flag = false;
        let accounts_country = {}
        for(let i = 0;i < accounts.length;i++){
            if(accounts_country[accounts[i].country]){

            }else{
                accounts_country[accounts[i].country] = 1
            }
        }
        if(Object.keys(accounts_country).length >1 ){
            flag = true;
        }
        this.setState({
            flag:flag
        })

    }
    ScountryChangeHandler(e){
        e.preventDefault();
        let Scountry = e.target.value
        this.setState({
            Scountry:Scountry,
            Scurrency:currency[Scountry]
        })
        if(currency[this.state.Dcountry] == currency[Scountry]){
            alert("source currency and destination currency are same!!")
            this.setState({
                rate:''
            })
        }else{
        if(this.state.Dcountry && Scountry){
            let key = currency[Scountry]+'_'+currency[this.state.Dcountry]
            this.setState({
                rate:rate[key]
            })
        }
        }
    }
    DcountryChangeHandler(e){
        e.preventDefault();
        let Dcountry = e.target.value
        this.setState({
            Dcountry:Dcountry,
            Dcurrency:currency[Dcountry]
        })
        if(this.state.Scountry && Dcountry){
            if(currency[this.state.Scountry] == currency[Dcountry]){
                alert("source currency and destination currency are same!!")
                this.setState({
                    rate:''
                })
            }else{
            let key = currency[this.state.Scountry]+'_'+currency[Dcountry]
            console.log("keykeykey",key)
            this.setState({
                rate:rate[key]
            })
            }
        }
    }
    submit(e){
        e.preventDefault();
        if(this.state.flag){

        let timezone = -8;
        let offset_GMT = new Date().getTimezoneOffset();
        let nowDate = new Date(e.target.expireDate.value + " 00:00:00").getTime()
        let targetDate = nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000;
        console.log("expireDate：" + targetDate + new Date(targetDate));


        let paramdata = {
            user_id:this.props.id,
            Scountry: e.target.Scountry.value,
            Scurrency: this.state.Scurrency,
            Dcountry: e.target.Dcountry.value,
            expireDate: targetDate,
            Dcurrency: this.state.Dcurrency,
            amount: parseInt(e.target.amount.value),
            rate: this.state.rate,
            splitOffer: e.target.splitOffer.value,
            counterOffer:e.target.counterOffer.value,
        }
        console.log("paramdata",paramdata)
        axios.post(url + '/offer/?Dcountry='+paramdata.Dcountry+'&Dcurrency='+paramdata.Dcurrency+'&Scountry='+paramdata.Scountry+'&Scurrency='+paramdata.Scurrency+
            '&amount='+paramdata.amount+'&counterOffer='+paramdata.counterOffer+
            '&splitOffer='+paramdata.splitOffer+'&rate='+paramdata.rate+'&expireDate='+paramdata.expireDate+'&user_id='+paramdata.user_id)
            .then(response => {
                if(response.status === 200){
                    console.log('response.data',response.data)
                    alert("success!!")
                    this.props.history.push("/home/myOffer");
                }else{

                }})
        }else{
            alert("you should have at least 2 accounts from different country")
        }
    }
    basicCancel(){
        this.setState({
            Scountry:'',
            Scurrency:'',
            Dcountry:'',
            Dcurrency:'',
        })
    }

    render(){
        let redirectVar = null;
        if(this.props.isLogin){

        }else{
            redirectVar=<Redirect to="/login"/>
        }
        return (
            <div>
                {redirectVar}
                <div class="img">
                    <div class = "cprofile_card img" style = {{'width':'100%'}}>
                        <h3 class='img center'>Fill Your New Offer</h3>
                        <br></br>
                        <form onSubmit={this.submit}  class='img'>
                            <p class='img' style = {{'width':'70%'}}>Source country:
                                <select ref = "" name="Scountry" onChange={this.ScountryChangeHandler} >
                                    {
                                        Object.keys(currency).map((m) =>(
                                            <option  value={m} >{m}</option>
                                        ))
                                    }
                                </select>
                            </p>
                            <p class='img' style = {{'width':'70%','margin-top':'10px'}}>Source currency:
                                {/*<input type="text" name="Scurrency"></input>*/}
                                {this.state.Scurrency}
                            </p>
                            <p class='img' style = {{'width':'70%','margin-top':'10px'}}>Destination country:
                                <select ref = "" name="Dcountry" onChange={this.DcountryChangeHandler}>
                                    {
                                        Object.keys(currency).map((m) =>(
                                            <option  value={m} >{m}</option>
                                        ))
                                    }
                                </select>
                            </p>
                            <p class='img' style = {{'width':'70%','margin-top':'10px'}}>Destination currency:
                                {/*<input type="text" name="Dcurrency"></input>*/}
                                {this.state.Dcurrency}
                            </p>
                            <p className='img' style={{'width': '70%', 'margin-top': '10px'}}>Amount:<input
                                type="number" name="amount" required></input>
                            </p>

                            <p class='img' style = {{'width':'70%','margin-top':'10px'}}>Exchange rate:<input type="number" name="rate" value={this.state.rate} required></input></p>
                            <p className='img' style={{'width': '70%', 'margin-top': '10px'}}>Expiration:<input type="date" name="expireDate" required></input></p>

                            <p class='img' style = {{'width':'120%','margin-top':'10px'}}>Whether to allow counter offers:
                                <label class="radio-inline" style = {{'margin-left':'5px'}}>
                                    <input type="radio" name="counterOffer"  value= {true} checked="checked"/> true
                                </label>
                                <label class="radio-inline">
                                    <input type="radio" name="counterOffer"  value= {false}/> false
                                </label>
                            </p>
                            <p className='img' style={{'width': '120%', 'margin-top': '10px'}}>Whether to allow split exchanges:
                                <label className="radio-inline" style={{'margin-left': '5px'}}>
                                    <input type="radio" name="splitOffer" value="true" checked="checked"/> true
                                </label>
                                <label className="radio-inline">
                                    <input type="radio" name="splitOffer" value="false"/> false
                                </label>
                            </p>

                            <div class='img' style = {{'margin-top':'10px','margin-bottom':'10px'}}>
                                <button type="submit" class='btn btn-success'>save</button>
                                <button type="reset" style = {{'margin-left':'50px'}} onClick = {this.basicCancel} class='btn btn-danger'>reset</button>
                            </div>

                        </form>
                    </div>
                </div>

            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        id: state.userinfo.id,
        accounts: state.userinfo.accounts,
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
export default connect(mapStateToProps, mapDispatchToProps) (postOffer);