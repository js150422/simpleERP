from model.pool import pool
from mysql.connector import errors



class UserModel:
	def searchUser(self,user,name,department,employeeId):

		try:
			db = pool.get_connection()
			cursor = db.cursor(dictionary=True)

			sql = """SELECT
			`user`.`employeeId`, `user`.`name`,
			`user`.`email`, `user`.`user`,
			 `user`.`password`, `user`.`grad`,
			`department`.`departmentId`,
			`department`.`departmentName`,
			`user`.headPhoto, `user`.signPhoto
			FROM `user`, `work`, `department`
			WHERE `user`.`employeeId` = `work`.`employeeId`
			AND `work`.`departmentId` = `department`.`departmentId` """
			if user!='':
				sql=sql+'AND `user`.`user` = '+"'"+user+"'"
			if name!='':
				sql=sql+'AND `user`.`name` = '+"'"+name+"'"
			if department!='':
				sql=sql+'AND `department`.`departmentName` = '+"'"+department+"'"
			if employeeId!='':
				sql=sql+'AND `user`.`employeeId` = '+str(employeeId)
			cursor.execute(sql)

			result = cursor.fetchall()

			db.commit()
			if result == []:
				#尚未設定部門的這邊才撈的到，為了要讓資料格一致設定grad,employeeId is null AS departmentId及employeeId is null AS departmentName
				if user!='':
					cursor.execute("""SELECT `employeeId`,`name`, email, user, password,
					 grad,employeeId is null AS departmentId,
					 employeeId is null AS departmentName,
					headPhoto, signPhoto  FROM `user` WHERE user =%s;""",(user,))
				if name!='':
					cursor.execute("""SELECT `employeeId`,`name`, email, user, password,
					 grad,employeeId is null AS departmentId,employeeId is null AS departmentName,
					headPhoto, signPhoto  FROM `user` WHERE name =%s;""",(name,))
				if employeeId!='':
					cursor.execute("""SELECT `employeeId`,`name`, email, user, password,
					 grad,employeeId is null AS departmentId,employeeId is null AS departmentName,
					headPhoto, signPhoto  FROM `user` WHERE employeeId =%s;""",(employeeId,))
				result = cursor.fetchall()

				db.commit()
			return result
		except errors.Error as e:
			print('error',e)
		finally:
			cursor.close()
			db.close()


	def searchSignJpgDb(self,sign1,sign2,sign3):
		try:
			db = pool.get_connection()
			cursor = db.cursor(dictionary=True)
			sql = 'SELECT `name`,`signPhoto` FROM `user`'
			if sign1!='':
				sql=sql+'WHERE `name` = '+"'"+sign1+"'"
			if sign2!='':
				if '=' not in sql:
					sql=sql+'WHERE `name` = '+"'"+sign2+"'"
				else:
					sql=sql+' or `name` = '+"'"+sign2+"'"
			if sign3!='':
				if '=' not in sql:
					sql=sql+'WHERE `name` = '+"'"+sign3+"'"
				else:
					sql=sql+' or `name` = '+"'"+sign3+"'"

			cursor.execute(sql)
			result = cursor.fetchall()
			db.commit()
			return result
		except errors.Error as e:
			print('error',e)
		finally:
			cursor.close()
			db.close()




	def increaseUser(self, name, email, user, password):
		try:
			db = pool.get_connection()
			cursor = db.cursor(dictionary=True)
			sql = 'INSERT INTO `user` (name,  email, user, password) VALUES (%s, %s, %s, %s)'
			val = (name, email, user, password)
			cursor.execute(sql,val)
			db.commit()
		except errors.Error as e:
			print('error',e)
		finally:
			cursor.close()
			db.close()


	def updateGrad(self, grad,employeeId):
		try:
			db = pool.get_connection()
			cursor = db.cursor(dictionary=True)
			sql = 'UPDATE `user` SET grad = "%s" WHERE employeeId = %s;'%(grad,str(employeeId))
			cursor.execute(sql)
			db.commit()
		except errors.Error as e:
			print('error',e)
		finally:
			cursor.close()
			db.close()



	def jpgUpLoad(self,url,user,hint):
		try:
			db = pool.get_connection()
			cursor = db.cursor(dictionary=True)
			if hint=='head':
				sql = 'UPDATE `user` SET `headPhoto` = %s WHERE `employeeId` = %s '
			else:
				sql = 'UPDATE `user` SET `signPhoto` = %s WHERE `employeeId` = %s '
			val = (url,user)
			cursor.execute(sql,val)
			db.commit()
		except errors.Error as e:
			print('error',e)
		finally:
			cursor.close()
			db.close()

# -------------------------------------------------------work--------------------------------------------------------------

	def checkDepartmentMember(self, employeeId):
		try:
			db = pool.get_connection()
			cursor = db.cursor(dictionary=True)
			sql = 'SELECT `departmentId`,`employeeId` FROM `work` WHERE employeeId =%s;'%(str(employeeId))
			cursor.execute(sql)
			result = cursor.fetchone()

			db.commit()
			return result
		except errors.Error as e:
			print('error',e)
		finally:
			cursor.close()
			db.close()



	def insertDepartmentMember(self, employeeId,departmentId):
		try:
			db = pool.get_connection()
			cursor = db.cursor(dictionary=True)
			sql = 'INSERT INTO `work` (employeeId,departmentId) VALUES (%s, %s);'%(str(employeeId),str(departmentId))
			cursor.execute(sql)
			db.commit()
		except errors.Error as e:
			print('error',e)
		finally:
			cursor.close()
			db.close()


	def upDateDepartmentMember(self, departmentId,employeeId):
		try:
			db = pool.get_connection()
			cursor = db.cursor(dictionary=True)
			sql = 'UPDATE `work` SET departmentId = %s WHERE employeeId = %s;'%(str(departmentId),str(employeeId))
			cursor.execute(sql)
			db.commit()
		except errors.Error as e:
			print('error',e)
		finally:
			cursor.close()
			db.close()

user_Model=UserModel()