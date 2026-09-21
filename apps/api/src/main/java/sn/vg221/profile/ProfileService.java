package sn.vg221.profile;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import sn.vg221.auth.CurrentUserResponse;
import sn.vg221.auth.CurrentUserService;
import sn.vg221.auth.FirebaseIdentity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
class ProfileService {
    private final JdbcTemplate jdbc;
    private final CurrentUserService currentUsers;

    ProfileService(JdbcTemplate jdbc, CurrentUserService currentUsers) {
        this.jdbc = jdbc;
        this.currentUsers = currentUsers;
    }

    @Transactional
    CurrentUserResponse update(FirebaseIdentity identity, ProfileUpdateRequest request) {
        currentUsers.synchronize(identity);

        var displayName = requiredLength(request.displayName(), "Le nom", 2, 120);
        var city = requiredLength(request.city(), "La ville ou commune", 2, 100);
        var whatsappNumber = SenegalPhoneNumber.normalize(request.whatsappNumber());
        var now = OffsetDateTime.now(ZoneOffset.UTC);

        jdbc.update("""
                update users
                set display_name = ?, whatsapp_number = ?, city = ?,
                    avatar_url = coalesce(?, avatar_url),
                    avatar_public_id = coalesce(?, avatar_public_id),
                    profile_completed_at = ?, updated_at = ?
                where firebase_uid = ?
                """,
            displayName, whatsappNumber, city, blankToNull(request.avatarUrl()),
            blankToNull(request.avatarPublicId()), now, now, identity.uid());

        return currentUsers.synchronize(identity);
    }

    private static String requiredLength(String value, String label, int minimum, int maximum) {
        if (value == null) {
            throw new IllegalArgumentException(label + " est obligatoire.");
        }
        var trimmed = value.trim();
        if (trimmed.length() < minimum || trimmed.length() > maximum) {
            throw new IllegalArgumentException(
                label + " doit contenir entre " + minimum + " et " + maximum + " caractères.");
        }
        return trimmed;
    }

    private static String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
