package com.example.demo.enums;

import java.io.Serializable;
import java.util.Set;

public enum Currency implements Serializable {

    EUR,
    GBP,
    INR,
    RMB,
    USD;

    public String getCurrency(){
        return  this.name();
    }

//    private Set<ExchangeDetails> exchangeDetails;
//
//    public Set<ExchangeDetails> getExchangeDetails(){
//        return  this.exchangeDetails;
//    }
//
//    private Currency(Set<ExchangeDetails> exchangeDetails){
//        this.exchangeDetails = exchangeDetails;
//    }

    }
