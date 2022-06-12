from model.pool import pool
from mysql.connector import errors


class DeliveryBillModel:
    def searchSingleDeliveryDB(self,station,applicationId):
        try:
            db = pool.get_connection()
            cursor = db.cursor(dictionary=True)
            sql= """SELECT
                `application`.`applicationId`,`application`.`status`,
                `application`.`applicationType`,`application`.`station`,
                `application`.`approveName-1st`,`application`.`approveTime-1st`,
                `application`.`approveName-2nd`,`application`.`approveTime-2nd`,
                `application`.`approveName-3th`,`application`.`approveTime-3th`,
                `saleOrder`.`clientName`,`saleOrder`.`taxId`,
                `saleOrder`.`orderDate`,`saleOrder`.`deliveryDate`,
                `saleOrder`.`repEmployee`,`saleOrder`.`paymentTerm`,
                `saleOrder`.`clientCredit`,`saleOrder`.`contactName`,
                `saleOrder`.`contactPhone`,`saleOrder`.`contactEmail`,
                `saleOrder`.`clientAddress`,`department`.`departmentName`,
                GROUP_CONCAT(`productStock`.`productId`,',',product.productName,',',`productStock`.`Quantity`,',',`productStock`.`reason`) AS saleOrderDetail,
                (SELECT GROUP_CONCAT(name,commentTime,commentText) FROM comment  GROUP BY applicationId HAVING applicationId = application.`applicationId`)As comment
                FROM `productStock`
                INNER JOIN `product` ON `productStock`.`productId` = `product`.`applicationId`
                INNER JOIN `application` ON `application`.`applicationId` = `productStock`.`applicationId`
                INNER JOIN `saleOrder` ON `saleOrder`.`deliveryNumber` = `productStock`.`applicationId`
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
                sql="""SELECT
                    `application`.`applicationId`,`application`.`status`,
                    `application`.`applicationType`,`application`.`station`,
                    `application`.`approveName-1st`,`application`.`approveTime-1st`,
                    `application`.`approveName-2nd`,`application`.`approveTime-2nd`,
                    `application`.`approveName-3th`,`application`.`approveTime-3th`,
                    `saleOrder`.`clientName`,`saleOrder`.`taxId`,
                    `saleOrder`.`orderDate`,`saleOrder`.`deliveryDate`,
                    `saleOrder`.`repEmployee`,`saleOrder`.`paymentTerm`,
                    `saleOrder`.`clientCredit`,`saleOrder`.`contactName`,
                    `saleOrder`.`contactPhone`,`saleOrder`.`contactEmail`,
                    `saleOrder`.`clientAddress`,`department`.`departmentName`,
                    (SELECT GROUP_CONCAT(CONCAT(product.applicationId,','),CONCAT(saleOrderDetail.productName,','),CONCAT(saleOrderDetail.OrderQuantity,','),CONCAT(saleOrderDetail.productPrice is null))
                    FROM `saleOrderDetail`
                    INNER JOIN `product` ON `product`.`productName`=`saleOrderDetail`.`productName`
                    GROUP BY `orderNumber`
                    HAVING `orderNumber` = `saleOrder`.`orderNumber`)
                    As `saleOrderDetail`,
                    (SELECT GROUP_CONCAT(name,commentTime,commentText) FROM comment  GROUP BY applicationId HAVING applicationId = application.`applicationId`)As comment
                    FROM `application`
                    INNER JOIN `saleOrder` ON `application`.`applicationId`=`saleOrder`.`deliveryNumber`
                    INNER JOIN `saleOrderDetail` ON `saleOrder`.`orderNumber`=`saleOrderDetail`.`orderNumber`
                    INNER JOIN `product` ON `product`.`productName`=`saleOrderDetail`.`productName`
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

    def conditionSearchDeliveryBill(self,applicationId,status,taxId,ODS,ODE,DDS,DDE,clientName,page):
        # 搜尋出貨單的時候，搜尋條件沒包含出貨數量情形，可以連productStock
        try:
            db = pool.get_connection()
            cursor = db.cursor(dictionary=True)
            sql= """SELECT `application`.`applicationId`,`application`.`status`,`application`.`station`,`application`.`applicationType`,
            `saleOrder`.`clientName`,`saleOrder`.`taxId`,`saleOrder`.`orderDate`,`saleOrder`.`deliveryDate`,
            `saleOrder`.`deliveryDate`,`saleOrder`.`repEmployee`,
            `saleOrder`.`paymentTerm`,`saleOrder`.`clientCredit`,
            `saleOrder`.`contactName`,`saleOrder`.`contactPhone`,
            `saleOrder`.`contactEmail`,`saleOrder`.`clientAddress`,`application`.`applicationType`,
            `application`.`approveName-1st`,`application`.`approveTime-1st`,
            `application`.`approveName-2nd`,`application`.`approveTime-2nd`,
            `application`.`approveName-3th`,`application`.`approveTime-3th`
            FROM `saleOrder`
            INNER JOIN `application` ON `saleOrder`.`deliveryNumber`=`application`.`applicationId` """
            if applicationId!='':
                sql=sql+'WHERE `application`.`applicationId` = '+"'"+applicationId+"'"
            if status!='':
                if '=' not in sql:
                    sql=sql+'WHERE `application`.`status` = '+"'"+status+"'"
                else:
                    sql=sql+' and `application`.`status` = '+"'"+status+"'"
            if taxId!='':
                if '=' not in sql:
                    sql=sql+'WHERE `saleOrder`.`taxId` ='+"'"+taxId+"'"
                else:
                    sql=sql+'and `saleOrder`.`taxId` = '+"'"+taxId+"'"
            if ODS!='':
                if '=' not in sql:
                    sql=sql+'WHERE `saleOrder`.`orderDate` >= '+"'"+ODS+"'"
                else:
                    sql=sql+' and `saleOrder`.`orderDate` >= '+"'"+ODS+"'"
            if ODE!='':
                if '=' not in sql:
                    sql=sql+'WHERE `saleOrder`.`orderDate` <= '+"'"+ODE+"'"
                else:
                    sql=sql+' and `saleOrder`.`orderDate` <= '+"'"+ODE+"'"

            if DDS!='':
                if '=' not in sql:
                    sql=sql+'WHERE `saleOrder`.`deliveryDate` >= '+"'"+DDS[0:10]+"'"
                else:
                    sql=sql+' and `saleOrder`.`deliveryDate` >= '+"'"+DDS[0:10]+"'"
            if DDE!='':
                if '=' not in sql:
                    sql=sql+'WHERE `saleOrder`.`deliveryDate` <= '+"'"+DDE[0:10]+"'"
                else:
                    sql=sql+' and `saleOrder`.`deliveryDate` <= '+"'"+DDE[0:10]+"'"
            if clientName!='':
                if '=' not in sql:
                    sql=sql+'WHERE `saleOrder`.`clientName` LIKE '+"'"+'%'+clientName+'%'+"'"
                else:
                    sql=sql+' and `saleOrder`.`clientName` LIKE '+"'"+'%'+clientName+'%'+"'"
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


deliveryBill_Model = DeliveryBillModel()