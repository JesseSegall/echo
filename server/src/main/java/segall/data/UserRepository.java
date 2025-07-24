package segall.data;

import segall.models.User;

public interface UserRepository {
    User create(User user);
    User findByEmail(String email);
    User findByUsername(String username);

    boolean updateUser(User user);
}
