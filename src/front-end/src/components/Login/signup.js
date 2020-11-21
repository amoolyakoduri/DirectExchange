import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import config from '../../config/basicConfig'

import { actionCreators } from '../../store/reducer/userinfo'
import { connect } from "react-redux";
import 'firebaseui/dist/firebaseui.css'
import { auth,firebaseAuth } from "../../config/firebase";
let firebaseui = require('firebaseui');
let backend_url = config.host+":"+config.back_end_port

//Define a Signup Component
class Signup extends Component{
    //call the constructor method
    constructor(props){
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            emailId : "",
            password : "",
            name : "",
            message : null,
            // lead : ''
        }
        //Bind the handlers to this class
        this.nameChangeHandler = this.nameChangeHandler.bind(this);
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
        this.emailIdChangeHandler = this.emailIdChangeHandler.bind(this);

        this.submitInfo = this.submitInfo.bind(this);

    }
    //Call the Will Mount to set the auth Flag to false
    componentWillMount(){

        // TODO: Replace the following with your app's Firebase project configuration
        // For Firebase JavaScript SDK v7.20.0 and later, `measurementId` is an optional field
        let existed = true;
        let ui
        if(firebaseui.auth.AuthUI.getInstance()){
            ui = firebaseui.auth.AuthUI.getInstance()
        }else{
            existed = false;
            ui = new firebaseui.auth.AuthUI(auth);
        }

        let uiConfig = {
            callbacks: {
                signInSuccessWithAuthResult: function(authResult, redirectUrl) {
                    // User successfully signed in.
                    // Return type determines whether we continue the redirect automatically
                    // or whether we leave that to developer to handle.
                    console.log("authResultauthResultauthResult",authResult.additionalUserInfo.profile)
                    let profile = authResult.additionalUserInfo.profile;
                    // localStorage.setItem("outId",profile.id);
                    let user = auth.currentUser;
                    let email = localStorage.getItem("emailId")
                    let password = localStorage.getItem("password")
                    let nickName = localStorage.getItem('nickName')
                    if(email && password && nickName){
                        console.log("email password nickName",email,password,nickName)
                        // firebase.auth().createUserWithEmailAndPassword(email,password)
                        auth.createUserWithEmailAndPassword(email,password)
                            .then((r) => {
                                // console.log("rrrrrrr",r)
                                // let currentUser = firebase.auth().currentUser;
                                let currentUser = auth.currentUser;
                                currentUser.sendEmailVerification().then(function() {

                                    let credential = auth.EmailAuthProvider.credential(email, password);
                                    // user.linkWithCredential(1)
                                    user.linkWithCredential(credential).then(r2 => {})
                                })
                            })

                    }
                    user.sendEmailVerification().then(function() {
                        alert("success ! check the verification link in your email")
                        // Email sent.
                    }).catch(function(error) {
                        // An error happened.
                    });
                    // write in the database out_id
                    localStorage.setItem("out_id",profile.id)
                    return true;
                }

            },
            // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
            signInFlow: 'popup',
            signInSuccessUrl: '/emailVerification',
            signInOptions: [
                firebaseAuth.GoogleAuthProvider.PROVIDER_ID,
                firebaseAuth.FacebookAuthProvider.PROVIDER_ID,

            ],
            // Terms of service url.
            // tosUrl: '<your-tos-url>',
        };

        if(!existed){
            ui.start('#firebaseui-auth-container', uiConfig);
        }
    }


    //username change handler to update state variable with the text entered by the user
    nameChangeHandler = (e) => {
        if(/^(?=.*[a-zA-Z])(?=.*[0-9])[A-Za-z0-9]+$/.test(e.target.value)){
            this.setState({
                name : e.target.value
            })
            localStorage.setItem("nickName",e.target.value)
        }else{
            // alert("nick name should be alphanumeric")
            this.setState({
                name : ""
            })
            localStorage.setItem("nickName","")
        }

    }
    //password change handler to update state variable with the text entered by the user
    passwordChangeHandler = (e) => {
        this.setState({
            password : e.target.value
        })
        localStorage.setItem("password",e.target.value)

    }
    emailIdChangeHandler = (e) => {
        this.setState({
            emailId : e.target.value
        })
        localStorage.setItem("emailId",e.target.value)
    }

    //submit Login handler to send a request to the node backend
    submitInfo = (e) => {
        //prevent page from refresh
        e.preventDefault();
        let that = this
        if(this.state.name && this.state.password  && this.state.emailId){

            axios({
                method:"POST",
                url:backend_url+"/user/signUpInLocal?emailId="+this.state.emailId +"&pwd="+this.state.password+"&nickName="+this.state.name,

            }).then(function (res) {
                if(res.status === 200 && res.data.message === 'success'){
                    // firebase.auth().createUserWithEmailAndPassword(this.state.emailId, this.state.password)
                    auth.createUserWithEmailAndPassword(that.state.emailId, that.state.password)

                        .then((user) => {
                            // let currentUser = firebase.auth().currentUser;
                            let currentUser = auth.currentUser;
                            currentUser.sendEmailVerification().then(function() {
                                alert("success ! check the verification link in your email")
                                let host = config.host;
                                let port = config.front_end_port;
                                let url = host + ':' + port;
                                window.location.href=url+"/login"
                            }).catch(function(error) {
                            });
                        }).catch((error) => {
                        let errorCode = error.code;
                        let errorMessage = error.message;
                        alert(errorMessage);
                        console.log("error createUserWithEmailAndPassword",error)
                    });
                }else{
                    alert("nick name or email id duplicated in database");
                }
            })


        }else{
            alert("make sure no empty and nickName is alphanumeric")
        }
    }

    render(){
        //redirect based on successful login
        let host = config.host;
        let port = config.front_end_port;
        let url = host + ':' + port;
        return(
            <div>
                <div class="container">

                    <div class="maincenter">
                        <div class="loginform">
                            <div align ="center">
                                <p>Please register your information</p>
                            </div>
                            <div class="form-group">
                                <input onChange = {this.nameChangeHandler}  type="text" class="form-control" name="name" placeholder="Nick Name"/>
                            </div>
                            <div class="form-group">
                                <input onChange = {this.emailIdChangeHandler}  type="text" class="form-control" name="email" placeholder="Email Id"/>
                            </div>
                            <div class="form-group">
                                <input onChange = {this.passwordChangeHandler}  type="password" class="form-control" name="password" placeholder="Password"/>
                            </div>

                            <div id='firebaseui-auth-container' ></div>
                            <hr/>
                            <button onClick = {this.submitInfo} class="button">Signup</button>
                            <div><h4>{this.state.message}</h4></div>
                        </div>
                        <div class='signin'>
                            <p >already have an account? <a href={url + '/login'} class="navbar-link">signin</a></p>
                        </div>
                    </div>
                </div>
            </div>
        )
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

export default connect(mapStateToProps, mapDispatchToProps)(Signup);