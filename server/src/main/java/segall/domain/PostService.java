package segall.domain;

import org.springframework.stereotype.Service;
import segall.data.PostJdbcClientRepository;
import segall.models.Post;

@Service

public class PostService {
    private final PostJdbcClientRepository repository;

    public PostService(PostJdbcClientRepository repository) {
        this.repository = repository;
    }

    public Result<Post> addPost(Post post) {
        Result<Post> result = new Result<>();
        if (post.getUserId() == null && post.getBandId() == null) {
            result.addErrorMessage("A post must be created by either a user or a band", ResultType.INVALID);
            return result;
        }

        if (post.getUserId() != null && post.getBandId() != null) {
            result.addErrorMessage("A post cannot be created by both a user and a band", ResultType.INVALID);
            return result;
        }

        if(result.isSuccess()){
            Post newPost = repository.add(post);
            result.setpayload(newPost);
        }
        return result;
    }

    public Post getPostById(Long postId){
        return repository.getPostById(postId);
    }
}
