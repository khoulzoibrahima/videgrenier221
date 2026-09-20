package sn.vg221.shop;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
class PublicShopService {
    private final PublicShopRepository repository;

    PublicShopService(PublicShopRepository repository) {
        this.repository = repository;
    }

    PublicShopResponse getBySlug(String slug) {
        var shop = repository.findPublishedBySlug(slug)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        return new PublicShopResponse(
            shop.id(), shop.name(), shop.slug(), shop.city() + ", " + shop.region(),
            "/boutique/" + shop.slug(), repository.findPublishedListings(shop.id()));
    }
}
