package segall.data;

import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;
import segall.models.BandMember;

import java.time.LocalDateTime;
import java.util.List;
@Repository
public class BandMemberJdbcClientRepository implements BandMemberRepository{
    public BandMemberJdbcClientRepository(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }

    private final JdbcClient jdbcClient;
    @Override
    public BandMember addBandMember(BandMember bandMember) {
        final String sql = """
                insert into band_members (band_id, user_id, role)
                values (:band_id, :user_id, :role)
                """;

        int rowsAffected = jdbcClient.sql(sql)
                .param("band_id", bandMember.getBandId())
                .param("user_id", bandMember.getUserId())
                .param("role", bandMember.getRole())
                .update();
        if(rowsAffected > 0){
            bandMember.setJoinedAt(LocalDateTime.now());
            return bandMember;
        }else{
            return null;
        }

    }

    @Override
    public List<BandMember> findAllMembersByBandId(Long bandId) {
        final String sql = """
                select * from band_members where band_id = ?
                """;
        return jdbcClient.sql(sql).param(bandId).query(BandMember.class).list();
    }

    @Override
    public boolean removeMember(Long bandId, Long userId) {
        final String sql = "delete from band_members where band_id = ? and user_id = ?";
        return jdbcClient.sql(sql).param(bandId).param(userId).update()>0;
    }
}
