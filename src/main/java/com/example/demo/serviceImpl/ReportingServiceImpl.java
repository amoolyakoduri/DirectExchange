package com.example.demo.serviceImpl;


import com.example.demo.repositories.ReportingRepository;
import com.example.demo.services.ReportingService;
import org.springframework.stereotype.Service;
import javax.annotation.Resource;

import java.util.List;


@Service
public class ReportingServiceImpl {
	
	@Resource
    ReportingRepository reportingRepository;
	
	public List<Object[]> getTxnHistory(long user_id, String month){
        List<Object[]> txnList = reportingRepository.getTxnHistory(user_id,month);
        return txnList;
	}
	
	public List<Object[]> getSysFinancialReport(String month){
        List<Object[]> repList = reportingRepository.getSysFinancialReport(month);
        return repList;
	}

}
