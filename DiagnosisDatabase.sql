create database Diagnosis
use Diagnosis

create table diagnosis(
id int primary key identity(1,1),
doctorId int not null,
userId int not null,
description varchar(255) not null,
diagnosis_date DATETIME NOT NULL
)