package com.example.demo.services;

import com.example.demo.entities.User;
import org.springframework.stereotype.Service;

@Service
public interface UserService {

    public User getUserDetails(Long userId);

}
