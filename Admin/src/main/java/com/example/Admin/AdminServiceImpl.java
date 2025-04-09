package com.example.Admin;

import com.example.Admin.Dto.CreateDoctorDTO;
import com.example.Admin.Dto.CreateUserDTO;
import com.example.Doctor.ExceptionHandlers.InvalidUserInputException;
import org.springframework.cloud.stream.function.StreamBridge;
import org.springframework.stereotype.Service;

@Service
public class AdminServiceImpl implements AdminService {

    private final StreamBridge streamBridge;

    public AdminServiceImpl(StreamBridge streamBridge) {
        this.streamBridge = streamBridge;
    }

    @Override
    public void createUser(CreateUserDTO dto) {
        if(dto.getFirstName().isEmpty() || dto.getLastName().isEmpty()
                || dto.getEmail().isEmpty()||dto.getPassword().isEmpty()) {
            throw new InvalidUserInputException("Please fill all the necessary fields");
        }
        if(dto.getFirstName().length()>20||dto.getLastName().length()>20){
            throw new InvalidUserInputException("Name or Surname cannot be more than 20 characters");
        }
        if(dto.getEmail().length()>75){
            throw new InvalidUserInputException("Email cannot be more than 75 characters");
        }
        CreateUserDTO createUserDTO = new CreateUserDTO();
        createUserDTO.setFirstName(dto.getFirstName());
        createUserDTO.setLastName(dto.getLastName());
        createUserDTO.setEmail(dto.getEmail());
        createUserDTO.setPassword(dto.getPassword());

        streamBridge.send("userAdminCreated-out-0",createUserDTO);
    }

    @Override
    public void createDoctor(CreateDoctorDTO dto) {

    }
}
