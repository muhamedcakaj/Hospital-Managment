use Auth

create table refresh_token(
id int primary key identity(1,1),
userId int not null,
refreshToken varchar(255) not null
)

drop table refresh_token