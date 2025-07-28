package segall.controllers;



import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import segall.domain.PostService;
import segall.domain.Result;
import segall.models.Post;
import segall.utils.JwtUtil;
import java.time.LocalDateTime;

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
        post.setCreatedAt( LocalDateTime.now());
        Result<Post> result = service.addPost(post);
        if(result.isSuccess()){
            return new ResponseEntity<>(result.getpayload(), HttpStatus.OK);
        }
        return new ResponseEntity<>(result.getErrorMessages(), HttpStatus.BAD_REQUEST);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Object> getAllPostsByUserId(@PathVariable Long userId){
        List<Post> posts = service.getPostsByUserId(userId);
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }

    @GetMapping("/{postId}")
    public ResponseEntity<Object> getPost(@PathVariable Long postId){
        Post post = service.getPostById(postId);
        if(post == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(post, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deletePostById(@PathVariable Long id, @RequestHeader Map<String, String> headers){
        Integer userIdFromHeaders = jwtUtil.getUserIdFromHeaders(headers);
        if(userIdFromHeaders == null){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        boolean deleted = service.DeletePostById(id);
        if(!deleted){
            return new ResponseEntity<>("No post with that Id was found", HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }
    @PutMapping("/{postId}")
    public ResponseEntity<Object> updatePost(@PathVariable Long postId, @RequestBody Post post,
                                             @RequestHeader Map<String, String> headers){
        Integer userIdFromHeaders = jwtUtil.getUserIdFromHeaders(headers);
        if(userIdFromHeaders == null){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }


        Post existingPost = service.getPostById(postId);
        if(existingPost == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        if(!userIdFromHeaders.equals(existingPost.getUserId().intValue())){
            return new ResponseEntity<>(List.of("Cannot edit another user's post"), HttpStatus.FORBIDDEN);
        }


        post.setCreatedAt(existingPost.getCreatedAt());

        Result<Post> result = service.updatePost(post);
        if(result.isSuccess()){
            return new ResponseEntity<>(result.getpayload(), HttpStatus.OK);
        }
        return new ResponseEntity<>(result.getErrorMessages(), HttpStatus.BAD_REQUEST);
    }


}
