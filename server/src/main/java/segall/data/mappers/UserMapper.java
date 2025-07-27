package segall.data.mappers;

import org.springframework.jdbc.core.RowMapper;
import segall.models.User;

import java.sql.ResultSet;
import java.sql.SQLException;

public class UserMapper implements RowMapper<User> {
    @Override
    public User mapRow(ResultSet rs, int rowNum) throws SQLException {
        User user = new User();
        user.setId(rs.getLong("id"));
        user.setFirstName(rs.getString("first_name"));
        user.setLastName(rs.getString("last_name"));
        user.setCity(rs.getString("city"));
        user.setState(rs.getString("state"));
        user.setZipCode(rs.getString("zip_code"));
        user.setProfileImgUrl(rs.getString("profile_img_url"));
        user.setEmail(rs.getString("email"));
        user.setInstrument(rs.getString("instrument"));
        return user;
    }
}
