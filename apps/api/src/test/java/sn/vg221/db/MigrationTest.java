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
}
