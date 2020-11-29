package com.example.demo.enums;

public enum ExchangeRates {

    EUR_GBP(0.89),
    EUR_INR(87.99),
    EUR_RMB(7.78),
    EUR_USD(1.19),

    GBP_EUR(1.12),
    GBP_INR(98.50),
    GBP_RMB(8.70),
    GBP_USD(1.33),

    INR_EUR(0.011),
    INR_GBP(0.010),
    INR_RMB(0.089),
    INR_USD(0.013),

    USD_EUR(0.84),
    USD_GBP(0.75),
    USD_RMB(6.56),
    USD_INR(73.84);

    private double rate;

    private ExchangeRates(double rate) {
        this.rate = rate;
    }

    public double getRate() {
        return this.rate;
    }
}
