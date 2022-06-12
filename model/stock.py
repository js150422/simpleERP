from model.pool import pool
from mysql.connector import errors


class StockModel:
    def insertStock(self,deliveryQchangeData,approveTime):
        try:
            db = pool.get_connection()
            cursor = db.cursor(dictionary=True)
            for i in range(len(deliveryQchangeData)):
                cursor.execute("""INSERT INTO `productStock`
                (productId, `applicationId`,`Quantity`, `reason`,`changeDate`)
                VALUES (%s,%s,%s,%s,%s);""",
                (deliveryQchangeData[i]['productId'],
                deliveryQchangeData[i]['applicationId'],
                int(deliveryQchangeData[i]['Quantity']),
                deliveryQchangeData[i]['reason'],approveTime,))
                db.commit()
        except errors.Error as e:
                print('error',e)
        finally:
                cursor.close()
                db.close()

    def deleteStockRecord(self,applicationId):
        try:
            db = pool.get_connection()
            cursor = db.cursor(dictionary=True)
            cursor.execute("""DELETE FROM `productStock` WHERE `applicationId` = %s;""",(applicationId,))
            result = cursor.fetchall()
            db.commit()
            return result
        except errors.Error as e:
                print('error',e)
        finally:
                cursor.close()
                db.close()


    def searchStock(self,applicationId):
        try:
            db = pool.get_connection()
            cursor = db.cursor(dictionary=True)
            cursor.execute("""SELECT `productId` FROM `productStock` WHERE `applicationId` = %s;""",(applicationId,))
            result = cursor.fetchall()
            db.commit()
            return result
        except errors.Error as e:
                print('error',e)
        finally:
                cursor.close()
                db.close()


    def stockBalanceSearchDB(self,supplierName,productName,balanceDate,page):
        try:
            db = pool.get_connection()
            cursor = db.cursor(dictionary=True)
            sql = """select `productStock`.`productId`,`product`.`productName`,`product`.`supplierName`,
                    SUM(CASE WHEN `productStock`.`Quantity` > 0 THEN `productStock`.`Quantity` ELSE 0 end) AS stockIn,
                    SUM(CASE WHEN `productStock`.`Quantity` < 0 THEN `productStock`.`Quantity` ELSE 0 end) AS stockOut,
                    SUM(`productStock`.`Quantity`)  AS balance,`product`.`productUnit`
                    from `productStock`
                    INNER JOIN `product` ON `product`.`applicationId` = `productStock`.`productId` """
            if supplierName!='':
                sql=sql+' WHERE `product`.`supplierName` = '+"'"+supplierName+"'"
            if productName!='':
                if '=' not in sql:
                    sql=sql+' WHERE `product`.`productName` = '+"'"+productName+"'"
                else:
                    sql=sql+' and `product`.`productName` = '+"'"+productName+"'"
            if balanceDate!='':
                if '=' not in sql:
                    sql=sql+' WHERE `productStock`.`changeDate` < '+"'"+balanceDate[0:10]+"'"
                else:
                    sql=sql+' and `productStock`.`changeDate` < '+"'"+balanceDate[0:10]+"'"
            if page!='':
                sql = sql + ' GROUP BY `productStock`.`productId` ORDER BY `productStock`.`productId` LIMIT '+page+',11;'
            else:
                sql = sql + ' GROUP BY `productStock`.`productId` ORDER BY `productStock`.`productId` ;'
            cursor.execute(sql)
            result = cursor.fetchall()
            db.commit()
            return result
        except errors.Error as e:
                print('error',e)
        finally:
                cursor.close()
                db.close()

    def stockChangeDetailDB(self,supplierName,productName,startDate,endDate,page):
        try:
            db = pool.get_connection()
            cursor = db.cursor(dictionary=True)
            sql = """select
                    `productStock`.`changeDate`,`productStock`.`applicationId`,
                    `productStock`.`productId`,`product`.`productName`,
                    `product`.`supplierName`, `productStock`.`Quantity`,
                    `product`.`productUnit`
                    from `productStock`
                    INNER JOIN `product` ON `product`.`applicationId` = `productStock`.`productId` """
            if supplierName!='':
                sql=sql+' WHERE `product`.`supplierName` = '+"'"+supplierName+"'"
            if productName!='':
                if '=' not in sql:
                    sql=sql+' WHERE `product`.`productName` = '+"'"+productName+"'"
                else:
                    sql=sql+' and `product`.`productName` = '+"'"+productName+"'"
            if startDate!='':
                if '=' not in sql:
                    sql=sql+' WHERE `productStock`.`changeDate` > '+"'"+startDate[0:10]+"'"
                else:
                    sql=sql+' and `productStock`.`changeDate` > '+"'"+startDate[0:10]+"'"
            if endDate!='':
                if '=' not in sql:
                    sql=sql+' WHERE `productStock`.`changeDate` < '+"'"+endDate[0:10]+"'"
                else:
                    sql=sql+' and `productStock`.`changeDate` < '+"'"+endDate[0:10]+"'"
            if page!='':
                sql = sql + ' ORDER BY `productStock`.`productId` LIMIT '+page+',11;'
            else:
                sql = sql + ' ORDER BY `productStock`.`applicationId` ;'
            cursor.execute(sql)
            result = cursor.fetchall()
            db.commit()
            return result
        except errors.Error as e:
                print('error',e)
        finally:
                cursor.close()
                db.close()




stock_Model=StockModel()

