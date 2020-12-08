package com.example.demo.controllers;

import com.example.demo.entities.CounterOfferDetails;
import com.example.demo.entities.OfferDetails;
import com.example.demo.enums.OfferStatus;
import com.example.demo.exceptions.NotFoundException;
import com.example.demo.pojos.*;
import com.example.demo.serviceImpl.CounterOfferServiceImpl;
import com.example.demo.serviceImpl.EmailService;
import com.example.demo.serviceImpl.OfferServiceImpl;
import com.example.demo.serviceImpl.UserServiceImpl;
import com.example.demo.utils.ResponsePayloadUtils;
import net.sf.json.JSONObject;
import net.sf.json.JsonConfig;
import net.sf.json.util.CycleDetectionStrategy;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;
import java.util.Optional;

@CrossOrigin("http://localhost:3000")
@Controller
@RequestMapping("/matchingOffers")
public class MatchingOffersController {

    @Resource
    OfferServiceImpl offerService;

    @Resource
    UserServiceImpl userService;

    @Resource
    CounterOfferServiceImpl counterOfferService;

    @Resource
    ResponsePayloadUtils responsePayloadUtils;

    @RequestMapping(value={"/all"},method = RequestMethod.GET,produces = {"application/json;charset=utf-8"})
    @ResponseBody
    @Transactional
    public RestResponse getAllMatchingOffers(@RequestParam(required = true) Long offerId){
        RestResponse response = new RestResponse();
        try {
            Optional<OfferDetails> offer = offerService.getOfferDetailsById(offerId);
            if (offer.isPresent() ) {
                if(offer.get().getOfferStatus()!= OfferStatus.Open){
                    response.setPayload(null);
                    response.setCode(HttpStatus.BAD_REQUEST.value());
                    response.setMessage("failure");
                    response.setDebugMessage("Offer already in " + offer.get().getOfferStatus() + "status");
                    return response;
                }
                JsonConfig jc = new JsonConfig();
                jc.setExcludes(new String[]{"accounts","offers"});
                jc.setCycleDetectionStrategy(CycleDetectionStrategy.LENIENT);
                MatchingOffers matchingOffers = offerService.getMatchingOffers(offer.get());
                JSONObject payload = responsePayloadUtils.matchingOffersJson(matchingOffers);//JSONObject.fromObject(matchingOffers);
                response.setPayload(payload);
                response.setCode(HttpStatus.OK.value());
                response.setMessage("success");
//                response.setDebugMessage("Invalid Offer Id " + offerId);
            } else {
                response.setPayload(null);
                response.setCode(HttpStatus.BAD_REQUEST.value());
                response.setMessage("failure");
                response.setDebugMessage("Invalid Offer Id " + offerId);
            }
            return response;
        }
        catch (Exception ex){
            response.setPayload(null);
            response.setCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
            response.setMessage("failure");
            response.setDebugMessage(ex.getLocalizedMessage());
            return response;
        }
    }

    @RequestMapping(value={"/acceptOffer"},method = RequestMethod.POST,produces = {"application/json;charset=utf-8"})
    @ResponseBody
    @Transactional
    public RestResponse acceptOffer(@RequestBody AcceptOfferRequest acceptOfferRequest){
        RestResponse response = new RestResponse();
        try{
            offerService.acceptOffer(acceptOfferRequest);
            response.setPayload(null);
            response.setCode(HttpStatus.OK.value());
            response.setMessage("success");
        }
        catch (NotFoundException ex){
            response.setPayload(null);
            response.setCode(HttpStatus.BAD_REQUEST.value());
            response.setMessage("failure");
            response.setDebugMessage(ex.getMessage());
        }
        return response;
    }

    @RequestMapping(value={"/matchOffer"},method = RequestMethod.PUT,produces = {"application/json;charset=utf-8"})
    @ResponseBody
    @Transactional
    public RestResponse matchOffer(@RequestBody MatchOfferRequest matchOfferRequest){
        RestResponse response = new RestResponse();
        try{
            AcceptOfferRequest acceptOfferRequest = new AcceptOfferRequest();
            acceptOfferRequest.setTimeStamp(matchOfferRequest.getTimeStamp());
            OfferDetails updatedOffer = offerService.updateOfferAmt(matchOfferRequest.getOfferId(),
                    matchOfferRequest.getAmount());
            acceptOfferRequest.setOfferId1(matchOfferRequest.getOfferId());
            acceptOfferRequest.setOfferId2(matchOfferRequest.getOfferId1());
            acceptOfferRequest.setOfferId3(matchOfferRequest.getOfferId2());
            offerService.acceptOffer(acceptOfferRequest);
            response.setPayload(responsePayloadUtils.offerDetailsJson(updatedOffer));
            response.setCode(HttpStatus.OK.value());
            response.setMessage("success");
        }
        catch (NotFoundException ex){
            response.setPayload(null);
            response.setCode(HttpStatus.BAD_REQUEST.value());
            response.setMessage("failure");
            response.setDebugMessage(ex.getMessage());
        }
        return response;
    }

