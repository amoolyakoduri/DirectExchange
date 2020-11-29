import axios from 'axios';
import config from '../../../config/basicConfig'
let backend_url = config.host+":"+config.back_end_port

export const login = (out_id,email,pwd) =>{
    return ( dispatch ) => {

        axios({
            method:"GET",
            url:backend_url+"/user/login?out_id="+out_id+"&email="+email+"&pwd="+pwd,
        }).then(function (res) {
            console.log(res);
            if(res.status === 200 && res.data.message === 'success'){
                let data = res.data.payload;
                data['type'] = 'login';
                data['isLogin'] = true;
                console.log('data',data)
                dispatch(data)
            }else{
                alert("login failed");
            }
        }).catch(function (error) {
            console.log(error);
        });
}
}

export const signupByLocal = (email,pwd,nickName) =>{
    return ( dispatch ) => {
        let obj = {
            email: email,
            password: pwd,
            nickName:nickName
        }

    }
}

export const signupByOutId = (out_id) =>{
    return ( dispatch ) => {
        axios({
            method:"POST",
            url:backend_url+"/user/signupByOutId?out_id="+out_id,
            // data:JSON.stringify(obj),
        }).then(function (res) {
            if(res.status === 200 && res.data.message === 'success'){

            }else{
                alert("signup by out_id in database failed");
            }
        })}

 }

export const connectLocalAccount = (out_id,emailId,pwd,nickName) =>{
    return ( dispatch ) => {
        axios({
            method:"PUT",
            url:backend_url+"/user/connectLocalAccount?out_id="+out_id+"&emailId="+emailId+"&pwd="+pwd+"&nickName="+nickName,
        }).then(function (res) {
            if(res.status === 200 && res.data.message === 'success'){

            }else {
                alert("connectLocalAccount in database failed");
            }

        })}
}

export const logOut = ()=>{
    return ( dispatch ) => {
        dispatch({'type':'logout'})
    }
}
