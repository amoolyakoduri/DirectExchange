package com.example.demo.services;

import com.example.demo.entities.BankAccount;
import com.example.demo.enums.Currency;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public interface BankAcctService {

    public BankAccount saveBankAcct(Long userId,
                                    String bankName,
                                    String country,
                                    String acctNo,
                                    String ownerName,
                                    String ownerAddress,
                                    Currency currency,
                                    Boolean sending,
                                    Boolean receiving);

}
