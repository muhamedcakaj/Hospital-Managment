create database Appointment 
use Appointment

create table appointment(
id int primary key identity(1,1),
doctorId int not null,
userId int not null,
localDate date not null,
localTime time not null,
AppointemntStatus varchar(12) default 'Pending'
)