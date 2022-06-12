import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()
password = os.getenv("password")

db = mysql.connector.connect(user='test', password = password, host = 'localhost')
cursor = db.cursor()



cursor.execute("USE `simpleERP`")


# -------------------------供應商資料表---------------------------

cursor.execute("""CREATE TABLE `supplier`(
                `applicationId` varchar(255),
                `supplierName` varchar(255),
                `taxId` varchar(255),
                `supplierAddress` varchar(255),
                `supplierCapital` varchar(255),
                `contactName` varchar(255),
                `contactPersonTile` varchar(10),
                `contactPhone` varchar(255),
                `contactEmail` varchar(255),
                `paymentTerm` varchar(255),
                `repEmployee` varchar(255),
                `supplierNote`  varchar(255),
                PRIMARY KEY(applicationId),
                INDEX (supplierName),
                INDEX (taxId),
                INDEX (contactEmail),
                INDEX (repEmployee)
            );""")


#UNION ALL  兩個有同樣欄位的表可以上下連接



cursor.execute("""CREATE TABLE `purchaseOrderDetail`(
            `id` bigint auto_increment,
            `orderNumber` varchar(255),
            `productName` varchar(255),
            `productPrice` bigint,
            `OrderQuantity` bigint,
            PRIMARY KEY(id),
			INDEX (orderNumber),
            INDEX (productName),
			INDEX (productPrice),
            INDEX (OrderQuantity)
        );""")
db.commit()



cursor.execute("""CREATE TABLE `purchaseOrder`(
            `orderNumber` varchar(255),
            `receiptNumber` varchar(255),
            `supplierName` varchar(255),
            `stockInNumber` varchar(255),
            `taxId` varchar(255),
			`orderDate` varchar(255),
            `receiptDate` varchar(255),
            `stockInDate` varchar(255),
			`repEmployee` varchar(255),
			`paymentTerm` varchar(255),
			`contactName` varchar(255),
            `contactPersonTile` varchar(10),
			`contactPhone` varchar(255),
			`contactEmail` varchar(255),
			`supplierAddress` varchar(255),
            PRIMARY KEY(orderNumber),
            INDEX (receiptNumber),
			INDEX (supplierName),
            INDEX (stockInNumber),
			INDEX (orderDate),
            INDEX (receiptDate),
            INDEX (repEmployee)
        ); """)
db.commit()

