from model.pool import pool
from mysql.connector import errors


class ApplicationModel:

    def myPendingApplicationDB(self, name, station, grad, departmentId,page):
        try:
            db = pool.get_connection()
            cursor = db.cursor(dictionary=True)
            if grad == 'Boss':
                sql="""SELECT
                `application`.`applicationId`,`department`.`departmentName`,
                `application`.`applicationType`, `application`.`status`,
                `application`.`station`,
                `application`.`approveName-1st`,`application`.`approveTime-1st`,
                `application`.`approveName-2nd`,`application`.`approveTime-2nd`,
                `application`.`approveName-3th`,`application`.`approveTime-3th`,
                null AS managerName,`application`.`turn`
                FROM `application`
                INNER JOIN `department` ON `department`.`departmentId`= `application`.`departmentId` """
            else:
                sql="""SELECT
                `application`.`applicationId`,`department`.`departmentName`,
                `application`.`applicationType`, `application`.`status`,
                `application`.`station`,
                `application`.`approveName-1st`,`application`.`approveTime-1st`,
                `application`.`approveName-2nd`,`application`.`approveTime-2nd`,
                `application`.`approveName-3th`,`application`.`approveTime-3th`,
                `user`.`name` AS managerName,`application`.`turn`
                FROM `application`
                INNER JOIN `department` ON `department`.`departmentId`= `application`.`departmentId`
                INNER JOIN `departmentManage` ON `department`.`departmentId`= `departmentManage`.`departmentId`
                INNER JOIN `user` ON `departmentManage`.`manager`= `user`.`employeeId` """
            if grad == 'staff' and int(departmentId)!= 4:
                sql=sql +'WHERE `application`.`approveName-1st` =' +"'"+name+"'"+ ' AND `application`.station = '+"'"+station+"'"
            if grad == 'staff' and int(departmentId)== 4:
                sql=sql +'WHERE `application`.`station` = "start"'
            if grad == 'Section Manager' and int(departmentId)!= 4:
                sql= sql + 'WHERE `user`.`name`=' +"'"+name+"'"+ 'AND station = '+"'"+station+"'"
            if grad == 'Section Manager' and int(departmentId)== 4:
                sql= sql + 'WHERE `application`.`station` = "middle"'
            if grad == 'Boss'and int(departmentId)!= 4:
                sql= sql + 'WHERE `application`.`station` ='+"'"+station+"'"+' AND `department`.`departmentId`!=4'
            if grad == 'driver'and int(departmentId)== 4:
                sql= sql + 'WHERE `application`.`station` ="final" '
            if departmentId!='' and grad!='Boss':
                if '=' not in sql:
                    sql=sql +'WHERE `department`.`departmentId` =' +str(departmentId)
                else:
                    sql=sql +' AND `department`.`departmentId` =' +str(departmentId)
            sql = sql +"""
                    UNION
                    SELECT  `application`.`applicationId`, `department`.`departmentName`,
                    `application`.`applicationType`, `application`.`status`,
                    `application`.`station`,
                    `application`.`approveName-1st`,`application`.`approveTime-1st`,
                    `application`.`approveName-2nd`,`application`.`approveTime-2nd`,
                    `application`.`approveName-3th`,`application`.`approveTime-3th`,
                    null AS managerName,`application`.`turn`
                    FROM `application`
                    INNER JOIN `department` ON `department`.`departmentId`= `application`.`departmentId`
                    WHERE `application`.`applicationType` = 'saleOrder'
                    AND `application`.`status` = 'complete'
                    AND `application`.`turn` is null
                    AND `application`.`approveName-1st` = """+"'"+name+"'"+"""
                    UNION
                    SELECT  `application`.`applicationId`, `department`.`departmentName`,
                    `application`.`applicationType`, `application`.`status`,
                    `application`.`station`,
                    `application`.`approveName-1st`,`application`.`approveTime-1st`,
                    `application`.`approveName-2nd`,`application`.`approveTime-2nd`,
                    `application`.`approveName-3th`,`application`.`approveTime-3th`,
                    null AS managerName,`application`.`turn`
                    FROM `application`
                    INNER JOIN `department` ON `department`.`departmentId`= `application`.`departmentId`
                    WHERE `application`.`applicationType` = 'purchaseOrder'
                    AND `application`.`status` = 'complete'
                    AND `application`.`turn` is null
                    AND `application`.`approveName-1st` = """+"'"+name+"' ;"

            cursor.execute(sql)
            result = cursor.fetchall()
            db.commit()

            return result
        except errors.Error as e:
            print("error",e)
        finally:
            cursor.close()
            db.close()

  #------------------------------------非登錄---------------------------------------------------------------------------

    def searchPendingDB(self, name, station, grad, applicationId, applicationType, departmentId):
        try:
            db = pool.get_connection()
            cursor = db.cursor(dictionary=True)
            if grad == 'Boss':
                sql="""SELECT
                `application`.`applicationId`,`department`.`departmentName`,
                `application`.`applicationType`, `application`.`status`,
                `application`.`station`,
                `application`.`approveName-1st`,`application`.`approveTime-1st`,
                `application`.`approveName-2nd`,`application`.`approveTime-2nd`,
                `application`.`approveName-3th`,`application`.`approveTime-3th`,
                null AS managerName
                FROM `application`
                INNER JOIN `department` ON `department`.`departmentId`= `application`.`departmentId` """
            else:
                sql="""SELECT
                `application`.`applicationId`,`department`.`departmentName`,
                `application`.`applicationType`, `application`.`status`,
                `application`.`station`,
                `application`.`approveName-1st`,`application`.`approveTime-1st`,
                `application`.`approveName-2nd`,`application`.`approveTime-2nd`,
                `application`.`approveName-3th`,`application`.`approveTime-3th`,
                `user`.`name` AS managerName
                FROM `application`
                INNER JOIN `department` ON `department`.`departmentId`= `application`.`departmentId`
                INNER JOIN `departmentManage` ON `department`.`departmentId`= `departmentManage`.`departmentId`
                INNER JOIN `user` ON `departmentManage`.`manager`= `user`.`employeeId` """
            if grad == 'staff' and int(departmentId)!= 4:
                sql=sql +'WHERE `application`.`approveName-1st` =' +"'"+name+"'"+ ' AND `application`.station = '+"'"+station+"'"
            if grad == 'staff' and int(departmentId)== 4:
                sql=sql +'WHERE `application`.`station` = "start"'
            if grad == 'Section Manager' and int(departmentId)!= 4:
                sql= sql + 'WHERE `user`.`name`=' +"'"+name+"'"+ 'AND station = '+"'"+station+"'"
            if grad == 'Section Manager' and int(departmentId)== 4:
                sql= sql + 'WHERE `application`.`station` = "middle"'
            if grad == 'Boss'and int(departmentId)!= 4:
                sql= sql + 'WHERE `application`.`station` ='+"'"+station+"'"+' AND `department`.`departmentId`!=4'
            if grad == 'driver'and int(departmentId)== 4:
                sql= sql + 'WHERE `application`.`station` ="final" '
            if departmentId!='' and grad!='Boss':
                if '=' not in sql:
                    sql=sql +'WHERE `department`.`departmentId` =' +str(departmentId)
                else:
                    sql=sql +' AND `department`.`departmentId` =' +str(departmentId)
            if applicationId!='':
                if '=' not in sql:
                    sql=sql +'WHERE `application`.`applicationId` =' +"'"+applicationId+"'"
                else:
                    sql=sql +' AND `application`.`applicationId` =' +"'"+applicationId+"'"
            if applicationType!='':
                if '=' not in sql:
                    sql=sql +'WHERE `application`.`applicationType` =' +"'"+applicationType+"'"
                else:
                    sql=sql +' AND `application`.`applicationType` =' +"'"+applicationType+"'"

            sql = sql + ' GROUP BY `application`.`applicationId` ORDER BY `application`.`applicationId`; '

            cursor.execute(sql)
            result = cursor.fetchall()
            db.commit()

            return result
        except errors.Error as e:
            print("error",e)
        finally:
            cursor.close()
            db.close()


    #------------------------------------廠商資料建立---------------------------------------------------------------------------
    def clientCreateSignDB(self, name, station, grad, applicationId, applicationType):
            try:
                db = pool.get_connection()
                cursor = db.cursor(dictionary=True)
                sql="""SELECT  `application`.`applicationId`, `department`.`departmentName`,
                    `application`.`applicationType`, `application`.`status`,
                    `application`.`station`,`application`.`approveName-1st`,
                    `application`.`approveTime-1st`,`application`.`approveName-2nd`,
                    `application`.`approveTime-2nd`,`application`.`approveName-3th`,
                    `application`.`approveTime-3th`,`user`.`name` AS managerName,
                    `client`.paymentTerm
                    FROM `application`
                    INNER JOIN `department` ON `department`.`departmentId`= `application`.`departmentId`
                    INNER JOIN `departmentManage` ON `department`.`departmentId`= `departmentManage`.`departmentId`
                    INNER JOIN `user` ON `departmentManage`.`manager`= `user`.`employeeId`
                    INNER JOIN `client` ON `application`.`applicationId`= `client`.`applicationId` """
                if grad == 'staff':
                    sql=sql +'WHERE `application`.`approveName-1st` =' +"'"+name+"'"+ ' AND `application`.station = '+"'"+station+"'"
                if grad == 'Section Manager':
                    sql= sql + 'WHERE `user`.`name`=' +"'"+name+"'"+ 'AND station = '+"'"+station+"'"
                if grad == 'Boss':
                    sql= sql + 'WHERE `application`.`station` ='+"'"+station+"'"+" AND `department`.`departmentId`!=4"
                if applicationId!='':
                    if '=' not in sql:
                        sql=sql +'WHERE `application`.`applicationId` =' +"'"+applicationId+"'"
                    else:
                        sql=sql +' AND `application`.`applicationId` =' +"'"+applicationId+"'"
                if applicationType!='':
                    if '=' not in sql:
                        sql=sql +'WHERE `application`.`applicationType` =' +"'"+applicationType+"'"
                    else:
                        sql=sql +' AND `application`.`applicationType` =' +"'"+applicationType+"'"

                sql = sql + ' GROUP BY `application`.`applicationId` ORDER BY `application`.`applicationId`; '

                cursor.execute(sql)
                result = cursor.fetchall()
                db.commit()

                return result
            except errors.Error as e:
                print('error',e)
            finally:
                cursor.close()
                db.close()
    #------------------------------------廠商資料建立---------------------------------------------------------------------------
    def supplierCreateSignDB(self, name, station, grad, applicationId, applicationType):
        try:
            db = pool.get_connection()
            cursor = db.cursor(dictionary=True)
            sql="""SELECT  `application`.`applicationId`, `department`.`departmentName`,
                    `application`.`applicationType`, `application`.`status`,
                    `application`.`station`,`application`.`approveName-1st`,
                    `application`.`approveTime-1st`,`application`.`approveName-2nd`,
                    `application`.`approveTime-2nd`,`application`.`approveName-3th`,
                    `application`.`approveTime-3th`,`user`.`name` AS managerName,
                    `supplier`.paymentTerm
                    FROM `application`
                    INNER JOIN `department` ON `department`.`departmentId`= `application`.`departmentId`
                    INNER JOIN `departmentManage` ON `department`.`departmentId`= `departmentManage`.`departmentId`
                    INNER JOIN `user` ON `departmentManage`.`manager`= `user`.`employeeId`
                    INNER JOIN `supplier` ON `application`.`applicationId`= `supplier`.`applicationId` """
            if grad == 'staff':
                sql=sql +'WHERE `application`.`approveName-1st` =' +"'"+name+"'"+ ' AND `application`.station = '+"'"+station+"'"
            if grad == 'Section Manager':
                sql= sql + 'WHERE `user`.`name`=' +"'"+name+"'"+ 'AND station = '+"'"+station+"'"
            if grad == 'Boss':
                sql= sql + 'WHERE `application`.`station` ='+"'"+station+"'"+' AND `department`.`departmentId`!=4'
            if applicationId!='':
                if '=' not in sql:
                    sql=sql +'WHERE `application`.`applicationId` =' +"'"+applicationId+"'"
                else:
                    sql=sql +' AND `application`.`applicationId` =' +"'"+applicationId+"'"
            if applicationType!='':
                if '=' not in sql:
                    sql=sql +'WHERE `application`.`applicationType` =' +"'"+applicationType+"'"
                else:
                    sql=sql +' AND `application`.`applicationType` =' +"'"+applicationType+"'"

            sql = sql + ' GROUP BY `application`.`applicationId` ORDER BY `application`.`applicationId`; '

            cursor.execute(sql)
            result = cursor.fetchall()
            db.commit()

            return result
        except errors.Error as e:
            print('error',e)
        finally:
            cursor.close()
            db.close()

    #-----------------------------------搜尋自己的申請單--------------------------------------------------------------
    def searchMyapplicationDB(self, name, status, dateStart,dateEnd,page):
        try:

            db = pool.get_connection()
            cursor = db.cursor(dictionary=True)
            sql="""SELECT  `application`.`applicationId`, `department`.`departmentName`,
                `application`.`applicationType`, `application`.`status`,
                `application`.`station`,`application`.`approveName-1st`,
                `application`.`approveTime-1st`,`application`.`approveName-2nd`,
                `application`.`approveTime-2nd`,`application`.`approveName-3th`,
                `application`.`approveTime-3th`,`user`.`name` AS managerName
                FROM `application`
                INNER JOIN `department` ON `department`.`departmentId`= `application`.`departmentId`
                INNER JOIN `departmentManage` ON `department`.`departmentId`= `departmentManage`.`departmentId`
                INNER JOIN `user` ON `departmentManage`.`manager`= `user`.`employeeId`
                WHERE `application`.`approveName-1st` = """+"'"+name+"'"
            if status!='':
                sql=sql +' AND `application`.`status` =' +"'"+status+"'"
            if dateStart!='':
                if '=' not in sql:
                    sql=sql+'WHERE `application`.`approveTime-1st` >= '+"'"+dateStart[0:10]+"'"
                else:
                    sql=sql+' and `application`.`approveTime-1st` >= '+"'"+dateStart[0:10]+"'"
            if dateEnd!='':
                if '=' not in sql:
                    sql=sql+'WHERE `application`.`approveTime-1st` <= '+"'"+dateEnd[0:10]+"'"
                else:
                    sql=sql+' and `application`.`approveTime-1st` <= '+"'"+dateEnd[0:10]+"'"
            if page!='':
                sql = sql + ' ORDER BY `application`.`applicationId` LIMIT '+page+',11;'
            else:
                sql = sql + ' ORDER BY `application`.`applicationId`;'
            cursor.execute(sql)

            result = cursor.fetchall()
            db.commit()

            return result
        except errors.Error as e:
            print('error',e)
        finally:
            cursor.close()
            db.close()


    # -----------------------------------新增新的簽核單--------------------------------------------
    def insertApplicaiton(self, name, departmentId, applicationType, applicationId, status, applicationTime, station):
        try:
            db = pool.get_connection()
            cursor = db.cursor(dictionary=True)
            cursor.execute("""INSERT INTO `application`
            (`approveName-1st`, departmentId, `applicationType`,
              `applicationId`, `status`, `approveTime-1st`, station)
              VALUES (%s,%s, %s, %s, %s, %s, %s)""",
              ( name, departmentId,applicationType, applicationId, status, applicationTime, station,))
            db.commit()
        except errors.Error as e:
            print('error',e)
        finally:
            cursor.close()
            db.close()

    # -----------------------------------更新簽合List表(核准)--------------------------------------------
    def signApplicationDB(self, grad, station, approveName, approveTime, applicationId,managerName,applicatePerson):
        try:

            db = pool.get_connection()
            cursor = db.cursor(dictionary=True)

            if (grad =='Section Manager') and (station =='final') and (managerName==applicatePerson):
                cursor.execute("""UPDATE application
                SET `station`=%s, `approveName-1st`= %s,`approveTime-1st`=%s
                 WHERE `applicationId`=%s;""",
                 (station, approveName, approveTime, applicationId,))
            elif (grad =='Section Manager') and (station =='final') and (managerName!=applicatePerson):
                cursor.execute("""UPDATE application
                SET `station`=%s, `approveName-2nd`= %s, `approveTime-2nd`=%s
                WHERE `applicationId` = %s;""",
                (station, approveName, approveTime, applicationId,))
            elif (grad =='Section Manager') and (station =='complete') :
                cursor.execute("""UPDATE application
                SET `status`='complete',`station`=%s, `approveName-2nd`= %s,`approveTime-2nd`=%s
                 WHERE `applicationId`=%s;""",
                 (station, approveName, approveTime, applicationId,))
            elif (grad =='staff') and (station =='middle'):
                cursor.execute("""UPDATE application
                SET `station`=%s, `approveName-1st`= %s, `approveTime-1st`=%s
                WHERE `applicationId` = %s;""",
                (station, approveName, approveTime, applicationId,))
            elif (grad =='Boss') and (station =='complete'):
                cursor.execute("""UPDATE application
                SET `status`='complete', `station`=%s, `approveName-3th`= %s, `approveTime-3th`=%s
                WHERE `applicationId` = %s;""",
                (station, approveName, approveTime, applicationId,))

            db.commit()
        except errors.Error as e:
            print('error',e)
        finally:
            cursor.close()
            db.close()
    # -----------------------------------更新簽合List表(駁回)--------------------------------------------
    def rejectApplicationDB(self, station, applicationId ):
        try:
            db = pool.get_connection()
            cursor = db.cursor(dictionary=True)
            if station == 'middle':
                cursor.execute("""UPDATE application
                SET `station`=%s,`approveName-3th`= null, `approveTime-3th`= null
                WHERE `applicationId` = %s;""",
                (station,applicationId,))
            else:
                cursor.execute("""UPDATE application
                SET `station`=%s,`approveName-2nd`= null, `approveTime-2nd`= null
                WHERE `applicationId` = %s;""",
                (station,applicationId,))
            db.commit()
        except errors.Error as e:
            print('error',e)
        finally:
            cursor.close()
            db.close()

    def searchMySOcomplete(self, name,applicationId):
        try:

            db = pool.get_connection()
            cursor = db.cursor(dictionary=True)
            if applicationId!='':
                cursor.execute("""SELECT  `application`.`applicationId`, `department`.`departmentName`,
                    `application`.`applicationType`, `application`.`status`,`application`.`station`,
                    `application`.`station`,`application`.`approveName-1st`,
                    `application`.`approveTime-1st`,`application`.`approveName-2nd`,
                    `application`.`approveTime-2nd`,`application`.`approveName-3th`,
                    `application`.`approveTime-3th`,`application`.`turn`
                    FROM `application`
                    INNER JOIN `department` ON `department`.`departmentId`= `application`.`departmentId`
                    WHERE `application`.`applicationType` = 'saleOrder'
                    AND `application`.`status` = 'complete'
                    AND `application`.`turn` is null
                    AND `application`.`approveName-1st` = %s
                    AND `application`.`applicationId` = %s
                    UNION
                    SELECT  `application`.`applicationId`, `department`.`departmentName`,
                    `application`.`applicationType`, `application`.`status`,`application`.`station`,
                    `application`.`station`,`application`.`approveName-1st`,
                    `application`.`approveTime-1st`,`application`.`approveName-2nd`,
                    `application`.`approveTime-2nd`,`application`.`approveName-3th`,
                    `application`.`approveTime-3th`,`application`.`turn`
                    FROM `application`
                    INNER JOIN `department` ON `department`.`departmentId`= `application`.`departmentId`
                    WHERE `application`.`applicationType` = 'purchaseOrder'
                    AND `application`.`status` = 'complete'
                    AND `application`.`turn` is null
                    AND `application`.`approveName-1st` = %s
                    AND `application`.`applicationId` = %s ;""",(name,applicationId,name,applicationId,))
            else:
                cursor.execute("""SELECT  `application`.`applicationId`, `department`.`departmentName`,
                    `application`.`applicationType`, `application`.`status`,`application`.`station`,
                    `application`.`station`,`application`.`approveName-1st`,
                    `application`.`approveTime-1st`,`application`.`approveName-2nd`,
                    `application`.`approveTime-2nd`,`application`.`approveName-3th`,
                    `application`.`approveTime-3th`,`application`.`turn`
                    FROM `application`
                    INNER JOIN `department` ON `department`.`departmentId`= `application`.`departmentId`
                    WHERE `application`.`applicationType` = 'saleOrder'
                    AND `application`.`status` = 'complete'
                    AND `application`.`turn` is null
                    AND `application`.`approveName-1st` = %s
                    UNION
                    SELECT  `application`.`applicationId`, `department`.`departmentName`,
                    `application`.`applicationType`, `application`.`status`,`application`.`station`,
                    `application`.`station`,`application`.`approveName-1st`,
                    `application`.`approveTime-1st`,`application`.`approveName-2nd`,
                    `application`.`approveTime-2nd`,`application`.`approveName-3th`,
                    `application`.`approveTime-3th`,`application`.`turn`
                    FROM `application`
                    INNER JOIN `department` ON `department`.`departmentId`= `application`.`departmentId`
                    WHERE `application`.`applicationType` = 'purchaseOrder'
                    AND `application`.`status` = 'complete'
                    AND `application`.`turn` is null
                    AND `application`.`approveName-1st` = %s;""",(name,name,))
            result = cursor.fetchall()
            db.commit()
            return result
        except errors.Error as e:
            print('error',e)
        finally:
            cursor.close()
            db.close()

    # 收貨進貨的新增簽單
    def insertDeliveryBill(self,departmentId,applicationType,applicationId,status,station):
        try:
            db = pool.get_connection()
            cursor = db.cursor(dictionary=True)
            cursor.execute("""INSERT INTO `application`
            (departmentId, `applicationType`,`applicationId`, `status`, `station`)
            VALUES (%s,%s,%s,%s,%s);""",(departmentId,applicationType,applicationId,status,station,))
            db.commit()
        except errors.Error as e:
                print('error',e)
        finally:
                cursor.close()
                db.close()


    def applicationTurnDB(self,applicationId):
        try:
            db = pool.get_connection()
            cursor = db.cursor(dictionary=True)
            cursor.execute("""UPDATE application SET `turn`='Y' WHERE `applicationId` = %s;""",(applicationId,))
            db.commit()
        except errors.Error as e:
                print('error',e)
        finally:
                cursor.close()
                db.close()




    def deliveryApplicationSign(self,grad,station,newStation, approveName, approveTime, applicationId):

        try:
            db = pool.get_connection()
            cursor = db.cursor(dictionary=True)
            if grad=='staff' and station=='start' and newStation =='middle':
                cursor.execute("""UPDATE application
                SET `station`=%s, `approveName-1st`= %s,`approveTime-1st`=%s
                WHERE `applicationId`=%s;""",
                (newStation, approveName, approveTime, applicationId,))

            elif grad=='Section Manager' and station=='middle'and newStation =='final':
                cursor.execute("""UPDATE application
                SET `station`=%s, `approveName-2nd`= %s, `approveTime-2nd`=%s
                WHERE `applicationId` = %s;""",
                (newStation, approveName, approveTime, applicationId,))

            elif grad=='Section Manager' and station=='middle'and newStation =='start':
                cursor.execute("""UPDATE application
                SET `station`=%s, `approveName-2nd`= null, `approveTime-2nd`=null
                WHERE `applicationId` = %s;""",
                (newStation, applicationId,))

            elif grad=='driver' and station=='final' and newStation =='complete':
                cursor.execute("""UPDATE application
                SET `status`='complete' ,`station`=%s, `approveName-3th`= %s, `approveTime-3th`=%s
                WHERE `applicationId` = %s;""",
                (newStation, approveName, approveTime, applicationId,))

            elif grad=='driver' and station=='final' and newStation =='middle':
                cursor.execute("""UPDATE application
                SET `station`=%s WHERE `applicationId` = %s;""",(newStation, applicationId,))
            db.commit()
        except errors.Error as e:
            print('error',e)
        finally:
            cursor.close()
            db.close()


    def receiptApplicationSign(self,grad,station,newStation, approveName, approveTime, applicationId):

        try:
            db = pool.get_connection()
            cursor = db.cursor(dictionary=True)
            if grad=='staff' and station=='start' and newStation =='middle':
                cursor.execute("""UPDATE application
                SET `station`=%s, `approveName-1st`= %s,`approveTime-1st`=%s
                WHERE `applicationId`=%s;""",
                (newStation, approveName, approveTime, applicationId,))

            elif grad=='Section Manager' and station=='middle'and newStation =='complete':
                cursor.execute("""UPDATE application
                SET `status`='complete',`station`=%s, `approveName-2nd`= %s, `approveTime-2nd`=%s
                WHERE `applicationId` = %s;""",
                (newStation, approveName, approveTime, applicationId,))

            elif grad=='Section Manager' and station=='middle'and newStation =='start':
                cursor.execute("""UPDATE application
                SET `station`=%s, `approveName-2nd`= null, `approveTime-2nd`=null
                WHERE `applicationId` = %s;""",
                (newStation, applicationId,))
            db.commit()
        except errors.Error as e:
            print('error',e)
        finally:
            cursor.close()
            db.close()




application_Model=ApplicationModel()