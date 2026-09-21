package sn.vg221.profile;

public record ProfileUpdateRequest(
    String displayName,
    String whatsappNumber,
    String city,
    String avatarUrl,
    String avatarPublicId
) {}
