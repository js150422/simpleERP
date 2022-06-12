from model.pool import pool
from mysql.connector import errors


class saleOrderModel:
	def insertSaleOrderDetail(self,orderNumber,orderList):
		try:
			db = pool.get_connection()
			cursor = db.cursor(dictionary=True)
			for i in range(len(orderList)):
				cursor.execute("""INSERT INTO `saleOrderDetail`
				(`orderNumber`,`productName`,`productPrice`,`OrderQuantity`)
				VALUES (%s, %s, %s, %s)""",
				(orderNumber,orderList[i]['productName'],int(orderList[i]['salePrice']),int(orderList[i]['OrderQuantity']),))
				db.commit()
		except errors.Error as e:
			print('error',e)
		finally:
			cursor.close()
			db.close()


	def insertSaleOrder(self,orderNumber,clientName,taxId,orderDate,repEmployee,paymentTerm,clientCredit,contactName,contactPersonTile,contactPhone,contactEmail,clientAddress):
		try:
			db = pool.get_connection()
			cursor = db.cursor(dictionary=True)
			cursor.execute("""INSERT INTO `saleOrder` (`orderNumber`,`clientName`,
			`taxId`,`orderDate`,`repEmployee`,
			`paymentTerm`,`clientCredit`,
			`contactName`,`contactPersonTile`,`contactPhone`,
			`contactEmail`,`clientAddress`)
			VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s,%s,%s)""",
			(orderNumber,clientName,taxId,orderDate,repEmployee,paymentTerm,clientCredit,contactName,contactPersonTile,contactPhone,contactEmail,clientAddress,))
			db.commit()
		except errors.Error as e:
			print('error',e)
		finally:
			cursor.close()
			db.close()

	def searchSaleOrder(self, orderNumber,status,clientName,taxId,repEmployee,orderDateStart,orderDateEnd,page):
		try:
			db = pool.get_connection()
			cursor = db.cursor(dictionary=True)
			sql= """SELECT `saleOrder`.`orderNumber`,`saleOrder`.`deliveryNumber`,`application`.`status`,`application`.`station`,
			`saleOrder`.`clientName`,`saleOrder`.`taxId`,
			`saleOrder`.`orderDate`,`saleOrder`.`repEmployee`,`saleOrder`.`deliveryDate`,
			`saleOrder`.`paymentTerm`,`saleOrder`.`clientCredit`,
			`saleOrder`.`contactName`,`saleOrder`.`contactPersonTile`,`saleOrder`.`contactPhone`,
			`saleOrder`.`contactEmail`,`saleOrder`.`clientAddress`,`application`.`applicationType`,
			`application`.`approveName-1st`,`application`.`approveTime-1st`,
			`application`.`approveName-2nd`,`application`.`approveTime-2nd`,
			`application`.`approveName-3th`,`application`.`approveTime-3th`,`user`.`name` AS managerName,`application`.`turn`,
					(SELECT GROUP_CONCAT(CONCAT(saleOrderDetail.productName,','),CONCAT(saleOrderDetail.productPrice,','),CONCAT(saleOrderDetail.OrderQuantity))
					FROM `saleOrderDetail`  GROUP BY `orderNumber` HAVING `orderNumber` = `saleOrder`.`orderNumber`)As `saleOrderDetail`,
					(select sum(`productPrice`*`OrderQuantity`) from `saleOrderDetail` GROUP BY `orderNumber` HAVING `orderNumber` = `saleOrder`.`orderNumber`)As amout,
					(SELECT GROUP_CONCAT(name,commentTime,commentText) FROM comment  GROUP BY applicationId HAVING applicationId = saleOrder.`orderNumber`)As comment
					FROM `saleOrder`
					INNER JOIN `saleOrderDetail` ON `saleOrder`.`orderNumber`=`saleOrderDetail`.`orderNumber`
					INNER JOIN `application` ON `saleOrder`.`orderNumber`=`application`.`applicationId`
					INNER JOIN `department` ON `department`.`departmentId`= `application`.`departmentId`
					INNER JOIN `departmentManage` ON `department`.`departmentId`= `departmentManage`.`departmentId`
					INNER JOIN `user` ON `departmentManage`.`manager`= `user`.`employeeId` """
			if orderNumber!='':
				sql=sql+'WHERE `saleOrder`.`orderNumber` = '+"'"+orderNumber+"'"
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
			if repEmployee!='':
				if '=' not in sql:
					sql=sql+'WHERE `saleOrder`.`repEmployee` = '+"'"+repEmployee+"'"
				else:
					sql=sql+' and `saleOrder`.`repEmployee` = '+"'"+repEmployee+"'"

			if orderDateStart!='':
				if '=' not in sql:
					sql=sql+'WHERE `saleOrder`.`orderDate` >= '+"'"+orderDateStart+"'"
				else:
					sql=sql+' and `saleOrder`.`orderDate` >= '+"'"+orderDateStart+"'"
			if orderDateEnd!='':
				if '=' not in sql:
					sql=sql+'WHERE `saleOrder`.`orderDate` <= '+"'"+orderDateEnd+"'"
				else:
					sql=sql+' and `saleOrder`.`orderDate` <= '+"'"+orderDateEnd+"'"
			if clientName!='':
				if '=' not in sql:
					sql=sql+'WHERE `saleOrder`.`clientName` LIKE '+"'"+'%'+clientName+'%'+"'"
				else:
					sql=sql+' and `saleOrder`.`clientName` LIKE '+"'"+'%'+clientName+'%'+"'"

			if page!='':
				sql = sql + ' GROUP BY `saleOrder`.`orderNumber` ORDER BY `saleOrder`.`orderNumber` LIMIT '+page+',11;'
			else:
				sql = sql + ' GROUP BY `saleOrder`.`orderNumber` ORDER BY `saleOrder`.`orderNumber`;'
			cursor.execute(sql)
			result = cursor.fetchall()
			db.commit()

			return result
		except errors.Error as e:
				print('error',e)
		finally:
				cursor.close()
				db.close()



	def updateSaleOrderDB(self,deliveryNumber,applicationId):
		try:
			db = pool.get_connection()
			cursor = db.cursor(dictionary=True)
			sql = 'UPDATE `saleOrder` SET deliveryNumber = "%s" WHERE orderNumber = "%s";'%(deliveryNumber,applicationId)
			cursor.execute(sql)
			db.commit()
		except errors.Error as e:
			print('error',e)
		finally:
			cursor.close()
			db.close()

	def updateDeliveryDate(self,approveTime,applicationId):
		try:
			db = pool.get_connection()
			cursor = db.cursor(dictionary=True)
			sql = 'UPDATE `saleOrder` SET deliveryDate = "%s" WHERE deliveryNumber = "%s";'%(approveTime,applicationId)
			cursor.execute(sql)
			db.commit()
		except errors.Error as e:
			print('error',e)
		finally:
			cursor.close()
			db.close()





saleOrder_Model = saleOrderModel()