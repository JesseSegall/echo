package segall.domain;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.springframework.stereotype.Service;
import segall.data.CommentJdbcClientRepository;
import segall.models.Comment;


import java.util.List;
import java.util.Set;


@Service
public class CommentService {
    private final CommentJdbcClientRepository repository;

    public CommentService(CommentJdbcClientRepository repository) {
        this.repository = repository;
    }
    public Result<Comment> addComment(Comment comment){
        Result<Comment> result = new Result<>();
        if (comment.getUserId() == null && comment.getBandId() == null) {
            result.addErrorMessage("A comment must be created by either a user or a band", ResultType.INVALID);
            return result;
        }

        if (comment.getUserId() != null && comment.getBandId() != null) {
            result.addErrorMessage("A comment cannot be created by both a user and a band", ResultType.INVALID);
            return result;
        }

        if(result.isSuccess()){
            Comment newComment = repository.addComment(comment);
            result.setpayload(newComment);
        }
        return result;
    }

    public Result<Comment> updateComment(Comment comment){
        Result<Comment> result = new Result<>();
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        Validator validator = factory.getValidator();
        Set<ConstraintViolation<Comment>> violations = validator.validate(comment);

        if (!violations.isEmpty()) {
            for (ConstraintViolation<Comment> violation : violations) {
                result.addErrorMessage(violation.getMessage(), ResultType.INVALID);
            }
        }

        if (result.isSuccess()){
            boolean updateSuccessful = repository.updateComment(comment);
            if(updateSuccessful){
                result.setpayload(comment);
            }
        }
        return result;
    }

    public List<Comment> getCommentsByPostId(Long postId){
        return repository.getCommentsByPostId(postId);
    }

    public List<Comment> getCommentsByBandId(Long bandId){
        return repository.getCommentsByBandId(bandId);
    }

    int getCommentCountByPostId(Long postId){
        return repository.getCommentCountByPostId(postId);
    }

    public boolean deleteCommentById(Long id){
        return repository.deleteCommentById(id);
    }

}
