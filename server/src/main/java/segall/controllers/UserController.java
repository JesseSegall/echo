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
        System.out.println("=== UPLOAD DEBUG ===");
        System.out.println("Path userId: " + userId);
        System.out.println("Path userId type: " + userId.getClass().getName());

        Integer userIdFromHeaders = getUserIdFromHeaders(headers);
        System.out.println("User ID from JWT: " + userIdFromHeaders);
        System.out.println("User ID from JWT type: " + (userIdFromHeaders != null ? userIdFromHeaders.getClass().getName() : "null"));

        if(userIdFromHeaders == null){
            System.out.println("User ID from headers is null - returning UNAUTHORIZED");
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        System.out.println("Comparing: " + userIdFromHeaders + " with " + userId.intValue());
        System.out.println("Are they equal? " + userIdFromHeaders.equals(userId.intValue()));

        if(!userIdFromHeaders.equals(userId.intValue())){
            System.out.println("User IDs don't match - returning FORBIDDEN");
            return new ResponseEntity<>(List.of("You do not have access"), HttpStatus.FORBIDDEN);
        }

        System.out.println("Authorization successful, proceeding with upload...");

        Result<Song> result = songService.addUserSong(file, userId, title);
        if (!result.isSuccess()) {
            return ResponseEntity.badRequest().body(result.getErrorMessages());
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(result.getpayload());
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

    @PutMapping("/{id}")
    public ResponseEntity<Object> update(@PathVariable int id, @RequestBody User user, @RequestHeader Map<String, String> headers){
        Integer userIdFromHeaders = getUserIdFromHeaders(headers);
        if(userIdFromHeaders == null){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        if (userIdFromHeaders != id) {
            return new ResponseEntity<>(
                    List.of("Cannot update another user’s profile"),
                    HttpStatus.FORBIDDEN
            );
        }
        if (id != user.getId()) {
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }
        Result<User> result = service.update(user);
        if(result.isSuccess()){
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
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
        System.out.println("=== JWT PARSING DEBUG ===");
        System.out.println("All headers: " + headers);

        String jwt = headers.get("authorization");
        System.out.println("JWT from 'authorization' header: '" + jwt + "'");

        if (jwt == null) {
            System.out.println("Trying 'Authorization' with capital A...");
            jwt = headers.get("Authorization");
            System.out.println("JWT from 'Authorization' header: '" + jwt + "'");
        }

        if (jwt == null || jwt.isEmpty()) {
            System.out.println("JWT is null or empty - returning null");
            return null;
        }

        // Check if JWT has Bearer prefix
        if (jwt.startsWith("Bearer ")) {
            System.out.println("JWT has 'Bearer ' prefix, removing it...");
            jwt = jwt.substring(7);
            System.out.println("JWT after removing Bearer: '" + jwt + "'");
        }

        System.out.println("JWT length: " + jwt.length());
        System.out.println("JWT starts with: " + jwt.substring(0, Math.min(20, jwt.length())));

        try {
            System.out.println("About to parse JWT with signing key...");
            System.out.println("Signing key is null? " + (secretSigningKey.getSigningKey() == null));

            Jws<Claims> parsedJwt = Jwts.parserBuilder()
                    .setSigningKey(secretSigningKey.getSigningKey())
                    .build()
                    .parseClaimsJws(jwt);

            System.out.println("JWT parsed successfully!");

            Claims claims = parsedJwt.getBody();
            System.out.println("All claims: " + claims);

            Object idClaim = claims.get("id");
            System.out.println("Raw ID claim: " + idClaim);
            System.out.println("ID claim type: " + (idClaim != null ? idClaim.getClass().getName() : "null"));

            Integer userId = (Integer) idClaim;
            System.out.println("Final user ID: " + userId);
            return userId;

        } catch (Exception ex) {
            System.out.println("JWT parsing failed with exception: " + ex.getClass().getName());
            System.out.println("Exception message: " + ex.getMessage());
            ex.printStackTrace();
            return null;
        }
    }

}
