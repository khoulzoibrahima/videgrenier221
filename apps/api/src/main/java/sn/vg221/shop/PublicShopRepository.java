package sn.vg221.shop;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
class PublicShopRepository {
    private final JdbcTemplate jdbc;

    PublicShopRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    Optional<ShopSummary> findPublishedBySlug(String slug) {
        try {
            return Optional.ofNullable(jdbc.queryForObject(
                "select id, name, slug, region, city from shops where slug = ? and status = 'PUBLISHED'",
                (rs, rowNum) -> new ShopSummary(
                    rs.getObject("id", UUID.class), rs.getString("name"), rs.getString("slug"),
                    rs.getString("region"), rs.getString("city")),
                slug));
        } catch (EmptyResultDataAccessException ignored) {
            return Optional.empty();
        }
    }

    List<PublicShopResponse.ListingResponse> findPublishedListings(UUID shopId) {
        return jdbc.query("""
            select id, title, description, category, item_condition, price_cfa, seller_validated
            from listings where shop_id = ? and status = 'PUBLISHED'
            order by created_at desc
            """,
            (rs, rowNum) -> new PublicShopResponse.ListingResponse(
                rs.getObject("id", UUID.class), rs.getString("title"), rs.getString("description"),
                rs.getString("category"), rs.getString("item_condition"),
                (Integer) rs.getObject("price_cfa"), rs.getBoolean("seller_validated")),
            shopId);
    }

    record ShopSummary(UUID id, String name, String slug, String region, String city) {}
}
