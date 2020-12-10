package com.example.demo.controllers;
import com.example.demo.entities.OfferDetails;
import com.example.demo.entities.Transaction;
import com.example.demo.enums.Currency;
import com.example.demo.pojos.RestResponse;
import com.example.demo.serviceImpl.ReportingServiceImpl;
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


@Controller
@RequestMapping("/reporting")
@CrossOrigin("http://localhost:3000")
public class ReportingController {
	
	@Resource
    ReportingServiceImpl reportingService;
	
	private JSONArray txnFunc(List<Object[]> txnList){
        JSONArray jsonArray = new JSONArray();
        for(Object[] item: txnList){
            JSONObject tempObj = new JSONObject();
            tempObj.put("Amount",item[0]);
            tempObj.put("Source_currency",item[1]);
            tempObj.put("Destination_amount",item[2]);
            tempObj.put("Destination_currency",item[3]);
            tempObj.put("Exchange_rate",item[4]);
            tempObj.put("Service_free",item[5]);
            tempObj.put("Transaction_date",item[6]);
            jsonArray.add(tempObj);
        }
        System.out.println(jsonArray);
        return jsonArray;
    }
	
	private JSONArray repFunc(List<Object[]> repList){
        JSONArray jsonArray = new JSONArray();
        for(Object[] item: repList){
            JSONObject tempObj = new JSONObject();
            tempObj.put("Completed_Amount",item[0]);
            tempObj.put("No_Complete_txns",item[1]);
            tempObj.put("No_Incomplete_txns",item[2]);
            tempObj.put("Total_Service_fee",item[3]);
           
            jsonArray.add(tempObj);
        }
        return jsonArray;
    }
	
    @RequestMapping(value={"/getTxnHistory"},method = RequestMethod.GET,produces = {"application/json;charset=utf-8"})
    @ResponseBody
    @Transactional
    public RestResponse getTxnHistory(@RequestParam(required = true) long user_id, 
    		@RequestParam(required = true) String month)
    {
        RestResponse response = new RestResponse();
        List<Object[]> txnList = reportingService.getTxnHistory(user_id,month);
        JSONArray jsonArray = this.txnFunc(txnList);
        response.setPayload_arr(jsonArray);
        response.setCode(HttpStatus.OK.value());
        response.setMessage("success");
        return response;
    }
    
    
    @RequestMapping(value={"/getSysFinancialReport"},method = RequestMethod.GET,produces = {"application/json;charset=utf-8"})
    @ResponseBody
    @Transactional
    public RestResponse getSysFinancialReport(@RequestParam(required = true) String month)
    {
        RestResponse response = new RestResponse();
        List<Object[]> repList = reportingService.getSysFinancialReport(month);
        JSONArray jsonArray = this.repFunc(repList);
        response.setPayload_arr(jsonArray);
        response.setCode(HttpStatus.OK.value());
        response.setMessage("success");
        return response;
   }
    
    

}
