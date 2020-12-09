package com.example.demo.controllers;

import com.example.demo.entities.OfferDetails;
import com.example.demo.entities.Transaction;
import com.example.demo.entities.User;
import com.example.demo.enums.Currency;
import com.example.demo.exceptions.NotFoundException;
import com.example.demo.pojos.RestResponse;
import com.example.demo.serviceImpl.OfferServiceImpl;
import com.example.demo.serviceImpl.TransactionSeriveImpl;
import com.example.demo.serviceImpl.UserServiceImpl;
import com.example.demo.utils.ResponsePayloadUtils;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.apache.taglibs.standard.tag.common.fmt.RequestEncodingSupport;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;
import java.util.Optional;

@Controller
@RequestMapping("/transaction")
@CrossOrigin("http://localhost:3000")
public class transactionController {
    @Resource
    TransactionSeriveImpl transactionSerive;
    @Resource
    UserServiceImpl userService;
    @Resource
    OfferServiceImpl offerService;
    @Resource
    ResponsePayloadUtils responsePayloadUtils;

    @RequestMapping(value={"/creatInProcess"},method = RequestMethod.POST,produces = {"application/json;charset=utf-8"})
    @ResponseBody
    @Transactional
    public RestResponse createTransactionsInProcess(
                              @RequestParam(required = true) Long offer_id ,
                              @RequestParam(required = true) Long poster_id ,
                              @RequestParam(required = true) Long receiver_id,
                              @RequestParam(required = true) String SCurrency,
                              @RequestParam(required = true) double Samount,
                              @RequestParam(required = true) String DCurrency,
                              @RequestParam(required = true) double Damount,
                              @RequestParam(required = true) long create_time
    ){
        RestResponse response = new RestResponse();
        Transaction t1 = new Transaction();
        Transaction t2 = new Transaction();
        Transaction t3 = new Transaction();
        Transaction t4 = new Transaction();
        Optional<User> poster = userService.getUserDetails(poster_id);
        Optional<User> receiver = userService.getUserDetails(receiver_id);
        Optional<OfferDetails> offer = offerService.getOfferDetailsById(offer_id);
        t1.setOffer(offer.get());t2.setOffer(offer.get());t3.setOffer(offer.get());t4.setOffer(offer.get());
//        t1.setCreatedAt(create_time);t2.setCreatedAt(create_time);t3.setCreatedAt(create_time);t4.setCreatedAt(create_time);
//        t1.setCurrency(Currency.valueOf(SCurrency));t1.setAmount(0-Samount);t1.setStatus("processing");t1.setUserId(poster.get());
//        t2.setCurrency(Currency.valueOf(DCurrency));t2.setAmount(Damount*0.9995);t2.setStatus("processing");t2.setUserId(poster.get());
//        t3.setCurrency(Currency.valueOf(SCurrency));t3.setAmount(Samount*0.9995);t3.setStatus("processing");t3.setUserId(receiver.get());
//        t4.setCurrency(Currency.valueOf(DCurrency));t4.setAmount(0-Damount);t4.setStatus("processing");t4.setUserId(receiver.get());

        transactionSerive.CareteTransaction(t1,poster_id,offer_id);
        transactionSerive.CareteTransaction(t2,poster_id,offer_id);
        transactionSerive.CareteTransaction(t3,receiver_id,offer_id);
        transactionSerive.CareteTransaction(t4,receiver_id,offer_id);
        
        
        //updating transaction count to calculate rating
        poster.get().setTotalTranCnt(poster.get().getTotalTranCnt() + 1);
        receiver.get().setTotalTranCnt(receiver.get().getTotalTranCnt() + 1);
        userService.updateTotalTransactionCount(poster.get().getTotalTranCnt(), poster_id);
        userService.updateTotalTransactionCount(receiver.get().getTotalTranCnt(), receiver_id);
        response.setCode(HttpStatus.OK.value());
        response.setMessage("success");
        return response;
    }

//    @RequestMapping(value={"/confirmTransfer"},method = RequestMethod.PUT,produces = {"application/json;charset=utf-8"})
//    @ResponseBody
//    @Transactional
//    public RestResponse confirmTransfer(
//            @RequestParam(required = true) Long offer_id,
//            @RequestParam(required = true) Long user_id,
//            @RequestParam(required = true) long timeStamp
//    ){
//        RestResponse response = new RestResponse();
//        Optional<User> user = userService.getUserDetails(user_id);
//        List<Transaction> transactionListOfUserAndOffer = transactionSerive.getByUserAndOffer(user_id,offer_id);
//        long create_time = transactionListOfUserAndOffer.get(0).getCreatedAt();
//        if(timeStamp - create_time > 10*60*1000){
//            transactionSerive.setAbortedOrCompelted(offer_id,"aborted");
//            response.setCode(HttpStatus.OK.value());
//            response.setMessage("aborted");
//             user.get().setFaultTranCnt(user.get().getFaultTranCnt() + 1);
//             user.get().calcRating();
//             userService.updateRating(user.get().getRating(), user_id);
//
//        }else{
//            transactionSerive.ConfirmTransfer(user_id,offer_id,"confirmTransfer");
//            String mess = "";
//            boolean allConfirm = true;
//            List<Transaction> transactionListByOffer = transactionSerive.getByOffer(offer_id);
//            for(Transaction t : transactionListByOffer){
////                if(t.getStatus()!="confirmTransfer"){
////                    allConfirm = false;
////                    break;
////                }
//            }
//            if(allConfirm){
//                transactionSerive.setAbortedOrCompelted(offer_id,"completed");
//                mess = "compeleted";
//            }else{
//                mess = "comfirmed";
//            }
//
//        	boolean allConfirm2 = true;
//       	 	for(Transaction t : transactionListOfUserAndOffer){
////                if(t.getStatus()!="confirmTransfer"){
////               	 allConfirm2 = false;
////                    break;
////                }
//            }
//            if(allConfirm2){
//           	 user.get().calcRating();
//                userService.updateRating(user.get().getRating(), user_id);
//            }
//
//            response.setCode(HttpStatus.OK.value());
//            response.setMessage(mess);
//        }
//
//        return response;
//
//    }

