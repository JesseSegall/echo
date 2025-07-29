package segall.domain;

import at.favre.lib.crypto.bcrypt.BCrypt;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import segall.data.UserRepository;
import segall.models.User;
import segall.storage.StorageService;

import java.io.IOException;
import java.util.Set;
@Service
public class UserService {
    private final UserRepository repository;
    private final StorageService storageService;

    public UserService(UserRepository repository, StorageService storageService) {
        this.repository = repository;
        this.storageService = storageService;
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

    public Result<User> update(User user, MultipartFile profilePhoto){
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
            try{
                if (profilePhoto != null && !profilePhoto.isEmpty()) {
                    String photoUrl = storageService.upload(profilePhoto, "user", user.getId(), "photos");
                    user.setProfileImgUrl(photoUrl);
                }
            boolean updateSuccessful = repository.updateUser(user);

            if (updateSuccessful) {
                result.setpayload(user);
            } else {
                result.addErrorMessage("Failed to update user", ResultType.NOT_FOUND);

            }
            } catch (IOException e) {
                result.addErrorMessage("Could not upload photo: %s", ResultType.INVALID, e.getMessage());
            } catch (Exception e) {
                result.addErrorMessage("Could not update user: %s", ResultType.INVALID, e.getMessage());
            }
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

    public User findByUsername(String username){
        return repository.findByUsername(username);
    }

    public User findById(Long userId){
        return repository.findById(userId);
    }

}
