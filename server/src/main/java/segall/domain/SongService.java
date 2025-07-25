package segall.domain;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import segall.data.SongJdbcClientRepository;
import segall.models.Song;
import segall.storage.StorageService;

import java.io.IOException;
import java.util.List;
import java.util.Set;

@Service
public class SongService {
    private final SongJdbcClientRepository repository;
    private final StorageService storageService;

    private final Validator validator;

    public Result<Song> addBandSong(MultipartFile file,
                                    Long bandId,
                                    Long albumId,
                                    String title
                                    ) {
        Result<Song> result = new Result<>();

        Song toValidate = new Song();
        toValidate.setBandId(bandId);
        toValidate.setAlbumId(albumId);
        toValidate.setTitle(title);


        Set<ConstraintViolation<Song>> violations = validator.validate(toValidate);
        for (var v : violations) {
            result.addErrorMessage(v.getMessage(), ResultType.INVALID);
        }

        if (file == null || file.isEmpty()) {
            result.addErrorMessage("Audio file is required.", ResultType.INVALID);
        }

        if (result.isSuccess()) {
            try {
                String publicUrl = storageService.upload(file, "band", bandId);
                String key       = publicUrl.substring(publicUrl.lastIndexOf('/') + 1);

                Song song = new Song();
                song.setBandId(bandId);
                song.setAlbumId(albumId);
                song.setTitle(title);

                song.setFileKey(key);
                song.setFileUrl(publicUrl);

                Song saved = repository.add(song);
                result.setpayload(saved);

            } catch (IOException ioe) {
                result.addErrorMessage(
                        "Could not upload file: %s", ResultType.INVALID, ioe.getMessage());
            } catch (Exception ex) {
                result.addErrorMessage(
                        "Could not save song record: %s", ResultType.NOT_FOUND, ex.getMessage());
            }
        }

        return result;
    }

    public Result<Song> addUserSong(MultipartFile file,
                                    Long userId,
                                    String title) {
        Result<Song> result = new Result<>();

        Song toValidate = new Song();
        toValidate.setUserId(userId);
        toValidate.setTitle(title);


        Set<ConstraintViolation<Song>> violations = validator.validate(toValidate);
        for (var v : violations) {
            result.addErrorMessage(v.getMessage(), ResultType.INVALID);
        }

        if (file == null || file.isEmpty()) {
            result.addErrorMessage("Audio file is required.", ResultType.INVALID);
        }

        if (result.isSuccess()) {
            try {
                String publicUrl = storageService.upload(file, "user", userId);
                String key       = publicUrl.substring(publicUrl.lastIndexOf('/') + 1);

                Song song = new Song();
                song.setUserId(userId);
                song.setTitle(title);
                song.setFileKey(key);
                song.setFileUrl(publicUrl);

                Song saved = repository.add(song);
                result.setpayload(saved);

            } catch (IOException ioe) {
                result.addErrorMessage(
                        "Could not upload file: %s", ResultType.INVALID, ioe.getMessage());
            } catch (Exception ex) {
                result.addErrorMessage(
                        "Could not save song record: %s", ResultType.NOT_FOUND, ex.getMessage());
            }
        }

        return result;
    }

    public SongService(SongJdbcClientRepository repository, StorageService storageService, Validator validator) {
        this.repository = repository;
        this.storageService = storageService;
        this.validator = validator;
    }

    public List<Song> getSongsByBandId(Long bandId){
        return repository.getSongsByBandId(bandId);
    }

    public List<Song> getSongsByAlbumId(Long albumId){
        return repository.getSongsByAlbumId(albumId);
    }

    public Song getSongById(Long id){
        return repository.getSongById(id);
    }
}
