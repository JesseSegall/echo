package segall.controllers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.ListObjectsV2Request;
import software.amazon.awssdk.services.s3.model.ListObjectsV2Response;

@RestController
public class TestController {

    @Value("${spring.cloud.aws.credentials.access-key}")
    private String accessKey;

    @Value("${spring.cloud.aws.credentials.secret-key}")
    private String secretKey;

    @Value("${spring.cloud.aws.s3.bucket}")
    private String bucketName;

    @GetMapping("/test-aws")
    public ResponseEntity<String> testAWS() {
        try {
            AwsBasicCredentials awsCreds = AwsBasicCredentials.create(accessKey, secretKey);

            S3Client s3Client = S3Client.builder()
                    .region(Region.US_EAST_1)
                    .credentialsProvider(StaticCredentialsProvider.create(awsCreds))
                    .build();

            ListObjectsV2Request request = ListObjectsV2Request.builder()
                    .bucket(bucketName)
                    .maxKeys(1)
                    .build();

            ListObjectsV2Response response = s3Client.listObjectsV2(request);

            return ResponseEntity.ok("AWS S3 connection successful! Bucket: " + bucketName);

        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body("AWS S3 connection failed: " + e.getMessage());
        }
    }
}
