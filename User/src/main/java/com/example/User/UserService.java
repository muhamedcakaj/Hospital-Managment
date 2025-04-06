package com.example.User;

public interface UserService {
     UserEntity findById(int id);
     UserEntity save(UserEntity userEntity);
     UserEntity updateUser(int id, UserEntity userEntity);
     void deleteById(int id);

}
