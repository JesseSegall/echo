package segall.data;

import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;
import segall.models.Post;

import java.util.List;
import java.util.Objects;

@Repository
public class PostJdbcClientRepository implements PostRepository{
    private final JdbcClient jdbcClient;


    public PostJdbcClientRepository(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;

    }

    @Override
    public List<Post> getPostsByUserId(Long userId) {
        final String sql = "select * from posts where user_id = ?";
        return jdbcClient.sql(sql)
                .param(userId)
                .query(Post.class)
                .list();
    }

    @Override
    public List<Post> getPostsByBandId(Long bandId) {
        final String sql = "select * from posts where band_id = ?";
        return jdbcClient.sql(sql)
                .param(bandId)
                .query(Post.class)
                .list();
    }

    @Override
    public Post getPostById(Long id) {
        final String sql = "select * from posts where id = ?";
        return jdbcClient.sql(sql)
                .param(id)
                .query(Post.class)
                .optional().orElse(null);
    }

    @Override
    public Post add(Post post) {
        final String sql = """
                insert into posts ( user_id, band_id, body, created_at)
                values ( :user_id, :band_id, :body, :created_at);
                """;
        KeyHolder keyHolder = new GeneratedKeyHolder();

        int rowsAffected = jdbcClient.sql(sql)
                .param("user_id", post.getUserId())
                .param("band_id", post.getBandId())
                .param("body", post.getBody())
                .param("created_at",  post.getCreatedAt())
                .update(keyHolder,"id");
        if(rowsAffected == 0){
            return null;
        }
        post.setId(Objects.requireNonNull(keyHolder.getKey()).longValue());
        return post;
    }

    @Override
    public boolean deletePostById(Long id) {
        final String sql = "delete from posts where id = ?";

        return jdbcClient.sql(sql).param(id).update()>0;
    }

    @Override
    public boolean updatePost(Post post) {
        final String sql = """
                update posts set
                user_id = :user_id,
                band_id = :band_id,
                body = :body,
                created_at = :created_at
                where `id` = :id;
                
                """;
        return jdbcClient.sql(sql)
                .param("user_id", post.getUserId())
                .param("band_id", post.getBandId())
                .param("body", post.getBody())
                .param("created_at", post.getCreatedAt())
                .param("id", post.getId())
                .update() > 0;
    }
}
