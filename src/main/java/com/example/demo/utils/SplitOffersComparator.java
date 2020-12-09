package com.example.demo.utils;

import com.example.demo.pojos.SplitMatchOffer;

import java.util.Comparator;

public class SplitOffersComparator implements Comparator<SplitMatchOffer> {

    @Override
    public int compare(SplitMatchOffer a, SplitMatchOffer b) {
        if(Math.abs(a.getAmountDifferencePercentage()) < Math.abs(b.getAmountDifferencePercentage()))
            return 1;
        else if(Math.abs(a.getAmountDifferencePercentage()) == Math.abs(b.getAmountDifferencePercentage())){
            return a.getAmountDifferencePercentage()>0 ? -1 : 1;
        }
        return -1;
    }

}
