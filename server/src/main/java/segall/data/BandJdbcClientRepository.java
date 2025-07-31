package segall.data;

import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;
import segall.models.Band;

import java.util.List;
import java.util.Objects;

@Repository
public class BandJdbcClientRepository implements BandRepository{
    private final JdbcClient jdbcClient;

    public BandJdbcClientRepository(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }

    @Override
    public Band create(Band band) {
        final String sql = """
                insert into band (name, band_img_url, genre, bio, city, state, zip_code, needs_new_member)
                values (:name, :band_img_url, :genre, :bio, :city, :state, :zip_code, :needs_new_member)
                """;
        KeyHolder keyHolder = new GeneratedKeyHolder();

        int rowsAffected =jdbcClient.sql(sql)
                .param("name", band.getName())
                .param("band_img_url", band.getBandImgUrl())
                .param("genre", band.getGenre())
                .param("bio", band.getBio())
                .param("city", band.getCity())
                .param("state", band.getState())
                .param("zip_code", band.getZipcode())
                .param("needs_new_member", band.getNeedsNewMember())
                .update(keyHolder, "id");
        if(rowsAffected == 0){
            return null;
        }
        band.setId(Objects.requireNonNull(keyHolder.getKey()).longValue());
        return band;
    }

    @Override
    public Band findById(Long bandId) {
        final String sql = """
                select * from band where id = ?
                """;
        return jdbcClient.sql(sql).param(bandId).query(Band.class).optional().orElse(null);
    }

    @Override
    public boolean updateBand(Band band) {
        final String sql = """
                update `band` set
                name = :name,
                band_img_url = :band_img_url,
                genre = :genre,
                bio = :bio,
                city = :city,
                state = :state,
                zip_code = :zip_code,
                needs_new_member = :needs_new_member
                where `id` = :id;
                """;
        return jdbcClient.sql(sql)
                .param("name", band.getName())
                .param("band_img_url", band.getBandImgUrl())
                .param("genre", band.getGenre())
                .param("bio", band.getBio())
                .param("city", band.getCity())
                .param("state", band.getState())
                .param("zip_code", band.getZipcode())
                .param("needs_new_member", band.getNeedsNewMember())
                .param("id", band.getId())
                .update()>0;
    }

    @Override
    public List<Band> getAllBands() {
        final String sql = """
                select * from band;
                """;
        return jdbcClient.sql(sql).query(Band.class).list();
    }

    @Override
    public boolean deleteById(Long bandId) {
        final String sql = """
                delete from band where id = ?
                """;
        return jdbcClient.sql(sql).param(bandId).update()>0;
    }
}
