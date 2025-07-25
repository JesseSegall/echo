package segall.domain;

import org.springframework.stereotype.Service;
import segall.data.SongJdbcClientRepository;
import segall.models.Song;

import java.util.List;
@Service
public class SongService {
    private final SongJdbcClientRepository repository;

    public SongService(SongJdbcClientRepository repository) {
        this.repository = repository;
    }

    public List<Song> getSongsByBandId(Long bandId){
        return repository.getSongsByBandId(bandId);
    }

    public List<Song> getSongsByAlbumId(Long albumId){
        return repository.getSongsByAlbumId(albumId);
    }
}
