package segall.domain;

import at.favre.lib.crypto.bcrypt.BCrypt;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import segall.data.UserRepository;
import segall.models.User;

import java.util.Set;
@Service
public class UserService {
    UserRepository repository;

    public UserService(UserRepository repository) {
        this.repository = repository;
    }

    public Result<User> create(User user){
        Result<User> result = new Result<>();
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        Validator validator = factory.getValidator();
        Set<ConstraintViolation<User>> violations = validator.validate(user);

        if (!violations.isEmpty()) {
            for (ConstraintViolation<User> violation : violations) {
                result.addErrorMessage(violation.getMessage(), ResultType.INVALID);
            }
        }

        if (result.isSuccess()) {
            String hashedPassword = BCrypt.withDefaults().hashToString(12,user.getPassword().toCharArray());
            user.setPassword(hashedPassword);
            User created = repository.create(user);
            result.setpayload(created);
        }

        return result;

    }
}
