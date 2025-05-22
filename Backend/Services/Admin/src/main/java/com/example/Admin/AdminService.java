package com.example.Admin;

import com.example.Admin.Dto.CreateDoctorDTO;
import com.example.Admin.Dto.CreateUserDTO;
import com.example.Admin.Dto.UpdateDoctorDTO;
import com.example.Admin.Dto.UpdateUserDTO;

public interface AdminService {
    void createUser(CreateUserDTO dto);
    void createDoctor(CreateDoctorDTO dto);
    void updateUser(UpdateUserDTO dto);
    void updateDoctor(UpdateDoctorDTO dto);
    void deleteUser(int id);
    void deleteDoctor(int id);

}
