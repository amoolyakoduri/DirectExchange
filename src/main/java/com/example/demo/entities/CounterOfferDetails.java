package com.example.demo.entities;

import com.example.demo.enums.CounterOfferStatus;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Data;
import lombok.ToString;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name="counter_offer_details")
@Data
public class CounterOfferDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id", unique = true)
    private long id;

    @ManyToOne
    @JoinColumn(name="from_user_id", nullable=true, insertable = false,updatable = true)
    @JsonBackReference
    @JsonIgnore
    @ToString.Exclude
    private User userId;

    @ManyToOne
    @JoinColumn(name="offer_id", nullable=true,insertable = false,updatable = false)
    @JsonBackReference
    @JsonIgnore
    private OfferDetails originalOffer;

    @Column(name="from_offer_id")
    private Long fromOfferId;

    @Column(name="other_offer_id")
    @JsonIgnore
    private Long thirdOffer = null;

    @Column(name="new_amount")
    private double newAmount;

    @Enumerated(EnumType.STRING)
    @Column(name="status", nullable=false)
    private CounterOfferStatus status;

    @Column(name="created_at")
    private Date createdAt;

    @Column(name="updated_at")
    private Date updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = new Date();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = new Date();
    }
}
