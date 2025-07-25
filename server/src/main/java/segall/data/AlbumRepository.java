package segall.data;

import segall.models.Album;

import java.util.Optional;

public interface AlbumRepository {
    Optional<Album> findAlbumById(Long id);
}
