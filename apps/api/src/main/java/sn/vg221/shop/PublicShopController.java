package sn.vg221.shop;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/shops")
class PublicShopController {
    private final PublicShopService service;

    PublicShopController(PublicShopService service) {
        this.service = service;
    }

    @GetMapping("/{slug}")
    PublicShopResponse getShop(@PathVariable String slug) {
        return service.getBySlug(slug);
    }
}
