
from controller.timeConvert import timeConvert
from controller.application import applicationIdGet
from dotenv import load_dotenv
from controller.express import regExp_Model
from model.product import product_Model
from flask import *
import time
import os
import boto3


product = Blueprint('product', __name__)

load_dotenv()
regionData = os.getenv('region')
ACCESS_KEY = os.getenv('aws_access_key_id')
SECRET_KEY = os.getenv('aws_secret_access_key')



@product.route('/api/product',methods=['POST'])
def createProduct():
    if request.content_type!='application/json':
        return Response(response='錯誤的格式', status=400)
    else:
        data = request.get_json()
        checkInputRegExp = regExp_Model.checkProductInsert(data)
        if checkInputRegExp!=None:
            return jsonify(checkInputRegExp)
        else:
            productName = data['productName']
            supplierName = data['supplierName']
            costPrice = data['costPrice']
            productUnit = data['productUnit']
            productDescription = data['productDescription']
            name = data['name']
            grad = data['grad']
            result = product_Model.searchProduct(priceStart='',priceEnd='',applicationId ='',status='',productName=productName,productDescription=productDescription,supplierName=supplierName,page='')
            if result == 'error':
                return jsonify({'error':True,'message':'伺服器錯誤'}),500
            else:
                if result == []:
                    applicationId = applicationIdGet(name,'productCreate',grad)
                    product_Model.insertProduct(applicationId,productName, supplierName,costPrice,productUnit,productDescription)
                    return jsonify({'data':applicationId})
                else:
                    return jsonify({'error':True,'message':'已有重複的商品'})


@product.route('/api/product/jpg',methods=['POST'])
def productPigUpload():
	file = request.files.get('files')
	applicationId  = request.form['applicationId']
	content_type = request.mimetype
	uxiTime = time.gmtime() # 取得時間元組
	uxiTimeStamp = int(time.mktime(uxiTime)) # 將時間員組轉成時間戳
	#-------------------------------s3新增------------------------------
	try:
		s3Client = boto3.client('s3', region_name = regionData, aws_access_key_id = ACCESS_KEY, aws_secret_access_key = SECRET_KEY)
		s3Client.put_object(Body = file,Bucket='jane-s3',Key = 'simpleERP/' + f'{uxiTimeStamp}-product-{applicationId}',ContentType=content_type)
	except:
		return {'error': True, 'message': 'S3錯誤'}, 500

	url = 'https://jane-s3.s3.amazonaws.com/simpleERP/'+f'{uxiTimeStamp}-product-{applicationId}'
	result = product_Model.jpgUpLoad(url,applicationId)
	if result=='error':
		return jsonify({'error':True,'message':'伺服器錯誤'}),500
	else:
		return {'ok':True}

def statusCheck(applicationStatus):
    if applicationStatus == '申請中':
        return 'running'
    elif applicationStatus == '審核完成':
        return 'complete'
    else:
        return ''

@product.route('/api/product',methods=['GET'])
def conditionSearch():
    if request.content_type!='application/json':
        return Response(response='錯誤的格式', status=400)
    else:
        page = request.args.get('page')
        if page == None:
            page = ''
        productName = request.args.get('productName')
        if productName == None:
            productName = ''
        supplierName = request.args.get('supplierName')
        if supplierName == None:
            supplierName =''
        productDescription = request.args.get('productDescription')
        if productDescription==None:
            productDescription=''
        priceStart = request.args.get('priceStart')
        if priceStart==None:
            priceStart=''
        priceEnd = request.args.get('priceEnd')
        if priceEnd==None:
            priceEnd=''
        applicationId = request.args.get('applicationId')
        if applicationId ==None:
            applicationId=''
        applicationStatus = request.args.get('applicationStatus')
        if applicationStatus == None:
            applicationStatus=''
        status = statusCheck(applicationStatus)
        result = product_Model.searchProduct(priceStart,priceEnd,applicationId,status,productName,productDescription,supplierName,page)
        if result == 'error':
            return jsonify({'error':True,'message':'伺服器錯誤'}),500
        else:
            if result==[]:
                return jsonify({'error':True,'message':'沒有符合的資料'})
            else:
                return jsonify({'data':timeConvert(result)})


@product.route('/api/product/single',methods=['GET'])
def getProductSingle():
    if request.content_type!='application/json':
        return Response(response='錯誤的格式', status=400)
    else:
        applicationId  = request.args.get('applicationId')
        result = product_Model.searchProduct(priceStart='',priceEnd='',applicationId =applicationId,status='',productName='',productDescription='',supplierName='',page='')
        if result == 'error':
            return jsonify({'error':True,'message':'伺服器錯誤'}),500
        else:
            if result==None:
                return jsonify({'error':True,'message':'沒有符合的資料'})
            else:
                return jsonify({'data':timeConvert(result)})



