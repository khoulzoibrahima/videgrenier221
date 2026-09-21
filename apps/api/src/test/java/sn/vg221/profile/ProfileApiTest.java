package sn.vg221.profile;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
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

@SpringBootTest
@AutoConfigureMockMvc
@Import(ProfileApiTest.FakeAuthConfiguration.class)
class ProfileApiTest {
    @Autowired MockMvc mvc;
    @Autowired JdbcTemplate jdbc;

    @BeforeEach
    void clearUsers() {
        jdbc.update("delete from users");
    }

    @Test
    void normalizesSenegalPhoneNumbers() {
        assertThat(SenegalPhoneNumber.normalize("77 123 45 67")).isEqualTo("+221771234567");
        assertThat(SenegalPhoneNumber.normalize("771234567")).isEqualTo("+221771234567");
        assertThat(SenegalPhoneNumber.normalize("+221771234567")).isEqualTo("+221771234567");
        assertThat(SenegalPhoneNumber.normalize("221-77-123-45-67")).isEqualTo("+221771234567");
    }

    @Test
    void rejectsInvalidOrForeignPhoneNumbers() {
        assertThatThrownBy(() -> SenegalPhoneNumber.normalize("77123456"))
            .isInstanceOf(IllegalArgumentException.class);
        assertThatThrownBy(() -> SenegalPhoneNumber.normalize("+33612345678"))
            .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    void updatesAndCompletesTheAuthenticatedProfile() throws Exception {
        mvc.perform(get("/api/v1/me").header("Authorization", "Bearer valid-token"))
            .andExpect(status().isOk());

        mvc.perform(put("/api/v1/me/profile")
                .header("Authorization", "Bearer valid-token")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "displayName": "  Awa Ndiaye  ",
                      "whatsappNumber": "77 123 45 67",
                      "city": "  Dakar  "
                    }
                    """))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.displayName").value("Awa Ndiaye"))
            .andExpect(jsonPath("$.whatsappNumber").value("+221771234567"))
            .andExpect(jsonPath("$.city").value("Dakar"))
            .andExpect(jsonPath("$.profileComplete").value(true));
    }

    @Test
    void rejectsInvalidProfileFields() throws Exception {
        mvc.perform(put("/api/v1/me/profile")
                .header("Authorization", "Bearer valid-token")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {"displayName":"A", "whatsappNumber":"+33612345678", "city":"D"}
                    """))
            .andExpect(status().isBadRequest());
    }

    @TestConfiguration
    static class FakeAuthConfiguration {
        @Bean
        @Primary
        IdentityTokenVerifier profileIdentityTokenVerifier() {
            return token -> {
                if (!"valid-token".equals(token)) {
                    throw new InvalidIdentityTokenException();
                }
                return new FirebaseIdentity(
                    "google-awa", "awa@gmail.com", "Awa Google", "https://google.test/awa.jpg");
            };
        }
    }
}
