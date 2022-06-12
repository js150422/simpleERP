from model.pool import pool
from mysql.connector import errors


class SupplierModel:
	def increaseSupplier(self, applicationId, data ):
		try:
			db = pool.get_connection()
			cursor = db.cursor(dictionary=True)
			cursor.execute("""INSERT INTO `supplier`
			(applicationId, supplierName, taxId, supplierAddress,
			 supplierCapital, contactName,contactPersonTile,
              contactPhone,  contactEmail,paymentTerm,
               repEmployee, supplierNote)
			  VALUES ( %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)""",
			  (applicationId,data['supplierName'],
               data['taxId'],data['supplierAddress'],
                data['supplierCapital'],data['contactName'],
                data['contactPersonTile'],data['contactPhone'],
                data['contactEmail'],data['paymentTerm'],
                data['repEmployee'],data['supplierNote']))
			db.commit()
		except errors.Error as e:
			print('error',e)
		finally:
			cursor.close()
			db.close()



	def summarySupplierDB(self, status,applicationId,taxId,supplierName,repEmployee,page):
		try:
			db = pool.get_connection()
			cursor = db.cursor(dictionary=True)
			sql= """SELECT `supplier`.`applicationId`,`application`.`status`,`application`.`station`,
					`supplier`.`supplierName`,`supplier`.`taxId`,
					`supplier`.`supplierAddress`,`supplier`.`supplierCapital`,`supplier`.`contactPersonTile`,
					`supplier`.`contactName`,`supplier`.`contactPhone`,
					`supplier`.`contactEmail`,`supplier`.`paymentTerm`,
					`supplier`.`repEmployee`,`supplier`.`supplierNote`,`application`.`applicationType`,
					`application`.`approveName-1st`,`application`.`approveTime-1st`,
					`application`.`approveName-2nd`,`application`.`approveTime-2nd`,
					`application`.`approveName-3th`,`application`.`approveTime-3th`,`user`.`name` AS managerName,
					(SELECT GROUP_CONCAT(name,commentTime,commentText) FROM comment  GROUP BY applicationId HAVING applicationId = supplier.applicationId)As comment
					FROM `supplier`
					INNER JOIN `application` ON `supplier`.`applicationId`=`application`.`applicationId`
					INNER JOIN `department` ON `department`.`departmentId`= `application`.`departmentId`
					INNER JOIN `departmentManage` ON `department`.`departmentId`= `departmentManage`.`departmentId`
					INNER JOIN `user` ON `departmentManage`.`manager`= `user`.`employeeId` """
			if status!='':
				sql=sql+'WHERE `application`.`status` = '+"'"+status+"'"
			if applicationId!='':
				if '=' not in sql:
					sql=sql+'WHERE `supplier`.`applicationId` = '+"'"+applicationId+"'"
				else:
					sql=sql+' and `supplier`.`applicationId` = '+"'"+applicationId+"'"
			if taxId!='':
				if '=' not in sql:
					sql=sql+'WHERE `supplier`.`taxId` ='+"'"+taxId+"'"
				else:
					sql=sql+' and `supplier`.`taxId` = '+"'"+taxId+"'"
			if repEmployee!='':
				if '=' not in sql:
					sql=sql+'WHERE `supplier`.`repEmployee` = '+"'"+repEmployee+"'"
				else:
					sql=sql+' and `supplier`.`repEmployee` = '+"'"+repEmployee+"'"
			if supplierName!='':
				if ('=' not in sql) and ('LIKE' not in sql):
					sql=sql+'WHERE `supplier`.`supplierName` LIKE '+"'"+'%'+supplierName+'%'+"'"
				else:
					sql=sql+' and `supplier`.`supplierName` LIKE '+"'"+'%'+supplierName+'%'+"'"
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




supplier_Model=SupplierModel()