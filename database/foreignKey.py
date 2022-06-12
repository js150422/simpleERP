import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()
password = os.getenv("password")

db = mysql.connector.connect(user='test', password = password, host = 'localhost')
cursor = db.cursor()



cursor.execute("USE `simpleERP`")


# -------------------------管理者新增---------------------------

cursor.execute("""INSERT INTO `user` (`name`,`email`, `user`, `password`,`grad`) VALUES ('測試員', 'test@gmail.com', 'test','123456', 'staff');""")
db.commit()

# -------------------------user---------------------------
#ON DELETE CASCADE刪除同時修改
# ON UPDATE SET NULL 有update或刪除的時候關聯的地方改成null
# ON DELETE SET NULL 有update或刪除的時候關聯的地方改成null

cursor.execute("""ALTER TABLE `work` ADD FOREIGN KEY (`employeeId`) REFERENCES `user` (`employeeId`) ON DELETE CASCADE;""")
db.commit()

cursor.execute("""ALTER TABLE `work` ADD FOREIGN KEY (`departmentId`) REFERENCES `department` (`departmentId`) ON DELETE CASCADE;""")
db.commit()

cursor.execute("""ALTER TABLE `departmentManage` ADD FOREIGN KEY (`manager`) REFERENCES `user` (`employeeId`) ON DELETE CASCADE;""")
db.commit()

cursor.execute("""ALTER TABLE `departmentManage` ADD FOREIGN KEY (`departmentId`) REFERENCES `department` (`departmentId`) ON DELETE CASCADE;""")
db.commit()



# -------------------------簽核排除---------------------------
cursor.execute("""INSERT INTO `checkCondition` (`table`,`applicationType`, `column`, `conditionExclude`) VALUES ('sale', 'clientCreate', 'paymentTerm', '貨到後立即電匯支付');""")
db.commit()
cursor.execute("""INSERT INTO `checkCondition` (`table`,`applicationType`, `column`, `conditionExclude`) VALUES ('sale', 'clientCreate', 'paymentTerm', '貨到後立支付即期支票');""")
db.commit()
cursor.execute("""INSERT INTO `checkCondition` (`table`,`applicationType`, `column`, `conditionExclude`) VALUES ('sale', 'clientCreate', 'paymentTerm', '貨到後立支付現金');""")
db.commit()
cursor.execute("""INSERT INTO `checkCondition` (`table`,`applicationType`, `column`, `conditionExclude`) VALUES ('sale', 'clientCreate', 'paymentTerm', '預付20%訂金，貨到後立即電匯剩餘80%');""")
db.commit()
cursor.execute("""INSERT INTO `checkCondition` (`table`,`applicationType`, `column`, `conditionExclude`) VALUES ('sale', 'clientCreate', 'paymentTerm', '預付20%訂金，貨到後立即電匯剩餘80%');""")
db.commit()





# -------------------------新增FOREIGN KEY---------------------------
cursor.execute("""ALTER TABLE client ADD FOREIGN KEY (`applicationId`) REFERENCES `application` (`applicationId`) ON DELETE CASCADE ON UPDATE CASCADE;""")
db.commit()

cursor.execute("""ALTER TABLE saleOrder ADD FOREIGN KEY (`orderNumber`) REFERENCES `application` (`applicationId`) ON DELETE CASCADE ON UPDATE CASCADE;""")
db.commit()


cursor.execute("""ALTER TABLE `saleOrder` ADD FOREIGN KEY (`clientName`) REFERENCES `client` (`clientName`) ON DELETE CASCADE ON UPDATE CASCADE;""")
db.commit()



# saleOrderDetail 一樣新增application的applicationId為FK，因為orderNumber來自於application的applicationId
cursor.execute("""ALTER TABLE `saleOrderDetail` ADD FOREIGN KEY (`orderNumber`) REFERENCES `application` (`applicationId`) ON DELETE CASCADE ON UPDATE CASCADE;""")
db.commit()


cursor.execute("""ALTER TABLE purchaseOrder ADD FOREIGN KEY (`orderNumber`) REFERENCES `application` (`applicationId`) ON DELETE CASCADE ON UPDATE CASCADE;""")
db.commit()


cursor.execute("""ALTER TABLE `purchaseOrder` ADD FOREIGN KEY (`supplierName`) REFERENCES `supplier` (`supplierName`) ON DELETE CASCADE ON UPDATE CASCADE""")
db.commit()


# saleOrderDetail 一樣新增application的applicationId為FK，因為orderNumber來自於application的applicationId
cursor.execute("""ALTER TABLE `purchaseOrderDetail` ADD FOREIGN KEY (`orderNumber`) REFERENCES `application` (`applicationId`) ON DELETE CASCADE ON UPDATE CASCADE;""")
db.commit()


cursor.execute("""ALTER TABLE product ADD FOREIGN KEY (`applicationId`) REFERENCES `application` (`applicationId`) ON DELETE CASCADE ON UPDATE CASCADE;""")
db.commit()

