package com.example.demo.pojos;

import com.example.demo.entities.OfferDetails;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class MatchingOffers {

    private OfferDetails offerDetails;
    private List<SingleMatchOffer> singleMatches = new ArrayList<>();
    private List<SplitMatchOffer> splitMatches = new ArrayList<>();
//    private List<SingleMatchOffer> approxSingleMatches = new ArrayList<>();
//    private List<SplitMatchOffer> approxSplitMatches = new ArrayList<>();

    public void addSplitMatch(SplitMatchOffer splitMatchOffer){
        this.splitMatches.add(splitMatchOffer);
    }

//    public void addApproxSplitMatch(SplitMatchOffer splitMatchOffer){
//        this.approxSplitMatches.add(splitMatchOffer);
//    }

    public void addSingleMatch(SingleMatchOffer offerDetails){
        this.singleMatches.add(offerDetails);
    }

//    public void addApproxSingleMatch(SingleMatchOffer offerDetails){
//        this.approxSingleMatches.add(offerDetails);
//    }
}
