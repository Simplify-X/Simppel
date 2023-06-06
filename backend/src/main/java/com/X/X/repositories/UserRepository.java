package com.X.X.repositories;

import com.X.X.domains.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface UserRepository extends CrudRepository<User, UUID> {
    User findByEmail(String email);
    User findByUsername(String username);
    User findByUserId(UUID userId);
    User findByAccountId(UUID accountId);

    @Query("SELECT u FROM User u WHERE u.accountId = :accountId AND u.isLinkedToTeamGroup = true")
    List<User> findAllByAccountIdAndAccountRoleNot(UUID accountId);

    @Query("SELECT u FROM User u WHERE u.userActive = false")
    List<User> findInactiveUser();

    List<User> findAll();



}
