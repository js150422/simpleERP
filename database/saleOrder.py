import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()
password = os.getenv("password")

db = mysql.connector.connect(user='test', password = password, host = 'localhost')
cursor = db.cursor()



cursor.execute("USE `simpleERP`")

# -------------------------客戶資料表----------------------

cursor.execute("""CREATE TABLE `client`(
                `applicationId` varchar(255),
                `clientName` varchar(255),
                `taxId` varchar(255),
                `clientAddress` varchar(255),
                `clientCapital` varchar(255),
                `contactName` varchar(255),
                `contactPersonTile` varchar(10),
                `contactPhone` varchar(255),
                `contactEmail` varchar(255),
                `paymentTerm` varchar(255),
                `clientCredit` varchar(255),
                `repEmployee` varchar(255),
                `clientNote`  varchar(255),
                PRIMARY KEY(applicationId),
                INDEX (clientName),
                INDEX (taxId),
                INDEX (contactEmail),
                INDEX (repEmployee)
            );""")
db.commit()

# -------------------------訂單明細表---------------------------

cursor.execute("""CREATE TABLE `saleOrderDetail`(
            `id` bigint auto_increment,
            `orderNumber` varchar(255),
            `productName` varchar(255),
            `productPrice` bigint,
            `OrderQuantity` bigint,
            PRIMARY KEY(id),
            INDEX (productName),
			INDEX (orderNumber),
			INDEX (productPrice),
            INDEX (OrderQuantity)
        );""")
db.commit()


# -------------------------訂單表---------------------------
cursor.execute("""CREATE TABLE `saleOrder`(
            `orderNumber` varchar(255),
            `deliveryNumber` varchar(255),
            `clientName` varchar(255),
            `taxId` varchar(255),
			`orderDate` varchar(255),
            `deliveryDate` varchar(255),
			`repEmployee` varchar(255),
			`paymentTerm` varchar(255),
			`clientCredit` varchar(255),
			`contactName` varchar(255),
            `contactPersonTile` varchar(10),
			`contactPhone` varchar(255),
			`contactEmail` varchar(255),
			`clientAddress` varchar(255),
            PRIMARY KEY(orderNumber),
            INDEX (deliveryNumber),
			INDEX (clientName),
			INDEX (orderDate),
            INDEX (deliveryDate),
            INDEX (repEmployee)
        );""")
db.commit()



cursor.execute("""CREATE TABLE `specialPrice`(
            `applicationId` varchar(255),
            `clientId` varchar(255),
            `productId` varchar(255),
            `specialPrice` MEDIUMINT,
			`specialDescription` MEDIUMTEXT,
            `version` MEDIUMINT,
            PRIMARY KEY(applicationId),
            INDEX (clientId),
            INDEX (productId),
			INDEX (specialPrice),
            INDEX (version)
        );""")
db.commit()