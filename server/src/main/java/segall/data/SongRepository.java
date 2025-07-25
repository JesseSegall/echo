package segall.data;

import segall.models.Song;

import java.util.List;

public interface SongRepository {
    List<Song> getSongsByBandId(Long bandId);
    List<Song> getSongsById(Long id);
}
