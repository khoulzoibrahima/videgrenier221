package sn.vg221.media;

import sn.vg221.auth.CurrentUserResponse;
import sn.vg221.auth.FirebaseIdentity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/me")
class AvatarController {
    private final AvatarService service;

    AvatarController(AvatarService service) {
        this.service = service;
    }

    @PostMapping("/avatar-signature")
    AvatarSignatureResponse signature(@AuthenticationPrincipal FirebaseIdentity identity) {
        return service.signature(identity);
    }

    @DeleteMapping("/avatar")
    CurrentUserResponse delete(@AuthenticationPrincipal FirebaseIdentity identity) {
        return service.delete(identity);
    }
}
