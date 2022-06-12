import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()
password = os.getenv("password")

db = mysql.connector.connect(user='test', password = password, host = 'localhost')
cursor = db.cursor()



cursor.execute("USE `simpleERP`")



# -------------------------部門資訊表----------------------


cursor.execute("""CREATE TABLE `department`(
	`departmentId` bigint auto_increment,
	`departmentName` varchar(255),
	PRIMARY KEY(`departmentId`),
	INDEX (departmentName)
);""")
db.commit()

# -------------------------部門主管表----------------------


cursor.execute("""CREATE TABLE `departmentManage`(
    `departmentId` bigint,
	`manager` bigint,
	INDEX (departmentId)
    );""")
db.commit()

# -------------------------部門工作者----------------------


cursor.execute("""CREATE TABLE `work`(
    `departmentId` bigint,
	`employeeId` bigint,
	INDEX (departmentId),
	INDEX (employeeId)
    );""")
db.commit()


# -------------------------使用者表---------------------------


cursor.execute("""CREATE TABLE `user`(
	`employeeId` bigint auto_increment,
	`name` varchar(255),
	`email`  varchar(255),
	`user`  varchar(255),
	`password`  varchar(255),
	`grad` varchar(255),
    `headPhoto` varchar(255),
    `signPhoto` varchar(255),
	PRIMARY KEY(employeeId),
	INDEX (name),
    INDEX (user),
	INDEX (grad)
    );""")
db.commit()


#已存在的表格新增新的欄位
# alter table `user` add `headPhoto` varchar(255) after grad;
# alter table `user` add `signPhoto` varchar(255) after `headPhoto`;


#砍掉已經存在的欄位
# alter table client drop column createTime;
# alter table client drop column updateTime;