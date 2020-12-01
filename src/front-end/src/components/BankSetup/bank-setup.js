import React, { Component, Fragment } from "react";
import { Alert,
    Card, CardBody,
  } from 'reactstrap';
import 'react-dropdown/style.css';
import  'react-multiple-select-dropdown-lite/dist/index.css';
import './bank-setup.css';
import Select from 'react-select';
import { connect } from 'react-redux';
import config from '../../config/basicConfig';
import {bankSetup} from '../../store/reducer/bankSetup/actionCreator';
import currencyConst from '../../config/currency'
import Navbar from "../Nav/navBar";

const Joi = require('joi');
const schema = Joi.object({
    bankName: Joi.string()
        .required(),
    ownerName: Joi.string()
        .required(),
    ownerAddress: Joi.string()
        .required(),
    acctNo: Joi.string()
        .required(),
    currency: Joi.string()
        .required(),
    country: Joi.string()
        .required(),
    sending: Joi.boolean()
        .required(),
    receiving: Joi.boolean()
        .required(),
    userId: Joi.number()
        .required()
})


class BankSetup extends Component {

    constructor(){
    super();
    this.state = {
        countries: [
            { value: 'India', label: 'India' },
            { value: 'China', label: 'China' },
            { value: 'America', label: 'USA' },
            { value: 'Germany', label: 'Germany' },
            { value: 'France', label: 'France' },
            { value: 'Italy', label: 'Italy' },
            { value: 'Greece', label: 'Greece' },
            { value: 'Poland', label: 'Poland' },
            { value: 'Finland', label: 'Finland' },
            { value: 'England', label: 'England' }
        ],
        currencies: [
            { value: 'INR', label: 'INR' },
            { value: 'USD', label: 'USD' },
            { value: 'EUR', label: 'EUR' },
            { value: 'GBP', label: 'GBP' },
            { value: 'RMB', label: 'RMB' }
        ],
        operations: [
            {label: "Sending" , value: "sending"},
            {label: "Receiving", value: "receiving"}
        ],
        error:"",
        bankName: "",
        country: "",
        acctNo: "",
        ownerName: "",
        ownerAddress: "",
        currency: "",
        sending: false,
        receiving: false
    };
  }

  componentDidMount(){
      if(!this.props.isLoggedIn){
          this.props.history.push("/login");
      }
  }

  setupAcct = (event) => {
    event.preventDefault();

    let accountDetails = {
        bankName: this.state.bankName,
        country: this.state.country,
        acctNo: this.state.acctNo,
        ownerName: this.state.ownerName,
        ownerAddress: this.state.ownerAddress,
        currency: this.state.currency,
        sending: this.state.sending,
        receiving: this.state.receiving,
        userId: this.props.userId
    }

    let validationDetails = schema.validate(accountDetails);
    console.log(`validation -> ${JSON.stringify(validationDetails)}`)
    if(!validationDetails.error){
        this.props.bankSetup(accountDetails,this.props.history)
    }
    else {
        this.setState({error: validationDetails.error.details.map(d => d.message).join('\n')})
    }
    }

  handleOnchange  =  event  => {
      var id = event.target.id;
      if(id ==="both"){
          this.setState({sending:true, receiving: true});
      }
      else if(id === "sending"){
        this.setState({sending:true, receiving: false});
      }
      else{
        this.setState({sending:false, receiving: true});
      }
  }

  onChange = (event) => {
    let key = event.target.id;//.label;
    let value = event.target.value;
    this.setState({ [key]: value });
  }

  onChangeCountry = (event) => {
    let key = "country";
    let value = event.value;
    let currency = currencyConst[value];
    this.setState({ [key]: value , currency : currency});
  }

  onChangeCurrency = (event) => {
    let key = "currency";
    let value = event.value;
    this.setState({ [key]: value });
  }