    @RequestMapping(value={"/createCounterOffer"},method = RequestMethod.POST,produces = {"application/json;charset=utf-8"})
    @ResponseBody
    @Transactional
    public RestResponse createCounterOffer(@RequestBody CounterOfferRequest counterOfferRequest)
    {
        RestResponse response = new RestResponse();
        try {
            CounterOfferDetails savedCO = counterOfferService.createCounterOffer(counterOfferRequest);
            response.setPayload(responsePayloadUtils.counterOfferJson(savedCO));
            response.setCode(HttpStatus.OK.value());
            response.setMessage("success");
        }
        catch (NotFoundException ex){
            response.setPayload(null);
            response.setCode(HttpStatus.BAD_REQUEST.value());
            response.setMessage("failure");
            response.setDebugMessage(ex.getMessage());
        }
        return response;
    }

    @RequestMapping(value={"/acceptCounterOffer"},method = RequestMethod.PUT,produces = {"application/json;charset=utf-8"})
    @ResponseBody
    @Transactional
    public RestResponse acceptCounterOffer(@RequestParam Long counterOfferId)
    {
        RestResponse response = new RestResponse();
        try {
            CounterOfferDetails savedCO = counterOfferService.acceptCounterOffer(counterOfferId);
            response.setPayload(responsePayloadUtils.counterOfferJson(savedCO));
            response.setCode(HttpStatus.OK.value());
            response.setMessage("success");
        }
        catch (NotFoundException ex){
            response.setPayload(null);
            response.setCode(HttpStatus.BAD_REQUEST.value());
            response.setMessage("failure");
            response.setDebugMessage(ex.getMessage());
        }
        return response;
    }

    @RequestMapping(value={"/rejectCounterOffer"},method = RequestMethod.PUT,produces = {"application/json;charset=utf-8"})
    @ResponseBody
    @Transactional
    public RestResponse rejectCounterOffer(@RequestParam Long counterOfferId)
    {
        RestResponse response = new RestResponse();
        try {
            CounterOfferDetails savedCO = counterOfferService.rejectCounterOffer(counterOfferId);
            response.setPayload(responsePayloadUtils.counterOfferJson(savedCO));
            response.setCode(HttpStatus.OK.value());
            response.setMessage("success");
        }
        catch (NotFoundException ex){
            response.setPayload(null);
            response.setCode(HttpStatus.BAD_REQUEST.value());
            response.setMessage("failure");
            response.setDebugMessage(ex.getMessage());
        }
        return response;
    }

    @RequestMapping(value={"/getCounterOffersReceived"},method = RequestMethod.GET,produces = {"application/json;charset=utf-8"})
    @ResponseBody
    @Transactional
    public RestResponse getCounterOffersReceived(@RequestParam Long offerId){
        RestResponse response = new RestResponse();
        try{
            Optional<OfferDetails> offer = offerService.getOfferDetailsById(offerId);
            if(!offer.isPresent()){
                throw new NotFoundException("Invalid offer id");
            }
            List<CounterOfferDetails> counterOffersList = offer.get().getCounterOffers();
            response.setPayload(responsePayloadUtils.counterOffersListJson(counterOffersList));
            response.setCode(HttpStatus.OK.value());
            response.setMessage("success");
        }
        catch (NotFoundException ex){
            response.setPayload(null);
            response.setCode(HttpStatus.BAD_REQUEST.value());
            response.setMessage("failure");
            response.setDebugMessage(ex.getMessage());
        }
        return response;
    }

    @RequestMapping(value={"/getCounterOffersMade"},method = RequestMethod.GET,produces = {"application/json;charset=utf-8"})
    @ResponseBody
    @Transactional
    public RestResponse getCounterOffersMade(@RequestParam Long userId){
        RestResponse response = new RestResponse();
        try{
            List<CounterOfferDetails> counterOffersList = counterOfferService.getCounterOffersMade(userId);
            response.setPayload(responsePayloadUtils.counterOffersListJson(counterOffersList));
            response.setCode(HttpStatus.OK.value());
            response.setMessage("success");
        }
        catch (NotFoundException ex){
            response.setPayload(null);
            response.setCode(HttpStatus.BAD_REQUEST.value());
            response.setMessage("failure");
            response.setDebugMessage(ex.getMessage());
        }
        return response;
    }
}
