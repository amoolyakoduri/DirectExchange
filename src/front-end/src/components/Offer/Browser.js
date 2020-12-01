import React, {Component} from 'react';
import '../../App.css';
import config from '../../config/basicConfig'
import currency from '../../config/currency'
import rate from '../../config/rate'
import axios from 'axios';
import { Redirect } from 'react-router';
import {connect} from "react-redux";
import {actionCreators} from "../../store/reducer/userinfo";

import Rating from '@material-ui/lab/Rating';

let host = config.host;
let port = config.back_end_port;
let url = host + ':' + port;


class browserOffer extends Component{
    constructor(props){
        super(props);
        this.state = {
            offerList:[],
            currencyList:[],
            Samount:'',
            Damount:'',
            Scurrency:'',
            Dcurrency:'',
            offer:'',
            currentPage:1,

            showAcceptButton:'none',

            pageNumList:[],
            showTransactions:'none',
            transactions:[]
        }
        this.submit = this.submit.bind(this)


        this.SamountChangeHandler = this.SamountChangeHandler.bind(this)
        this.DamountChangeHandler = this.DamountChangeHandler.bind(this)

        this.ScurrencyChangeHandler = this.ScurrencyChangeHandler.bind(this)
        this.DcurrencyChangeHandler = this.DcurrencyChangeHandler.bind(this)

        this.detail = this.detail.bind(this)
        this.getOfferList = this.getOfferList.bind(this)

        this.jumpToTransaction = this.jumpToTransaction.bind(this)
    }
    componentWillMount(){

        let currencyList = []
        Object.keys(currency).map((m) =>{
            currencyList.push(currency[m])
        })
        this.setState({
            currencyList: Array.from(new Set(currencyList))
        })
    }
    SamountChangeHandler(e){
        e.preventDefault();
        let Scurrency = this.state.Scurrency
        let Dcurrency = this.state.Dcurrency
        if(Scurrency == '' && Dcurrency == ''){
            alert("please select source and destination currency first!")
        }else{
            let Samount = e.target.value
            let Damount
            if(Scurrency == Dcurrency){
                Damount = Samount
            }else{
                let key = Scurrency+"_"+Dcurrency
                Damount = rate[key] * Samount
            }
            this.setState({
                Samount:Samount,
                Damount:Damount
            })
            console.log("this.state",this.state)
        }
    }
    DamountChangeHandler(e){
        e.preventDefault();
        let Scurrency = this.state.Scurrency
        let Dcurrency = this.state.Dcurrency
        if(Scurrency == '' && Dcurrency == ''){
            alert("please select source and destination currency first!")
        }else{
            let Damount = e.target.value
            let Samount
            if(Scurrency == Dcurrency){
                Samount = Damount
            }else{
                let key = Scurrency+"_"+Dcurrency
                Samount =  Damount/rate[key]
            }
            this.setState({
                Samount:Samount,
                Damount:Damount
            })
        }
    }

    DcurrencyChangeHandler(e){
        e.preventDefault();
        this.setState({
            Dcurrency:e.target.value
        })
    }
    ScurrencyChangeHandler(e){
        e.preventDefault();
        this.setState({
            Scurrency:e.target.value
        })
    }

    commonFunc(n,Scurrency,Samount,Dcurrency){
        axios.get(url + '/offer/all?pageNum='+n+"&Scurrency="+Scurrency+"&Samount="+Samount+"&Dcurrency="+Dcurrency+"&user_id="+this.props.id)
            .then(res => {
                if(res.status === 200 && res.data.message === 'success'){
                    let payload_arr = res.data.payload_arr
                    if(payload_arr.length != 0){
                        let l = res.data.payload.totalNum
                        let pageNum = parseInt(l/4) + 1;
                        if(l % 4 == 0){
                            pageNum = parseInt(l/4);
                        }
                        let temp_arr = []
                        for(let i = 0;i < pageNum;i++){
                            temp_arr.push(i)
                        }
                        this.setState({
                            offerList:payload_arr,
                            pageNumList:temp_arr
                        })

                    }else{
                        alert("there is no offers mateched")
                    }

                }
            })
    }
    submit(e){
        e.preventDefault();
        let Samount = this.state.Samount
        let Scurrency = this.state.Scurrency
        let Dcurrency = this.state.Dcurrency
        this.commonFunc(1,Scurrency,Samount,Dcurrency)

    }

    getOfferList(index){
        if(0 < index && index <= this.state.pageNumList.length){
            this.setState({
                currentPage:index
            })
            axios.get(url + '/offer/all?pageNum='+index+"&Scurrency="+this.state.Scurrency+"&Samount="+this.state.Samount+"&Dcurrency="+this.state.Dcurrency+"&user_id="+this.props.id)
            .then(res => {
                if(res.status === 200 && res.data.message === 'success'){
                    let payload_arr = res.data.payload_arr
                    if(payload_arr.length == 0){
                        this.setState({
                            offerList:[],
                            offer:''
                        })
                    }else{
                        this.setState({
                            offerList:payload_arr
                        })
                    }
                }
            })
        }

    }

    detail(offer){
        console.log("offeroffer",offer)
        this.setState({
            offer:offer,
            showAcceptButton:'block'
        })
    }

