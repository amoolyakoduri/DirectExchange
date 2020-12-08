package com.example.demo.pojos;

import lombok.Data;

@Data
public class MatchOfferRequest {

    private Long offerId;
    private Long timeStamp;
    private Long offerId1;
    private Long offerId2;
    private Double amount;
}
