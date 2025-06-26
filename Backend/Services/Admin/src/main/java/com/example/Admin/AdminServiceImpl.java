package com.example.Admin;

import com.example.Admin.Dto.*;
import com.example.Doctor.ExceptionHandlers.InvalidUserInputException;
import org.springframework.cloud.stream.function.StreamBridge;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class AdminServiceImpl implements AdminService {

    private final RestTemplate restTemplate;
    private final String AUTH_SERVICE_URL = "http://host.docker.internal:8081/auth/";
    private final String USER_SERVICE_URL = "http://host.docker.internal:8080/users/";
    private final String DOCTOR_SERVICE_URL = "http://host.docker.internal:8082/doctors/";
    private final StreamBridge streamBridge;

    public AdminServiceImpl(StreamBridge streamBridge, RestTemplate restTemplate) {
        this.streamBridge = streamBridge;
        this.restTemplate = restTemplate;
    }

    public List<ReadUserDTO> getAllUsers() {
        AuthEntityDTO[] authUsers = restTemplate.getForObject(AUTH_SERVICE_URL + "admin/getAllUsers",AuthEntityDTO[].class);
        UserEntityDTO [] userDetails = restTemplate.getForObject(USER_SERVICE_URL + "getUsers", UserEntityDTO[].class);

        Map<Integer, UserEntityDTO> userMap = Arrays.stream(userDetails)
                .collect(Collectors.toMap(UserEntityDTO::getId, Function.identity()));

        List<ReadUserDTO> result = new ArrayList<>();
        for (AuthEntityDTO auth : authUsers) {
            UserEntityDTO detail = userMap.get(auth.getId());
            if (detail != null) {
                ReadUserDTO dto = new ReadUserDTO();
                dto.setId(auth.getId());
                dto.setEmail(auth.getEmail());
                dto.setRole(auth.getRole());
                dto.setFirst_name(detail.getFirst_name());
                dto.setSecond_name(detail.getSecond_name());
                dto.setConfirmationCode(auth.getConfirmationCode());
                result.add(dto);
            }
        }
        return result;
    }

    @Override
    public List<ReadDoctorDTO> getAllDoctors() {
        AuthEntityDTO[] authDoctors = restTemplate.getForObject(AUTH_SERVICE_URL + "/admin/getAllDoctors", AuthEntityDTO[].class);
        DoctorEntityDTO[] doctorDetails = restTemplate.getForObject(DOCTOR_SERVICE_URL + "/user", DoctorEntityDTO[].class);

        Map<Integer, DoctorEntityDTO> doctorMap = Arrays.stream(doctorDetails)
                .collect(Collectors.toMap(DoctorEntityDTO::getId, Function.identity()));

        List<ReadDoctorDTO> result = new ArrayList<>();
        for (AuthEntityDTO auth : authDoctors) {
            DoctorEntityDTO detail = doctorMap.get(auth.getId());
            if (detail != null) {
                ReadDoctorDTO dto = new ReadDoctorDTO();
                dto.setId(auth.getId());
                dto.setEmail(auth.getEmail());
                dto.setRole(auth.getRole());
                dto.setFirst_name(detail.getFirst_name());
                dto.setLast_name(detail.getLast_name());
                dto.setSpecialization(detail.getSpecialization());
                dto.setDescription(detail.getDescription());
                dto.setConfirmationCode(auth.getConfirmationCode());
                result.add(dto);
            }
        }
        return result;
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
        if(dto.getId()<=0 || dto.getFirstName().isEmpty() || dto.getLastName().isEmpty()
        ||dto.getDescription().isEmpty() || dto.getSpecialization().isEmpty()
        || dto.getEmail().isEmpty()||(dto.getEmailConfirmation()>=2||dto.getEmailConfirmation()<0)) {
            throw new InvalidUserInputException("Please fill all the necessary fields with correct values");
        }
        if(dto.getFirstName().length()>15||dto.getLastName().length()>15
                || dto.getSpecialization().length()>15){
            throw new InvalidUserInputException("Name or Surname or Specialization cannot be more than 15 characters");
        }

        if(dto.getEmail().length()>75){
            throw new InvalidUserInputException("Email cannot be more than 75 characters");
        }

        streamBridge.send("doctorAdminUpdate-out-0", dto);
    }

    @Override
    public void deleteUser(int id) {
        if(id<0){
            throw new InvalidUserInputException("Please enter a valid ID");
        }
        streamBridge.send("userAdminDelete-out-0", id);
    }

    @Override
    public void deleteDoctor(int id) {
        if(id<0){
            throw new InvalidUserInputException("Please enter a valid ID");
        }
        streamBridge.send("doctorAdminDelete-out-0", id);
    }

}
