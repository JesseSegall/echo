package segall.data;

import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;
import segall.models.Band;

@Repository
public class BandJdbcClientRepository implements BandRepository{
    private final JdbcClient jdbcClient;

    public BandJdbcClientRepository(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }

    @Override
    public Band create(Band band) {
        return null;
    }

    @Override
    public Band findById(Long bandId) {
        return null;
    }

    @Override
    public boolean updateBand(Band band) {
        return false;
    }

    @Override
    public boolean deleteById(Long bandId) {
        return false;
    }
}
