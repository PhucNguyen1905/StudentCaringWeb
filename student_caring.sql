CREATE SCHEMA student_caring;
USE student_caring;

CREATE TABLE STUDENT(
	ID INT NOT NULL,
    Fname VARCHAR(15),
    Lname VARCHAR(15),
    EduProgram VARCHAR(15),
    YearOfAdmission INT,
    Edu_mail VARCHAR(30),
    Password VARCHAR(30),
    DayOfBirth DATE,
    Street VARCHAR(50),
    ApartmentNumber INT,
    province VARCHAR(15),
    sex VARCHAR(15),
    learningStatus VARCHAR(15)
);

CREATE TABLE SUBJECT(
	ID VARCHAR(15) NOT NULL,
    name VARCHAR(50),
    credit INT,
    major VARCHAR(50),
    midtermPoINT FLOAT,
    lastTermPoINT FLOAT,
    AssPoINT FLOAT
);

CREATE TABLE CLASS(
	ID VARCHAR(15),
    subjectID VARCHAR(15)
);

CREATE TABLE PARENTS(
	StudentID INT,
    name VARCHAR(50),
    address VARCHAR(50),
    relationship VARCHAR(15)
);

CREATE TABLE FACULTY(
	ID INT NOT NULL,
    falName VARCHAR(50)
);

CREATE TABLE SCHOOL_STAFF(
	ID INT NOT NULL,
    LName VARCHAR(15),
    Fname VARCHAR(15),
    Edu_mail VARCHAR(30),
    Password VARCHAR(30)
);

CREATE TABLE FACULTY_STAFF(
		ID INT NOT NULL,
        FACULTY_ID INT NOT NULL
);

CREATE TABLE REQUEST(
	ID INT NOT NULL,
    studentID INT,
    faculty_staffID INT,
    content VARCHAR(500),
    Type VARCHAR(30)
);

CREATE TABLE CONSULTANT(
	ID INT NOT NULL
);

CREATE TABLE EVENT(
	ID INT NOT NULL,
    Stime DATE NOT NULL,
    Etime DATE NOT NULL
);

CREATE TABLE STUDY(
	StudentID INT,
    ClassID VARCHAR(15),
    SubjectID VARCHAR(15),
    LastTermPoint FLOAT, 
    MidTermPoint FLOAT,
    AssPoint FLOAT 
);

CREATE TABLE REGISTER (
    StudentID INT,
    Event_ID INT
);

CREATE TABLE CHAT (
    StudentID INT, 
    Consultant_ID INT
);

CREATE TABLE Consulting_field (
    Consultant_ID INT,
    Consulting_field VARCHAR(20)
);

CREATE TABLE Online_time (
    Consultant_ID INT, 
    STIME TIME,
    ETIME TIME,
    ONLINEDAY DATE
);

CREATE TABLE Contents (
    ID INT, 
    Consultant_ID INT,
    time TIME,
    Day DATE,
    QNA VARCHAR(350),
    QoA char(1)
);

CREATE TABLE Staff_phone (
    ID INT ,
    Phone CHAR(15)
);

CREATE TABLE Parent_phone (
    StudentID INT,
    Name VARCHAR(30), 
    phone CHAR(15)
);

CREATE TABLE Student_phone (
    StudentID INT, 
    PHONE CHAR(15)
);

CREATE TABLE Student_Private_Mail (
    StudentID INT, 
    mail VARCHAR(50)
);

CREATE TABLE TimeTable (
    SubjectID VARCHAR(15), 
    ClassID VARCHAR(15), 
    STUWeek INT, 
    Day_OF_WEEK VARCHAR(9), 
    SPERIOD INT, 
    EPERIOD INT
);

-- ALTER Table start from here
ALTER TABLE STUDENT
    ADD PRIMARY KEY (ID),
    ADD CHECK (learningStatus = 'Tạm dừng' or learningStatus = 'Đình chỉ' or learningStatus = 'Đang học');

ALTER TABLE SUBJECT
    ADD PRIMARY KEY (ID);

ALTER TABLE CLASS
    ADD PRIMARY KEY (ID, subjectID),
    ADD FOREIGN KEY (subjectID) REFERENCES subject(ID);

ALTER TABLE PARENTS
    ADD PRIMARY KEY (studentID, name),
    ADD FOREIGN KEY (studentID) REFERENCES student(ID);

ALTER TABLE FACULTY
    ADD PRIMARY KEY (ID);

ALTER TABLE SCHOOL_STAFF
    ADD PRIMARY KEY (ID);

ALTER Table FACULTY_STAFF
    ADD PRIMARY KEY (ID),
    ADD FOREIGN KEY (ID) REFERENCES school_staff(ID),
    ADD FOREIGN KEY (Faculty_ID) REFERENCES Faculty(ID)
    ON DELETE CASCADE ON UPDATE CASCADE;
    
