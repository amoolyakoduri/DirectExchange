package com.example.demo.serviceImpl;

import com.example.demo.entities.AcceptedOffer;
import com.example.demo.entities.CounterOfferDetails;
import com.example.demo.entities.OfferDetails;
import com.example.demo.entities.User;
import com.example.demo.enums.AcceptedOfferStatus;
import com.example.demo.enums.CounterOfferStatus;
import com.example.demo.enums.OfferStatus;
import com.example.demo.exceptions.NotFoundException;
import com.example.demo.pojos.AcceptOfferRequest;
import com.example.demo.pojos.CounterOfferRequest;
import com.example.demo.repositories.AcceptedOfferRepository;
import com.example.demo.repositories.CounterOfferRepository;
import com.example.demo.repositories.OfferDetailsRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.sql.Timestamp;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class CounterOfferServiceImpl {

    @Resource
    CounterOfferRepository counterOfferRepository;

    @Resource
    OfferServiceImpl offerService;

    @Resource
    UserServiceImpl userService;

    @Resource
    EmailService emailService;

    @Resource
    OfferDetailsRepository offerDetailsRepository;

    @Resource
    AcceptedOfferRepository acceptedOfferRepository;

    @Transactional
    public CounterOfferDetails createCounterOffer(CounterOfferRequest counterOfferRequest) throws  NotFoundException{
        CounterOfferDetails saved = null;
        Optional<OfferDetails> toOffer = offerService.getOfferDetailsById(counterOfferRequest.getToOffer());
        Optional<OfferDetails> fromOffer = offerService.getOfferDetailsById(counterOfferRequest.getFromOffer());
        Optional<User> userDetails = userService.getUserDetails(counterOfferRequest.getFromUserId());
        if(!toOffer.isPresent() || !userDetails.isPresent() || !fromOffer.isPresent()){
            throw new NotFoundException("Invalid to offer id or from offer id or user id");
        }
        CounterOfferDetails counterOfferDetails = new CounterOfferDetails();
        counterOfferDetails.setNewAmount(counterOfferRequest.getNewAmount());
        counterOfferDetails.setStatus(CounterOfferStatus.New);
        counterOfferDetails.setFromOfferId(counterOfferRequest.getFromOffer());
        counterOfferDetails.setThirdOffer(counterOfferRequest.getThirdOffer());
        fromOffer.get().setOfferStatus(OfferStatus.CounterMade);
        try {
            saved = counterOfferRepository.saveAndFlush(counterOfferDetails);
            toOffer.get().addCounterOffer(saved);
            counterOfferRepository.addForeignKeyFromUser(counterOfferRequest.getFromUserId(),saved.getId());
            counterOfferRepository.addForeignKeyOriginalOffer(toOffer.get().getId(),saved.getId());
            saved.setOriginalOffer(toOffer.get());
            saved.setUserId(userDetails.get());
        } catch (Exception ex) {
            throw new NotFoundException(ex.getMessage());
        }
        emailService.sendSimpleMessage(new String[]{toOffer.get().getUserId().getUsername()},"Received Counter Offer",
                "Hey! You just received a counter offer for one of your offers.\n"+
                "Offer Id: "+toOffer.get().getId() + "\n" +
                "Original Amount: "+toOffer.get().getAmount()+"\n" +
                "New Amount: "+counterOfferRequest.getNewAmount()+"\n");
        return saved;
    }

    @Transactional
    public CounterOfferDetails acceptCounterOffer(Long counterOfferId) throws  NotFoundException{
        Optional<CounterOfferDetails> counterOfferDetails = counterOfferRepository.findById(counterOfferId);
        if(!counterOfferDetails.isPresent()){
            throw new NotFoundException("Invalid counter_offer id");
        }
        Optional<OfferDetails> offer = offerService.getOfferDetailsById(counterOfferDetails.get().getOriginalOffer().getId());
        if(!offer.isPresent()){
            throw new NotFoundException("Invalid original offer id");
        }
        offer.get().setOfferStatus(OfferStatus.InTransaction);
        offer.get().setAmount(counterOfferDetails.get().getNewAmount());
        Optional<OfferDetails> fromOffer = offerService.getOfferDetailsById(counterOfferDetails.get().getFromOfferId());
        if(!fromOffer.isPresent()){
            throw new NotFoundException("Invalid from offer id");
        }
        fromOffer.get().setOfferStatus(OfferStatus.InTransaction);
        counterOfferDetails.get().setStatus(CounterOfferStatus.Accept);
        AcceptOfferRequest acceptOfferRequest = new AcceptOfferRequest();
        acceptOfferRequest.setOfferId1(offer.get().getId());
        acceptOfferRequest.setOfferId2(fromOffer.get().getId());
        if(counterOfferDetails.get().getThirdOffer()!=null) {
            Optional<OfferDetails> thirdOffer = offerDetailsRepository.findById(counterOfferDetails.get().getThirdOffer());
            thirdOffer.get().setOfferStatus(OfferStatus.InTransaction);
            acceptOfferRequest.setOfferId3(counterOfferDetails.get().getThirdOffer());
        }
        acceptOfferRequest.setTimeStamp(new Date().getTime());
        offerService.acceptOffer(acceptOfferRequest);
        return counterOfferDetails.get();
    }

    @Transactional
    public CounterOfferDetails rejectCounterOffer(Long counterOfferId) throws  NotFoundException{
        Optional<CounterOfferDetails> counterOfferDetails = counterOfferRepository.findById(counterOfferId);
        if(!counterOfferDetails.isPresent()){
            throw new NotFoundException("Invalid counter_offer id");
        }
        Optional<OfferDetails> fromOffer = offerService.getOfferDetailsById(counterOfferDetails.get().getFromOfferId());
        if(!fromOffer.isPresent()){
            throw new NotFoundException("Invalid from offer id");
        }
        fromOffer.get().setOfferStatus(OfferStatus.Open);
        Optional<OfferDetails> thirdOffer = offerDetailsRepository.findById(counterOfferDetails.get().getThirdOffer());
        thirdOffer.get().setOfferStatus(OfferStatus.Open);
        counterOfferDetails.get().setStatus(CounterOfferStatus.Reject);
        return counterOfferDetails.get();
    }

    public List<CounterOfferDetails> getCounterOffersMade(Long userId){
        return counterOfferRepository.getCountersMade(userId);
    }

    public void updateExpiredOffers(){
        List<CounterOfferDetails> counterOfferDetails = counterOfferRepository.findAll();

        counterOfferDetails.forEach( co -> {

            if(co.getStatus()==CounterOfferStatus.New && isExpired(co)) {
                Optional<OfferDetails> offerDetails = offerService.getOfferDetailsById(co.getFromOfferId());
                co.setStatus(CounterOfferStatus.Expired);
                offerDetails.get().setOfferStatus(OfferStatus.Open);
                try {
                    offerDetailsRepository.save(offerDetails.get());
                    counterOfferRepository.save(co);

                } catch (Exception ex) {
                    System.out.println("Cron failure with ex: " + ex.getMessage());
                }
            }
        });
    }

    public boolean isExpired(CounterOfferDetails co){
        Date curr = new Date();
        long diff = curr.getTime() - co.getCreatedAt().getTime();
        long diffMinutes = diff / (60 * 1000) % 60;
        long diffSeconds = diff / 1000 % 60;
        long diffHours = diff / (60 * 60 * 1000);
        System.out.println("curTime: "+curr.toString());
        System.out.println("counter offer time: "+co.getCreatedAt().getTime());
        System.out.println("Diff is "+diffHours+" hours "+diffMinutes+" minutes "+diffSeconds+" seconds");
        if( diffHours>0 || diffMinutes> 5 || (diffMinutes==5 && diffSeconds>0))
            return true;
        return false;
    }
}
