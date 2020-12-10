import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import config from '../../config/basicConfig'
import axios from 'axios';
import { Redirect } from 'react-router';
import {connect} from "react-redux";
import {actionCreators} from "../../store/reducer/userinfo";

//import SystemReport from "./systemreport"

let host = config.host;
let port = config.back_end_port;
let url = host + ':' + port;

class Reporting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      month: "", 
      txnrecs :[]
    };
  }
  showSystemReport=(event)=>
  {
    console.log("rediredting")
    this.setState({
     redirect:"/systemReport"
    })
  }

  monthChangeHandler = (event) => {
    this.setState({ month: event.target.value });
    console.log(this.state)
  };

  submitHandler = (event) => {
    event.preventDefault();
    console.log(this.state)
    console.log(this.props)
    //let uid = localStorage.getItem("id");
    let uid = this.props.id


    axios.get(url + '/reporting/getTxnHistory?user_id='+uid +'&month='+this.state.month)
        .then(response => {
            if(response.status === 200 && response.data.message === 'success'){
                let payload_arr = response.data.payload_arr
                if(payload_arr.length != 0){
                    this.setState({
                        txnrecs : payload_arr
                    })
                    console.log(this.state.txnrecs)
                }else{
                    alert("No records")
                }
            }
        })
  };

  componentWillMount(){
  }   

  render() {
    let redirectVar = null;
    console.log(this.state);
    if(this.state.redirect){
      redirectVar= <Redirect push to={this.state.redirect} />
    }
    
    return (
      <div>{redirectVar}
      
        <p >Reporting</p>
          <form onSubmit={this.submitHandler}>
          <div className="dropdown">
          <label>Select month:</label>
            <select value={this.state.month} onChange={this.monthChangeHandler}>
            <option value="1">January</option>
            <option value="2">February</option>
            <option value="3">March</option>
            <option value="4">April</option>
            <option value="5">May</option>
            <option value="6">June</option>
            <option value="7">July</option>
            <option value="8">August</option>
            <option value="9">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>
          <input type="Submit" value="Go" />
          </div>
          </form> 

          <div>
          <label>System Financial Report</label>
          <button
          type="button"
          onClick={(e) => this.showSystemReport()}
          // e.preventDefault();
          // window.location.href= url+'/reporting/getSysFinancialReport';
          > View </button>
          </div>

          <div class="txncard">
            <h3>User Transaction Report</h3>
            <Card style={{ backgroundColor: "lightgrey" }}>
              <Card.Body>
                <Card.Text>
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <td>Remitted Amount</td>
                          <td>Source Currency</td>
                          <td>Destination Amount</td>
                          <td>Destination Currency</td>
                          <td>Exchange Rate</td>
                          <td>Service Fee</td>
                          <td>Transaction Date</td>
                        </tr>
                      </thead>
                      <tbody>
                        {
                           this.state.txnrecs.map(
                             rec =>
                             <tr>
                               <td>{rec.Amount}</td>
                               <td>{rec.Source_currency}</td>
                               <td>{rec.Destination_amount}</td>
                               <td>{rec.Destination_currency}</td>
                               <td>{rec.Exchange_rate}</td>
                               <td>{rec.Service_free}</td>
                               <td>{rec.Transaction_date}</td>
                             </tr>
                           )
                        }
                      </tbody>
                    </table>
                </Card.Text>
              </Card.Body>
            </Card>
          </div>  
        </div>     
        
    );
    }
}
  
const mapStateToProps = (state) => {
  return {
      id: state.userinfo.id,
      isLogin: state.userinfo.isLogin,
  }
}
const mapDispatchToProps = (dispatch) => ({
  signupByLocal(email, pwd,nickName) {
      dispatch(actionCreators.signupByLocal(email, pwd,nickName));
  },
  signupByOutId(out_id){
      dispatch(actionCreators.signupByOutId(out_id));
  }
})
export default connect(mapStateToProps, mapDispatchToProps)(Reporting);
