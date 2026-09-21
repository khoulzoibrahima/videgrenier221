package sn.vg221.media;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfiguration {
    @Bean
    CloudinarySettings cloudinarySettings(
        @Value("${cloudinary.cloud-name:}") String cloudName,
        @Value("${cloudinary.api-key:}") String apiKey,
        @Value("${cloudinary.api-secret:}") String apiSecret
    ) {
        return new CloudinarySettings(cloudName, apiKey, apiSecret);
    }

    @Bean
    Cloudinary cloudinary(CloudinarySettings settings) {
        return new Cloudinary(ObjectUtils.asMap(
            "cloud_name", settings.cloudName(),
            "api_key", settings.apiKey(),
            "api_secret", settings.apiSecret(),
            "secure", true
        ));
    }

    public record CloudinarySettings(String cloudName, String apiKey, String apiSecret) {}
}
