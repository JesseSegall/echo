package segall.data;

import segall.models.Song;

import java.util.List;

public interface SongRepository {
    List<Song> getSongsByBandId(Long bandId);
    List<Song> getSongsByAlbumId(Long albumId);
    Song getSongById(Long id);
    List<Song> getSongsByUserId(Long userId);

    Song add(Song song);
    boolean deleteById(Long id);
}
