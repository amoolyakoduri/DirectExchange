package com.example.demo.serviceImpl;

import com.example.demo.entities.*;
import com.example.demo.enums.*;
import com.example.demo.enums.Currency;
import com.example.demo.exceptions.NotFoundException;
import com.example.demo.pojos.AcceptOfferRequest;
import com.example.demo.pojos.MatchingOffers;
import com.example.demo.pojos.SingleMatchOffer;
import com.example.demo.pojos.SplitMatchOffer;
import com.example.demo.repositories.AcceptedOfferRepository;
import com.example.demo.repositories.OfferDetailsRepository;
import com.example.demo.repositories.TransactionRepository;
import com.example.demo.utils.SingleOfferComparator;
import com.example.demo.utils.SplitOffersComparator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.sql.ResultSet;
import java.util.*;

@Service
public class OfferServiceImpl {

    @Resource
    OfferDetailsRepository offerDetailsRepository;

    @Resource
    AcceptedOfferRepository acceptedOfferRepository;

    @Resource
    UserServiceImpl userService;

    @Resource
    TransactionRepository transactionRepository;

    @Resource
    EmailService emailService;

    @Transactional
    public Optional<OfferDetails> getOfferDetailsById(Long offerId) {
        return offerDetailsRepository.findById(offerId);
    }

    @Transactional
    public MatchingOffers getMatchingOffers(OfferDetails offerDetails) {
        MatchingOffers matchingOffers = new MatchingOffers();
        matchingOffers.setOfferDetails(offerDetails);
        List<Object[]> splitOffers = offerDetailsRepository.getApproxSplitMatches(offerDetails.getAmount(),
                offerDetails.getExchangeRate(), offerDetails.getSourceCountry(),
                offerDetails.getDestinationCountry(), offerDetails.getSourceCurrency().name(),
                offerDetails.getDestinationCurrency().name(), 0.1,offerDetails.getId(),
                offerDetails.getUserId().getId());
        for (Object[] obj : splitOffers) {
            SplitMatchOffer splitMatchOffer = new SplitMatchOffer();
            Optional<OfferDetails> offer1 = offerDetailsRepository.findById(Long.parseLong(obj[0].toString()));
            Optional<OfferDetails> offer2 = offerDetailsRepository.findById(Long.parseLong(obj[1].toString()));
            if (offer1.isPresent() && offer2.isPresent()) {
                splitMatchOffer.setOffer1(offer1.get());
                splitMatchOffer.setOffer2(offer2.get());
                splitMatchOffer.setAmountDifferencePercentage(
                        calculateAmountDifferenceSplitOffer(offerDetails.getAmount(), offer1.get().getAmount(),
                                offer2.get().getAmount(), offerDetails.getSourceCurrency(),
                                offerDetails.getExchangeRate(), offer1.get().getSourceCurrency(),
                                offer2.get().getSourceCurrency()));
                matchingOffers.addSplitMatch(splitMatchOffer);
            }
        }
        Collections.sort(matchingOffers.getSplitMatches(), new SplitOffersComparator());
        List<Object[]> singleMatches = offerDetailsRepository.getApproxSingleMatches(offerDetails.getAmount(),
                offerDetails.getExchangeRate(), offerDetails.getSourceCountry(),
                offerDetails.getDestinationCountry(), offerDetails.getSourceCurrency().name(),
                offerDetails.getDestinationCurrency().name(),
                offerDetails.getApproxRange(0.1), offerDetails.getApproxRange(0.1),
                offerDetails.getId(),offerDetails.getUserId().getId());
        for (Object[] obj : singleMatches) {
            Optional<OfferDetails> offer1 = offerDetailsRepository.findById(Long.parseLong(obj[0].toString()));
            if (offer1.isPresent()) {
                SingleMatchOffer singleMatchOffer = new SingleMatchOffer();
                singleMatchOffer.setOffer(offer1.get());
                singleMatchOffer.setAmountDifferencePercentage(calculateAmountDifferenceSingleOffer(offerDetails.getAmount(), offer1.get().getAmount(),
                        offerDetails.getExchangeRate()));
                matchingOffers.addSingleMatch(singleMatchOffer);
            }
        }
        Collections.sort(matchingOffers.getSingleMatches(), new SingleOfferComparator());
        return matchingOffers;
    }

