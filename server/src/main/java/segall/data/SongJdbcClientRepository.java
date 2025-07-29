package segall.data;

import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;
import segall.data.mappers.SongMapper;
import segall.models.Song;

import java.util.List;
import java.util.Objects;

@Repository
public class SongJdbcClientRepository implements SongRepository{
    private final JdbcClient jdbcClient;

    public SongJdbcClientRepository(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }

    @Override
    public List<Song> getSongsByBandId(Long bandId) {
         final String sql = """
                select * from songs
                where band_id = ?;
                """;
        return jdbcClient.sql(sql)
                .param(bandId)
                .query(new SongMapper())
                .list();
    }

    @Override
    public List<Song> getSongsByAlbumId(Long albumId) {
        final String sql = """
                select * from songs
                where album_id = ?;
                """;
        return jdbcClient.sql(sql)
                .param(albumId)
                .query(new SongMapper())
                .list();
    }

    @Override
    public Song getSongById(Long id) {
        final String sql = """
                select * from songs
                where id = ?;
                """;
        return jdbcClient.sql(sql)
                .param(id)
                .query(new SongMapper())
                .optional()
                .orElse(null);
    }

    @Override
    public List<Song> getSongsByUserId(Long userId) {
        final String sql = """
                
                select * from songs where user_id = ?;
                
                """;
        return jdbcClient.sql(sql)
                .param(userId)
                .query(new SongMapper())
                .list();
    }

    @Override
    public Song add(Song song) {
        final String sql = """
                insert into songs (band_id, album_id,user_id, title,  file_key, file_url, created_at)
                values (:band_id, :album_id, :user_id, :title,  :file_key, :file_url, :created_at);
                """;

        KeyHolder keyHolder = new GeneratedKeyHolder();

        int rowsAffected = jdbcClient.sql(sql)
                .param("band_id", song.getBandId())
                .param("album_id", song.getAlbumId())
                .param("user_id", song.getUserId())
                .param("title", song.getTitle())
                .param("file_key", song.getFileKey())
                .param("file_url", song.getFileUrl())
                .param("created_at", song.getCreatedAt())
                .update(keyHolder, "id");
        if(rowsAffected == 0){
            return null;
        }
        song.setId(Objects.requireNonNull(keyHolder.getKey()).longValue());
        return song;
    }

    @Override
    public boolean deleteById(Long id) {
        final String sql = "delete from songs where id = ?;";

        return jdbcClient.sql(sql).param(id).update()>0;
    }
}
