package com.example.demo.pojos;

import com.example.demo.enums.Currency;
import lombok.Data;
import org.springframework.web.bind.annotation.RequestParam;

@Data
public class BankSetupRequest {

    private Long userId;
    private String bankName;
    private String country;
    private String acctNo;
    private String ownerName;
    private String ownerAddress;
    private String currency;
    private Boolean sending;
    private Boolean receiving;
}