    @Transactional
    public Boolean acceptOffer(AcceptOfferRequest acceptOfferRequest) throws NotFoundException {
        Optional<OfferDetails> offer2 = null;
        Optional<OfferDetails> offer3 = null;
        Optional<OfferDetails> offer1 = offerDetailsRepository.findById(acceptOfferRequest.getOfferId1());
        if (offer1.isPresent() && acceptOfferRequest.getOfferId2() != null
                && acceptOfferRequest.getOfferId3() != null) {
            offer2 = offerDetailsRepository.findById(acceptOfferRequest.getOfferId2());
            offer3 = offerDetailsRepository.findById(acceptOfferRequest.getOfferId3());
            if (offer2.isPresent() && offer3.isPresent()) {
                offer1.get().setOfferStatus(OfferStatus.InTransaction);
                offer2.get().setOfferStatus(OfferStatus.InTransaction);
                offer3.get().setOfferStatus(OfferStatus.InTransaction);
                AcceptedOffer acceptedOffer = new AcceptedOffer();
                acceptedOffer.setOfferId1(offer1.get().getId());
                acceptedOffer.setOfferId2(offer2.get().getId());
                acceptedOffer.setOfferId3(offer3.get().getId());
                acceptedOffer.setOfferStatus(AcceptedOfferStatus.InTransaction);
                acceptedOffer.setTimeStamp(new Date(acceptOfferRequest.getTimeStamp()));
                Transaction txn1 = new Transaction();
                txn1.setAmount(offer1.get().getAmount());
                txn1.setCurrency(offer1.get().getSourceCurrency());
                txn1.setOffer(offer1.get());
                txn1.setServiceFee(0.0005*offer1.get().getAmount());
                txn1.setStatus(TransactionStatus.Pending);
                txn1.setUserId(offer1.get().getUserId().getId());
                emailService.sendSimpleMessage(new String[]{offer1.get().getUserId().getUsername(),
                            offer2.get().getUserId().getUsername()},"Offer accepted!",
                        "Your offer has been accepted. Please complete your transaction in my transactions page.");
                emailService.sendSimpleMessage(new String[]{offer3.get().getUserId().getUsername()},"Offer accepted!",
                        "Your offer has been accepted. Please complete your transaction in my transactions page.");
                Transaction txn2 = new Transaction();
                txn2.setAmount(offer2.get().getAmount());
                txn2.setCurrency(offer2.get().getSourceCurrency());
                txn2.setOffer(offer2.get());
                txn2.setServiceFee(0.0005*offer2.get().getAmount());
                txn2.setStatus(TransactionStatus.Pending);
                txn2.setUserId(offer2.get().getUserId().getId());
                Transaction txn3 = new Transaction();
                txn3.setAmount(offer3.get().getAmount());
                txn3.setCurrency(offer3.get().getSourceCurrency());
                txn3.setOffer(offer3.get());
                txn3.setServiceFee(0.0005*offer3.get().getAmount());
                txn3.setStatus(TransactionStatus.Pending);
                txn3.setUserId(offer3.get().getUserId().getId());
                try {
                    AcceptedOffer savedOffer = acceptedOfferRepository.saveAndFlush(acceptedOffer);
                    txn1.setAcceptedOfferId(savedOffer.getId());
                    txn2.setAcceptedOfferId(savedOffer.getId());
                    txn3.setAcceptedOfferId(savedOffer.getId());
                    transactionRepository.save(txn1);
                    transactionRepository.save(txn2);
                    transactionRepository.save(txn3);
                    return true;
                } catch (Exception ex) {
                    throw ex;
                }
            } else {
                throw new NotFoundException("One or more offer ids " + offer2.get().getId() +
                        ", " + ", " + offer2.get().getId() + " are invalid");
            }
        } else if (offer1.isPresent() && acceptOfferRequest.getOfferId2() != null) {
            offer2 = offerDetailsRepository.findById(acceptOfferRequest.getOfferId2());
            if (offer2.isPresent()) {
                offer1.get().setOfferStatus(OfferStatus.InTransaction);
                offer2.get().setOfferStatus(OfferStatus.InTransaction);
                AcceptedOffer acceptedOffer = new AcceptedOffer();
                acceptedOffer.setOfferId1(offer1.get().getId());
                acceptedOffer.setOfferId2(offer2.get().getId());
                acceptedOffer.setOfferStatus(AcceptedOfferStatus.InTransaction);
                acceptedOffer.setTimeStamp(new Date(acceptOfferRequest.getTimeStamp()));
                Transaction txn1 = new Transaction();
                txn1.setAmount(offer1.get().getAmount());
                txn1.setCurrency(offer1.get().getSourceCurrency());
                txn1.setOffer(offer1.get());
                txn1.setServiceFee(0.0005*offer1.get().getAmount());
                txn1.setStatus(TransactionStatus.Pending);
                txn1.setUserId(offer1.get().getUserId().getId());
                Transaction txn2 = new Transaction();
                txn2.setAmount(offer2.get().getAmount());
                txn2.setCurrency(offer2.get().getSourceCurrency());
                txn2.setOffer(offer2.get());
                txn2.setServiceFee(0.0005*offer2.get().getAmount());
                txn2.setStatus(TransactionStatus.Pending);
                txn2.setUserId(offer2.get().getUserId().getId());
                emailService.sendSimpleMessage(new String[]{offer1.get().getUserId().getUsername(),
                                offer2.get().getUserId().getUsername()},"Offer accepted!",
                        "Your offer has been accepted. Please complete your transaction in my transactions page.");
                try {
                    AcceptedOffer savedOffer = acceptedOfferRepository.saveAndFlush(acceptedOffer);
                    txn1.setAcceptedOfferId(savedOffer.getId());
                    txn2.setAcceptedOfferId(savedOffer.getId());
                    transactionRepository.save(txn1);
                    transactionRepository.save(txn2);
                    return true;
                } catch (Exception ex) {
                    throw ex;
                }
            } else {
                throw new NotFoundException("Offer id " + offer2.get().getId() +
                        " is invalid");
            }
        } else if(offer1.isPresent() && acceptOfferRequest.getOfferId2() != null){
            throw new NotFoundException("Minimum two offer ids expected to match offer" );
        }
        else{
            throw new NotFoundException("Offer id " + offer1.get().getId() +
                    " is invalid");
        }
    }

