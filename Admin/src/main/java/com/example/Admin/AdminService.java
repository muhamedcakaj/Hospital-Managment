package com.example.Admin;

import com.example.Admin.Dto.CreateDoctorDTO;
import com.example.Admin.Dto.CreateUserDTO;

public interface AdminService {
    void createUser(CreateUserDTO dto);
    void createDoctor(CreateDoctorDTO dto);
}
