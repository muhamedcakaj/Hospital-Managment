use Userr

create table user_table(
id int primary key,
first_name varchar(20) not null,
second_name varchar(20) not null,
specialization varchar (15) null,
description varchar (255) null
)

drop table user_table