package com.example.demo.services;

import java.util.List;

import org.springframework.stereotype.Service;

@Service
public interface ReportingService {
	
	
	public List<Object[]> getTxnHistory(long user_id, String month);
	
	public List<Object[]> getSysFinancialReport(String month);

}

