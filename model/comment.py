from model.pool import pool
from mysql.connector import errors



class CommentModel:
	def searchCommentDB(self, data):
		try:
			db = pool.get_connection()
			cursor = db.cursor(dictionary=True)
			if 'applicationId' in data:
				sql = 'SELECT `applicationId`,`name`,`commentText`,`commentTime` FROM `comment` WHERE `applicationId` ="%s"'%(data['applicationId'])
			else:
				sql = 'SELECT `applicationId`,`name`,`commentText`,`commentTime` FROM `comment` WHERE `commentTime` ="%s"'%(data['commentTime'])
			cursor.execute(sql)
			result = cursor.fetchall()
			db.commit()
			return result
		except errors.Error as e:
			print('error',e)
		finally:
			cursor.close()
			db.close()

	def insertCommentDB(self, applicationId, name, comment,commentTime):
		try:
			db = pool.get_connection()
			cursor = db.cursor(dictionary=True)
			cursor.execute("""INSERT INTO `comment`
			(`applicationId`, `name`, `commentText`,`commentTime`)
			VALUES (%s, %s,%s,%s)""",
			(applicationId, name, comment,commentTime,))
			db.commit()
		except errors.Error as e:
			print('error',e)
		finally:
			cursor.close()
			db.close()


comment_Model=CommentModel()