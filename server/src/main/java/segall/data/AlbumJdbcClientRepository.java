package segall.data;

import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;
import segall.data.mappers.AlbumMapper;
import segall.models.Album;

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
}
