package com.example.User;

import com.example.User.ExceptionHandlers.InvalidUserInputException;
import com.example.User.ExceptionHandlers.UserNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserEntity findById(int id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User Not Found with id: " + id));
    }

    @Override
    public UserEntity save(UserEntity userEntity) {
        if (userEntity.getFirst_name().isEmpty() || userEntity.getSecond_name().isEmpty()) {
            throw new InvalidUserInputException("Please fill all the information!");
        }
        return userRepository.save(userEntity);
    }
    public UserEntity updateUser(int id, UserEntity userEntity) {
         UserEntity user = findById(id);

         if(userEntity.getFirst_name() != null ){
             user.setFirst_name(userEntity.getFirst_name());
         }
         if(userEntity.getSecond_name() != null ){
             user.setSecond_name(userEntity.getSecond_name());
         }
         return userRepository.save(user);
    }

    @Override
    public void deleteById(int id) {
        if (!userRepository.existsById(id)) {
            throw new UserNotFoundException("User Not Found with id: " + id);
        }
        userRepository.deleteById(id);
    }
}
