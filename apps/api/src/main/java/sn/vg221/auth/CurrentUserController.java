package sn.vg221.auth;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/me")
class CurrentUserController {
    private final CurrentUserService service;

    CurrentUserController(CurrentUserService service) {
        this.service = service;
    }

    @GetMapping
    CurrentUserResponse currentUser(@AuthenticationPrincipal FirebaseIdentity identity) {
        return service.synchronize(identity);
    }
}
