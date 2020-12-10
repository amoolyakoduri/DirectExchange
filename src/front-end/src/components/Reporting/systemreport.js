import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import config from '../../config/basicConfig'
import axios from 'axios';
import { Redirect } from 'react-router';
import {actionCreators} from "../../store/reducer/userinfo";
import {connect} from "react-redux";

let host = config.host;
let port = config.back_end_port;
let url = host + ':' + port;

class SystemReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      month: "", 
      recs :[]
    };
  }

  monthChangeHandler = (event) => {
    this.setState({ month: event.target.value });
  };

  submitHandler = (event) => {
    //alert("You have selected the month: " + this.state.month);
    event.preventDefault();
    axios.get(url + `/reporting/getSysFinancialReport?month=${this.state.month}`)
    .then(response => {
        if(response.status === 200 && response.data.message === 'success'){
            let payload_arr = response.data.payload_arr
            if(payload_arr.length != 0){
                this.setState({
                    recs : payload_arr
                })
            }else{
                alert("No records")
            }
        }
    })
  };

  componentWillMount(){
   
}

  render() {
    return (
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

          <div class="sysreportcard">
            <h3> System Financial Report</h3>
            <Card style={{ backgroundColor: "lightgrey" }}>
              <Card.Body>
                <Card.Text>
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <td>Total Remitted Amount</td>
                          <td>No of Completed Txns</td>
                          <td>No of Incomplete Txns</td>
                          <td>Total Service Fee</td>
                        </tr>
                      </thead>
                      <tbody>
                        {
                           this.state.recs.map(
                             recs =>
                             <tr>
                               <td>{recs.Completed_Amount}</td>
                               <td>{recs.No_Complete_txns}</td>
                               <td>{recs.No_Incomplete_txns}</td>
                               <td>{recs.Total_Service_fee}</td>
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
      </form>
      
    );
    }
}
  
const mapStateToProps = (state) => {
  return {
      // isLogin: state.userinfo.isLogin,
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
export default connect(mapStateToProps, mapDispatchToProps) (SystemReport);
