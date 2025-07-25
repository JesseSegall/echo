package segall.data;

import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;
import segall.data.mappers.SongMapper;
import segall.models.Song;

import java.util.List;
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
}
