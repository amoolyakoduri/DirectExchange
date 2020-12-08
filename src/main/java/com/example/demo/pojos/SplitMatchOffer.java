package com.example.demo.pojos;

import com.example.demo.entities.OfferDetails;
import lombok.Data;

@Data
public class SplitMatchOffer {

    private Double amountDifferencePercentage;
    private OfferDetails offer1;
    private OfferDetails offer2;

}
