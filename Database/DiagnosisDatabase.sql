create database Diagnosis
use Diagnosis

drop table diagnosis

create table diagnosis(
id int primary key identity(1,1),
doctorId int not null,
doctorName varchar(15) not null,
doctorSurname varchar(15)not null,
userId int not null,
userName varchar(20) not null,
userSurname varchar(20)not null,
diagnosis varchar(255) not null,
diagnosis_date DATETIME NOT NULL
)