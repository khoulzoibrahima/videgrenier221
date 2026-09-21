package sn.vg221.profile;

import java.net.URI;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import sn.vg221.auth.CurrentUserResponse;
import sn.vg221.auth.CurrentUserService;
import sn.vg221.auth.FirebaseIdentity;
import sn.vg221.media.CloudinaryConfiguration.CloudinarySettings;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
class ProfileService {
    private final JdbcTemplate jdbc;
    private final CurrentUserService currentUsers;
    private final CloudinarySettings cloudinary;

    ProfileService(JdbcTemplate jdbc, CurrentUserService currentUsers, CloudinarySettings cloudinary) {
        this.jdbc = jdbc;
        this.currentUsers = currentUsers;
        this.cloudinary = cloudinary;
    }

    @Transactional
    CurrentUserResponse update(FirebaseIdentity identity, ProfileUpdateRequest request) {
        currentUsers.synchronize(identity);

        var displayName = requiredLength(request.displayName(), "Le nom", 2, 120);
        var city = requiredLength(request.city(), "La ville ou commune", 2, 100);
        var whatsappNumber = SenegalPhoneNumber.normalize(request.whatsappNumber());
        validateAvatar(identity.uid(), request.avatarUrl(), request.avatarPublicId());
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

    private void validateAvatar(String uid, String avatarUrl, String avatarPublicId) {
        var url = blankToNull(avatarUrl);
        var publicId = blankToNull(avatarPublicId);
        if (url == null && publicId == null) {
            return;
        }
        var expectedPublicId = "videgrenier221/users/" + uid + "/avatar";
        if (url == null || !expectedPublicId.equals(publicId)) {
            throw new IllegalArgumentException("Cette photo de profil n'est pas valide.");
        }
        try {
            var uri = URI.create(url);
            var expectedPath = "/" + cloudinary.cloudName() + "/image/upload/";
            if (!"https".equals(uri.getScheme())
                || !"res.cloudinary.com".equals(uri.getHost())
                || !uri.getPath().startsWith(expectedPath)) {
                throw new IllegalArgumentException("Cette photo de profil n'est pas valide.");
            }
        } catch (IllegalArgumentException exception) {
            throw new IllegalArgumentException("Cette photo de profil n'est pas valide.");
        }
    }
}
