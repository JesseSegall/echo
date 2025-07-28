package segall.data;

import segall.models.Post;

import java.util.List;

public interface PostRepository {
    List<Post> getPostsByUserId(Long userId);
    List<Post> getPostsByBandId(Long bandId);
    Post getPostById(Long id);
    Post add(Post post);
    boolean deletePostById(Long id);
    boolean updatePost(Post post);
}
