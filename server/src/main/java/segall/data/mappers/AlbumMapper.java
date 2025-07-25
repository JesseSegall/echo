package segall.data.mappers;

import org.springframework.jdbc.core.RowMapper;
import segall.models.Album;

import java.sql.ResultSet;
import java.sql.SQLException;

public class AlbumMapper implements RowMapper<Album> {
    @Override
    public Album mapRow(ResultSet rs, int rowNum) throws SQLException {
        Album album = new Album();
        album.setId(rs.getLong("id"));
        album.setBandId(rs.getLong("band_id"));
        album.setTitle(rs.getString("title"));
        album.setReleaseDate(rs.getDate("release_date").toLocalDate());
        album.setCoverUrl(rs.getString("cover_url"));
        album.setCoverKey(rs.getString("cover_key"));
        album.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
        return album;
    }
}
