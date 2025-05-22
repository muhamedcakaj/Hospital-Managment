package com.example.Doctor;

import java.util.List;

public interface DoctorService {
    DoctorEntity findById(int id);
    DoctorEntity save(DoctorEntity doctor);
    DoctorEntity update(int id,DoctorEntity doctor);
    void delete(int id);
    List<DoctorEntity> getAll();

}
