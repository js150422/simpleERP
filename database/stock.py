import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()
password = os.getenv("password")

db = mysql.connector.connect(user='test', password = password, host = 'localhost')
cursor = db.cursor()



cursor.execute("USE `simpleERP`")


# -------------------------產品資料表---------------------------


cursor.execute("""CREATE TABLE `productStock`(
            `id` bigint auto_increment,
            `productId` varchar(255),
            `applicationId` varchar(255),
			`changeDate` varchar(255),
			`Quantity` int,
			`reason` varchar(255),
            PRIMARY KEY(id),
			INDEX (productId),
			INDEX (applicationId),
            INDEX (changeDate),
            INDEX (reason)
        );""")
db.commit()