package segall.storage;

import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

public interface StorageService {
    String upload(MultipartFile file) throws IOException;
    String upload(MultipartFile file, String folder, Long entityId) throws IOException;
    String upload(MultipartFile file, String folder, Long entityId, String subFolder) throws IOException;
    void delete(String key);
}