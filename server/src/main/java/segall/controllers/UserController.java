package segall.controllers;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.SignatureException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import segall.domain.Result;
import segall.domain.ResultType;
import segall.domain.SongService;
import segall.domain.UserService;
import segall.models.Song;
import segall.models.User;


import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user")

public class UserController {
    UserService service;
    SongService songService;
    SecretSigningKey secretSigningKey;

    public UserController(UserService service, SecretSigningKey secretSigningKey, SongService songService) {
        this.service = service;
        this.secretSigningKey = secretSigningKey;
        this.songService = songService;
    }

    @PostMapping(value = "/{userId}/songs", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Object> uploadForUser(
            @PathVariable Long userId,
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestHeader Map<String, String> headers
    ) {


        Integer userIdFromHeaders = getUserIdFromHeaders(headers);


        if(userIdFromHeaders == null){

            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }


        if(!userIdFromHeaders.equals(userId.intValue())){

            return new ResponseEntity<>(List.of("You do not have access"), HttpStatus.FORBIDDEN);
        }



        Result<Song> result = songService.addUserSong(file, userId, title);
        if (!result.isSuccess()) {
            return ResponseEntity.badRequest().body(result.getErrorMessages());
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(result.getpayload());
    }

    @GetMapping("/{userId}/songs")
    public ResponseEntity<Object> getSongsByUserId(@PathVariable Long userId) {
        List<Song> songs = songService.getSongsByUserId(userId);
        return ResponseEntity.ok(songs);
    }



    @DeleteMapping("/songs/{songId}")
    public ResponseEntity<Object> deleteUserSong(@PathVariable Long songId, @RequestHeader Map<String, String> headers) {

        Integer userIdFromHeaders = getUserIdFromHeaders(headers);
        if(userIdFromHeaders == null){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        Result<Song> removed = songService.deleteById( songId);
        if (!removed.isSuccess()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(removed.getErrorMessages() );
        }
        return ResponseEntity.noContent().build();
    }


    @PostMapping
    public ResponseEntity<Object> create(@RequestBody User user){
        Result<User> result = service.create(user);
        if(result.isSuccess()){
            return new ResponseEntity<>(result.getpayload(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(result.getErrorMessages(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/authenticate")
    public ResponseEntity<Object> authenticate(@RequestBody User user){
        Result<User> result = service.authenticate(user.getEmail(), user.getPassword());

        if(result.isSuccess()){
            String jwt = Jwts.builder()
                    .claim("email", result.getpayload().getEmail())
                    .claim("id", result.getpayload().getId())
                    .signWith(secretSigningKey.getSigningKey())
                    .compact();
            Map<String, String> jwtMap = new HashMap<>();
            jwtMap.put("jwt", jwt);

            return new ResponseEntity<>(jwtMap, HttpStatus.OK);

        } else if (result.getResultType()== ResultType.NOT_FOUND) {
            return new ResponseEntity<>(result.getErrorMessages(), HttpStatus.NOT_FOUND);
        }else {
            return new ResponseEntity<>(result.getErrorMessages(), HttpStatus.UNAUTHORIZED);
        }
    }

    @GetMapping("/profile/{username}")
    public ResponseEntity<Object> getUserByUsername(@PathVariable String username){
        User user = service.findByUsername(username);
        if(user == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @PutMapping( "/{id}")
    public ResponseEntity<Object> update(
            @PathVariable Long id,
            @RequestBody User user,
            @RequestHeader Map<String, String> headers) {

        Integer userIdFromHeaders = getUserIdFromHeaders(headers);
        if(userIdFromHeaders == null){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        if (userIdFromHeaders.longValue() !=  id) {
            return new ResponseEntity<>(
                    List.of("Cannot update another user's profile"),
                    HttpStatus.FORBIDDEN
            );
        }
        if (!id.equals(user.getId())) {
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }

        Result<User> result = service.update(user, null);

        if(result.isSuccess()){
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(result.getErrorMessages(), HttpStatus.BAD_REQUEST);
    }


    @PutMapping(value = "/{id}/photo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Object> updatePhoto(
            @PathVariable Long id,
            @RequestParam("profilePhoto") MultipartFile profilePhoto,
            @RequestHeader Map<String, String> headers) {

        System.out.println("Photo endpoint hit - ID: " + id);
        System.out.println("File name: " + (profilePhoto != null ? profilePhoto.getOriginalFilename() : "null"));
        System.out.println("File size: " + (profilePhoto != null ? profilePhoto.getSize() : "null"));

        Integer userIdFromHeaders = getUserIdFromHeaders(headers);
        if(userIdFromHeaders == null){
            System.out.println("No user ID from headers");
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        if (userIdFromHeaders.longValue() !=  id) {
            System.out.println("User ID mismatch: " + userIdFromHeaders + " vs " + id);
            return new ResponseEntity<>(
                    List.of("Cannot update another user's profile"),
                    HttpStatus.FORBIDDEN
            );
        }

        // Get existing user
        User user = service.findById(id);
        if (user == null) {
            System.out.println("User not found: " + id);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        System.out.println("About to call service.update with photo");
        Result<User> result = service.update(user, profilePhoto);
        System.out.println("Service result success: " + result.isSuccess());

        if (!result.isSuccess()) {
            System.out.println("Error messages: " + result.getErrorMessages());
        }

        if(result.isSuccess()){
            return new ResponseEntity<>(result.getpayload(), HttpStatus.OK);
        }
        return new ResponseEntity<>(result.getErrorMessages(), HttpStatus.BAD_REQUEST);
    }

    @GetMapping("/{email}")
    public ResponseEntity<Object> getUserByEmail(@PathVariable String email){
        User user = service.findByEmail(email);
        if(user == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    private Integer getUserIdFromHeaders(Map<String, String> headers){
        String jwt = headers.get("authorization");

        if (jwt == null) {
            jwt = headers.get("Authorization");
        }

        if (jwt == null || jwt.isEmpty()) {
            return null;
        }


        if (jwt.startsWith("Bearer ")) {
            jwt = jwt.substring(7);
        }

        try {
            Jws<Claims> parsedJwt = Jwts.parserBuilder()
                    .setSigningKey(secretSigningKey.getSigningKey())
                    .build()
                    .parseClaimsJws(jwt);

            Claims claims = parsedJwt.getBody();
            Object idClaim = claims.get("id");
            return (Integer) idClaim;

        } catch (Exception ex) {
            return null;
        }
    }

}
