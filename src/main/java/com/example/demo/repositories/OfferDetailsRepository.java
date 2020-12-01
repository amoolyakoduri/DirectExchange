package com.example.demo.repositories;

import com.example.demo.entities.OfferDetails;
import com.example.demo.entities.User;
import com.example.demo.enums.Currency;
import com.example.demo.pojos.SplitOfferIds;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.sql.ResultSet;
import java.util.List;
import java.util.Optional;

@EntityScan(basePackages = {"com.example.demo.entity"})
public interface OfferDetailsRepository extends JpaRepository<OfferDetails,Long> {

    @Override
    Optional<OfferDetails> findById(Long offerId);

    @Transactional
    @Query(value = "SELECT oda.id as id1,\n" +
            "\t\todb.id as id2\n" +
            "FROM directexchange.offer_details as oda, directexchange.offer_details as odb\n" +
            "where oda.id>odb.id \n" +
            "and oda.offer_status='Open' \n" +
            "and odb.offer_status='Open'\n" +
            "and ((oda.amount + odb.amount = :amount * :exchangeRate\n" +
            "and oda.source_country = :destinationCountry\n" +
            "and oda.destination_country = :sourceCountry\n" +
            "and oda.source_currency = :destinationCurrency\n" +
            "and oda.destination_currency = :sourceCurrency\n" +
            "and odb.source_country = :destinationCountry\n" +
            "and odb.destination_country = :sourceCountry\n" +
            "and odb.source_currency = :destinationCurrency\n" +
            "and odb.destination_currency = :sourceCurrency\n )" +
            "or ( \n" +
            "\t((oda.amount + :amount) * :exchangeRate = odb.amount\n" +
            "\t\tand oda.source_country = :sourceCountry\n" +
            "        and odb.source_country = :destinationCountry\n" +
            "        and oda.destination_country = :destinationCountry\n" +
            "        and odb.destination_country = :sourceCountry\n" +
            "        and oda.source_currency = :sourceCurrency\n" +
            "        and odb.source_currency = :destinationCurrency\n" +
            "        and oda.destination_currency = :destinationCurrency\n" +
            "        and odb.destination_currency = :sourceCurrency) \n" +
            "\tor \n" +
            "\t((odb.amount + :amount) * :exchangeRate = oda.amount\n" +
            "\t\tand odb.source_country = :sourceCountry\n" +
            "        and oda.source_country = :destinationCountry\n" +
            "        and odb.destination_country = :destinationCountry\n" +
            "        and oda.destination_country = :sourceCountry\n" +
            "        and odb.source_currency = :sourceCurrency\n" +
            "        and oda.source_currency = :destinationCurrency\n" +
            "        and odb.destination_currency = :destinationCurrency\n" +
            "        and oda.destination_currency = :sourceCurrency) \n" +
            "))",nativeQuery = true)
    List<Object[]> getSplitOffers(@Param("amount") Double amount,
                                 @Param("exchangeRate") Double exchangeRate,
                                 @Param("sourceCountry") String sourceCountry,
                                 @Param("destinationCountry") String destinationCountry,
                                 @Param("sourceCurrency") String sourceCurrency,
                                 @Param("destinationCurrency") String destinationCurrency);


