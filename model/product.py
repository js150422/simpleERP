from model.pool import pool
from mysql.connector import errors
import math

class productModel:




    def searchProduct(self,priceStart,priceEnd,applicationId,status,productName,productDescription,supplierName,page):
        try:
            db = pool.get_connection()
            cursor = db.cursor(dictionary=True)
            sql = """SELECT  `application`.`applicationId`, `department`.`departmentName`,
                        `application`.`applicationType`, `application`.`status`,`application`.`station`,
                        `application`.`station`,`application`.`approveName-1st`,
                        `application`.`approveTime-1st`,`application`.`approveName-2nd`,
                        `application`.`approveTime-2nd`,`application`.`approveName-3th`,
                        `application`.`approveTime-3th`,`user`.`name` AS managerName,
                        `product`.`productName`,`product`.`supplierName`,`application`.`applicationType`,
                        `product`.`costPrice`,`product`.`salePrice`,
                        `product`.`productUnit`,`product`.`productDescription`,
                        `product`.`productPig`,
                        (SELECT GROUP_CONCAT(name,commentTime,commentText) FROM comment  GROUP BY applicationId HAVING applicationId = product.applicationId)As comment
                        FROM `application`
                        INNER JOIN `department` ON `department`.`departmentId`= `application`.`departmentId`
                        INNER JOIN `departmentManage` ON `department`.`departmentId`= `departmentManage`.`departmentId`
                        INNER JOIN `user` ON `departmentManage`.`manager`= `user`.`employeeId`
                        INNER JOIN `product` ON `product`.`applicationId`= `application`.`applicationId` """
            if priceStart != '':
                sql = sql + 'WHERE `product`.`salePrice` >= '+priceStart
            if priceEnd != '':
                if '=' not in sql:
                    sql = sql + 'WHERE `product`.`salePrice` <= '+priceEnd
                else:
                    sql = sql + ' AND `product`.`salePrice` <= '+priceEnd
            if applicationId != '':
                if '=' not in sql:
                    sql = sql + 'WHERE `application`.`applicationId` = '+"'"+applicationId+"'"
                else:
                    sql = sql + ' AND `application`.`applicationId` = '+"'"+applicationId+"'"
            if status != '':
                if '=' not in sql:
                    sql = sql + 'WHERE `application`.`status` = '+"'"+status+"'"
                else:
                    sql = sql + ' AND `application`.`status` = '+"'"+status+"'"
            if productName != '':
                if '=' not in sql:
                    sql=sql+'WHERE `product`.`productName` LIKE '+"'"+'%'+productName+'%'+"'"
                else:
                    sql=sql+' AND `product`.`productName` LIKE '+"'"+'%'+productName+'%'+"'"
            if productDescription != '':
                if ('=' not in sql) and ('LIKE' not in sql):
                    sql=sql+'WHERE `product`.`productDescription` LIKE '+"'"+'%'+productDescription+'%'+"'"
                elif 'LIKE' not in sql:
                    sql=sql+' AND `product`.`productDescription` LIKE '+"'"+'%'+productDescription+'%'+"'"
            if supplierName != '':
                if ('=' not in sql) and ('LIKE' not in sql):
                    sql=sql+'WHERE `product`.`supplierName` LIKE '+"'"+'%'+supplierName+'%'+"'"
                else:
                    sql=sql+' AND `product`.`supplierName` LIKE '+"'"+'%'+supplierName+'%'+"'"
            if page!='':
                sql = sql + ' ORDER BY `application`.`applicationId`  LIMIT '+page+',11;'
            else:
                sql = sql + ' ORDER BY `application`.`applicationId` '

            cursor.execute(sql)
            result = cursor.fetchall()
            db.commit()
            return result
        except errors.Error as e:
            print('error',e)
        finally:
            cursor.close()
            db.close()



    def insertProduct(self, applicationId,productName, supplierName,costPrice,productUnit,productDescription):
        try:
            db = pool.get_connection()
            cursor = db.cursor(dictionary=True)
            grossProfitRate = 0.35
            salePriceSuggest = math.ceil(int(costPrice)/(1-grossProfitRate))
            cursor.execute("""INSERT INTO `product`
            (`applicationId`,`productName`,`supplierName`,
            `costPrice`,`salePrice`,
            `productUnit`,`productDescription`)
            VALUES ( %s, %s, %s, %s, %s, %s, %s)""",
            (applicationId,productName, supplierName,int(costPrice),int(salePriceSuggest),productUnit,productDescription,))
            db.commit()
        except errors.Error as e:
            print('error',e)
        finally:
            cursor.close()
            db.close()


    def jpgUpLoad(self,url,applicationId):
        try:
            db = pool.get_connection()
            cursor = db.cursor(dictionary=True)
            sql = 'UPDATE `product` SET `productPig` = %s WHERE `applicationId` = %s '
            val = (url,applicationId)
            cursor.execute(sql,val)
            db.commit()
        except errors.Error as e:
            print('error',e)
        finally:
            cursor.close()
            db.close()


product_Model=productModel()