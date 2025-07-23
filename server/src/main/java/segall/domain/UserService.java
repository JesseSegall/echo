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

    public Result<User> authenticate(String email, String password){
        Result<User> result = new Result<>();

        User user = repository.findByEmail(email);

        if(user == null){
            result.addErrorMessage("User not found", ResultType.NOT_FOUND);
            return result;
        }

        if(BCrypt.verifyer().verify(password.toCharArray(), user.getPassword()).verified){
            result.setpayload(user);
        }else{
            result.addErrorMessage("Incorrect Password", ResultType.INVALID);
        }

        return result;
    }

    public User findByEmail(String email){
        return repository.findByEmail(email);
    }


}
