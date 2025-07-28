package segall.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import segall.domain.CommentService;
import segall.domain.Result;
import segall.models.Comment;

import segall.utils.JwtUtil;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/comments")
public class CommentController {
    CommentService service;
    JwtUtil jwtUtil;

    public CommentController(CommentService service, JwtUtil jwtUtil) {
        this.service = service;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/{postId}")
    public ResponseEntity<Object> addComment(@PathVariable Long postId,
                                             @RequestBody Comment comment,
                                             @RequestHeader Map<String, String> headers) {

        Integer userIdFromHeaders = jwtUtil.getUserIdFromHeaders(headers);
        if(userIdFromHeaders == null){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }


        if(comment.getUserId() != null && !comment.getUserId().equals(userIdFromHeaders.longValue())) {
            return new ResponseEntity<>(List.of("Cannot create comment for another user"), HttpStatus.FORBIDDEN);
        }


        comment.setPostId(postId);
        comment.setCreatedAt(LocalDateTime.now());

        Result<Comment> result = service.addComment(comment);
        if(result.isSuccess()){
            return new ResponseEntity<>(result.getpayload(), HttpStatus.CREATED);
        }
        return new ResponseEntity<>(result.getErrorMessages(), HttpStatus.BAD_REQUEST);
    }

    @PutMapping("/{commentId}")
    public ResponseEntity<Object> updateComment(@PathVariable Long commentId, @RequestBody Comment comment,
                                             @RequestHeader Map<String, String> headers){
        Integer userIdFromHeaders = jwtUtil.getUserIdFromHeaders(headers);
        if(userIdFromHeaders == null){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }


        Comment existingComment = service.getCommentById(commentId);
        if(existingComment == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        if(!userIdFromHeaders.equals(existingComment.getUserId().intValue())){
            return new ResponseEntity<>(List.of("Cannot edit another user's post"), HttpStatus.FORBIDDEN);
        }


        comment.setCreatedAt(existingComment.getCreatedAt());

        Result<Comment> result = service.updateComment(comment);
        if(result.isSuccess()){
            return new ResponseEntity<>(result.getpayload(), HttpStatus.OK);
        }
        return new ResponseEntity<>(result.getErrorMessages(), HttpStatus.BAD_REQUEST);
    }

    @GetMapping("/{postId}")
    public ResponseEntity<Object> getAllCommentsByPostId(@PathVariable Long postId){
        List<Comment> comments = service.getCommentsByPostId(postId);
        return new ResponseEntity<>(comments, HttpStatus.OK);
    }

    @GetMapping("/count/{postId}")
    public ResponseEntity<Object> getCommentCountByPostId(@PathVariable Long postId){
        int commentCount = service.getCommentCountByPostId(postId);
        return new ResponseEntity<>(commentCount, HttpStatus.OK);
    }
}