    @Transactional
    @Query(value = "SELECT oda.id as id1, \n" +
            "            odb.id as id2 \n" +
            "            FROM directexchange.offer_details as oda, directexchange.offer_details as odb \n" +
            "            where oda.id>odb.id  \n" +
            "            and oda.offer_status='Open'  \n" +
            "            and odb.offer_status='Open' \n" +
            "            and oda.expiration_date >= UNIX_TIMESTAMP()  \n" +
            "            and odb.expiration_date >= UNIX_TIMESTAMP()  \n" +
            "            and oda.id!=:offerId and odb.id!= :offerId     \n" +
            "            and oda.user_id!=:userId and odb.user_id!= :userId     \n" +
            "            and (\n" +
            "\t\t\t\t(  \n" +
            "\t\t\t\t\t(oda.amount + odb.amount) - ( (oda.amount + odb.amount) * :marginPercentage)  <= :amount * :exchangeRate \n" +
            "\t\t\t\t\tand (oda.amount + odb.amount) + ( (oda.amount + odb.amount) * :marginPercentage)  >= :amount * :exchangeRate \n" +
//            "\t\t\t\t\tand oda.amount + odb.amount != :amount * :exchangeRate \n" +
            "\t\t\t\t\tand oda.source_country = :destinationCountry \n" +
            "\t\t\t\t\tand oda.destination_country = :sourceCountry\n" +
            "\t\t\t\t\tand oda.source_currency = :destinationCurrency\n" +
            "\t\t\t\t\tand oda.destination_currency = :sourceCurrency \n" +
            "\t\t\t\t\tand odb.source_country = :destinationCountry \n" +
            "\t\t\t\t\tand odb.destination_country = :sourceCountry\n" +
            "\t\t\t\t\tand odb.source_currency = :destinationCurrency\n" +
            "\t\t\t\t\tand odb.destination_currency = :sourceCurrency \n" +
            "\t\t\t\t) \n" +
            "\t\t\t\tor\n" +
            "\t\t\t\t(  \n" +
            "\t\t\t\t\t(\n" +
            "\t\t\t\t\t(oda.amount - (odb.amount * :exchangeRate ) ) - ( (oda.amount - (odb.amount * :exchangeRate )) * :marginPercentage ) <= :amount * :exchangeRate \n" +
            "\t\t\t\t\tand (oda.amount - (odb.amount * :exchangeRate )) + ( (oda.amount - (odb.amount * :exchangeRate )) * :marginPercentage ) >= :amount * :exchangeRate \n" +
//            "\t\t\t\t\tand (oda.amount - (odb.amount * :exchangeRate ) ) != :amount * :exchangeRate \n" +
            "\t\t\t\t\tand oda.source_country = :destinationCountry\n" +
            "\t\t\t\t\tand odb.source_country = :sourceCountry\n" +
            "\t\t\t\t\tand oda.destination_country = :sourceCountry\n" +
            "\t\t\t\t\tand odb.destination_country = :destinationCountry\n" +
            "\t\t\t\t\tand oda.source_currency = :destinationCurrency \n" +
            "\t\t\t\t\tand odb.source_currency = :sourceCurrency\n" +
            "\t\t\t\t\tand oda.destination_currency = :sourceCurrency\n" +
            "\t\t\t\t\tand odb.destination_currency = :destinationCurrency\n" +
            "                    )\n" +
            "\t\t\t\t\tor  \n" +
            "\t\t\t\t\t( \n" +
            "                 (odb.amount - (oda.amount * :exchangeRate )) - ( (odb.amount - (oda.amount * :exchangeRate )) * :marginPercentage ) <= :amount * :exchangeRate \n" +
            "\t\t\t\t\tand (odb.amount - (oda.amount * :exchangeRate )) + ( (odb.amount - (oda.amount * :exchangeRate )) * :marginPercentage ) >= :amount * :exchangeRate \n" +
//            "\t\t\t\t\tand (odb.amount - (oda.amount * :exchangeRate ) ) != :amount * :exchangeRate \n" +
            "\t\t\t\t\tand oda.source_country = :sourceCountry\n" +
            "\t\t\t\t\tand odb.source_country = :destinationCountry \n" +
            "\t\t\t\t\tand oda.destination_country = :destinationCountry \n" +
            "\t\t\t\t\tand odb.destination_country = :sourceCountry\n" +
            "\t\t\t\t\tand oda.source_currency = :sourceCurrency \n" +
            "\t\t\t\t\tand odb.source_currency = :destinationCurrency\n" +
            "\t\t\t\t\tand oda.destination_currency = :destinationCurrency\n" +
            "\t\t\t\t\tand odb.destination_currency = :sourceCurrency\n" +
            "                   )  \n" +
            "\t\t\t\t)\n" +
            "\t\t\t)",nativeQuery = true)
    List<Object[]> getApproxSplitMatches(@Param("amount") Double amount,
                                  @Param("exchangeRate") Double exchangeRate,
                                  @Param("sourceCountry") String sourceCountry,
                                  @Param("destinationCountry") String destinationCountry,
                                  @Param("sourceCurrency") String sourceCurrency,
                                  @Param("destinationCurrency") String destinationCurrency,
                                  @Param("marginPercentage") Double marginPercentage,
                                         @Param("offerId") Long offerId,
                                  @Param("userId") Long userId);

    @Transactional
    @Query(value = "SELECT\n" +
            "        oda.id as id1\n" +
            "    FROM\n" +
            "        directexchange.offer_details as oda\n" +
            "    where \n" +
            "         oda.offer_status='Open'   \n" +
            "\t\tand oda.amount  = :amount * :exchangeRate \n" +
            "\t\tand oda.source_country = :destinationCountry \n" +
            "\t\tand oda.destination_country = :sourceCountry \n" +
            "\t\tand oda.source_currency = :destinationCurrency\n" +
            "\t\tand oda.destination_currency = :sourceCurrency\n" ,nativeQuery = true)
    List<Object[]> getSingleOffers(@Param("amount") Double amount,
                                   @Param("exchangeRate") Double exchangeRate,
                                   @Param("sourceCountry") String sourceCountry,
                                   @Param("destinationCountry") String destinationCountry,
                                   @Param("sourceCurrency") String sourceCurrency,
                                   @Param("destinationCurrency") String destinationCurrency);

