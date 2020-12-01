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


class PrevailingRates extends Component{
    constructor(props){
        super(props);
        this.state = {
        }

    }
    componentWillMount(){
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
                        <h3 class='img center'>Prevailing Rates</h3>
                        <table className="table">
                            <thead>
                            <tr>
                                <th>Source_Destination</th>
                                <th>Rate</th>
                            </tr>
                            </thead>
                            <tbody>

                            {Object.keys(rate).map((key, index) => (
                                    <tr>
                                        <td>{key}</td>
                                        <td>{rate[key]}</td>
                                    </tr>
                                )
                            )}
                            </tbody>
                        </table>

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
export default connect(mapStateToProps, mapDispatchToProps) (PrevailingRates);