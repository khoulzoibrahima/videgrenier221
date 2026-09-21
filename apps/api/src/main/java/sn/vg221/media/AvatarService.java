package sn.vg221.media;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import java.io.IOException;
import java.time.Instant;
import java.util.Map;
import sn.vg221.auth.CurrentUserResponse;
import sn.vg221.auth.CurrentUserService;
import sn.vg221.auth.FirebaseIdentity;
import sn.vg221.media.CloudinaryConfiguration.CloudinarySettings;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
class AvatarService {
    static final String TRANSFORMATION = "c_fill,g_face,w_512,h_512,q_auto,f_auto";

    private final Cloudinary cloudinary;
    private final CloudinarySettings settings;
    private final JdbcTemplate jdbc;
    private final CurrentUserService currentUsers;

    AvatarService(
        Cloudinary cloudinary,
        CloudinarySettings settings,
        JdbcTemplate jdbc,
        CurrentUserService currentUsers
    ) {
        this.cloudinary = cloudinary;
        this.settings = settings;
        this.jdbc = jdbc;
        this.currentUsers = currentUsers;
    }

    AvatarSignatureResponse signature(FirebaseIdentity identity) {
        requireConfiguration();
        var timestamp = Instant.now().getEpochSecond();
        var folder = folder(identity.uid());
        Map<String, Object> parameters = ObjectUtils.asMap(
            "timestamp", timestamp,
            "public_id", "avatar",
            "folder", folder,
            "overwrite", true,
            "transformation", TRANSFORMATION
        );
        var signature = cloudinary.apiSignRequest(parameters, settings.apiSecret(), 1);
        return new AvatarSignatureResponse(
            settings.cloudName(), settings.apiKey(), timestamp, signature, "avatar", folder, true,
            TRANSFORMATION);
    }

    @Transactional
    CurrentUserResponse delete(FirebaseIdentity identity) {
        currentUsers.synchronize(identity);
        var publicIds = jdbc.query("select avatar_public_id from users where firebase_uid = ?",
            (rs, rowNum) -> rs.getString("avatar_public_id"), identity.uid());
        var publicId = publicIds.isEmpty() ? null : publicIds.get(0);
        if (publicId != null && !publicId.isBlank()) {
            requireConfiguration();
            try {
                cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            } catch (IOException exception) {
                throw new IllegalStateException("La suppression de la photo a échoué.", exception);
            }
        }
        jdbc.update("""
                update users
                set avatar_url = google_avatar_url, avatar_public_id = null, updated_at = current_timestamp
                where firebase_uid = ?
                """, identity.uid());
        return currentUsers.synchronize(identity);
    }

    static String folder(String uid) {
        return "videgrenier221/users/" + uid;
    }

    private void requireConfiguration() {
        if (settings.cloudName().isBlank() || settings.apiKey().isBlank() || settings.apiSecret().isBlank()) {
            throw new IllegalStateException("Cloudinary n'est pas configuré.");
        }
    }
}
