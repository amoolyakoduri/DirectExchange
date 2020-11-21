package com.example.demo.entities;

import com.example.demo.enums.Currency;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.Immutable;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Table(name="bank_account_details")
@Data
public class BankAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id", unique = true)
    private long id;

    @Column(name="bank_name", nullable = false)
    private String bankName;

    @Column(name="country", nullable = false)
    private String country;

    @Column(name="account_no", unique = true, nullable = false)
    private String accountNo;

    @Column(name="owner_name", nullable = false)
    private String ownerName;

    @Column(name="owner_address", nullable = false)
    private String ownerAddress;

    @Enumerated(EnumType.STRING)
    @Column(name="currency", nullable = false,  columnDefinition="VARCHAR(10)")
    private Currency currency;

    @Column(name="sending", nullable = false)
    private Boolean sending;

    @Column(name="receiving", nullable = false)
    private Boolean receiving;

    @ManyToOne
    @JoinColumn(name="user_id",insertable = false,updatable = false,nullable = true)
    @ToString.Exclude
    @Getter
    @Setter
    @JsonIgnore
    private User userId;

}
