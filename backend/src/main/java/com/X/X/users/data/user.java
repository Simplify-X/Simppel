package com.X.X.users.data;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="users",uniqueConstraints = { @UniqueConstraint(columnNames = { "email"})})
public class user {
    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private long userID;
    private String username;
    private String email;
    private String password;

    public user(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }
}
