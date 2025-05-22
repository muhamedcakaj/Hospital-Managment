create database Auth
use Auth

create table auth_table(
id int primary key identity(1,1),
email varchar(75) unique not null,
password varchar(12) not null,
role varchar (8) default('User') not null,
emailConfirmation int default(0),
confirmationCode varchar,
confirmationCodeExpiry DATETIME
)

drop table auth_table