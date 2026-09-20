package sn.vg221.shop;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.OffsetDateTime;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class PublicShopApiTest {
    private static final UUID USER_ID = UUID.fromString("00000000-0000-0000-0000-000000000001");
    private static final UUID SHOP_ID = UUID.fromString("00000000-0000-0000-0000-000000000002");
    private static final UUID LISTING_ID = UUID.fromString("00000000-0000-0000-0000-000000000003");

    @Autowired MockMvc mvc;
    @Autowired JdbcTemplate jdbc;

    @BeforeEach
    void seedPublishedShop() {
        jdbc.update("delete from listings");
        jdbc.update("delete from shops");
        jdbc.update("delete from users");
        var now = OffsetDateTime.parse("2026-09-20T18:00:00Z");
        jdbc.update("insert into users (id, firebase_uid, email, display_name, created_at, updated_at) values (?, ?, ?, ?, ?, ?)",
            USER_ID, "firebase-awa", "awa@example.sn", "Awa", now, now);
        jdbc.update("insert into shops (id, owner_id, name, slug, region, city, status, created_at, updated_at) values (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            SHOP_ID, USER_ID, "Vide-grenier de Awa", "awa-dakar", "Dakar", "Dakar", "PUBLISHED", now, now);
        jdbc.update("insert into listings (id, shop_id, title, description, category, item_condition, price_cfa, status, seller_validated, created_at, updated_at) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            LISTING_ID, SHOP_ID, "Canapé 3 places", "Canapé propre et confortable.", "Maison", "BON_ETAT", 125000, "PUBLISHED", true, now, now);
    }

    @Test
    void returnsAPublishedShopAndItsObjectListings() throws Exception {
        mvc.perform(get("/api/v1/shops/awa-dakar"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.name").value("Vide-grenier de Awa"))
            .andExpect(jsonPath("$.location").value("Dakar, Dakar"))
            .andExpect(jsonPath("$.shareUrl").value("/boutique/awa-dakar"))
            .andExpect(jsonPath("$.listings[0].title").value("Canapé 3 places"))
            .andExpect(jsonPath("$.listings[0].priceCfa").value(125000))
            .andExpect(jsonPath("$.listings[0].sellerValidated").value(true));
    }

    @Test
    void hidesUnknownOrUnpublishedShops() throws Exception {
        mvc.perform(get("/api/v1/shops/inconnue"))
            .andExpect(status().isNotFound());
    }
}
