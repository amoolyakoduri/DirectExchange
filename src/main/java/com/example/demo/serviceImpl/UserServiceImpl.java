package com.example.demo.serviceImpl;

import com.example.demo.entities.User;
import com.example.demo.enums.Rating;
import com.example.demo.repositories.UserRepository;
import com.example.demo.services.UserService;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.Optional;

@Service
public class UserServiceImpl  {

    @Resource
    UserRepository userRepository;

//    @Override
    @Transactional
    public Optional<User> getUserDetails(Long userId) {
        return userRepository.findById(userId);
    }
    @Transactional
    public Optional<User> getUserByPwd(String email,String pwd) {
        return userRepository.findByPwd(email,pwd);
    }

    @Transactional
    public int updateTotalTransactionCount(Integer count,Long user_id) {		
    	return userRepository.updateTotalTransactionCount(count, user_id);
    }
    
    @Transactional
    public int updateFaultTransactionCount(Integer count,Long user_id) {		
    	return userRepository.updateFaultTransactionCount(count, user_id);
    }
    
    @Transactional
    public int updateRating(Double rating,Long user_id) {
    	return userRepository.updateRating(rating, user_id);
    }
    
    public Optional<User> creatUser(String email,String pwd,String nickName){
        Optional<User> u = userRepository.findByNickNameOrEmail(email,nickName);
        if(u.isPresent()){
            return null;
        }else{
            User user = new User();
            user.setNickname(nickName);
            user.setPassword(pwd);
            user.setUsername(email);
            user.setRating(0.0);
            user.setOut_id(null);
            User temp = userRepository.saveAndFlush(user);
            Optional<User> u2 = Optional.of(temp);
            return u2;
        }


    }


    public User creatUserByOutId(String out_id){
        User user = new User();
        user.setOut_id(out_id);
        user.setRating(0.0);
        User u = userRepository.saveAndFlush(user);
        return u;
    }
    public int connectLocalAccount(String out_id,String emailId,String pwd,String nickName){
      int res =  userRepository.connectLocalAccount(nickName, emailId, pwd, out_id);
        return res;
    }
    public Optional<User> getUserByOutId(String out_id){
        Optional<User> user = userRepository.findByOutId(out_id);
        return user;
    }
    public Optional<User> getUserByEmail(String email){
        Optional<User> user = userRepository.findByEmail(email);
        return user;
    }


}
