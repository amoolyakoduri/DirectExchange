package com.example.demo.repositories;

import com.example.demo.entities.AcceptedOffer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

public interface AcceptedOfferRepository extends JpaRepository<AcceptedOffer,Long> {

//    @Transactional
//    @Modifying
//    @Query(value = "update accepted_offers set offer_id_1=?2, offer_id_2=?3, offer_id_3=?4 where id=?1 ",nativeQuery = true)
//    void addUserForeignKey(long acceptedOfferId1,long offer_id_1,long offer_id_2,long offer_id_3 );

}
