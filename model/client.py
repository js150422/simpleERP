from model.pool import pool
from mysql.connector import errors


class ClientModel:
	def increaseClient(self, applicationId, data ):
		try:
			db = pool.get_connection()
			cursor = db.cursor(dictionary=True)
			cursor.execute("""INSERT INTO `client`
			(applicationId, clientName, taxId,
			 clientAddress,clientCapital,
			  contactName,contactPersonTile, contactPhone,  contactEmail,
			  paymentTerm, clientCredit, repEmployee, clientNote)
			  VALUES ( %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)""",
			  (applicationId,data['clientName'], data['taxId'],
			   data['clientAddress'], data['clientCapital'],
			    data['contactName'], data['contactPersonTile'], data['contactPhone'],data['contactEmail'],
				data['paymentTerm'],data['clientCredit'], data['repEmployee'],data['clientNote'],))
			db.commit()
		except errors.Error as e:
			print('error',e)
		finally:
			cursor.close()
			db.close()



	def summaryClientDB(self, status,applicationId,taxId,clientName,repEmployee,page):
		try:
			db = pool.get_connection()
			cursor = db.cursor(dictionary=True)
			sql= """SELECT `client`.`applicationId`,`application`.`status`,`application`.`station`,
					`client`.`clientName`,`client`.`taxId`,
					`client`.`clientAddress`,`client`.`clientCapital`,
					`client`.`contactName`,`client`.`contactPersonTile`,`client`.`contactPhone`,
					`client`.`contactEmail`,`client`.`paymentTerm`,
					`client`.`clientCredit`,`client`.`repEmployee`,
					`client`.`clientNote`,`application`.`applicationType`,
					`application`.`approveName-1st`,`application`.`approveTime-1st`,
					`application`.`approveName-2nd`,`application`.`approveTime-2nd`,
					`application`.`approveName-3th`,`application`.`approveTime-3th`,`user`.`name` AS managerName,
					(SELECT GROUP_CONCAT(name,commentTime,commentText) FROM comment  GROUP BY applicationId HAVING applicationId = client.applicationId)As comment
					FROM `client`
					INNER JOIN `application` ON `client`.`applicationId`=`application`.`applicationId`
					INNER JOIN `department` ON `department`.`departmentId`= `application`.`departmentId`
					INNER JOIN `departmentManage` ON `department`.`departmentId`= `departmentManage`.`departmentId`
					INNER JOIN `user` ON `departmentManage`.`manager`= `user`.`employeeId` """
			if status!='':
				sql=sql+'WHERE `application`.`status` = '+"'"+status+"'"
			if applicationId!='':
				if '=' not in sql:
					sql=sql+'WHERE `client`.`applicationId` = '+"'"+applicationId+"'"
				else:
					sql=sql+' and `client`.`applicationId` = '+"'"+applicationId+"'"
			if taxId!='':
				if '=' not in sql:
					sql=sql+'WHERE `client`.`taxId` ='+"'"+taxId+"'"
				else:
					sql=sql+' and `client`.`taxId` = '+"'"+taxId+"'"
			if repEmployee!='':
				if '=' not in sql:
					sql=sql+'WHERE `client`.`repEmployee` = '+"'"+repEmployee+"'"
				else:
					sql=sql+' and `client`.`repEmployee` = '+"'"+repEmployee+"'"
			if clientName!='':
				if ('=' not in sql) and ('LIKE' not in sql):
					sql=sql+'WHERE `client`.`clientName` LIKE '+"'"+'%'+clientName+'%'+"'"
				else:
					sql=sql+' and `client`.`clientName` LIKE '+"'"+'%'+clientName+'%'+"'"
			if page!='':
				sql = sql + ' ORDER BY `client`.`applicationId` LIMIT '+page+',11;'
			else:
				sql = sql + ' ORDER BY `client`.`applicationId`;'

			cursor.execute(sql)
			result = cursor.fetchall()
			db.commit()
			return result
		except errors.Error as e:
			print('error',e)
		finally:
			cursor.close()
			db.close()




client_Model=ClientModel()