    public OfferDetails CareteOffer(OfferDetails offer, long user_id) {
        OfferDetails o = offerDetailsRepository.saveAndFlush(offer);
        offerDetailsRepository.addUserForeignKey(user_id, o.getId());
        return o;
    }


    public Double calculateAmountDifferenceSplitOffer(Double curentAmount,
                                                      Double offer1Amount, Double offer2Amount,
                                                      Currency currentSourceCurrency, Double exchangeRate,
                                                      Currency offer1SourceCurrency, Currency offer2SourceCurrency) {
        Double requiredAmount = 0.0;
        if (currentSourceCurrency == offer1SourceCurrency) {
            requiredAmount = offer2Amount - (offer1Amount * exchangeRate);
        } else if (currentSourceCurrency == offer2SourceCurrency) {
            requiredAmount = offer1Amount - (offer2Amount * exchangeRate);
        } else {
            requiredAmount = offer1Amount + offer2Amount;
        }
        Double difference = (curentAmount * exchangeRate) - requiredAmount;
        return Math.round((difference / (curentAmount * exchangeRate)) * 100.0 * 100) / 100.0;
    }

    public Double calculateAmountDifferenceSingleOffer(Double curentAmount,
                                                       Double offer1Amount,
                                                       Double exchangeRate) {
        Double difference = (curentAmount * exchangeRate) - offer1Amount;
        return Math.round((difference / (curentAmount * exchangeRate)) * 100.0 * 100) / 100.0;
    }
 
