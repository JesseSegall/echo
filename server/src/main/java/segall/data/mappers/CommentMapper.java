package segall.data.mappers;

import org.springframework.jdbc.core.RowMapper;
import segall.models.Comment;

import java.sql.ResultSet;
import java.sql.SQLException;

public class CommentMapper implements RowMapper<Comment> {
    @Override
    public Comment mapRow(ResultSet rs, int rowNum) throws SQLException {

        Comment comment = new Comment();

        comment.setId(rs.getLong("id"));
        comment.setPostId(rs.getLong("post_id"));
        comment.setUserId(rs.getLong("user_id"));
        comment.setBandId(rs.getLong("band_id"));
        comment.setBody(rs.getString("body"));
        comment.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());

        String userName = rs.getString("user_name");
        String bandName = rs.getString("band_name");

        if (userName != null) {
            comment.setAuthorName(userName);
            comment.setAuthorImageUrl(rs.getString("user_img"));
            comment.setAuthorType("user");
        } else if (bandName != null) {
            comment.setAuthorName(bandName);
            comment.setAuthorImageUrl(rs.getString("band_img"));
            comment.setAuthorType("band");
        }

        return comment;
    }
}

