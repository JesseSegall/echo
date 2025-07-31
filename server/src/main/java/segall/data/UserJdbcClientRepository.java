package segall.data;

import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;
import segall.data.mappers.UserMapper;
import segall.models.User;

import java.util.List;
import java.util.Objects;

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
        user.setId(Objects.requireNonNull(keyHolder.getKey()).longValue());
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

    @Override
    public User findById(Long userId) {
        final String sql = "select * from `user` where id = ?";
        return jdbcClient.sql(sql).param(userId).query(User.class).optional().orElse(null);
    }

    @Override
    public List<User> searchUsers(String query, Long excludeUserId) {
        final String sql = """
            SELECT DISTINCT u.* FROM `user` u
            WHERE (u.username LIKE :query OR u.first_name LIKE :query OR u.last_name LIKE :query OR u.email LIKE :query)
            AND u.id != :excludeUserId
            AND u.id NOT IN (
                SELECT bm.user_id 
                FROM band_members bm 
                WHERE bm.role = 'owner'
            )
            ORDER BY u.username 
            LIMIT 20
            """;

        String searchPattern = "%" + query + "%";

        return jdbcClient.sql(sql)
                .param("query", searchPattern)
                .param("excludeUserId", excludeUserId != null ? excludeUserId : 0L)
                .query(User.class)
                .list();
    }

    @Override
    public boolean updateUser(User user) {
        final String sql = """
                UPDATE `user` set
                username = :username,
                password = :password,
                email =  :email,
                first_name = :first_name,
                last_name = :last_name,
                bio = :bio,
                city = :city,
                state = :state,
                zip_code = :zip_code,
                profile_img_url = :profile_img_url,
                instrument = :instrument
                WHERE `id` = :id;
                """;
        return jdbcClient.sql(sql)
                .param("username", user.getUsername())
                .param("password", user.getPassword())
                .param("email", user.getEmail())
                .param("first_name", user.getFirstName())
                .param("last_name", user.getLastName())
                .param("bio", user.getBio())
                .param("city", user.getCity())
                .param("state", user.getState())
                .param("zip_code", user.getZipCode())
                .param("profile_img_url", user.getProfileImgUrl())
                .param("instrument", user.getInstrument())
                .param("id", user.getId())
                .update() > 0;


    }
    // TODO: Add delete user
}
