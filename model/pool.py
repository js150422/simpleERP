from mysql.connector import pooling
import os
from dotenv import load_dotenv

load_dotenv()
password = os.getenv('password')
server = os.getenv('server')

dbconfig={
'host':server,
'port':3306,
'user':'user1',
'password':password,
'database':'simpleerp',
}




pool=pooling.MySQLConnectionPool(
    pool_name='mypool',
    pool_size=20,
    **dbconfig
)


