package com.example.demo.controllers;

import com.example.demo.entities.BankAccount;
import com.example.demo.entities.User;
import com.example.demo.enums.Currency;
import com.example.demo.pojos.BankSetupRequest;
import com.example.demo.pojos.RestResponse;
import com.example.demo.serviceImpl.BankAcctServiceImpl;
import com.example.demo.serviceImpl.EmailService;
import com.example.demo.serviceImpl.UserServiceImpl;
import net.sf.json.JSONObject;
import net.sf.json.JsonConfig;
import net.sf.json.util.CycleDetectionStrategy;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import javax.annotation.Resource;
import javax.persistence.Embedded;
import java.sql.SQLException;
import java.util.Optional;

//@CrossOrigin("http://localhost:3000")
@CrossOrigin("http://3.136.86.151:3000")
@Controller

@RequestMapping("/bank")
public class BankAcctController {

    private static final Logger logger = LogManager.getLogger(BankAcctController.class);

    @Resource
    BankAcctServiceImpl bankAcctService;

    @Resource
    UserServiceImpl userService;

    @Resource
    EmailService emailService;

    @RequestMapping(value={"/setup"},method = RequestMethod.POST,produces = {"application/json;charset=utf-8"})
    @ResponseBody
    public RestResponse setUpBankAcct(@RequestBody BankSetupRequest request){
//            @RequestParam(required = true) Long userId,
//                                          @RequestParam(required = true) String bankName,
//                                          @RequestParam(required = true) String country,
//                                          @RequestParam(required = true) String acctNo,
//                                          @RequestParam(required = true) String ownerName,
//                                          @RequestParam(required = true) String ownerAddress,
//                                          @RequestParam(required = true) Currency currency,
//                                          @RequestParam(required = true) Boolean sending,
//                                          @RequestParam(required = true) Boolean receiving) {

        BankAccount acct;
        RestResponse response = new RestResponse();
        try {
            Optional<User> user = userService.getUserDetails(request.getUserId());
            if(user.isPresent()) {
                acct = bankAcctService.saveBankAcct(request, user.get());
                JsonConfig jc = new JsonConfig();
                jc.setExcludes(new String[]{"accounts","offers","userId"});
                jc.setCycleDetectionStrategy(CycleDetectionStrategy.LENIENT);
                response.setPayload(JSONObject.fromObject(acct, jc));
                response.setCode(HttpStatus.OK.value());
                response.setMessage("success");
//                emailService.sendSimpleMessage(new String[]{user.get().getUsername()},"Bank Account Added!",
//                        "Bank Account with the following details has been added to your direct exchange account:\n"+
//                        "Account Number: "+request.getAcctNo()+"\n"+
//                                "Bank Name: "+request.getBankName()+"\n"+
//                                "Country: "+request.getCountry()+"\n"+
//                                "Currency: "+request.getCurrency()+"\n"+
//                                "Owner Name: "+request.getOwnerName()+"\n"+
//                                "Owner Address: "+request.getOwnerAddress()+"\n"+
//                                "Receiving Enabled: "+request.getReceiving()+"\n"+
//                                "Sending Enabled: "+request.getSending()+"\n");
            } else {
                response.setPayload(null);
                response.setCode(HttpStatus.BAD_REQUEST.value());
                response.setMessage("failure");
                response.setDebugMessage("Invalid User Id " + request.getUserId());
            }
            return response;
        }
        catch (DataIntegrityViolationException e) {
            response.setPayload(null);
            response.setCode(HttpStatus.BAD_REQUEST.value());
            response.setMessage("failure");
            response.setDebugMessage("Sorry, this account number already exists!");
            return response;
        }
        catch ( Exception ex){
            response.setPayload(null);
            response.setCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
            response.setMessage("failure");
            response.setDebugMessage(ex.getMessage());
            return response;
        }
    }

}