cursor.execute("""ALTER TABLE supplier ADD FOREIGN KEY (`applicationId`) REFERENCES `application` (`applicationId`) ON DELETE CASCADE ON UPDATE CASCADE;""")
db.commit()


cursor.execute("""ALTER TABLE specialPrice ADD FOREIGN KEY (`applicationId`) REFERENCES `application` (`applicationId`) ON DELETE CASCADE ON UPDATE CASCADE;""")
db.commit()

cursor.execute("""ALTER TABLE `comment` ADD FOREIGN KEY (`applicationId`) REFERENCES `application` (`applicationId`) ON DELETE CASCADE ON UPDATE CASCADE;""")
db.commit()

# 這行有問題
# cursor.execute("""ALTER TABLE `checkCondition` ADD FOREIGN KEY (`applicationType`) REFERENCES `application` (`applicationType`) ON DELETE CASCADE ON UPDATE CASCADE;""")
# db.commit()

cursor.execute("""ALTER TABLE `client` ADD FOREIGN KEY (`repEmployee`) REFERENCES `user` (`name`) ON UPDATE SET NULL ON DELETE SET NULL;""")
db.commit()


cursor.execute("""ALTER TABLE `supplier` ADD FOREIGN KEY (`repEmployee`) REFERENCES `user` (`name`) ON UPDATE SET NULL ON DELETE SET NULL;""")
db.commit()



cursor.execute("""ALTER TABLE `saleOrder` ADD FOREIGN KEY (`repEmployee`) REFERENCES `user` (`name`) ON UPDATE SET NULL ON DELETE SET NULL;""")
db.commit()

cursor.execute("""ALTER TABLE `purchaseOrder` ADD FOREIGN KEY (`repEmployee`) REFERENCES `user` (`name`) ON UPDATE SET NULL ON DELETE SET NULL;""")
db.commit()


cursor.execute("""ALTER TABLE `productStock` ADD FOREIGN KEY (`productId`) REFERENCES `product` (`applicationId`) ON DELETE CASCADE ON UPDATE CASCADE;""")
db.commit()


#-----------------------------------------------------------懶得key的預備資料----------------------------------------------------------------------------



# INSERT INTO `user` (`name`,`email`, `user`, `password`,`grad`) VALUES ('測試員', 'test@gmail.com', 'test','123456', 'staff');
# INSERT INTO `user` (`name`,`email`, `user`, `password`,`grad`) VALUES ('apple', 'aaaa@gmail.com', 'aaaa','123456', 'staff');
# INSERT INTO `user` (`name`,`email`, `user`, `password`,`grad`) VALUES ('banana', 'bbbb@gmail.com', 'bbbb','123456', 'Section Manager');
# INSERT INTO `user` (`name`,`email`, `user`, `password`,`grad`) VALUES ('catcat', 'cccc@gmail.com', 'cccc','123456', 'staff');
# INSERT INTO `user` (`name`,`email`, `user`, `password`,`grad`) VALUES ('dogdog', 'dddd@gmail.com', 'dddd','123456', 'Section Manager');
# INSERT INTO `user` (`name`,`email`, `user`, `password`,`grad`) VALUES ('boss', 'boss@gmail.com', 'boss','123456', 'Boss');
# INSERT INTO `user` (`name`,`email`, `user`, `password`,`grad`) VALUES ('grape', 'gggg@gmail.com', 'gggg','123456', 'staff');

# INSERT INTO `work` (`departmentId`,`employeeId`) VALUES (3,1);
# INSERT INTO `work` (`departmentId`,`employeeId`) VALUES (4,2);
# INSERT INTO `work` (`departmentId`,`employeeId`) VALUES (4,3);
# INSERT INTO `work` (`departmentId`,`employeeId`) VALUES (2,4);
# INSERT INTO `work` (`departmentId`,`employeeId`) VALUES (2,5);
# INSERT INTO `work` (`departmentId`,`employeeId`) VALUES (3,6);
# INSERT INTO `work` (`departmentId`,`employeeId`) VALUES (5,4);

# INSERT INTO `department` (`departmentName`) VALUES ('sale');
# INSERT INTO `department` (`departmentName`) VALUES ('purchase');
# INSERT INTO `department` (`departmentName`) VALUES ('admin');


# INSERT INTO `departmentManage` (departmentId, manager) VALUES (2,5);





# alter table `application` change `id` `id` int;  把原本id的int屬性移除
# alter table `application` drop primary key;   砍掉相關fk
# ALTER TABLE `application` DROP COLUMN `id`;   刪除id這個欄位
# ALTER TABLE `application` ADD PRIMARY KEY (`applicationId`);  設定新的fk


# alter table `user` change `employeeId` `employeeId` int;
# alter table `user` drop primary key;
# ALTER TABLE `user` DROP COLUMN `employeeId`;
# ALTER TABLE `user` ADD PRIMARY KEY (`user`);