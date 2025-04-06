package com.example.Doctor;

public interface DoctorService {
    DoctorEntity findById(int id);
    DoctorEntity save(DoctorEntity doctor);
    DoctorEntity update(int id,DoctorEntity doctor);
    void delete(int id);

}
