create database if not exists data;

use data;
create table  if not exists users
(
id int auto_increment,
deadline varchar(11),
task varchar(100),
primary key(id)
);

show tables;

/*insert into users(task, deadline) values('run', '2022-03-01');*/

select*
from users;