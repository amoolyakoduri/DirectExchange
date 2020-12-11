package com.example.demo.controllers;

import com.example.demo.pojos.RestResponse;
import com.example.demo.serviceImpl.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

@Controller
@RequestMapping("/message")
@CrossOrigin("http://localhost:3000")
public class MessageController {

    @Resource
    UserServiceImpl userService;

    private JavaMailSender javaMailSender;

    @RequestMapping(value={"/sendmessage"},method = RequestMethod.POST,produces = {"application/json;charset=utf-8"})
    @ResponseBody
    @Transactional
    public RestResponse sendmessage(@RequestParam(required = true) String toEmail,
                                 @RequestParam(required = true) String fromEmail,
                                 @RequestParam(required = true) String subject,
                                 @RequestParam(required = true) String message){
        RestResponse response = new RestResponse();

        var mailMessage = new SimpleMailMessage();

        mailMessage.setTo(toEmail);
        mailMessage.setFrom(fromEmail);
        mailMessage.setSubject(subject);
        mailMessage.setText(message);

        javaMailSender.send(mailMessage);

        //response.setCode(HttpStatus.OK.value());
        //response.setMessage("message sent to " + toEmail);

        return response;
    }


}
