from model.pool import pool
from mysql.connector import errors


class DepartmentModel:
	def searchDepartment(self, departmentId):
		try:
			db = pool.get_connection()
			cursor = db.cursor(dictionary=True)
			cursor.execute("""SELECT `department`.`departmentId`,`department`.`departmentName`,`user`.`name`
								FROM `department`,`departmentManage`,`user`
								WHERE `department`.`departmentId` = `departmentManage`.`departmentId`
								AND `departmentManage`.`manager` = `user`.`employeeId`
								AND `department`.`departmentId`=%s""",(str(departmentId),))
			result = cursor.fetchone()
			db.commit()
			return result
		except errors.Error as e:
			print('error',e)
		finally:
			cursor.close()
			db.close()

	def insertDepartmentManager(self, departmentId, managerId):
		try:
			db = pool.get_connection()
			cursor = db.cursor(dictionary=True)
			sql = 'INSERT INTO `departmentManage` (`departmentId`,`manager`) VALUES (%s, %s)'%(str(departmentId), str(managerId))

			cursor.execute(sql)
			db.commit()
		except errors.Error as e:
			print('error',e)
		finally:
			cursor.close()
			db.close()

	def updateDepartmentManager(self,  managerId,departmentId):
		try:
			db = pool.get_connection()
			cursor = db.cursor(dictionary=True)
			sql = 'UPDATE departmentManage SET `manager` =%s WHERE `departmentId` = %s'%(str(managerId),str(departmentId))

			cursor.execute(sql)
			db.commit()
		except errors.Error as e:
			print('error',e)
		finally:
			cursor.close()
			db.close()

	def searchDepartmentName(self,departmentId):
		try:
			db = pool.get_connection()
			cursor = db.cursor(dictionary=True)
			if departmentId!='':
				sql = 'SELECT `departmentId`,`departmentName` FROM `department` WHERE departmentId = %s'%(str(departmentId))
			else:
				sql = 'SELECT `departmentId`,`departmentName` FROM `department`'
			cursor.execute(sql)
			result = cursor.fetchall()
			db.commit()
			return result
		except errors.Error as e:
			print('error',e)
		finally:
			cursor.close()
			db.close()

	def searchDepartmentManageDB(self,departmentId):

		try:
			db = pool.get_connection()
			cursor = db.cursor(dictionary=True)
			cursor.execute("""SELECT `department`.`departmentName`,`user`.`name` FROM `departmentManage`
							INNER JOIN `user` ON `departmentManage`.`manager` = `user`.`employeeId`
							INNER JOIN `work` ON `user`.`employeeId` = `work`.`employeeId`
							INNER JOIN `department` ON `work`.`departmentId` = `department`.`departmentId`
							WHERE `department`.`departmentId` = %s""",(str(departmentId),))
			result = cursor.fetchone()
			db.commit()

			return result
		except errors.Error as e:
			print('error',e)
		finally:
			cursor.close()
			db.close()




department_Model=DepartmentModel()