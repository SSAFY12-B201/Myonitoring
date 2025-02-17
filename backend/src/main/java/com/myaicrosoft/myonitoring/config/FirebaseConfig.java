import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;

import com.google.firebase.FirebaseOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

@Configuration
public class FirebaseConfig {
    @Value("${FIREBASE_CONFIG_PATH}")
    private String firebaseConfigPath;

    @Bean
    public FirebaseApp initializeFirebaseApp() throws IOException {
        File configFile = new File(firebaseConfigPath);
        FileInputStream serviceAccount = new FileInputStream(configFile);

        FirebaseOptions options = FirebaseOptions.builder()
                .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                .build();


        return FirebaseApp.initializeApp(options);
    }

}