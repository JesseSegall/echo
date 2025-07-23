package segall.controllers;

import io.jsonwebtoken.Jwts;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import segall.domain.Result;
import segall.domain.ResultType;
import segall.domain.UserService;
import segall.models.User;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = {"http://localhost:5173"})
public class UserController {
    UserService service;
    SecretSigningKey secretSigningKey;

    public UserController(UserService service, SecretSigningKey secretSigningKey) {
        this.service = service;
        this.secretSigningKey = secretSigningKey;
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

}
