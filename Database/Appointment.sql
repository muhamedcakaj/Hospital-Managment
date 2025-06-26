create database Appointment 
use Appointment

drop table appointment

create table appointment(
id int primary key identity(1,1),
doctorId int not null,
doctorName varchar(15)not null,
doctorSurname varchar(15)not null,
userId int not null,
userEmail varchar(75) not null,
userName varchar(20)not null,
userSurname varchar(20)not null,
localDate date not null,
localTime time not null,
AppointemntStatus varchar(12) default 'Pending'
)