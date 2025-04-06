package com.example.Doctor;

import com.example.Doctor.ExceptionHandlers.InvalidUserInputException;
import com.example.Doctor.ExceptionHandlers.UserNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DoctorServiceImpl implements DoctorService {

    private final DoctorRepository doctorRepository;

    @Autowired
    public DoctorServiceImpl(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    @Override
    public DoctorEntity findById(int id) {
        return doctorRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("Doctor Not Found with id: " + id));
    }

    @Override
    public DoctorEntity save(DoctorEntity doctor) {
        if (doctor.getFirst_name().isEmpty() || doctor.getLast_name().isEmpty()) {
            throw new InvalidUserInputException("Please fill all the information!");
        }
        return doctorRepository.save(doctor);
    }

    @Override
    public DoctorEntity update(int id, DoctorEntity doctor) {
        DoctorEntity doctorEntity = findById(id);

        if(doctor.getFirst_name() != null ){
            doctorEntity.setFirst_name(doctor.getFirst_name());
        }
        if(doctor.getLast_name() != null ){
            doctorEntity.setLast_name(doctor.getLast_name());
        }
        if(doctor.getDescription() != null ){
            doctorEntity.setDescription(doctor.getDescription());
        }
        if (doctor.getSpecialization() != null ){
            doctorEntity.setSpecialization(doctor.getSpecialization());
        }

        return doctorRepository.save(doctorEntity);
    }

    @Override
    public void delete(int id) {
        if(!this.doctorRepository.existsById(id)){
            throw new UserNotFoundException("Doctor Not Found with id: " + id);
        }
        this.doctorRepository.deleteById(id);
    }
}
