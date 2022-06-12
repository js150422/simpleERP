from model.pool import pool
from mysql.connector import errors


class ReceiptModel:
    def searchSingleReceiptDB(self,station,applicationId):
        try:
            db = pool.get_connection()
            cursor = db.cursor(dictionary=True)
            sql= """SELECT
                `application`.`applicationId`,`application`.`status`,
                `application`.`applicationType`,`application`.`station`,
                `application`.`approveName-1st`,`application`.`approveTime-1st`,
                `application`.`approveName-2nd`,`application`.`approveTime-2nd`,
                `application`.`approveName-3th`,`application`.`approveTime-3th`,
                `purchaseOrder`.`supplierName`,`purchaseOrder`.`taxId`,
                `purchaseOrder`.`orderDate`,`purchaseOrder`.`receiptDate`,
                `purchaseOrder`.`repEmployee`,`purchaseOrder`.`paymentTerm`,
                `purchaseOrder`.`contactName`,`purchaseOrder`.`contactPhone`,
                `purchaseOrder`.`contactEmail`,`purchaseOrder`.`supplierAddress`,
                `department`.`departmentName`,
                (SELECT GROUP_CONCAT(name,commentTime,commentText) FROM comment  GROUP BY applicationId HAVING applicationId = application.`applicationId`)As comment,
                GROUP_CONCAT(`productStock`.`productId`,',',product.productName,',',`productStock`.`Quantity`,',',`productStock`.`reason`) AS purchaseOrderDetail
                FROM `productStock`
                INNER JOIN `product` ON `productStock`.`productId` = `product`.`applicationId`
                INNER JOIN `application` ON `application`.`applicationId` = `productStock`.`applicationId`
                INNER JOIN `purchaseOrder` ON `purchaseOrder`.`receiptNumber` = `productStock`.`applicationId`
                INNER JOIN `department` ON `department`.`departmentId`= `application`.`departmentId` """
            if station!='':
                    sql=sql+'WHERE `application`.`station` = '+"'"+station+"'"+' AND `application`.`applicationId` = '+"'"+applicationId+"'"
            else:
                    sql=sql+'WHERE `application`.`applicationId` = '+"'"+applicationId+"'"
            sql = sql + ' GROUP BY `application`.`applicationId` '
            cursor.execute(sql)
            result = cursor.fetchall()
            db.commit()

            if result == []:
                # 還沒有入過庫存數量的會使用這個式子
                sql="""SELECT
                    `application`.`applicationId`,`application`.`status`,
                    `application`.`applicationType`,`application`.`station`,
                    `application`.`approveName-1st`,`application`.`approveTime-1st`,
                    `application`.`approveName-2nd`,`application`.`approveTime-2nd`,
                    `application`.`approveName-3th`,`application`.`approveTime-3th`,
                    `purchaseOrder`.`supplierName`,`purchaseOrder`.`taxId`,
                    `purchaseOrder`.`orderDate`,`purchaseOrder`.`receiptDate`,
                    `purchaseOrder`.`repEmployee`,`purchaseOrder`.`paymentTerm`,
                    `purchaseOrder`.`contactName`,`purchaseOrder`.`contactPhone`,
                    `purchaseOrder`.`contactEmail`,`purchaseOrder`.`supplierAddress`,
                    `department`.`departmentName`,
                    (SELECT GROUP_CONCAT(name,commentTime,commentText) FROM comment  GROUP BY applicationId HAVING applicationId = application.`applicationId`)As comment,
                    (SELECT GROUP_CONCAT(CONCAT(product.applicationId,','),CONCAT(purchaseOrderDetail.productName,','),CONCAT(purchaseOrderDetail.OrderQuantity,','),CONCAT(purchaseOrderDetail.productPrice is null))
                    FROM `purchaseOrderDetail`
                    INNER JOIN `product` ON `product`.`productName`=`purchaseOrderDetail`.`productName`
                    GROUP BY `orderNumber`
                    HAVING `orderNumber` = `purchaseOrder`.`orderNumber`)
                    As `purchaseOrderDetail`
                    FROM `application`
                    INNER JOIN `purchaseOrder` ON `application`.`applicationId`=`purchaseOrder`.`receiptNumber`
                    INNER JOIN `purchaseOrderDetail` ON `purchaseOrder`.`orderNumber`=`purchaseOrderDetail`.`orderNumber`
                    INNER JOIN `product` ON `product`.`productName`=`purchaseOrderDetail`.`productName`
                    INNER JOIN `department` ON `department`.`departmentId`= `application`.`departmentId` """
                if station!='':
                    sql=sql+'WHERE `application`.`station` = '+"'"+station+"'"+' AND `application`.`applicationId` = '+"'"+applicationId+"'"
                else:
                    sql=sql+'WHERE `application`.`applicationId` = '+"'"+applicationId+"'"
                sql = sql + ' GROUP BY `application`.`applicationId` '
                cursor.execute(sql)

                result = cursor.fetchall()
                db.commit()

            return result
        except errors.Error as e:
                print('error',e)
        finally:
                cursor.close()
                db.close()

    def conditionSearchReceipt(self,applicationId,status,taxId,ODS,ODE,RDS,RDE,supplierName,page):
        # 搜尋出貨單的時候，搜尋條件沒包含出貨數量情形，可以連productStock
        try:
            db = pool.get_connection()
            cursor = db.cursor(dictionary=True)
            sql= """SELECT `application`.`applicationId`,
            `application`.`status`,`application`.`station`,
            `application`.`applicationType`,`purchaseOrder`.`supplierName`,
            `purchaseOrder`.`taxId`,`purchaseOrder`.`orderDate`,
            `purchaseOrder`.`receiptDate`,`purchaseOrder`.`receiptDate`,
            `purchaseOrder`.`repEmployee`,`purchaseOrder`.`paymentTerm`,
            `purchaseOrder`.`contactName`,`purchaseOrder`.`contactPhone`,
            `purchaseOrder`.`contactEmail`,`purchaseOrder`.`supplierAddress`,
            `application`.`applicationType`,`application`.`approveName-1st`,
            `application`.`approveTime-1st`,`application`.`approveName-2nd`,
            `application`.`approveTime-2nd`,`application`.`approveName-3th`,
            `application`.`approveTime-3th`
            FROM `purchaseOrder`
            INNER JOIN `application` ON `purchaseOrder`.`receiptNumber`=`application`.`applicationId` """
            if applicationId!='':
                sql=sql+'WHERE `application`.`applicationId` = '+"'"+applicationId+"'"
            if status!='':
                if '=' not in sql:
                    sql=sql+'WHERE `application`.`status` = '+"'"+status+"'"
                else:
                    sql=sql+' and `application`.`status` = '+"'"+status+"'"
            if taxId!='':
                if '=' not in sql:
                    sql=sql+'WHERE `purchaseOrder`.`taxId` ='+"'"+taxId+"'"
                else:
                    sql=sql+'and `purchaseOrder`.`taxId` = '+"'"+taxId+"'"
            if ODS!='':
                if '=' not in sql:
                    sql=sql+'WHERE `purchaseOrder`.`orderDate` >= '+"'"+ODS+"'"
                else:
                    sql=sql+' and `purchaseOrder`.`orderDate` >= '+"'"+ODS+"'"
            if ODE!='':
                if '=' not in sql:
                    sql=sql+'WHERE `purchaseOrder`.`orderDate` <= '+"'"+ODE+"'"
                else:
                    sql=sql+' and `purchaseOrder`.`orderDate` <= '+"'"+ODE+"'"

            if RDS!='':
                if '=' not in sql:
                    sql=sql+'WHERE `purchaseOrder`.`receiptDate` >= '+"'"+RDS[0:10]+"'"
                else:
                    sql=sql+' and `purchaseOrder`.`receiptDate` >= '+"'"+RDS[0:10]+"'"
            if RDE!='':
                if '=' not in sql:
                    sql=sql+'WHERE `purchaseOrder`.`receiptDate` <= '+"'"+RDE[0:10]+"'"
                else:
                    sql=sql+' and `purchaseOrder`.`receiptDate` <= '+"'"+RDE[0:10]+"'"
            if supplierName!='':
                if '=' not in sql:
                    sql=sql+'WHERE `purchaseOrder`.`supplierName` LIKE '+"'"+'%'+supplierName+'%'+"'"
                else:
                    sql=sql+' and `purchaseOrder`.`supplierName` LIKE '+"'"+'%'+supplierName+'%'+"'"

            if page!='':
                sql = sql + ' GROUP BY `application`.`applicationId` ORDER BY `application`.`applicationId`  LIMIT '+page+',11;'
            else:
                sql = sql + ' GROUP BY `application`.`applicationId` ORDER BY `application`.`applicationId` '
            cursor.execute(sql)
            result = cursor.fetchall()
            db.commit()

            return result
        except errors.Error as e:
                print('error',e)
        finally:
                cursor.close()
                db.close()


receipt_Model = ReceiptModel()