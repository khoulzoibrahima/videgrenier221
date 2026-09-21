package sn.vg221.media;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import sn.vg221.auth.FirebaseIdentity;
import sn.vg221.auth.IdentityTokenVerifier;
import sn.vg221.auth.InvalidIdentityTokenException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.Primary;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest(properties = {
    "cloudinary.cloud-name=vg221-test",
    "cloudinary.api-key=test-key",
    "cloudinary.api-secret=test-secret"
})
@AutoConfigureMockMvc
@Import(AvatarApiTest.FakeAuthConfiguration.class)
class AvatarApiTest {
    @Autowired MockMvc mvc;
    @Autowired JdbcTemplate jdbc;

    @BeforeEach
    void clearUsers() {
        jdbc.update("delete from listings");
        jdbc.update("delete from shops");
        jdbc.update("delete from users");
    }

    @Test
    void rejectsUnsignedAvatarRequests() throws Exception {
        mvc.perform(post("/api/v1/me/avatar-signature"))
            .andExpect(status().isUnauthorized());
    }

    @Test
    void signsAnAvatarPathOwnedByTheAuthenticatedUser() throws Exception {
        mvc.perform(post("/api/v1/me/avatar-signature")
                .header("Authorization", "Bearer valid-token"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.cloudName").value("vg221-test"))
            .andExpect(jsonPath("$.apiKey").value("test-key"))
            .andExpect(jsonPath("$.folder").value("videgrenier221/users/google-awa"))
            .andExpect(jsonPath("$.publicId").value("avatar"))
            .andExpect(jsonPath("$.signature").isNotEmpty())
            .andExpect(jsonPath("$.apiSecret").doesNotExist());
    }

    @Test
    void deletingAnAvatarRestoresTheGooglePicture() throws Exception {
        mvc.perform(get("/api/v1/me").header("Authorization", "Bearer valid-token"))
            .andExpect(status().isOk());
        jdbc.update("""
                update users set avatar_url = ?, avatar_public_id = null where firebase_uid = ?
                """, "https://res.cloudinary.com/vg221-test/image/upload/custom.jpg", "google-awa");

        mvc.perform(delete("/api/v1/me/avatar")
                .header("Authorization", "Bearer valid-token"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.avatarUrl").value("https://google.test/awa.jpg"))
            .andExpect(jsonPath("$.avatarPublicId").doesNotExist());
    }

    @Test
    void rejectsAnAvatarThatDoesNotBelongToTheAuthenticatedUser() throws Exception {
        mvc.perform(put("/api/v1/me/profile")
                .header("Authorization", "Bearer valid-token")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "displayName":"Awa Ndiaye",
                      "whatsappNumber":"771234567",
                      "city":"Dakar",
                      "avatarUrl":"https://evil.test/avatar.jpg",
                      "avatarPublicId":"videgrenier221/users/another-user/avatar"
                    }
                    """))
            .andExpect(status().isBadRequest());
    }

    @TestConfiguration
    static class FakeAuthConfiguration {
        @Bean
        @Primary
        IdentityTokenVerifier avatarIdentityTokenVerifier() {
            return token -> {
                if (!"valid-token".equals(token)) {
                    throw new InvalidIdentityTokenException();
                }
                return new FirebaseIdentity(
                    "google-awa", "awa@gmail.com", "Awa Ndiaye", "https://google.test/awa.jpg");
            };
        }
    }
}
