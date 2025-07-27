package segall.controllers;



import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import segall.domain.PostService;
import segall.domain.Result;
import segall.models.Post;
import segall.utils.JwtUtil;

import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/posts")
public class PostController {
    PostService service;
    JwtUtil jwtUtil;

    public PostController(PostService service, JwtUtil jwtUtil) {
        this.service = service;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/user/{userId}")
    public ResponseEntity<Object> createUserPost(@PathVariable Long userId, @RequestBody Post post,
                                                 @RequestHeader Map<String, String> headers){
        Integer userIdFromHeaders = jwtUtil.getUserIdFromHeaders(headers);
        if(userIdFromHeaders == null){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        if (userIdFromHeaders.longValue() !=  userId) {
            return new ResponseEntity<>(
                    List.of("Cannot upload a post to another user's profile"),
                    HttpStatus.FORBIDDEN
            );
        }

        Result<Post> result = service.addPost(post);
        if(result.isSuccess()){
            return new ResponseEntity<>(result.getpayload(), HttpStatus.OK);
        }
        return new ResponseEntity<>(result.getErrorMessages(), HttpStatus.BAD_REQUEST);
    }

    @GetMapping("/{postId}")
    public ResponseEntity<Object> getPost(@PathVariable Long postId){
        Post post = service.getPostById(postId);
        if(post == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(post, HttpStatus.OK);
    }



}
