from model.pool import pool
from mysql.connector import errors


class SpecialPriceModel:
    def insertSpecialPrice(self,applicationId,clientId,productId,specialPrice,specialDescription,version):
        try:
            db = pool.get_connection()
            cursor = db.cursor(dictionary=True)
            cursor.execute("""INSERT INTO `specialPrice` (`applicationId`,`clientId`,
            `productId`,`specialPrice`,`specialDescription`,
            `version`)
            VALUES (%s, %s, %s, %s, %s, %s)""",
            (applicationId,clientId,productId,int(specialPrice),specialDescription,int(version),))
            db.commit()
        except errors.Error as e:
            print('error',e)
        finally:
            cursor.close()
            db.close()


    def searchSpecialPriceDB(self, applicationId,status,clientId,productId,clientName,taxId,productName,page):
        try:
            db = pool.get_connection()
            cursor = db.cursor(dictionary=True)
            sql= """SELECT  `application`.`applicationId`, `department`.`departmentName`,
                        `application`.`applicationType`, `application`.`status`,`application`.`station`,
                        `application`.`station`,`application`.`approveName-1st`,
                        `application`.`approveTime-1st`,`application`.`approveName-2nd`,
                        `application`.`approveTime-2nd`,`application`.`approveName-3th`,
                        `application`.`approveTime-3th`,`user`.`name` AS managerName,
                        `client`.`clientName`,`product`.`productName`,`application`.`applicationType`,
                        `product`.`salePrice`,`specialPrice`.`specialPrice`,
                        `specialPrice`.`specialDescription`,`specialPrice`.`version`,
                        (SELECT GROUP_CONCAT(name,commentTime,commentText) FROM comment  GROUP BY applicationId HAVING applicationId = specialPrice.applicationId)As comment
                        FROM `application`
                        INNER JOIN `department` ON `department`.`departmentId`= `application`.`departmentId`
                        INNER JOIN `departmentManage` ON `department`.`departmentId`= `departmentManage`.`departmentId`
                        INNER JOIN `user` ON `departmentManage`.`manager`= `user`.`employeeId`
                        INNER JOIN `specialPrice` ON `application`.`applicationId`= `specialPrice`.`applicationId`
                        INNER JOIN `product` ON `product`.`applicationId`= `specialPrice`.`productId`
                        INNER JOIN `client` ON `client`.`applicationId`= `specialPrice`.`clientId` """
            if applicationId!='':
                sql=sql+'WHERE `specialPrice`.`applicationId` = '+"'"+applicationId+"'"
            if status!='':
                if '=' not in sql:
                    sql=sql+'WHERE `application`.`status` = '+"'"+status+"'"
                else:
                    sql=sql+' and `application`.`status` = '+"'"+status+"'"
            if clientId!='':
                if '=' not in sql:
                    sql=sql+'WHERE `client`.`applicationId` = '+"'"+clientId+"'"
                else:
                    sql=sql+' and `client`.`applicationId` = '+"'"+clientId+"'"
            if taxId!='':
                if '=' not in sql:
                    sql=sql+'WHERE `client`.`taxId` = '+"'"+taxId+"'"
                else:
                    sql=sql+' and `client`.`taxId` = '+"'"+taxId+"'"
            if productId!='':
                if '=' not in sql:
                    sql=sql+'WHERE `product`.`applicationId` = '+"'"+productId+"'"
                else:
                    sql=sql+' and `product`.`applicationId` = '+"'"+productId+"'"

            if clientName!='':
                if ('=' not in sql) and ('LIKE' not in sql):
                     sql=sql+'WHERE `client`.`clientName` LIKE '+"'"+'%'+clientName+'%'+"'"
                else:
                    sql=sql+' and `client`.`clientName` LIKE '+"'"+'%'+clientName+'%'+"'"
            if productName!='':
                if ('=' not in sql) and ('LIKE' not in sql):
                     sql=sql+'WHERE `product`.`productName` LIKE '+"'"+'%'+productName+'%'+"'"
                else:
                    sql=sql+' and `product`.`productName` LIKE '+"'"+'%'+productName+'%'+"'"
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

    def searchClientSpecialPriceDB(self,clientId):

        try:
            db = pool.get_connection()
            cursor = db.cursor(dictionary=True)
            cursor.execute("""select `application`.`applicationId`,`product`.`applicationId`,`product`.`productName`,`specialPrice`.`specialPrice`,`product`.`productUnit`,`client`.`clientName`,`client`.`applicationId` AS clientId,application.status
                                FROM `product`
                                INNER JOIN `specialPrice` ON `product`.`applicationId`= `specialPrice`.`productId`
                                INNER JOIN `application` ON `specialPrice`.`applicationId`= `application`.`applicationId`
                                INNER JOIN `client` ON `specialPrice`.`clientId`= `client`.`applicationId`
                                WHERE `application`.`status`='complete' AND `client`.`applicationId`= %s
                                ORDER BY `specialPrice`.`applicationId` DESC LIMIT 1 ;""",(clientId,))

            result = cursor.fetchone()
            db.commit()
            return result
        except errors.Error as e:
            print('error',e)
        finally:
            cursor.close()
            db.close()



specialPrice_Model = SpecialPriceModel()