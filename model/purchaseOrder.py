from model.pool import pool
from mysql.connector import errors


class PurchaseModel:
	def insertPurchaseOrderDetail(self,orderNumber,orderList):
		try:
			db = pool.get_connection()
			cursor = db.cursor(dictionary=True)
			for i in range(len(orderList)):
				cursor.execute("""INSERT INTO `purchaseOrderDetail`
				(`orderNumber`,`productName`,`productPrice`,`OrderQuantity`)
				VALUES (%s, %s, %s, %s)""",
				(orderNumber,orderList[i]['productName'],int(orderList[i]['costPrice']),int(orderList[i]['OrderQuantity']),))
				db.commit()
		except errors.Error as e:
			print('error',e)
		finally:
			cursor.close()
			db.close()


	def insertPurchaseOrder(self,orderNumber,supplierName,taxId,orderDate,repEmployee,paymentTerm,contactName,contactPersonTile,contactPhone,contactEmail,supplierAddress):
		try:
			db = pool.get_connection()
			cursor = db.cursor(dictionary=True)
			cursor.execute("""INSERT INTO `purchaseOrder` (`orderNumber`,`supplierName`,
			`taxId`,`orderDate`,`repEmployee`,
			`paymentTerm`,
			`contactName`,`contactPersonTile`,`contactPhone`,
			`contactEmail`,`supplierAddress`)
			VALUES (%s, %s, %s, %s, %s, %s, %s, %s,%s,%s, %s )""",
			(orderNumber,supplierName,taxId,orderDate,repEmployee,paymentTerm,contactName,contactPersonTile,contactPhone,contactEmail,supplierAddress,))
			db.commit()
		except errors.Error as e:
			print('error',e)
		finally:
			cursor.close()
			db.close()

	def searchPurchaseOrder(self, orderNumber,status,supplierName,taxId,repEmployee,orderDateStart,orderDateEnd,page):
		try:
			db = pool.get_connection()
			cursor = db.cursor(dictionary=True)
			sql= """SELECT `purchaseOrder`.`orderNumber`, `purchaseOrder`.`receiptNumber`,
			`application`.`status`,`application`.`station`,`purchaseOrder`.`supplierName`,
			`purchaseOrder`.`taxId`,`purchaseOrder`.`orderDate`,
			`purchaseOrder`.`receiptDate`,`purchaseOrder`.`repEmployee`,
			`purchaseOrder`.`paymentTerm`,`purchaseOrder`.`contactName`,
			`purchaseOrder`.`contactPersonTile`,`purchaseOrder`.`contactPhone`,
			`purchaseOrder`.`contactEmail`,`purchaseOrder`.`supplierAddress`,
			`application`.`applicationType`,`application`.`approveName-1st`,
			`application`.`approveTime-1st`,`application`.`approveName-2nd`,
			`application`.`approveTime-2nd`,`application`.`approveName-3th`,
			`application`.`approveTime-3th`,`user`.`name` AS managerName,
					(SELECT GROUP_CONCAT(CONCAT(purchaseOrderDetail.productName,','),CONCAT(purchaseOrderDetail.productPrice,','),CONCAT(purchaseOrderDetail.OrderQuantity))
					FROM `purchaseOrderDetail`  GROUP BY `orderNumber` HAVING `orderNumber` = `purchaseOrder`.`orderNumber`)As `purchaseOrderDetail`,
					(select sum(`productPrice`*`OrderQuantity`) from `purchaseOrderDetail` GROUP BY `orderNumber` HAVING `orderNumber` = `purchaseOrder`.`orderNumber`)As amout,
					(SELECT GROUP_CONCAT(name,commentTime,commentText) FROM comment  GROUP BY applicationId HAVING applicationId = purchaseOrder.`orderNumber`)As comment
					FROM `purchaseOrder`
					INNER JOIN `purchaseOrderDetail` ON `purchaseOrder`.`orderNumber`=`purchaseOrderDetail`.`orderNumber`
					INNER JOIN `application` ON `purchaseOrder`.`orderNumber`=`application`.`applicationId`
					INNER JOIN `department` ON `department`.`departmentId`= `application`.`departmentId`
					INNER JOIN `departmentManage` ON `department`.`departmentId`= `departmentManage`.`departmentId`
					INNER JOIN `user` ON `departmentManage`.`manager`= `user`.`employeeId` """
			if orderNumber!='':
				sql=sql+'WHERE `purchaseOrder`.`orderNumber` = '+"'"+orderNumber+"'"
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
			if repEmployee!='':
				if '=' not in sql:
					sql=sql+'WHERE `purchaseOrder`.`repEmployee` = '+"'"+repEmployee+"'"
				else:
					sql=sql+' and `purchaseOrder`.`repEmployee` = '+"'"+repEmployee+"'"

			if orderDateStart!='':
				if '=' not in sql:
					sql=sql+'WHERE `purchaseOrder`.`orderDate` >= '+"'"+orderDateStart+"'"
				else:
					sql=sql+' and `purchaseOrder`.`orderDate` >= '+"'"+orderDateStart+"'"
			if orderDateEnd!='':
				if '=' not in sql:
					sql=sql+'WHERE `purchaseOrder`.`orderDate` <= '+"'"+orderDateEnd+"'"
				else:
					sql=sql+' and `purchaseOrder`.`orderDate` <= '+"'"+orderDateEnd+"'"
			if supplierName!='':
				if '=' not in sql:
					sql=sql+'WHERE `purchaseOrder`.`supplierName` LIKE '+"'"+'%'+supplierName+'%'+"'"
				else:
					sql=sql+' and `purchaseOrder`.`supplierName` LIKE '+"'"+'%'+supplierName+'%'+"'"

			if page!='':
				sql = sql + ' GROUP BY `purchaseOrder`.`orderNumber` ORDER BY `purchaseOrder`.`orderNumber` LIMIT '+page+',11;'
			else:
				sql = sql + ' GROUP BY `purchaseOrder`.`orderNumber` ORDER BY `purchaseOrder`.`orderNumber`;'

			cursor.execute(sql)
			result = cursor.fetchall()
			db.commit()

			return result
		except errors.Error as e:
				print('error',e)
		finally:
				cursor.close()
				db.close()



	def updatePurchaseOrderDB(self,receiptNumber,applicationId):
		try:
			db = pool.get_connection()
			cursor = db.cursor(dictionary=True)
			sql = 'UPDATE `purchaseOrder` SET receiptNumber = "%s" WHERE orderNumber = "%s";'%(receiptNumber,applicationId)
			cursor.execute(sql)
			db.commit()
		except errors.Error as e:
			print('error',e)
		finally:
			cursor.close()
			db.close()

	def updateReceiptDate(self,approveTime,applicationId):
		try:
			db = pool.get_connection()
			cursor = db.cursor(dictionary=True)
			sql = 'UPDATE `purchaseOrder` SET receiptDate = "%s" WHERE receiptNumber = "%s";'%(approveTime,applicationId)
			cursor.execute(sql)
			db.commit()
		except errors.Error as e:
			print('error',e)
		finally:
			cursor.close()
			db.close()




purchaseOrder_Model = PurchaseModel()