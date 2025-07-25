package segall.domain;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import segall.data.AlbumJdbcClientRepository;
import segall.models.Album;


@Service
public class AlbumService {
    private final AlbumJdbcClientRepository repository;

    public AlbumService(AlbumJdbcClientRepository repository) {
        this.repository = repository;
    }

    public Album getAlbumById(Long id) {
        return repository.findAlbumById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Album not found: " + id));
    }
}
