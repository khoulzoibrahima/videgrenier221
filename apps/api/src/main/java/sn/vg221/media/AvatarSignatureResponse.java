package sn.vg221.media;

public record AvatarSignatureResponse(
    String cloudName,
    String apiKey,
    long timestamp,
    String signature,
    String publicId,
    String folder,
    boolean overwrite,
    String transformation
) {}
