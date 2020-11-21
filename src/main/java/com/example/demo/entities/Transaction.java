package com.example.demo.entities;

import com.example.demo.enums.Currency;
import com.example.demo.enums.TransactionStatus;
import lombok.Data;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name="transactions_details")
@Data
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private long id;

//    @ManyToOne
//    @JoinColumn(name = "user_id")
    @Column(name="user_id")
    private Long userId;

    @ManyToOne
    @JoinColumn(name = "offer_id")
    private OfferDetails offer;

    @Column(name = "amount",nullable = false)
    private double amount;

    @Column(name="created_at")
    private Date createdAt;

    @Column(name="status")
    @Enumerated(EnumType.STRING)
    private TransactionStatus status;

    @Enumerated(EnumType.STRING)
    @Column(name="currency")
    private Currency currency;

    @Column(name="service_fee",nullable = false)
    private Double serviceFee;

    @Column(name="accepted_offer_id")
    private Long acceptedOfferId;

    @PrePersist
    protected void onCreate() {
        createdAt = new Date();
    }

    public TransactionStatus getStatus() {
        return this.status;
    }

}
