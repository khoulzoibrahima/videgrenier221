package sn.vg221.auth;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseAuth;
import java.io.IOException;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FirebaseAuthConfiguration {
    @Bean
    @ConditionalOnProperty(name = "firebase.enabled", havingValue = "true")
    IdentityTokenVerifier firebaseIdentityTokenVerifier() throws IOException {
        var options = FirebaseOptions.builder()
            .setCredentials(GoogleCredentials.getApplicationDefault())
            .build();
        var app = FirebaseApp.getApps().isEmpty() ? FirebaseApp.initializeApp(options) : FirebaseApp.getInstance();
        var auth = FirebaseAuth.getInstance(app);
        return token -> {
            try {
                var decoded = auth.verifyIdToken(token);
                return new FirebaseIdentity(
                    decoded.getUid(), decoded.getEmail(), decoded.getName(), decoded.getPicture());
            } catch (Exception exception) {
                throw new InvalidIdentityTokenException(exception);
            }
        };
    }

    @Bean
    @ConditionalOnProperty(name = "firebase.enabled", havingValue = "false", matchIfMissing = true)
    IdentityTokenVerifier disabledIdentityTokenVerifier() {
        return token -> { throw new InvalidIdentityTokenException(); };
    }
}
