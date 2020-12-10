package com.example.demo.repositories;

import com.example.demo.entities.OfferDetails;
import com.example.demo.entities.Transaction;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;


import java.util.List;


@EntityScan(basePackages = {"com.example.demo.entity"})
public interface ReportingRepository extends JpaRepository<OfferDetails,Transaction>{
//
//	 @Transactional
//	    @Query(value = "select o.amount,\n"+
//	    		 "o.source_currency,\n"+ 
//	    		 "(o.amount* o.exchange_rate) as destination_amount,\n"+
//	    		 "o.destination_currency,o.exchange_rate,(o.amount*0.0005) as service_fee,\n"+
//	    		 "DATE_FORMAT(FROM_UNIXTIME(t.created_at/1000),'%d-%m-%Y') as creation_date\n"+
//	    		 "from transactions_details t, offer_details o \n"+
//	    		 "where t.offer_id = o.id \n"+
//	    		 "and t.status = \"Fulfilled\" \n"+
//	    		 "and o.user_id = :userID \n"+
//	    		 "and MONTH(FROM_UNIXTIME(t.created_at/1000))= :month\n", nativeQuery = true)	 
//	    List<Object[]> getTxnHistory(@Param("userID") Long userID, @Param("month") String month);
	    
	    @Transactional
	    @Query(value = "select td.amount as amount,\n"
	    		+ "       td.currency as source_currency,\n"
	    		+ "       td.amount*od.exchange_rate as destination_amount,\n"
	    		+ "       od.destination_currency as destination_currency,\n"
	    		+ "       od.exchange_rate as exchange_rate,\n"
	    		+ "       td.service_fee*ser.exchange_rate as service_fee,\n"
	    		+ "       td.created_at as creation_date\n"
	    		+ "from transactions_details td, offer_details od, static_exchange_rates ser\n"
	    		+ "where td.offer_id = od.id \n"
	    		+ "and td.currency = ser.source_currency\n"
	    		+ "and ser.destination_currency = \"USD\"\n"
	    		+ "and UPPER(td.status) = \"FULFILLED\"\n"
	    		+ "and td.user_id = :userID\n"
	    		+ "and MONTH(td.created_at)= :month\n", nativeQuery = true)	 
	    List<Object[]> getTxnHistory(@Param("userID") Long userID, @Param("month") String month);
	    
	    
	    
	    @Transactional
	    @Query(value = "select sum(remitted_amount) as remitted_amount,\n"
	    		+ " 	sum(completed_transactions) as completed_transactions,\n"
	    		+ "       sum(incomplete_transactions) as incomplete_transactions,\n"
	    		+ "       sum(service_fee) as service_fee \n"
	    		+ "from (\n"
	    		+ "select count(distinct(td.accepted_offer_id)) AS completed_transactions,\n"
	    		+ "         0 as incomplete_transactions,\n"
	    		+ "        SUM(amount*ser.exchange_rate)/2 AS remitted_amount,\n"
	    		+ "        SUM(service_fee*ser.exchange_rate) AS service_fee\n"
	    		+ "FROM \n"
	    		+ "transactions_details td, static_exchange_rates ser\n"
	    		+ "where td.currency = ser.source_currency\n"
	    		+ "and UPPER(td.status) = \"FULFILLED\"\n"
	    		+ "and destination_currency = \"USD\"\n"
	    		+ "and MONTH(td.created_at)= :month\n"
	    		+ "UNION \n"
	    		+ "SELECT 0 as completed_transactions, count(distinct(accepted_offer_id)) as incomplete_transactions ,0 as remitted_amount,0 as service_fee\n"
	    		+ "FROM transactions_details\n"
	    		+ "where UPPER(status) in (\"PENDING\",\"CANCELLED\",\"AWAITING\")\n"
	    		+ "and MONTH(created_at)= :month) aggregates_table;\n", nativeQuery = true)	 
	    List<Object[]> getSysFinancialReport(@Param("month") String month);


}
