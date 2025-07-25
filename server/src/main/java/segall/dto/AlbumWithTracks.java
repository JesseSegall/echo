package segall.dto;

import segall.models.Album;
import segall.models.Song;

import java.util.List;

public class AlbumWithTracks {
    private Album album;
    private List<Song> tracks;

    public AlbumWithTracks(Album album, List<Song> tracks) {
        this.album = album;
        this.tracks = tracks;
    }

    public Album getAlbum() {
        return album;
    }

    public List<Song> getTracks() {
        return tracks;
    }
}
