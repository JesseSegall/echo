package segall.controllers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.HeadBucketRequest;

@RestController
@RequestMapping("/api/test")
public class TestController {

    private final S3Client s3;
    private final String   bucketName;

    public TestController(S3Client s3,
                          @Value("${aws.s3.bucket}") String bucketName) {
        this.s3         = s3;
        this.bucketName = bucketName;
    }

    @GetMapping("/s3")
    public ResponseEntity<String> testS3() {
        try {

            s3.headBucket(HeadBucketRequest.builder()
                    .bucket(bucketName)
                    .build());
            return ResponseEntity.ok(
                    "S3 is reachable and bucket '" + bucketName + "' exists"
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("S3 test failed: " + e.getMessage());
        }
    }
}
