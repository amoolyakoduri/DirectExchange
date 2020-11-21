package com.example.demo.entities;

import com.example.demo.enums.Currency;
import com.example.demo.enums.OfferStatus;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Data;
import lombok.ToString;

import javax.persistence.*;
import java.util.Date;
import java.util.List;
import java.util.Set;

@Entity
@Table(name="offer_details")
@Data
public class OfferDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id", unique = true)
    private long id;

    @Column(name="source_country")
    private String sourceCountry;

    @Enumerated(EnumType.STRING)
    @Column(name="source_currency")
    private Currency sourceCurrency;

    @Column(name="amount")
    private double amount;

    @Column(name="destination_country")
    private String destinationCountry;

    @Enumerated(EnumType.STRING)
    @Column(name="destination_currency")
    private Currency destinationCurrency;

    @Column(name="exchange_rate")
    private double exchangeRate;

    @Column(name="expiration_date")
    private long expirationDate;

    @Column(name="allow_counter_offers")
    private Boolean allowCounterOffers;

    @Column(name="allow_split_exchange")
    private Boolean allowSplitExchange;

    @Enumerated(EnumType.STRING)
    @Column(name="offer_status")
    private OfferStatus offerStatus;

    @OneToMany(mappedBy="originalOffer")
    @JsonManagedReference
    @JsonIgnore
    @ToString.Exclude
    private List<CounterOfferDetails> counterOffers;

    @ManyToOne
    @JoinColumn(name="user_id", nullable=true, insertable = false,updatable = false)
    @ToString.Exclude
    @JsonIgnore
    private User userId;

    @Column(name="created_at")
    private Date createdAt;

    @Column(name="updated_at")
    private Date updatedAt;

    @Column(name="status")
    private String status;

    @PrePersist
    protected void onCreate() {
        createdAt = new Date();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = new Date();
    }

    public Double getApproxRange(Double percentage){
        return percentage*this.amount;
    }

    public void addCounterOffer(CounterOfferDetails counterOfferDetails) {
        this.counterOffers.add(counterOfferDetails);
        counterOfferDetails.setOriginalOffer(this);
    }

    public void removeCounterOffer(CounterOfferDetails counterOfferDetails) {
        this.counterOffers.remove(counterOfferDetails);
//        counterOfferDetails.setUserId(null);
    }
}
