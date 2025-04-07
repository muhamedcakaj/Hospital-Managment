package com.example.User;

import jakarta.persistence.*;


@Entity
@Table(name="user_table")

public class UserEntity {
    @Id
    private int id;

    @Column(nullable = false, length = 20)
    private String first_name;

    @Column(nullable = false, length = 20)
    private String second_name;

    public int getId() {
        return id;
    }

    public String getFirst_name() {
        return first_name;
    }

    public void setFirst_name(String first_name) {
        this.first_name = first_name;
    }

    public String getSecond_name() {
        return second_name;
    }

    public void setSecond_name(String second_name) {
        this.second_name = second_name;
    }
}
