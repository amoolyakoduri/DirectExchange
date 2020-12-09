package com.example.demo.serviceImpl;

import com.example.demo.entities.AcceptedOffer;
import com.example.demo.entities.OfferDetails;
import com.example.demo.entities.Transaction;
import com.example.demo.enums.AcceptedOfferStatus;
import com.example.demo.enums.OfferStatus;
import com.example.demo.enums.TransactionStatus;
import com.example.demo.exceptions.NotFoundException;
import com.example.demo.repositories.AcceptedOfferRepository;
import com.example.demo.repositories.OfferDetailsRepository;
import com.example.demo.repositories.TransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class TransactionSeriveImpl {
    @Resource
    TransactionRepository transactionRepository;

    @Resource
    AcceptedOfferRepository acceptedOfferRepository;

    @Resource
    EmailService emailService;

    @Resource
    UserServiceImpl userService;

    @Resource
    OfferDetailsRepository offerDetailsRepository;

    @Transactional
    public Transaction CareteTransaction(Transaction t, long user_id,long offer_id){
        Transaction transaction =  transactionRepository.saveAndFlush(t);
        long t_id = transaction.getId();
        System.out.println("zyl  t_idt_idt_idt_id "+t_id+" user_id "+user_id+" offer_id "+offer_id);
//        transactionRepository.addUserForeignKey(user_id,offer_id,t_id);
        transactionRepository.addUserForeignKey(user_id,t_id);
        transactionRepository.addOfferForeignKey(offer_id,t_id);
        this.updateUserRating(user_id);
        return transaction;
    }

    @Transactional
    public void ConfirmTransfer(long userId,long offerId,String status){
        transactionRepository.confirmTransfer(userId,offerId,status);
    }

    @Transactional
    public List<Transaction> getByUserAndOffer(long userId, long offerId){
        return transactionRepository.getByUserAndOffer(userId,offerId);
    }
    @Transactional
    public List<Transaction> getByUser(long userId){
        return transactionRepository.getByUser(userId);
    }

    @Transactional
    public void setAbortedOrCompelted(long offerId,String status){
        transactionRepository.setAbortedOrCompelted(offerId,status);
    }

    @Transactional
    public List<Transaction> getByOffer(long offerId){
        return transactionRepository.getByOffer(offerId);
    }
    @Transactional
    public List<Transaction> getTxnHistoryWithUserName(long userID){
        return transactionRepository.getTxnHistoryWithUserName(userID);
    }

    @Transactional
    public List<Transaction> getPendingTxnsByUserId(Long userId){
        return transactionRepository.getPendingTxnsByUserId(userId);
    }

    @Transactional
    public List<Transaction> getFulfilledTxnsByUserId(Long userId){
        return transactionRepository.getFulfilledTxnsByUserId(userId);
    }

    @Transactional
    public List<Transaction> getAwaitingTxnsByUserId(Long userId){
        return transactionRepository.getAwaitingTxnsByUserId(userId);
    }

    @Transactional
    public List<Transaction> getCancelledTxnsByUserId(Long userId){
        return transactionRepository.getCancelledTxnsByUserId(userId);
    }

    @Transactional
    public void confirmPayment(Long txnId,Long offerId) throws NotFoundException{
        ArrayList<Long> offers = new ArrayList<>();
        boolean fulfilled = true;
        try {
            Optional<Transaction> txn = transactionRepository.findById(txnId);
            Optional<AcceptedOffer> acceptedOffer = acceptedOfferRepository.findById(txn.get().getAcceptedOfferId());
            offers.add(acceptedOffer.get().getOfferId1());
            offers.add(acceptedOffer.get().getOfferId2());
            if (acceptedOffer.get().getOfferId3() != null)
                offers.add(acceptedOffer.get().getOfferId3());
            offers.remove(offerId);
            for (Long offer : offers) {
                Transaction txn1 = transactionRepository.findByOfferIdAcceptedOfferId(offer,acceptedOffer.get().getId());
                if (txn1.getStatus() != TransactionStatus.Awaiting)
                    fulfilled = false;
            }
            if (fulfilled) {
                txn.get().setStatus(TransactionStatus.Fulfilled);
                for (Long offer : offers) {
                    Transaction txn2 = transactionRepository.findByOfferIdAcceptedOfferId(offer,acceptedOffer.get().getId());
                    Optional<OfferDetails> offer2 = offerDetailsRepository.findById(offer);
                    offer2.get().setOfferStatus(OfferStatus.Fulfilled);
                    txn2.setStatus(TransactionStatus.Fulfilled);
                    transactionRepository.save(txn2);
                    offerDetailsRepository.save(offer2.get());
                    acceptedOffer.get().setOfferStatus(AcceptedOfferStatus.Complete);
                    emailService.sendSimpleMessage(new String[]{offer2.get().getUserId().getUsername()},"Transaction Complete!",
                            "Your transactions has been successfully completed. \n" +
                                    "You have been charged a service fee of "+offer2.get().getSourceCurrency()+ " " +
                                    0.0005*offer2.get().getAmount()+".\n You have received "+offer2.get().getSourceCurrency()+ " " +
                                    0.9995*offer2.get().getAmount()+".\n"
                            );

                }
            } else {
                txn.get().setStatus(TransactionStatus.Awaiting);
            }
        }
        catch (Exception ex){
            throw new NotFoundException("Exception in payment confirmation "+ex.getMessage());
        }
    }

    private void updateUserRating(Long user_id){
        double rating = 0;
        double totalTransactions = 0;
        double totalFaultTransactions = 0;

        List<Transaction> transactionList = this.getTxnHistoryWithUserName(user_id);
        totalTransactions = transactionList.size();

        for(Transaction transaction : transactionList){
            if(transaction.getStatus() == TransactionStatus.Cancelled){
                totalFaultTransactions++;
            }
        }
        if(totalTransactions > 0) {
            rating = Math.toIntExact(Math.round(((1 - (totalFaultTransactions/totalTransactions)) * 4) + 1));
        }
        userService.updateRating(rating, user_id);
    }
}
