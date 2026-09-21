package sn.vg221.auth;

import java.util.UUID;

public record CurrentUserResponse(
    UUID id,
    String firebaseUid,
    String email,
    String displayName,
    String avatarUrl
) {}