    jumpToTransaction(){
        let timezone = -8;
        let offset_GMT = new Date().getTimezoneOffset();
        let nowDate = new Date().getTime()
        let create_time = nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000;
        console.log("create_time",create_time,Number(create_time))

        let user_email = this.props.email
        let subject = 'Offer Confirm'
        let mess = 'you have an offer confirmation notification,check your offer information'
        let poster_email = this.state.offer.owner_email
        console.log("user_email poster_email ",user_email,poster_email)
        axios.post(url + '/message/sendmessage?toEmail='+user_email+'&fromEmail='+poster_email+'&subject='+subject+'&message='+mess)
        axios.post(url + '/message/sendmessage?toEmail='+poster_email+'&fromEmail='+user_email+'&subject='+subject+'&message='+mess)



        let Damount = this.state.offer.Amount * this.state.offer.Rate
        axios.post(url + '/transaction/creatInProcess?offer_id='+Number(this.state.offer.offerId)+
            "&SCurrency="+this.state.offer.SCurrency+"&Samount="+this.state.offer.Amount+
            "&DCurrency="+this.state.offer.DCurrency+"&Damount="+Number(Damount)+
            "&poster_id="+Number(this.state.offer.owner_id)+"&receiver_id="+Number(this.props.id)+"&create_time="+Number(create_time))
            .then(res => {
                if(res.status === 200 && res.data.message === 'success'){

                    this.props.history.push('/home/transaction',{
                        offer:this.state.offer
                    })

                }else{
                    alert("database error!!")
                }
            })


    }
    render(){
        let Samount = this.state.Samount
        let Damount = this.state.Damount

        let redirectVar = null;
        if(this.props.isLogin){

        }else{
            redirectVar=<Redirect to="/login"/>
        }
        return ( <div class="col-md-12 ">
                {redirectVar}
                <h3 className="center">Offers List </h3>
                <div className="cprofile_card img" style={{'width': '100%'}}>

                <h3 className="center">left is source  ,  right is destination</h3>

                <form onSubmit={this.submit} className='img' style={{'width': '43%'}} >

                    <select style={{'margin-left': '30px'}} ref="" name="Scurrency" onChange={this.ScurrencyChangeHandler}>
                        {
                            this.state.currencyList.map((m) =>(
                                <option  value={m} >{m}</option>
                            ))
                        }
                    </select>
                    <input type="text" name="Samount" value={Samount} placeholder="amount of source"
                           style={{'width': '28%'}} onChange={this.SamountChangeHandler}></input>

                    <select style={{'margin-left': '30px'}} ref="" name="Dcurrency" onChange={this.DcurrencyChangeHandler}>
                        {
                            this.state.currencyList.map((m) =>(
                                <option  value={m} >{m}</option>
                            ))
                        }
                    </select>
                    <input type="text"  style={{}} name="Damount" value={Damount} placeholder="amount of destination"
                           onChange={this.DamountChangeHandler}></input>

                    <button type="submit" className="glyphicon glyphicon-search "
                            style={{'margin-left': '10px'}}></button>
                </form>
            </div>
            <div className="col-md-6">
                <div className='profile_card' style={{'margin-left': '0px'}}>
                    <h2>Posted Offers</h2>
                {this.state.offerList.map( (offer,index) => (
                    <div class = "education_box" >
                        <button type="button" style={{}} onClick={()=>this.detail(offer)}
                                className="glyphicon glyphicon-triangle-right edit-right">detail
                        </button>
                        <p style = {{}}>Source Country:<h4 class='inline'>{offer.SCountry}</h4></p>
                        <p style=  {{}}>Source Currency:<h4 className='inline'>{offer.SCurrency}</h4></p>
                        <p style=  {{}}>Destination Country:<h4 className='inline'>{offer.DCountry}</h4></p>
                        <p style=  {{}}>Destination Currency:<h4 className='inline'>{offer.DCurrency}</h4></p>
                        <p style=  {{}}>Amount:<h4 className='inline'>{offer.Amount}</h4></p>
                        <p style=  {{}}>Rate:<h4 className='inline'>{offer.Rate}</h4></p>

                    </div>
                ))}
                    <div style={{'margin-left': '40px'}}>
                        <nav aria-label="Page navigation pagination-sm">
                            <ul className="pagination">
                                <li>
                                    <a onClick={() => this.getOfferList(this.state.currentPage - 1)}
                                       aria-label="Previous">
                                        <span aria-hidden="true">&laquo;</span>
                                    </a>
                                </li>
                                {this.state.pageNumList.map((index) => (
                                    <li><a onClick={() => this.getOfferList(index + 1)}>{index + 1}</a></li>
                                ))}
                                <li>
                                    <a onClick={() => this.getOfferList(this.state.currentPage + 1)} aria-label="Next">
                                        <span aria-hidden="true">&raquo;</span>
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
            <div className="col-md-6">
                <div className='profile_card' style={{'margin-left': '0px', 'height': 'auto'}}>
                    <h2>detail info</h2>
                    <div className="education_box">

                        <p style={{}}>Allow Counter Offer:<h4 className='inline'>{this.state.offer.CounterOffer}</h4></p>
                        <p style={{}}>Allow Split Offer:<h4 className='inline'>{this.state.offer.SplitExchange}</h4></p>
                        <p style={{}}>owner_id:<h4 className='inline'>{this.state.offer.owner_id}</h4></p>
                        <p style={{}}>owner_name:<h4 className='inline'>{this.state.offer.owner_name}</h4></p>
                        <p style={{}}>owner_rating:<h4 className='inline'><Rating name="disabled" value={parseInt(this.state.offer.owner_rating)} disabled /></h4></p>
                        {/*<button style = {{'display':this.state.showAcceptButton}} onClick={this.jumpToTransaction}>Accept</button>*/}

                    </div>

                    <div className="education_box" style = {{'display':this.state.showTransactions}}>
                        <h4>transaction history:</h4>
                        {this.state.transactions.map( (transaction,index) => (
                            <div class = "education_box" >
                                <p style = {{}}>:<h4 class='inline'>{transaction}</h4></p>

                            </div>
                        ))}
                    </div>

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
        email: state.userinfo.username
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
export default connect(mapStateToProps, mapDispatchToProps)(browserOffer);