    @Transactional
    @Query(value = "SELECT\n" +
            "        oda.id as id1\n" +
            "    FROM\n" +
            "        directexchange.offer_details as oda\n" +
            "    where \n" +
            "         oda.offer_status='Open'   \n" +
            "            and oda.id!=:offerId   \n" +
            "            and oda.user_id!=:userId  \n" +
            "         and oda.expiration_date >= UNIX_TIMESTAMP()  \n" +
            "\t\tand oda.amount  >= (:amount - :lowerApproxRange) * :exchangeRate \n" +
            "\t\tand oda.amount  <= (:amount + :higherApproxRange) * :exchangeRate \n" +
//            "\t\tand oda.amount  != :amount * :exchangeRate \n" +
            "\t\tand oda.source_country = :destinationCountry \n" +
            "\t\tand oda.destination_country = :sourceCountry \n" +
            "\t\tand oda.source_currency = :destinationCurrency\n" +
            "\t\tand oda.destination_currency = :sourceCurrency\n" ,nativeQuery = true)
    List<Object[]> getApproxSingleMatches(@Param("amount") Double amount,
                                   @Param("exchangeRate") Double exchangeRate,
                                   @Param("sourceCountry") String sourceCountry,
                                   @Param("destinationCountry") String destinationCountry,
                                   @Param("sourceCurrency") String sourceCurrency,
                                   @Param("destinationCurrency") String destinationCurrency,
                                   @Param("lowerApproxRange") Double lowerApproxRange,
                                   @Param("higherApproxRange") Double higherApproxRange,
                                          @Param("offerId") Long offerId,
                                          @Param("userId") Long userId);

    @Transactional
    @Query(value = "SELECT oda.id as id1,\n" +
            "\t\todb.id as id2\n" +
            "FROM directexchange.offer_details as oda, directexchange.offer_details as odb\n" +
            "where oda.id>odb.id \n" ,nativeQuery = true)
    List<Object[]> getSplitOffers2();

    @Transactional
    @Query(value = "    SELECT\n" +
            "        oda.id as id1,\n" +
            "        odb.id as id2 \n" +
            "    FROM\n" +
            "        directexchange.offer_details as oda,\n" +
            "        directexchange.offer_details as odb \n" +
            "    where\n" +
            "        oda.id>odb.id  \n" +
            "        and oda.offer_status='Open'  \n" +
            "        and odb.offer_status='Open' \n" +
            "        and (\n" +
            "            (\n" +
            "                oda.amount + odb.amount = :amount.0 * :exchangeRate \n" +
            "                and oda.source_country = 'IND' \n" +
            "                and oda.destination_country = 'USA' \n" +
            "                and oda.source_currency = 'INR'\n" +
            "                and oda.destination_currency = 'USD' \n" +
            "                and odb.source_country = 'IND'\n" +
            "                and odb.destination_country = 'USA' \n" +
            "                and odb.source_currency = 'INR'\n" +
            "                and odb.destination_currency = 'USD'  \n" +
            "            )\n" +
            "            or (\n" +
            "                (\n" +
            "                    (\n" +
            "                        oda.amount + :amount.0\n" +
            "                    ) * :exchangeRate = odb.amount   \n" +
            "                    and oda.source_country = 'USA'         \n" +
            "                    and odb.source_country = 'IND'         \n" +
            "                    and oda.destination_country = 'IND'         \n" +
            "                    and odb.destination_country = 'USA'         \n" +
            "                    and oda.source_currency = 'USD'         \n" +
            "                    and odb.source_currency = 'INR'         \n" +
            "                    and oda.destination_currency = 'INR'         \n" +
            "                    and odb.destination_currency = 'USD'\n" +
            "                )   \n" +
            "                or   (\n" +
            "                    (\n" +
            "                        odb.amount + :amount.0\n" +
            "                    ) * :exchangeRate = oda.amount   \n" +
            "                    and odb.source_country = 'USA'         \n" +
            "                    and oda.source_country = 'IND'         \n" +
            "                    and odb.destination_country = 'IND'         \n" +
            "                    and oda.destination_country = 'USA'         \n" +
            "                    and odb.source_currency = 'USD'         \n" +
            "                    and oda.source_currency = 'INR'         \n" +
            "                    and odb.destination_currency = 'INR'         \n" +
            "                    and oda.destination_currency = 'USD'\n" +
            "                )  \n" +
            "            )\n" +
            "        )" ,nativeQuery = true)
    List<Object[]> getSplitOffers3();


    @Transactional
    @Modifying
    @Query(value = "update offer_details set user_id=?1 where id=?2 ",nativeQuery = true)
    void addUserForeignKey(long userId,long offerId);

    @Transactional
    @Query(value = "select * from offer_details where source_currency=?2 and amount > ?3 and destination_currency=?4 and user_id !=?5 limit ?1,4",nativeQuery = true)
    List<OfferDetails> getOfferList(int pageNum,String Scurrency,int Samount,String Dcurrency,long user_id);

    @Transactional
    @Query(value = "select * from offer_details where user_id=?1",nativeQuery = true)
    List<OfferDetails> getOfferByUser(long user_id);

    @Transactional
    @Query(value = "select * from offer_details where source_currency=?1 and amount > ?2 and destination_currency=?3 and user_id !=?4 and offer_status=?5",nativeQuery = true)
    List<OfferDetails> getTotalOffers(String Scurrency,int Samount,String Dcurrency,long user_id, String status);

}
