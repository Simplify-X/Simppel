package com.X.X.users.services;

import com.X.X.users.data.user;
import org.springframework.data.repository.CrudRepository;

public interface userRepo extends CrudRepository<user,Long> {
    user findByEmail(String email);
    user findByUsername(String username);
}