ALTER TABLE REQUEST
    ADD PRIMARY KEY (ID),
    ADD CHECK (type = 'Print Document' or type = 'Review Examination' or type = 'Reduce Tuition'),
    MODIFY ID INT(11) NOT NULL AUTO_INCREMENT,
    ADD FOREIGN KEY (studentID) REFERENCES student(id),
    ADD FOREIGN KEY (faculty_staffID) REFERENCES faculty_staff(ID);

ALTER TABLE CONSULTANT
    ADD PRIMARY KEY (ID),
    ADD FOREIGN KEY (ID) REFERENCES school_staff(ID);

ALTER TABLE EVENT
    ADD PRIMARY KEY (ID),
    MODIFY ID INT(11) NOT NULL AUTO_INCREMENT,
    ADD CHECK (Etime > Stime),
    ADD (FACULTYSTAFF_ID INT NOT NULL),
    ADD FOREIGN KEY (FacultyStaff_ID) REFERENCES Faculty_Staff (ID)
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE STUDY
    ADD PRIMARY KEY (studentID, classid, subjectid),
    ADD FOREIGN KEY (studentid) REFERENCES student(id),
    ADD FOREIGN KEY (classid, subjectid) REFERENCES class(id, subjectid),
    ADD CHECK (lastTermPoint >= 0 and lastTermPoint <= 10),
    ADD CHECK (midTermPoint >=0 and midTermPoint <=10), 
    ADD CHECK (assPoint >=0 and assPoint <=10);


ALTER TABLE STUDENT
	ADD QC_Fstaff_ID INT,
    ADD Scholarship_staff_ID INT,
	ADD Amount_of_money INT,
    ADD Faculty_ID INT not null,
    ADD FOREIGN KEY (QC_Fstaff_ID) REFERENCES faculty_staff(ID),
    ADD FOREIGN KEY (Scholarship_staff_ID) REFERENCES faculty_staff(ID),
    ADD FOREIGN KEY (Faculty_ID) REFERENCES faculty(ID);


ALTER TABLE REGISTER
    ADD PRIMARY KEY (StudentID,Event_ID),
    ADD FOREIGN KEY (StudentID) REFERENCES Student(ID)
    ON DELETE CASCADE ON UPDATE CASCADE,
    ADD FOREIGN KEY (Event_ID) REFERENCES Event(ID)
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE CHAT
    ADD PRIMARY KEY (StudentID, Consultant_ID),
    ADD FOREIGN KEY (Consultant_ID) REFERENCES Consultant(ID)
    ON DELETE CASCADE ON UPDATE CASCADE,
    ADD FOREIGN KEY (StudentID) REFERENCES Student(ID)
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE Consulting_field
    ADD PRIMARY KEY (Consultant_ID, Consulting_field),
    ADD FOREIGN KEY (Consultant_ID) REFERENCES Consultant(ID)
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE Online_time
    ADD PRIMARY KEY (Consultant_ID, STime,ETIME,ONLINEDAY),
    ADD FOREIGN KEY (Consultant_ID) REFERENCES Consultant(ID)
    ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CHECK (TIMESTAMPDIFF(MINUTE,TIMESTAMP(ONLINEDAY,STIME),TIMESTAMP(ONLINEDAY,ETIME))>=360);

ALTER TABLE CONTENTS
    ADD PRIMARY KEY (ID,Consultant_ID,time,QNA,QOA),
    ADD FOREIGN KEY (ID,Consultant_ID) REFERENCES Chat(StudentID,Consultant_ID)
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE Staff_phone
    ADD PRIMARY KEY( ID,Phone),
    ADD FOREIGN KEY (ID) REFERENCES School_staff(ID)
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE Student_phone
    ADD PRIMARY KEY (StudentID, phone),
    ADD FOREIGN KEY (StudentID) REFERENCES Student(ID)
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE Student_Private_Mail
    ADD PRIMARY KEY (StudentID, mail),
    ADD FOREIGN KEY (StudentID) REFERENCES Student(ID)
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE Parent_phone
    ADD PRIMARY KEY(StudentID, Name, phone),
    ADD FOREIGN KEY (StudentID, Name) REFERENCES Parents(StudentID, Name)
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE TimeTable
    ADD PRIMARY KEY (SubjectID, classID, STUWeek, Day_OF_WEEK, SPERIOD,EPERIOD),
    ADD FOREIGN KEY (SubjectID,ClassID) REFERENCES Class(SubjectID,ID)
    ON DELETE CASCADE ON UPDATE CASCADE,
    ADD Check (SPERIOD > 2 AND EPERIOD<= 13 AND SPERIOD<EPERIOD);