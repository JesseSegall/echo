package segall.data;

import segall.models.User;

import java.util.List;

public interface UserRepository {
    User create(User user);
    User findByEmail(String email);
    User findByUsername(String username);
    User findById(Long userId);
    List<User> searchUsers(String query, Long excludeUserId);
    boolean updateUser(User user);
}
