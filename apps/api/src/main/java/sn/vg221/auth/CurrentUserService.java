package sn.vg221.auth;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.UUID;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
class CurrentUserService {
    private final JdbcTemplate jdbc;

    CurrentUserService(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @Transactional
    CurrentUserResponse synchronize(FirebaseIdentity identity) {
        var existing = jdbc.query("select id from users where firebase_uid = ?",
            (rs, rowNum) -> rs.getObject("id", UUID.class), identity.uid());
        var now = OffsetDateTime.now(ZoneOffset.UTC);
        var displayName = identity.displayName() == null || identity.displayName().isBlank()
            ? identity.email().split("@")[0] : identity.displayName();
        UUID id;
        if (existing.isEmpty()) {
            id = UUID.randomUUID();
            jdbc.update("""
                    insert into users (
                        id, firebase_uid, email, display_name, avatar_url,
                        google_avatar_url, created_at, updated_at
                    ) values (?, ?, ?, ?, ?, ?, ?, ?)
                    """,
                id, identity.uid(), identity.email(), displayName, identity.avatarUrl(),
                identity.avatarUrl(), now, now);
        } else {
            id = existing.get(0);
            jdbc.update("""
                    update users
                    set email = ?,
                        display_name = case when profile_completed_at is null then ? else display_name end,
                        avatar_url = coalesce(avatar_url, ?),
                        google_avatar_url = ?,
                        updated_at = ?
                    where id = ?
                    """,
                identity.email(), displayName, identity.avatarUrl(), identity.avatarUrl(), now, id);
        }
        return jdbc.queryForObject("""
                select id, firebase_uid, email, display_name, avatar_url, google_avatar_url,
                       whatsapp_number, city, avatar_public_id, profile_completed_at
                from users
                where id = ?
                """,
            (rs, rowNum) -> new CurrentUserResponse(
                rs.getObject("id", UUID.class),
                rs.getString("firebase_uid"),
                rs.getString("email"),
                rs.getString("display_name"),
                rs.getString("avatar_url"),
                rs.getString("google_avatar_url"),
                rs.getString("whatsapp_number"),
                rs.getString("city"),
                rs.getString("avatar_public_id"),
                rs.getObject("profile_completed_at") != null
            ), id);
    }
}
