package com.example.demo.repositories;

import com.example.demo.entities.BankAccount;
import com.example.demo.entities.CounterOfferDetails;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@EntityScan(basePackages = {"com.example.demo.entity"})
public interface CounterOfferRepository extends JpaRepository<CounterOfferDetails, Long> {

    @Transactional
    @Modifying
    @Query(value = "select * from counter_offer_details where from_user_id=?1 ",nativeQuery = true)
    List<CounterOfferDetails> getCountersMade(Long userId);

    @Transactional
    @Modifying
    @Query(value = "update counter_offer_details set offer_id=?1 where id=?2 ",nativeQuery = true)
    void addForeignKeyOriginalOffer(long offer_id,long counter_offer_id);

    @Transactional
    @Modifying
    @Query(value = "update counter_offer_details set from_user_id=?1 where id=?2 ",nativeQuery = true)
    void addForeignKeyFromUser(long from_user_id,long counter_offer_id);
}
