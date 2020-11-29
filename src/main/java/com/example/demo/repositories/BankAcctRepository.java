package com.example.demo.repositories;

import com.example.demo.entities.BankAccount;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

@EntityScan(basePackages = {"com.example.demo.entity"})
public interface BankAcctRepository extends JpaRepository<BankAccount,Long> {

    @Transactional
    @Modifying
    @Query(value = "update bank_account_details set user_id=?1 where id=?2 ",nativeQuery = true)
    void addUserForeignKey(long userId,long acctId);

}
