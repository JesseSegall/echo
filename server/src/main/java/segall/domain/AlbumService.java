package segall.domain;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import segall.data.AlbumJdbcClientRepository;
import segall.models.Album;
import segall.storage.StorageService;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;

import java.io.IOException;
import java.time.LocalDate;
import java.util.Set;


@Service
public class AlbumService {
    private final AlbumJdbcClientRepository repository;
    private final StorageService storageService;
    private final Validator validator;

    public AlbumService(AlbumJdbcClientRepository repository, StorageService storageService, Validator validator) {
        this.repository = repository;
        this.storageService = storageService;
        this.validator = validator;
    }

    public Album getAlbumById(Long id) {
        return repository.findAlbumById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Album not found: " + id));
    }

    public Result<Album> addAlbum(MultipartFile cover,
                                  Long bandId,
                                  String title,
                                  LocalDate releaseDate) {
        Result<Album> result = new Result<>();


        Album toValidate = new Album();
        toValidate.setBandId(bandId);
        toValidate.setTitle(title);
        toValidate.setReleaseDate(releaseDate);


        Set<ConstraintViolation<Album>> violations = validator.validate(toValidate);
        for (ConstraintViolation<Album> v : violations) {
            result.addErrorMessage(v.getMessage(), ResultType.INVALID);
        }


        if (cover == null || cover.isEmpty()) {
            result.addErrorMessage("Cover image is required.", ResultType.INVALID);
        }


        if (result.isSuccess()) {
            try {

                String publicUrl = storageService.upload(cover);
                String key       = publicUrl.substring(publicUrl.lastIndexOf('/') + 1);

               
                Album album = new Album();
                album.setBandId(bandId);
                album.setTitle(title);
                album.setReleaseDate(releaseDate);
                album.setCoverKey(key);
                album.setCoverUrl(publicUrl);

                Album saved = repository.add(album);
                result.setpayload(saved);

            } catch (IOException ioe) {
                result.addErrorMessage(
                        "Could not upload cover: %s", ResultType.INVALID, ioe.getMessage());
            } catch (Exception ex) {
                result.addErrorMessage(
                        "Could not save album record: %s", ResultType.NOT_FOUND, ex.getMessage());
            }
        }

        return result;
    }
}