    public List<OfferDetails> getOfferList(int pageNum,String Scurrency,int Samount,String Dcurrency,Long user_id){
        List<OfferDetails> offerList = offerDetailsRepository.getOfferList( pageNum, Scurrency, Samount, Dcurrency,user_id);
        return offerList;
    }

    public List<OfferDetails> getOfferByUser(long user_id) {
        List<OfferDetails> offerList = offerDetailsRepository.getOfferByUser(user_id);
        return offerList;
    }
    public List<OfferDetails> getTotalOffers(String Scurrency,int Samount,String Dcurrency,long user_id){
        List<OfferDetails> offerList = offerDetailsRepository.getTotalOffers(Scurrency, Samount, Dcurrency,user_id,"Open");
        return offerList;
    }

    @Transactional
    public OfferDetails updateOfferAmt(Long offerId, Double amount) {
        Optional<OfferDetails> offerDetails = offerDetailsRepository.findById(offerId);
        if (offerDetails.isPresent()) {
            offerDetails.get().setAmount(amount);
            return offerDetails.get();
        } else {
            throw new NotFoundException("Offer id " + offerId +
                    " is invalid");
        }
    }

    public void updateExpiredOffers(){
        List<AcceptedOffer> acceptedOffers = acceptedOfferRepository.findAll();
        acceptedOffers.forEach( offer -> {

            if(offer.getOfferStatus() == AcceptedOfferStatus.InTransaction && isExpired(offer)) {
                Optional<OfferDetails> offer1 = offerDetailsRepository.findById(offer.getOfferId1());
                Optional<OfferDetails> offer2 = offerDetailsRepository.findById(offer.getOfferId2());
                offer1.get().setOfferStatus(OfferStatus.Open);
                offer2.get().setOfferStatus(OfferStatus.Open);
                offer.setOfferStatus(AcceptedOfferStatus.Cancelled);
                Transaction txn1 = transactionRepository.getTxnByUserOffer(offer1.get().getUserId().getId(),offer1.get().getId());
                Transaction txn2 = transactionRepository.getTxnByUserOffer(offer2.get().getUserId().getId(),offer2.get().getId());
                txn1.setStatus(TransactionStatus.Cancelled);
                txn2.setStatus(TransactionStatus.Cancelled);
                try {
                    offerDetailsRepository.save(offer1.get());
                    offerDetailsRepository.save(offer2.get());
                    transactionRepository.save(txn1);
                    transactionRepository.save(txn2);
                    if(offer.getOfferId3()!=null){
                        Optional<OfferDetails> offer3 = offerDetailsRepository.findById(offer.getOfferId3());
                        offer3.get().setOfferStatus(OfferStatus.Open);
                        offerDetailsRepository.save(offer3.get());
                        Transaction txn3 = transactionRepository.getTxnByUserOffer(offer3.get().getUserId().getId(),offer3.get().getId());
                        txn3.setStatus(TransactionStatus.Cancelled);
                        transactionRepository.save(txn3);
                    }
                    acceptedOfferRepository.save(offer);
                } catch (Exception ex) {
                    System.out.println("Cron failure with ex: " + ex.getMessage());
                }
            }
        });
    }

    public boolean isExpired(AcceptedOffer offer){
        Date curr = new Date();
        long diff = curr.getTime() - offer.getTimeStamp().getTime();
        long diffMinutes = diff / (60 * 1000) % 60;
        long diffSeconds = diff / 1000 % 60;
        long diffHours = diff / (60 * 60 * 1000);
        if( diffHours>0 || diffMinutes> 10 || (diffMinutes==10 && diffSeconds>0))
            return true;
        return false;
    }


}
