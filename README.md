Kemi zhvilluar një web aplikacion modern, që thjeshton ndjeshëm menaxhimin e takimeve, diagnozave dhe komunikimin mes mjekëve dhe pacientëve. Aplikacioni është ndërtuar me një frontend të fuqishëm në ReactJS dhe një backend të ndarë në mikroshërbime me Spring Boot , duke ndjekur praktikat më të mira të arkitekturës software.

-Roli i përdoruesve:

Pacienti:
* Cakton takime me mjekun
* Shikon diagnozat personale
* Ndjek statuset e takimeve të bëra
* Komunikon në kohë reale me mjekun
* Përditëson dhe menaxhon të dhënat e profilit
* Lajmërohet automatikisht kur krijohet një diagnozë e re për të ne email
* Merr njoftim kur ndryshohet statusi i një terminit të tij ne email
  
Doktori:
* Shkruan diagnoza për pacientët
* Menaxhon terminet (ndryshim statusesh)
* Ka akses në historikun e diagnozave të tij
* Komunikon me pacientët
* Përditëson të dhënat e profilit

-Frontend
* ReactJS për ndërfaqe dinamike dhe moderne
* TailwindCSS për stilizim të pastër, responsive dhe të shpejtë
* Axios për komunikim me backend API-të

-Backend & Arkitektura
* Spring Boot për çdo microservice (auth, user, doctor, appointment, diagnosis, chat, admin, etj.)
* Spring Security + JWT + Refresh Tokens për autentikim dhe autorizim
* Event-Driven Architecture për komunikim asinkron mes shërbimeve (me RabbitMQ)
* WebSocket për komunikim në kohë reale ndërmjet pacientëve dhe mjekëve
* Spring Cloud Gateway & Eureka Server për discovery, routing dhe load balancing
* SQL Server për të dhëna relacionale (p.sh. users, doctors, appointments)
* MongoDBpër të dhëna jo-relacionale (p.sh. mesazhet në chat)
* Docker për containerizim të të gjithë sistemit dhe vendosje më të lehtë në cloud/VPS




<img width="800" alt="Login" src="https://github.com/user-attachments/assets/f348a510-dcfe-4807-a6f2-01e81a3b39d0" />
<img width="799" alt="Register" src="https://github.com/user-attachments/assets/77c53def-b407-4d56-a593-c07a27205bb7" />
<img width="789" alt="EmailVerification" src="https://github.com/user-attachments/assets/e49a05ef-1985-4a4a-9e78-e6e5efc5e068" />
<img width="948" alt="UserDashboard" src="https://github.com/user-attachments/assets/3078f4f2-75ab-4d5c-8242-1f914d605ed6" />
<img width="944" alt="UserCreateAppointment" src="https://github.com/user-attachments/assets/ba57a00d-a484-40a6-b081-9c3c53dba09c" />
<img width="946" alt="UserMyDiagnoses" src="https://github.com/user-attachments/assets/fa38f6a9-60ad-45c6-90ef-f8862e1bc023" />
<img width="947" alt="UserDiagnoseDetails" src="https://github.com/user-attachments/assets/751ba7c3-c0a6-4fb2-ae30-09a0db5f3103" />
<img width="946" alt="UserMyAppointments" src="https://github.com/user-attachments/assets/1f525d87-3879-4d21-b5a3-aff57b80070e" />
<img width="947" alt="UserAppointmentsDetail" src="https://github.com/user-attachments/assets/50fea38a-2f91-4807-89df-390e704e4fc2" />
<img width="953" alt="UserChat" src="https://github.com/user-attachments/assets/183cbf12-b233-42ad-bb67-c47fccdc1a9d" />
<img width="949" alt="UserMessage" src="https://github.com/user-attachments/assets/7422a900-3473-42b8-92a1-916e30fd5171" />
<img width="956" alt="UserProfile" src="https://github.com/user-attachments/assets/51cf51c5-a612-4049-b119-f509f6dfcb5b" />
<img width="959" alt="UserLogOut" src="https://github.com/user-attachments/assets/4419d162-e1cb-4feb-9b2d-091f984f63ad" />
<img width="948" alt="DoctorDashboard" src="https://github.com/user-attachments/assets/8fe18dea-71b5-4e39-8893-557c5d7f97ad" />
<img width="949" alt="DoctorCreateDiagnosis" src="https://github.com/user-attachments/assets/e6340537-4d7d-4c38-850d-7448397a0093" />
<img width="947" alt="DoctorMyAppointments" src="https://github.com/user-attachments/assets/a9d9cf17-47e0-4254-85d1-30bbbfba6440" />
<img width="950" alt="DoctorAppointmentsDetail" src="https://github.com/user-attachments/assets/342b2837-c32e-40ab-b727-d17663b2488d" />
<img width="953" alt="DoctorChat" src="https://github.com/user-attachments/assets/e99bd862-0319-41b8-a57d-4e080a520a1a" />
<img width="960" alt="DoctorMessage" src="https://github.com/user-attachments/assets/27a49ad8-4f05-42a9-97d7-922f9b6f36cd" />
<img width="960" alt="AdminRead" src="https://github.com/user-attachments/assets/6996a54b-c8ed-4ae5-bcf6-0f5357159fd3" />
<img width="960" alt="AdminCreate" src="https://github.com/user-attachments/assets/6d66af12-0109-45f4-978f-fd3d9cf4c46f" />
<img width="960" alt="DoctorEdit" src="https://github.com/user-attachments/assets/cb07991e-837e-4393-9d96-7814a1f77994" />
<img width="960" alt="DoctorDelete" src="https://github.com/user-attachments/assets/28c38700-a8f5-400d-a7d9-6dc57af25cc1" />



