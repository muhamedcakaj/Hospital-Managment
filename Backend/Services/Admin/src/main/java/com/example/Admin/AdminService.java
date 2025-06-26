package com.example.Admin;

import com.example.Admin.Dto.*;

import java.util.List;

public interface AdminService {
    void createUser(CreateUserDTO dto);
    void createDoctor(CreateDoctorDTO dto);
    void updateUser(UpdateUserDTO dto);
    void updateDoctor(UpdateDoctorDTO dto);
    void deleteUser(int id);
    void deleteDoctor(int id);
    List<ReadUserDTO> getAllUsers();
    List<ReadDoctorDTO> getAllDoctors();

}
