package com.example.demo.repositories;

import com.example.demo.entities.User;
import com.example.demo.enums.Rating;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@EntityScan(basePackages = {"com.example.demo.entity"})
public interface UserRepository extends JpaRepository<User,Long> {

    @Override
    Optional<User> findById(Long userId);

    @Transactional
    @Modifying
    @Query(value = "update user set nickname=?1,uname=?2,password=?3 where out_id=?4 ",nativeQuery = true)
    int connectLocalAccount(String nickName,String emailId,String pwd,String out_id);

    @Transactional
    @Query(value = "select * from user where out_id=?1 ",nativeQuery = true)
    Optional<User> findByOutId(String out_id);

    @Transactional
    @Query(value = "select * from user where uname=?1 and password=?2 ",nativeQuery = true)
    Optional<User> findByPwd(String email,String pwd);



    @Transactional
    @Query(value = "select * from user where uname=?1 ",nativeQuery = true)
    Optional<User> findByEmail(String email);

    @Transactional
    @Query(value = "select * from user where uname=?1 or nickname=?2",nativeQuery = true)
    Optional<User> findByNickNameOrEmail(String email,String nickName);
    
    @Transactional
    @Modifying
    @Query(value = "update user set totalTranCnt=?1 where user_id=?2 ",nativeQuery = true)
    int updateTotalTransactionCount(Integer count,Long user_id);
    
    @Transactional
    @Modifying
    @Query(value = "update user set faultTranCnt=?1 where user_id=?2 ",nativeQuery = true)
    int updateFaultTransactionCount(Integer count,Long user_id);
    
    @Transactional
    @Modifying
    @Query(value = "update user set rating=?1 where user_id=?2 ",nativeQuery = true)
    int updateRating(Double rating,Long user_id);

}
