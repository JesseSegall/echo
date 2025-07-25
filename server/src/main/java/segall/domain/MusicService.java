package segall.domain;
import segall.dto.AlbumWithTracks;
import segall.models.Album;
import segall.models.Song;

import java.util.List;


public class MusicService {
    private final AlbumService albumService;
    private final SongService songService;

    public MusicService(AlbumService albumService, SongService songService) {
        this.albumService = albumService;
        this.songService = songService;
    }

    public AlbumWithTracks getAlbumWithTracks(Long albumId){
        List<Song> tracks = songService.getSongsByAlbumId(albumId);
        Album album = albumService.getAlbumById(albumId);
        return new AlbumWithTracks(album, tracks);
    }
}
