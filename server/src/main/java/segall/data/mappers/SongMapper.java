package segall.data.mappers;

import org.springframework.jdbc.core.RowMapper;
import segall.models.Song;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;

public class SongMapper implements RowMapper<Song> {
    @Override
    public Song mapRow(ResultSet rs, int rowNum) throws SQLException {
        Song song = new Song();
        song.setId(rs.getLong("id"));
        song.setBandId(rs.getLong("band_id"));
        song.setUserId(rs.getLong("user_id"));
        song.setAlbumId(rs.getLong("album_id"));
        song.setTitle(rs.getString("title"));
        song.setFileKey(rs.getString("file_key"));
        song.setFileUrl(rs.getString("file_url"));
        Timestamp ts = rs.getTimestamp("created_at");
        if (ts != null) {
            song.setCreatedAt(ts.toLocalDateTime());
        } else {
            song.setCreatedAt(null);
        }

        return song;
    }
}
