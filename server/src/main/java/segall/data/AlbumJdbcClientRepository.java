package segall.data;

import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;
import segall.data.mappers.AlbumMapper;
import segall.models.Album;

import java.util.Objects;
import java.util.Optional;

@Repository

public class AlbumJdbcClientRepository implements AlbumRepository{
    private final JdbcClient jdbcClient;

    public AlbumJdbcClientRepository(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }

    @Override
    public Optional<Album> findAlbumById(Long id) {
        final String sql = """
                select * from albums
                where id = ?;
                
                """;
        return jdbcClient.sql(sql)
                .param(id)
                .query(new AlbumMapper())
                .optional();

    }

    @Override
    public Album add(Album album) {
        final String sql = """
                insert into albums (band_id, title, release_date, cover_url, cover_key, created_at)
                values (:band_id, :title, :release_date, :cover_url, :cover_key, :created_at)
                """;
        KeyHolder keyHolder = new GeneratedKeyHolder();

        int rowsAffected = jdbcClient.sql(sql)
                .param("band_id", album.getBandId())
                .param("title", album.getTitle())
                .param("release_date", album.getReleaseDate())
                .param("cover_url", album.getCoverUrl())
                .param("cover_key", album.getCoverKey())
                .param("created_at", album.getCreatedAt())
                .update(keyHolder, "id");
        if(rowsAffected == 0){
            return null;
        }
        album.setId(Objects.requireNonNull(keyHolder.getKey()).longValue());
        return album;
    }
}
