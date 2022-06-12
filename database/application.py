import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()
password = os.getenv("password")

db = mysql.connector.connect(user='test', password = password, host = 'localhost')
cursor = db.cursor()



cursor.execute("USE `simpleERP`")

# -------------------------簽核List----------------------
cursor.execute("""CREATE TABLE `application`(
                `applicationId` varchar(255),
                `departmentId` bigint,
                `applicationType` varchar(255),
                `status` varchar(255),
                `station` varchar(255),
                `approveName-1st` varchar(255),
                `approveTime-1st` varchar(255),
                `approveName-2nd` varchar(255),
                `approveTime-2nd` varchar(255),
                `approveName-3th` varchar(255),
                `approveTime-3th` varchar(255),
                `turn` varchar(10),
                PRIMARY KEY(applicationId),
                INDEX (applicationType),
                INDEX (status)
                INDEX (turn)
            );""")
db.commit()



# -------------------------簽核意見表----------------------
# 一個簽核表可能不只有一個簽核意見所以不以applicationId當作PK
cursor.execute("""CREATE TABLE `comment`(
			`id` bigint auto_increment,
            `applicationId` varchar(255),
            `name` varchar(255),
            `commentText` MEDIUMTEXT,
            `commentTime` varchar(255),
            PRIMARY KEY(id),
            INDEX (applicationId),
            INDEX (name)
        );""")
db.commit()



# -------------------------簽核條件---------------------------


cursor.execute("""CREATE TABLE `checkCondition`(
            `applicationType` varchar(255),
            `column` varchar(255),
            `conditionExclude` varchar(255),
			INDEX (`applicationType`),
			INDEX (`column`),
            INDEX (`conditionExclude`)
        );""")
db.commit()






# 簽核條件直接入系統
# INSERT INTO `checkCondition` (`applicationType`, `column`, `conditionExclude`) VALUES ( 'clientCreate', 'paymentTerm', '貨到後立即電匯支付');
# INSERT INTO `checkCondition` (`applicationType`, `column`, `conditionExclude`) VALUES ( 'clientCreate', 'paymentTerm', '貨到後立支付即期支票');
# INSERT INTO `checkCondition` (`applicationType`, `column`, `conditionExclude`) VALUES ( 'clientCreate', 'paymentTerm', '貨到後立支付現金');
# INSERT INTO `checkCondition` (`applicationType`, `column`, `conditionExclude`) VALUES ( 'clientCreate', 'paymentTerm', '預付20%訂金，貨到後立即電匯剩餘80%');
# INSERT INTO `checkCondition` (`applicationType`, `column`, `conditionExclude`) VALUES ( 'clientCreate', 'paymentTerm', '預付20%訂金，貨到後立即電匯剩餘80%');
