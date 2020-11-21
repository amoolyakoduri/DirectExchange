package com.example.demo.entities;

import com.example.demo.enums.Rating;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Immutable;

import javax.persistence.*;
import java.util.List;
import java.util.Set;

@Entity
@Table(name="user")
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id", unique = true)
    private long id;

    @Column(name="uname", unique = true, updatable = false)
//    @Immutable
    private String username;

    @Column(name="nickname", unique = true)
    private String nickname;

    @Column(name="password")
    @JsonIgnore
    private String password;

    @Column(name="out_id", unique = true)
    private String out_id;

//    @Column(name="email_verified", nullable = false)
//    private Boolean emailVerified = false;

//    @NotNull
//    @Enumerated(EnumType.STRING)
//    private AuthProvider provider;

//    @Column(nullable = false)
//    private String providerId;

    @OneToMany(mappedBy="userId")
    @JsonIgnore
    @ToString.Exclude
    private List<BankAccount> accounts;

    @OneToMany(mappedBy="userId")
    @ToString.Exclude
    @JsonIgnore
    private List<OfferDetails> offers;

    @Column(name="rating", nullable = false)
    private double rating;
    
    private Integer faultTranCnt;
    
    private Integer totalTranCnt;

    public void addAcct(BankAccount acct) {
        this.accounts.add(acct);
        acct.setUserId(this);
    }

    public void removeAcct(BankAccount acct) {
        this.accounts.remove(acct);
        acct.setUserId(null);
    }

    public void addOffer(OfferDetails offer) {
        this.offers.add(offer);
        offer.setUserId(this);
    }

    public void removeOffer(OfferDetails offer) {
        this.offers.remove(offer);
        offer.setUserId(null);
    }
    
    public void calcRating()
    {
    	double currRating = Math.round((1-(this.getFaultTranCnt())/(this.getTotalTranCnt())) * 4) + 1;
    	this.setRating(currRating);
    }

}
