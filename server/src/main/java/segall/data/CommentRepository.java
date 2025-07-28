package segall.data;

import segall.models.Comment;

import java.util.List;

public interface CommentRepository {
    Comment addComment(Comment comment);
    Comment getCommentById(Long id);
    boolean updateComment(Comment comment);
    List<Comment> getCommentsByPostId(Long postId);
    List<Comment> getCommentsByUserId(Long userId);
    List<Comment> getCommentsByBandId(Long bandId);
    int getCommentCountByPostId(Long postId);
    boolean deleteCommentById(Long id);
}
