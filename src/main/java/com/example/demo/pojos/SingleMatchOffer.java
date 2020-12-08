package com.example.demo.pojos;

import com.example.demo.entities.OfferDetails;
import lombok.Data;

@Data
public class SingleMatchOffer {

    private Double amountDifferencePercentage;
    private OfferDetails offer;

}

