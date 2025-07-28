package segall.data;

import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;
import segall.models.Comment;

import java.util.List;
import java.util.Objects;

@Repository
public class CommentJdbcClientRepository implements CommentRepository{
    private final JdbcClient jdbcClient;

    public CommentJdbcClientRepository(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }

    @Override
    public Comment addComment(Comment comment) {
        final String sql = """
                insert into `comments` (post_id, user_id, band_id, body, created_at)
                values (:post_id, :user_id, :band_id, :body, :created_at)
                """;
        KeyHolder keyHolder = new GeneratedKeyHolder();

        int rowsAffected = jdbcClient.sql(sql)
                .param("post_id", comment.getPostId())
                .param("user_id", comment.getUserId())
                .param("band_id", comment.getBandId())
                .param("body", comment.getBody())
                .param("created_at", comment.getCreatedAt())
                .update(keyHolder, "id");

        if (rowsAffected == 0){
            return null;
        }
        comment.setId(Objects.requireNonNull(keyHolder.getKey()).longValue());
        return comment;
    }

    @Override
    public boolean updateComment(Comment comment) {
        final String sql = """
                update `comments` set
                post_id = :post_id,
                user_id = :user_id,
                band_id = :band_id,
                body = :body,
                created_at = :created_at
                where `id` = :id;
                """;
        return jdbcClient.sql(sql)
                .param("post_id", comment.getPostId())
                .param("user_id", comment.getUserId())
                .param("band_id", comment.getBandId())
                .param("body", comment.getBody())
                .param("created_at", comment.getCreatedAt())
                .param("id", comment.getId())
                .update() > 0;
    }

    @Override
    public List<Comment> getCommentsByPostId(Long postId) {
        final String sql = """
                select * from comments where post_id = ?;
                """;
        return jdbcClient.sql(sql).param(postId).query(Comment.class).list();
    }

    @Override
    public List<Comment> getCommentsByUserId(Long userId) {
        final String sql = """
                select * from comments where user_id = ?;
                """;
        return jdbcClient.sql(sql).param(userId).query(Comment.class).list();
    }

    @Override
    public List<Comment> getCommentsByBandId(Long bandId) {
        final String sql = """
                select * from comments where band_id = ?;
                """;
        return jdbcClient.sql(sql).param(bandId).query(Comment.class).list();
    }

    @Override
    public int getCommentCountByPostId(Long postId) {
        String sql = "SELECT COUNT(*) FROM comments WHERE post_id = ?";

        return jdbcClient.sql(sql)
                .param(postId)
                .query(Integer.class)
                .optional()
                .orElse(0);
    }

    @Override
    public boolean deleteCommentById(Long id) {
        final String sql = "delete from comments where id = ?";

        return jdbcClient.sql(sql).param(id).update()>0;
    }
}
