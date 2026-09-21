package sn.vg221.auth;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.Primary;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@Import(AuthApiTest.FakeAuthConfiguration.class)
class AuthApiTest {
    @Autowired MockMvc mvc;
    @Autowired JdbcTemplate jdbc;

    @BeforeEach
    void clearUsers() {
        jdbc.update("delete from users");
    }

    @Test
    void rejectsRequestsWithoutAGoogleIdentity() throws Exception {
        mvc.perform(get("/api/v1/me"))
            .andExpect(status().isUnauthorized());
    }

    @Test
    void createsAndReturnsTheUserFromAValidFirebaseToken() throws Exception {
        mvc.perform(get("/api/v1/me").header("Authorization", "Bearer valid-token"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.firebaseUid").value("google-awa"))
            .andExpect(jsonPath("$.email").value("awa@gmail.com"))
            .andExpect(jsonPath("$.displayName").value("Awa Ndiaye"))
            .andExpect(jsonPath("$.googleAvatarUrl").value("https://google.test/awa.jpg"))
            .andExpect(jsonPath("$.profileComplete").value(false));
    }

    @Test
    void allowsTheLocalWebAppToCallTheApi() throws Exception {
        mvc.perform(options("/api/v1/me")
                .header("Origin", "http://localhost:3000")
                .header("Access-Control-Request-Method", "GET")
                .header("Access-Control-Request-Headers", "Authorization"))
            .andExpect(status().isOk())
            .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:3000"));
    }

    @TestConfiguration
    static class FakeAuthConfiguration {
        @Bean
        @Primary
        IdentityTokenVerifier fakeIdentityTokenVerifier() {
            return token -> {
                if (!"valid-token".equals(token)) {
                    throw new InvalidIdentityTokenException();
                }
                return new FirebaseIdentity("google-awa", "awa@gmail.com", "Awa Ndiaye", "https://google.test/awa.jpg");
            };
        }
    }
}
