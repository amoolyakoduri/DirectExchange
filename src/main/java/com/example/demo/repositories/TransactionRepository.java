package com.example.demo.repositories;

import com.example.demo.entities.Transaction;
import com.example.demo.entities.User;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@EntityScan(basePackages = {"com.example.demo.entity"})
public interface TransactionRepository extends JpaRepository<Transaction,Long> {
//    @Transactional
//    @Modifying
//    @Query(value = "update transactions_details set user_id=?1 and offer_id =?2 where id=?3 ",nativeQuery = true)
//    void addUserForeignKey(long userId,long offerId,long t_id);

    @Transactional
    @Modifying
    @Query(value = "update transactions_details set user_id=?1 where id=?2 ",nativeQuery = true)
    void addUserForeignKey(long userId,long t_id);

    @Transactional
    @Modifying
    @Query(value = "update transactions_details set offer_id =?1 where id=?2 ",nativeQuery = true)
    void addOfferForeignKey(long offerId,long t_id);

    @Transactional
    @Modifying
    @Query(value = "update transactions_details set status=?3  where user_id=?1 and offer_id =?2 ",nativeQuery = true)
    void confirmTransfer(long userId,long offerId,String status);

    @Transactional
    @Query(value = "select * from transactions_details where user_id=?1 and offer_id=?2 ",nativeQuery = true)
    List<Transaction> getByUserAndOffer(long userId,long offerId);

    @Transactional
    @Query(value = "select * from transactions_details where user_id=?1",nativeQuery = true)
    List<Transaction> getByUser(long userId);

    @Transactional
    @Modifying
    @Query(value = "update transactions_details set status=?2  where offer_id =?1",nativeQuery = true)
    void setAbortedOrCompelted(long offerId,String status);

    @Transactional
    @Query(value = "select * from transactions_details where offer_id=?1 ",nativeQuery = true)
    List<Transaction> getByOffer(long offerId);
    
    @Transactional
    @Query(value = "select T.*\n"
    		+ "from (select id\n"
    		+ "	  from offer_details\n"
    		+ "      where user_id = ?1) as O, transactions_details T\n"
    		+ "where T.offer_id = O.id\n"
    		+ "and T.user_id !=?1\n"
    		+ "and (upper(T.status) = \"COMPLETED\" or  upper(T.status) =\"ABORTED\")",nativeQuery = true) 	 
    List<Transaction> getTxnHistoryWithUserName(Long userID);

    @Transactional
    @Query(value = "select * from transactions_details where status='Pending' and user_id=?1",nativeQuery = true)
    List<Transaction> getPendingTxnsByUserId(Long userId);

    @Transactional
    @Query(value = "select * from transactions_details where status='Fulfilled' and user_id=?1",nativeQuery = true)
    List<Transaction> getFulfilledTxnsByUserId(Long userId);

    @Transactional
    @Query(value = "select * from transactions_details where status='Awaiting' and user_id=?1",nativeQuery = true)
    List<Transaction> getAwaitingTxnsByUserId(Long userId);

    @Transactional
    @Query(value = "select * from transactions_details where status='Cancelled' and user_id=?1",nativeQuery = true)
    List<Transaction> getCancelledTxnsByUserId(Long userId);

    @Transactional
    @Query(value= "select * from transactions_details where user_id=?1 and offer_id=?2",nativeQuery = true)
    Transaction getTxnByUserOffer(Long userId, Long offerId);

    @Transactional
    @Query(value= "select * from transactions_details where user_id=?1 and offer_id=?2 and status!='Cancelled'",nativeQuery = true)
    Transaction getTxnByUserOfferActive(Long userId, Long offerId);

    @Transactional
    @Query(value= "select * from transactions_details where offer_id=?1 and accepted_offer_id=?2",nativeQuery = true)
    Transaction findByOfferIdAcceptedOfferId(Long offerId,Long acceptedOfferId);
}
