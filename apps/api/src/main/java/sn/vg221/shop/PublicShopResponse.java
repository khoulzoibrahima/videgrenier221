package sn.vg221.shop;

import java.util.List;
import java.util.UUID;

public record PublicShopResponse(
    UUID id,
    String name,
    String slug,
    String location,
    String shareUrl,
    List<ListingResponse> listings
) {
    public record ListingResponse(
        UUID id,
        String title,
        String description,
        String category,
        String condition,
        Integer priceCfa,
        boolean sellerValidated
    ) {}
}
