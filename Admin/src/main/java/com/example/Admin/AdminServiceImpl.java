package com.example.Admin;

import com.example.Admin.Dto.CreateDoctorDTO;
import com.example.Admin.Dto.CreateUserDTO;
import com.example.Admin.Dto.UpdateDoctorDTO;
import com.example.Admin.Dto.UpdateUserDTO;
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
        streamBridge.send("userAdminCreated-out-0",dto);
    }

    @Override
    public void createDoctor(CreateDoctorDTO dto) {
        if(dto.getEmail().isEmpty() || dto.getPassword().isEmpty()
        || dto.getFirstName().isEmpty() || dto.getLastName().isEmpty()
        || dto.getDescription().isEmpty() || dto.getSpecialization().isEmpty()) {
            throw new InvalidUserInputException("Please fill all the necessary fields");
        }

        if(dto.getFirstName().length()>15||dto.getLastName().length()>15
        || dto.getSpecialization().length()>15){
            throw new InvalidUserInputException("Name or Surname or Specialization cannot be more than 15 characters");
        }

        if(dto.getEmail().length()>75){
            throw new InvalidUserInputException("Email cannot be more than 75 characters");
        }
        streamBridge.send("doctorAdminCreated-out-0",dto);
    }

    @Override
    public void updateUser(UpdateUserDTO dto) {
        if(dto.getId()<=0 || dto.getFirstName().isEmpty() || dto.getLastName().isEmpty()
        ||dto.getEmail().isEmpty()||(dto.getEmailConfirmation()>=2||dto.getEmailConfirmation()<0)){
            throw new InvalidUserInputException("Please fill all the necessary fields with correct values");
        }
        if(dto.getFirstName().length()>20||dto.getLastName().length()>20){
            throw new InvalidUserInputException("Name or Surname cannot be more than 20 characters");
        }
        if(dto.getEmail().length()>75){
            throw new InvalidUserInputException("Email cannot be more than 75 characters");
        }

        streamBridge.send("userAdminUpdate-out-0", dto);

    }

    @Override
    public void updateDoctor(UpdateDoctorDTO dto) {

    }

}
