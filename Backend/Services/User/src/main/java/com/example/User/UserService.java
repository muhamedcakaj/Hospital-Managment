package com.example.User;

import java.util.List;

public interface UserService {
     UserEntity findById(int id);
     List<UserEntity> findAll();
     UserEntity save(UserEntity userEntity);
     UserEntity updateUser(int id, UserEntity userEntity);
     void deleteById(int id);


}
