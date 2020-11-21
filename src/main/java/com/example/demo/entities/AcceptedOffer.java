package com.example.demo.entities;

import com.example.demo.enums.AcceptedOfferStatus;
import lombok.Data;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name="accepted_offers")
@Data
public class AcceptedOffer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id", unique = true)
    private long id;

    @Column(name="offer_id_1", nullable = false)
    private Long offerId1;

    @Column(name="offer_id_2", nullable = false)
    private Long offerId2;

    @Column(name="offer_id_3")
    private Long offerId3;

    @Column(name="time_stamp", nullable = false)
    private Date timeStamp;

    @Column(name="offer_status", nullable = false)
    @Enumerated(EnumType.STRING)
    private AcceptedOfferStatus offerStatus;

}
