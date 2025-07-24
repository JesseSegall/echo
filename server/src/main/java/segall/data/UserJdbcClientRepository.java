package segall.data;

import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;
import segall.data.mappers.UserMapper;
import segall.models.User;
@Repository

public class UserJdbcClientRepository implements UserRepository{
    private final JdbcClient jdbcClient;

    public UserJdbcClientRepository(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }

    @Override
    public User create(User user) {
        final String sql = """
                insert into `user` (username, `password`, first_name, last_name, bio, state, city,profile_img_url, zip_code, email, instrument)
                values (:username, :password, :first_name, :last_name,:bio, :state, :city,:profile_img_url, :zip_code, :email, :instrument);
                """;

        KeyHolder keyHolder = new GeneratedKeyHolder();

        int rowsAffected = jdbcClient.sql(sql)
                .param("username", user.getUsername())
                .param("password", user.getPassword())
                .param("first_name", user.getFirstName())
                .param("last_name", user.getLastName())
                .param("bio", user.getBio())
                .param("state", user.getState())
                .param("city", user.getCity())
                .param("profile_img_url", user.getProfileImgUrl())
                .param("zip_code", user.getZipCode())
                .param("email", user.getEmail())
                .param("instrument", user.getInstrument())
                .update(keyHolder, "id");

        if(rowsAffected==0){
            return null;
        }
        user.setId(keyHolder.getKey().intValue());
        return user;
    }

    @Override
    public User findByEmail(String email) {
        final String sql = """
                select * from `user` where email = :email;
                """;
        return jdbcClient.sql(sql)
                .param("email", email)
                .query(User.class)
                .optional().orElse(null);
    }

    @Override
    public User findByUsername(String username) {
        final String sql = """
                select * from `user` where username = :username;
                """;
        return jdbcClient.sql(sql)
                .param("username", username)
                .query(User.class)
                .optional().orElse(null);
    }
}
