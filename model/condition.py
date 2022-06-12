from model.pool import pool
from mysql.connector import errors


class conditionModel:
	# -----------------------------------搜尋未遷的清單(沒有單號)--------------------------------------------
	def searchCondition(self, applicationType):
		try:

			db = pool.get_connection()
			cursor = db.cursor(dictionary=True)
			sql = 'SELECT `column`,`conditionExclude` FROM `checkCondition` WHERE `applicationType` = "%s";'%(applicationType)
			cursor.execute(sql)
			result = cursor.fetchall()
			db.commit()
			return result
		except errors.Error as e:
			print('error',e)
		finally:
			cursor.close()
			db.close()





condition_Model=conditionModel()