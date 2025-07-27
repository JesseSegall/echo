package segall.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import segall.controllers.SecretSigningKey;

import java.util.Map;

@Component
public class JwtUtil {


    private final SecretSigningKey secretSigningKey;

    public JwtUtil(SecretSigningKey secretSigningKey) {
        this.secretSigningKey = secretSigningKey;
    }

    public Integer getUserIdFromHeaders(Map<String, String> headers) {
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