    @RequestMapping(value={"/getTransactionsById"},method = RequestMethod.GET,produces = {"application/json;charset=utf-8"})
    @ResponseBody
    @Transactional
    public RestResponse getTransactionsById(
            @RequestParam(required = true) long user_id
    ){
        RestResponse response = new RestResponse();
        List<Transaction> transactionListOfUser = transactionSerive.getByUser(user_id);
        JSONArray jsonArray = new JSONArray();
        for(Transaction t : transactionListOfUser){
            JSONObject tempObj = new JSONObject();
            tempObj.put("id",t.getId());
            tempObj.put("status",t.getStatus());
            tempObj.put("currency",t.getCurrency());
            tempObj.put("amount",t.getAmount());
//            tempObj.put("type",t.getType());
            jsonArray.add(tempObj);
        }
        response.setPayload_arr(jsonArray);
        response.setCode(HttpStatus.OK.value());
        response.setMessage("success");
        return response;
    }
    
    @RequestMapping(value={"/getTxnHistory"},method = RequestMethod.GET,produces = {"application/json;charset=utf-8"})
    @ResponseBody
    @Transactional
    public RestResponse getTxnHistoryWithUserName(
            @RequestParam(required = true) long user_id
    ){
        RestResponse response = new RestResponse();
        List<Transaction> transactionListOfUser = transactionSerive.getTxnHistoryWithUserName(user_id);
        JSONArray jsonArray = new JSONArray();
        for(Transaction t : transactionListOfUser){
            JSONObject tempObj = new JSONObject();
            tempObj.put("id",t.getId());
            tempObj.put("status",t.getStatus());
            tempObj.put("user_id",t.getUserId());
            tempObj.put("offer_id", t.getOffer().getId());
            jsonArray.add(tempObj);
        }
        response.setPayload_arr(jsonArray);
        response.setCode(HttpStatus.OK.value());
        response.setMessage("success");
        return response;
    }

    @RequestMapping(value={"/confirmPayment"},method = RequestMethod.PUT,produces = {"application/json;charset=utf-8"})
    @ResponseBody
    @Transactional
    public RestResponse confirmPayment(@RequestParam Long txnId,@RequestParam Long offerId ){
        RestResponse response = new RestResponse();
        try {
            transactionSerive.confirmPayment(txnId,offerId);
            response.setCode(HttpStatus.OK.value());
            response.setMessage("success");
            response.setPayload(null);
        }
        catch (NotFoundException ex){
            response.setPayload(null);
            response.setCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
            response.setMessage("failure");
            response.setDebugMessage(ex.getMessage());
        }
        return response;
    }

    @RequestMapping(value={"/getPendingTransactions"},method = RequestMethod.GET,produces = {"application/json;charset=utf-8"})
    @ResponseBody
    @Transactional
    public RestResponse getPendingTransactions(@RequestParam Long userId){
        RestResponse response = new RestResponse();
        response.setCode(HttpStatus.OK.value());
        response.setMessage("success");
        response.setPayload(responsePayloadUtils.txnsListJson(transactionSerive.getPendingTxnsByUserId(userId)));
        return response;
    }

    @RequestMapping(value={"/getFulfilledTransactions"},method = RequestMethod.GET,produces = {"application/json;charset=utf-8"})
    @ResponseBody
    @Transactional
    public RestResponse getFulfilledTransactions(@RequestParam Long userId){
        RestResponse response = new RestResponse();
        response.setCode(HttpStatus.OK.value());
        response.setMessage("success");
        response.setPayload(responsePayloadUtils.txnsListJson(transactionSerive.getFulfilledTxnsByUserId(userId)));
        return response;
    }

    @RequestMapping(value={"/getAwaitingTransactions"},method = RequestMethod.GET,produces = {"application/json;charset=utf-8"})
    @ResponseBody
    @Transactional
    public RestResponse getAwaitingTransactions(@RequestParam Long userId){
        RestResponse response = new RestResponse();
        response.setCode(HttpStatus.OK.value());
        response.setMessage("success");
        response.setPayload(responsePayloadUtils.txnsListJson(transactionSerive.getAwaitingTxnsByUserId(userId)));
        return response;
    }

    @RequestMapping(value={"/getCancelledTransactions"},method = RequestMethod.GET,produces = {"application/json;charset=utf-8"})
    @ResponseBody
    @Transactional
    public RestResponse getCancelledTransactions(@RequestParam Long userId){
        RestResponse response = new RestResponse();
        response.setCode(HttpStatus.OK.value());
        response.setMessage("success");
        response.setPayload(responsePayloadUtils.txnsListJson(transactionSerive.getCancelledTxnsByUserId(userId)));
        return response;
    }
}
