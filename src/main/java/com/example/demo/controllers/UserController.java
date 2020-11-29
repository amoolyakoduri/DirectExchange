package com.example.demo.controllers;

import com.example.demo.entities.BankAccount;
import com.example.demo.entities.OfferDetails;
import com.example.demo.entities.User;
import com.example.demo.pojos.RestResponse;
import com.example.demo.serviceImpl.EmailService;
import com.example.demo.serviceImpl.UserServiceImpl;
import net.sf.json.JSONObject;
import net.sf.json.JsonConfig;
import net.sf.json.util.CycleDetectionStrategy;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


@CrossOrigin("http://localhost:3000")
@Controller
@RequestMapping("/user")
public class UserController {
    @Resource
    UserServiceImpl userService;

    @Resource
    EmailService emailService;

    private JSONObject commonFunc(User u) {
        JSONObject userObj = new JSONObject();
        userObj.put("id", u.getId());
        userObj.put("username", u.getUsername());
        userObj.put("nickname", u.getNickname());
        if (u.getOut_id() != null) {
            userObj.put("out_id", u.getOut_id());
        } else {
            userObj.put("out_id", "");
        }
        userObj.put("rating", u.getRating());
        List<Long> offerIds = new ArrayList<>();
        List<JSONObject> accounts = new ArrayList<>();

        if (u.getOffers() != null) {
            for (OfferDetails item : u.getOffers()) {
                offerIds.add(item.getId());
            }
        }
        if (u.getAccounts() != null) {
            for (BankAccount item : u.getAccounts()) {
                JSONObject temp = new JSONObject();
                temp.put("account_id", item.getId());
                temp.put("country", item.getCountry());
                accounts.add(temp);
            }
        }
        userObj.put("accounts", accounts);
        userObj.put("offers", offerIds);
        return userObj;
    }

    @RequestMapping(value = {"/login"}, method = RequestMethod.GET, produces = {"application/json;charset=utf-8"})
    @ResponseBody
    @Transactional
    public RestResponse login(@RequestParam(required = false) String out_id,
                              @RequestParam(required = false) String email,
                              @RequestParam(required = false) String pwd
    ) {
        RestResponse response = new RestResponse();
        if (out_id != "") {
            Optional<User> user = userService.getUserByOutId(out_id);
            if (user.isPresent()) {
                User u = user.get();
                response.setPayload(this.commonFunc(u));
                response.setCode(HttpStatus.OK.value());
                response.setMessage("success");
            } else {
                response.setCode(HttpStatus.NOT_FOUND.value());
                response.setMessage("not found");
            }
        }
        if (email != "") {
            Optional<User> user = userService.getUserByEmail(email);
            if (user.isPresent()) {
                response.setPayload(this.commonFunc(user.get()));
                response.setCode(HttpStatus.OK.value());
                response.setMessage("success");
            } else {
                response.setCode(HttpStatus.NOT_FOUND.value());
                response.setMessage("not found");
            }
        }
        return response;
    }


    @RequestMapping(value = {"/signUpInLocal"}, method = RequestMethod.POST, produces = {"application/json;charset=utf-8"})
    @ResponseBody
    @Transactional
    public RestResponse signUpInLocal(@RequestParam(required = true) String emailId,
                                      @RequestParam(required = true) String pwd,
                                      @RequestParam(required = false) String nickName
    ) {
        RestResponse response = new RestResponse();
        if (nickName != null) {
            Optional<User> user = userService.creatUser(emailId, pwd, nickName);
            if (user != null && user.isPresent()) {
                response.setPayload(JSONObject.fromObject(user));
                response.setCode(HttpStatus.OK.value());
                response.setMessage("success");
            } else {
                response.setCode(HttpStatus.BAD_REQUEST.value());
                response.setMessage("no");
            }
        } else {
            //return user object
            Optional<User> user = userService.getUserByPwd(emailId, pwd);
            if (user.isPresent()) {
                User u = user.get();
                response.setPayload(this.commonFunc(u));
                response.setCode(HttpStatus.OK.value());
                response.setMessage("success");
            } else {
                response.setCode(HttpStatus.BAD_REQUEST.value());
                response.setMessage("no");
            }
        }


        return response;
    }

    @RequestMapping(value = {"/signupByOutId"}, method = RequestMethod.POST, produces = {"application/json;charset=utf-8"})
    @ResponseBody
    @Transactional
    public RestResponse signupByOutId(@RequestParam(required = true) String out_id) {
        RestResponse response = new RestResponse();
        User user = userService.creatUserByOutId(out_id);
        response.setPayload(JSONObject.fromObject(user));
        response.setCode(HttpStatus.OK.value());
        response.setMessage("success");
        return response;
    }

    @RequestMapping(value = {"/connectLocalAccount"}, method = RequestMethod.PUT, produces = {"application/json;charset=utf-8"})
    @ResponseBody
    @Transactional
    public RestResponse connectLocalAccount(@RequestParam(required = true) String out_id,
                                            @RequestParam(required = true) String emailId,
                                            @RequestParam(required = true) String pwd,
                                            @RequestParam(required = true) String nickName
    ) {
        RestResponse response = new RestResponse();
        int res = userService.connectLocalAccount(out_id, emailId, pwd, nickName);

        if (res == 1) {
            response.setCode(HttpStatus.OK.value());
            response.setMessage("success");

        } else {
            response.setCode(HttpStatus.BAD_REQUEST.value());
            response.setMessage("bad");
        }
        return response;
    }

    @RequestMapping(value = {"/getByOutId"}, method = RequestMethod.GET, produces = {"application/json;charset=utf-8"})
    @ResponseBody
    public RestResponse getByOutId(@RequestParam(required = true) String out_id) {
        RestResponse response = new RestResponse();
        Optional<User> user = userService.getUserByOutId(out_id);
        if (user.isPresent()) {
            JsonConfig jc = new JsonConfig();
            jc.setExcludes(new String[]{"userId", "accounts", "offers"});
            jc.setCycleDetectionStrategy(CycleDetectionStrategy.LENIENT);
            response.setPayload(JSONObject.fromObject(user.get(), jc));
            response.setCode(HttpStatus.OK.value());
            response.setMessage("success");
        } else {
            response.setCode(HttpStatus.NOT_FOUND.value());
            response.setMessage("no found");
        }
        return response;
    }

    @RequestMapping(value = {"/sendMessage"}, method = RequestMethod.POST, produces = {"application/json;charset=utf-8"})
    @ResponseBody
    public RestResponse sendMessage(@RequestParam String message, @RequestParam String subject, @RequestParam String to) {
        RestResponse response = new RestResponse();
        ;
        try {
            emailService.sendSimpleMessage(new String[]{to}, subject, message);
            response.setPayload(null);
            response.setMessage("success");
            response.setCode(HttpStatus.OK.value());
        } catch (Exception ex) {
            response.setPayload(null);
            response.setCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
            response.setMessage("failure");
            response.setDebugMessage(ex.getMessage());
        }
        return response;

    }
}
