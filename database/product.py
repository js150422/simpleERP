import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()
password = os.getenv("password")

db = mysql.connector.connect(user='test', password = password, host = 'localhost')
cursor = db.cursor()



cursor.execute("USE `simpleERP`")


# -------------------------產品資料表---------------------------


cursor.execute("""CREATE TABLE `product`(
            `applicationId` varchar(255),
            `productName` varchar(255),
            `supplierName` varchar(255),
            `costPrice` MEDIUMINT,
            `salePrice` MEDIUMINT,
            `productUnit` varchar(255),
			`productDescription` MEDIUMTEXT,
            `productPig` varchar(255),
            PRIMARY KEY(applicationId),
            INDEX (productName),
			INDEX (costPrice),
            INDEX (salePrice),
            INDEX (productUnit),
            INDEX (supplierName)
        );""")
db.commit()


