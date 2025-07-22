package segall.data;

import segall.models.User;

public interface UserRepository {
    User create(User user);
}
