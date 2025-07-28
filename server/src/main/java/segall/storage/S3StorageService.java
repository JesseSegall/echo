package segall.storage;

import java.io.IOException;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;

@Service
public class S3StorageService implements StorageService {
    private final S3Client s3;
    private final String   bucket;

    public S3StorageService(S3Client s3, @Value("${aws.s3.bucket}") String bucket) {
        this.s3     = s3;
        this.bucket = bucket;
    }


    @Override
    public String upload(MultipartFile file) throws IOException {
        String key = UUID.randomUUID() + "_" + file.getOriginalFilename();
        return uploadWithKey(file, key);
    }


    public String upload(MultipartFile file, String folder, Long entityId) throws IOException {
        String key = String.format("%s/%d/songs/%s_%s",
                folder, entityId, UUID.randomUUID(), file.getOriginalFilename());
        return uploadWithKey(file, key);
    }
    @Override
    public String upload(MultipartFile file, String folder, Long entityId, String subfolder) throws IOException {
        String key = String.format("%s/%d/%s/%s_%s",
                folder, entityId, subfolder, UUID.randomUUID(), file.getOriginalFilename());
        return uploadWithKey(file, key);
    }


    private String uploadWithKey(MultipartFile file, String key) throws IOException {
        s3.putObject(PutObjectRequest.builder()
                        .bucket(bucket)
                        .key(key)
                        .contentType(file.getContentType())
                        .build(),
                RequestBody.fromBytes(file.getBytes()));

        return s3.utilities()
                .getUrl(GetUrlRequest.builder().bucket(bucket).key(key).build())
                .toExternalForm();
    }

    @Override
    public void delete(String key) {
        s3.deleteObject(DeleteObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .build());
    }
}