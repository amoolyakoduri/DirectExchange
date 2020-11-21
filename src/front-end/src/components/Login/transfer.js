import {connect} from "react-redux";
import React, {Component} from 'react';
import {actionCreators} from "../../store/reducer/userinfo";
import config from "../../config/basicConfig";

class Transfer extends Component{
    constructor(props){
        //Call the constrictor of Super class i.e The Component
        super(props);
    }
    componentWillMount(){
        let out_id = localStorage.getItem("out_id_transfer");
        if(out_id){
            localStorage.removeItem("out_id_transfer");
            // this.setState({'out_id':out_id})
            this.props.login(out_id,"","")
            this.props.history.push("/home");
        }
    }
    render(){
        return(<div>
        </div>)
    }

}



const mapStateToProps = (state) => {
    return  {

    }
}
const mapDispatchToProps = (dispatch) => ({
    login(out_id,email, pwd) {
        dispatch(actionCreators.login(out_id,email, pwd));
    },
})
export default connect(mapStateToProps, mapDispatchToProps)(Transfer);