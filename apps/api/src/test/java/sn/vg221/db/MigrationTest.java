package sn.vg221.db;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;

@SpringBootTest
class MigrationTest {
    @Autowired
    JdbcTemplate jdbc;

    @Test
    void createsTheMarketplaceTables() {
        List<String> tables = jdbc.queryForList(
            "select table_name from information_schema.tables where table_schema = 'public'",
            String.class
        );

        assertThat(tables).contains(
            "users", "shops", "listings", "listing_images",
            "reservations", "analysis_jobs", "reports", "events"
        );
    }

    @Test
    void addsUserProfileColumns() {
        List<String> columns = jdbc.queryForList(
            "select column_name from information_schema.columns where table_schema = 'public' and table_name = 'users'",
            String.class
        );

        assertThat(columns).contains(
            "google_avatar_url", "whatsapp_number", "city",
            "avatar_public_id", "profile_completed_at"
        );
    }
}
