package com.example.demo.pojos;

import lombok.Data;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.springframework.http.HttpStatus;

@Data
public class RestResponse {

    private String status;
    private Integer code;
    private String message;
    private String debugMessage;
    private JSONObject payload;
    private JSONArray payload_arr;
}
