create database Doctor
use Doctor

create table doctor(
id int primary key not null,
first_name varchar(15) not null,
last_name varchar(15) not null,
specialization varchar(15) not null,
description varchar(255) not null,
)