package segall.domain;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.springframework.stereotype.Service;
import segall.data.PostJdbcClientRepository;
import segall.models.Post;
import segall.models.User;

import java.util.List;
import java.util.Set;

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

    public Result<Post> updatePost(Post post){
        Result<Post> result = new Result<>();
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        Validator validator = factory.getValidator();
        Set<ConstraintViolation<Post>> violations = validator.validate(post);

        if (!violations.isEmpty()) {
            for (ConstraintViolation<Post> violation : violations) {
                result.addErrorMessage(violation.getMessage(), ResultType.INVALID);
            }
        }

        if (result.isSuccess()){
            boolean updateSuccessful = repository.updatePost(post);
            if(updateSuccessful){
                result.setpayload(post);
            }
        }
        return result;
    }

    public boolean DeletePostById(Long id){
        return repository.deletePostById(id);
    }

    public Post getPostById(Long postId){
        return repository.getPostById(postId);
    }
    public List<Post> getPostsByUserId(Long userId){
        return repository.getPostsByUserId(userId);
    }
}