    render() {
        return (
            <Fragment>
                <Navbar/>
                <Card className="shadow top-style">
                <CardBody className="bs-bgcolor">
                <div class="jumbotron jumbotron-fluid cr-jumbo-container shadow">
                    <div class="cr-container">
                        <div>
                            <h1 className="display">Add Bank Account</h1>
                        </div>
                        <div>
                            <p>Setup your bank account now!</p>
                            <hr/>
                        </div>
                        <div className="bs-columns">
                            <div className="bs-col-style">
                            <div className="cr-row-flex">
                                <div className="cr-label">
                                    Bank Name:
                                </div>
                                <div className="cr-pad-left">
                                    <input type="text" class="form-control cr-input" id="bankName" onChange={this.onChange} placeholder="Bank Name..." aria-describedby="bankName" />
                                </div>
                            </div>
                            <div className="cr-row-flex">
                                <div className="cr-label">
                                    Country:
                                </div>
                                <div className="cr-pad-left">
                                    <Select options={this.state.countries} id="country" className = "cr-input" onChange={this.onChangeCountry}/>
                                </div>
                            </div>
                            <div className="cr-row-flex">
                                <div className="cr-label">
                                    Account Number:
                                </div>
                                <div className="cr-pad-left">
                                    <input type="text" class="form-control cr-input" onChange={this.onChange} id="acctNo" placeholder="Account Number..." aria-describedby="acctNo" />
                                </div>
                            </div>
                            <div className="cr-row-flex">
                                <div className="cr-label">
                                    Owner Name:
                                </div>
                                <div className="cr-pad-left">
                                    <input type="text" class="form-control cr-input" onChange={this.onChange} id="ownerName" placeholder="Onwer Name..." aria-describedby="ownerName" />
                                </div>
                            </div>
                            </div>
                            <div className="bs-col-style">
                            <div className="cr-row-flex">
                                <div className="cr-label">
                                    Owner Address:
                                </div>
                                <div className="cr-pad-left">
                                    <input type="text" class="form-control cr-input" onChange={this.onChange} id="ownerAddress" placeholder="Onwer Address..." aria-describedby="ownerAddress" />
                                </div>
                            </div>
                            <div className="cr-row-flex">
                                <div className="cr-label">
                                    Currency:
                                </div>
                                <div className="cr-pad-left">
                                    {/* <Select options={this.state.currencies} id="currency" className = "cr-input" required onChange={this.onChangeCurrency}/> */}
                                    {this.state.currency}
                                </div>
                            </div>
                            <div className="cr-row-flex">
                                <div className="cr-topics-style">
                                    Operations:
                                </div>
                                {/* <div class="form-check form-check-inline cr-pad-left">
                                    <input class="form-check-input" type="checkbox" id="sending" onChange={this.handleOnchange} value="sending" />
                                    <label class="form-check-label" for="Easy">Sending</label>
                                </div>
                                <div class="form-check form-check-inline cr-pad-left">
                                    <input class="form-check-input" type="checkbox" id="receiving" onChange={this.handleOnchange} value="receiving" />
                                    <label class="form-check-label" for="Medium">Receiving</label>
                                </div> */}
                                <div className="cr-pad-left">
                                    <input className="form-check-input" onChange={this.handleOnchange} type="radio" name="operations" id="sending" value="sending" />
                                    <label className="form-check-label cr-radio" for="sending">
                                        Sending
                                    </label>
                                </div>
                                <div className="cr-pad-left">
                                    <input className="form-check-input" type="radio" onChange={this.handleOnchange} name="operations" id="receiving" value="receiving" />
                                    <label className="form-check-label cr-radio" for="receiving">
                                        Receiving
                                    </label>
                                </div>
                                <div className="cr-pad-left">
                                    <input className="form-check-input" type="radio" onChange={this.handleOnchange} name="operations" id="both" value="both" />
                                    <label className="form-check-label cr-radio" for="both">
                                        Both
                                    </label>
                                </div>
                            </div>
                            <div className="cr-row-flex">
                                { this.state.error &&
                                    <div className="bs-error-style">
                                        {this.state.error}
                                    </div>
                                //     <Alert color="danger">
                                //     {this.state.error}
                                //   </Alert>
                                }
                            </div>
                            <div className="cr-row-flex">
                                <button type="button" onClick={this.setupAcct} class="btn btn-outline-primary btn-lg">Add Account</button>
                            </div>
                            </div>
                        </div>
                    </div>
                    </div>
                    {/* {this.state.error && <div className="bs-error-style">
                        {this.state.error}
                    </div>} */}
                    </CardBody>
                    </Card>
            </Fragment>
        );
    }
}

  const mapStateToProps = (state) => {
    const isLoggedIn = state.userinfo.isLogin;
    const userId = state.userinfo.id;
    return { isLoggedIn, userId };
  }

  const mapDispatchToProps = (dispatch) => ({
    bankSetup(accountDetails,history) {
        dispatch(bankSetup(accountDetails,history));
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(BankSetup);