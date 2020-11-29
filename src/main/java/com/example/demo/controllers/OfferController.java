package com.example.demo.controllers;

import com.example.demo.entities.OfferDetails;
import com.example.demo.entities.User;
import com.example.demo.enums.Currency;
import com.example.demo.enums.OfferStatus;
import com.example.demo.exceptions.NotFoundException;
import com.example.demo.pojos.RestResponse;
import com.example.demo.serviceImpl.OfferServiceImpl;
import com.example.demo.serviceImpl.UserServiceImpl;
import com.example.demo.utils.ResponsePayloadUtils;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import net.sf.json.JsonConfig;
import net.sf.json.util.CycleDetectionStrategy;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Controller
@RequestMapping("/offer")
@CrossOrigin("http://localhost:3000")
//@CrossOrigin("http://3.14.151.147:3000")
public class OfferController {
    @Resource
    OfferServiceImpl offerService;
    @Resource
    UserServiceImpl userService;

    @Resource
    ResponsePayloadUtils responsePayloadUtils;

    private JSONArray commonFunc(List<OfferDetails> offerList){
        JSONArray jsonArray = new JSONArray();
        for(OfferDetails item:offerList){
            JSONObject tempObj = new JSONObject();
            tempObj.put("offerId",item.getId());
            tempObj.put("DCountry",item.getDestinationCountry());
            tempObj.put("DCurrency",item.getDestinationCurrency());
            tempObj.put("SCountry",item.getSourceCountry());
            tempObj.put("SCurrency",item.getSourceCurrency());
            tempObj.put("Amount",item.getAmount());
            tempObj.put("Rate",item.getExchangeRate());
            tempObj.put("CounterOffer",item.getAllowCounterOffers().toString());
            tempObj.put("SplitExchange",item.getAllowSplitExchange().toString());
            tempObj.put("OfferStatus",item.getOfferStatus());
            tempObj.put("owner_id",item.getUserId().getId());
            tempObj.put("owner_name",item.getUserId().getNickname());
            tempObj.put("owner_rating",item.getUserId().getRating());
            tempObj.put("owner_email",item.getUserId().getUsername());

            if(item.getExpirationDate() == 0){
                tempObj.put("expire","");
            }else{
                tempObj.put("expire",item.getExpirationDate());
            }

            jsonArray.add(tempObj);
        }
        return jsonArray;
    }

    @RequestMapping(value={"/"},method = RequestMethod.POST,produces = {"application/json;charset=utf-8"})
    @ResponseBody
    @Transactional
    public RestResponse createOffer(@RequestParam(required = true) String Dcountry,
                                    @RequestParam(required = true) String Dcurrency,
                                    @RequestParam(required = true) String Scountry,
                                    @RequestParam(required = true) String Scurrency,
                                    @RequestParam(required = true) double amount,
                                    @RequestParam(required = true) String counterOffer,
                                    @RequestParam(required = true) String splitOffer,
                                    @RequestParam(required = true) double rate,
                                    @RequestParam(required = true) long expireDate,
                                    @RequestParam(required = true) long user_id
                                    )
    {
        Boolean temp1=true;
        Boolean temp2=true;
        if(counterOffer.equals("false") ){
            temp1 = false;
        }
        if(splitOffer.equals("false")){
            temp2 = false;
        }
        RestResponse response = new RestResponse();
        OfferDetails offer = new OfferDetails();
        Optional <User> u = userService.getUserDetails(user_id);
        if(u.isPresent()){
            offer.setUserId(u.get());
            offer.setSourceCountry(Scountry);
            offer.setSourceCurrency(Currency.valueOf(Scurrency));
            offer.setDestinationCountry(Dcountry);
            offer.setDestinationCurrency(Currency.valueOf(Dcurrency));
            offer.setAllowCounterOffers(temp1);
            offer.setAllowSplitExchange(temp2);
            offer.setExchangeRate(rate);
            offer.setExpirationDate(expireDate);
            offer.setAmount(amount);
            offer.setStatus("open");
            offer.setOfferStatus(OfferStatus.Open);
            JsonConfig jc = new JsonConfig();
            jc.setExcludes(new String[]{"userId"});
            jc.setCycleDetectionStrategy(CycleDetectionStrategy.LENIENT);

            response.setPayload(JSONObject.fromObject(offerService.CareteOffer(offer,u.get().getId()),jc));
            response.setCode(HttpStatus.OK.value());
            response.setMessage("success");
        }else{
            response.setCode(HttpStatus.NOT_FOUND.value());
            response.setMessage("no found");
        }
        return response;
    }
    @RequestMapping(value={"/all"},method = RequestMethod.GET,produces = {"application/json;charset=utf-8"})
    @ResponseBody
    @Transactional
    public RestResponse getAllOffer(@RequestParam(required = true) int pageNum,
                                    @RequestParam(required = true) String Scurrency,
                                    @RequestParam(required = true) int Samount,
                                    @RequestParam(required = true) String Dcurrency,
                                    @RequestParam(required = true) long user_id
                                    ){
        RestResponse response = new RestResponse();
        pageNum = pageNum -1;
        if(pageNum < 0){
            pageNum = 0;
        }
        List<OfferDetails> offerList = offerService.getOfferList(pageNum*4,Scurrency,Samount,Dcurrency,user_id);
        JSONArray jsonArray = this.commonFunc(offerList);

        //total count
        List<OfferDetails> totalOffers = offerService.getTotalOffers(Scurrency,Samount,Dcurrency,user_id);
        int length = totalOffers.size();
        JSONObject temp = new JSONObject();
        temp.put("totalNum",length);

        response.setPayload(temp);
        response.setPayload_arr(jsonArray);
        response.setCode(HttpStatus.OK.value());
        response.setMessage("success");
        return response;
    }

    @RequestMapping(value={"/getByUserId"},method = RequestMethod.GET,produces = {"application/json;charset=utf-8"})
    @ResponseBody
    @Transactional
    public RestResponse getOffersByuserId(@RequestParam(required = true) long user_id)
    {
        RestResponse response = new RestResponse();
        List<OfferDetails> offerList = offerService.getOfferByUser(user_id);
        JSONArray jsonArray = this.commonFunc(offerList);
        response.setPayload_arr(jsonArray);
        response.setCode(HttpStatus.OK.value());
        response.setMessage("success");
        return response;

    }
}
