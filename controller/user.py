from controller.express import regExp_Model
from model.user import user_Model
from flask_jwt_extended import *
from dotenv import load_dotenv
from flask import *
import time
import os
import boto3


load_dotenv()
regionData = os.getenv('region')
ACCESS_KEY = os.getenv('aws_access_key_id')
SECRET_KEY = os.getenv('aws_secret_access_key')


user=Blueprint('user', __name__)


# 沒過期就把原本jwt再返回前端
@user.route('/api/user',methods=['GET'])
@jwt_required(optional=True)
def mainInit():
    decrypt = get_jwt_identity()
    if request.content_type!='application/json':
        return Response(response='錯誤的格式', status=400)
    else:
        exp_timestamp = get_jwt()['exp']
        uxiNow = time.gmtime()
        NowTimeStamp = time.mktime(uxiNow)
        if int(NowTimeStamp) > int(exp_timestamp):
            return jsonify({'error':True,'message':'token過期'})
        else:
            return decrypt


@user.route('/api/user',methods=['POST'])
def signup():
    if request.content_type!='application/json':
        return Response(response='錯誤的格式', status=400)
    else:
        data = request.get_json()
        expressResult = regExp_Model.checkSign(data)
        if expressResult!= None:
            return expressResult
        else:
            name = data['name']
            email = data['email']
            user = data['user']
            password = data['password']
            repeatUser = {'error': True,'message': 'email重複'}
            result = user_Model.searchUser(user,name='',department='',employeeId='')
            if result == 'error':
                return jsonify({'error':True,'message':'伺服器錯誤'}),500
            else:
                if result == []:
                    user_Model.increaseUser( name, email, user, password)
                    return jsonify({'ok':True,'message':'註冊成功，請先請管理單位設定部門及職等資訊'})
                else:
                    return repeatUser


@user.route('/api/user',methods=['PATCH'])
def signin():
    if request.content_type!='application/json':
        return Response(response='錯誤的格式', status=400)
    else:
        data = request.get_json()
        expressResult = regExp_Model.checkSign(data)
        if expressResult!=None:
            expressResult
        else:
            user = data['user']
            password = data['password']
            return getCookie(user,password)


@user.route('/api/user',methods=['DELETE'])
def signout():
    if request.content_type!='application/json':
        return Response(response='錯誤的格式', status=400)
    else:
        success = make_response({'ok':True})
        success.delete_cookie('access_token')
        return success


def getCookie(user,password):
    searchResult=user_Model.searchUser(user,name='',department='',employeeId='')
    if searchResult == 'error':
        return jsonify({'error':True,'message':'伺服器錯誤'}),500
    else:
        if searchResult == []:
            return jsonify({'error':True,'message':'查無此帳號'})
        else:

            if searchResult[0]['user'] == user and searchResult[0]['password'] == password:
                if 'departmentName' in searchResult[0]:
                    access_token = create_access_token(identity = {'name' : searchResult[0]['name'],
                    'departmentName' : searchResult[0]['departmentName'],
                    'grad': searchResult[0]['grad'],
                    'email':searchResult[0]['email'],
                    'user':searchResult[0]['user'],
                    'headPhoto':searchResult[0]['headPhoto'],
                    'signPhoto':searchResult[0]['signPhoto'],
                    'employeeId' : searchResult[0]['employeeId'],
                    'departmentId':searchResult[0]['departmentId']})

                    success = make_response({'name' : searchResult[0]['name'],
                    'employeeId' : searchResult[0]['employeeId'],
                    'departmentName' : searchResult[0]['departmentName']})

                    success.set_cookie('access_token', access_token)
                    return success
                else:
                    access_token = create_access_token(identity = {'name' : searchResult[0]['name'],
                     'grad': searchResult[0]['grad'],
                     'email':searchResult[0]['email'],
                     'user':searchResult[0]['user'],
                     'headPhoto':searchResult[0]['headPhoto'],
                     'signPhoto':searchResult[0]['signPhoto'],
                     'employeeId' : searchResult[0]['employeeId']})

                    success = make_response({'name' : searchResult[0]['name'],'employeeId' : searchResult[0]['employeeId']})
                    success.set_cookie('access_token', access_token)
                    return success
            else:
                return jsonify({'error':True,'message':'帳號密碼錯誤'})


#---------------------------------↑使用者狀態相關---------------------------------------------------------------------------------------

@user.route('/api/user/departmentMember',methods=['GET'])
def searchDepartmentMember():
    if request.content_type!='application/json':
        return Response(response='錯誤的格式', status=400)
    else:
        department=request.args.get('department')
        searchDtResult = user_Model.searchUser(user='',name='',department=department,employeeId='')
        if searchDtResult == 'error':
            return jsonify({'error':True,'message':'伺服器錯誤'}),500
        else:
            if searchDtResult == None:
                return jsonify({'error':True,'message':'沒這個部門'})
            else:
                return jsonify({'data':searchDtResult})


@user.route('/api/user/signPig',methods=['GET'])
def getSignJpg():
    if request.content_type!='application/json':
        return Response(response='錯誤的格式', status=400)
    else:
        sign1=request.args.get('sign1')
        sign2=request.args.get('sign2')
        sign3=request.args.get('sign3')
        searchSignResult = user_Model.searchSignJpgDb(sign1,sign2,sign3)
        if searchSignResult == 'error':
            return jsonify({'error':True,'message':'伺服器錯誤'}),500
        else:
            if searchSignResult == None:
                return jsonify({'error':True,'message':'沒這個部門'})
            else:
                return jsonify({'data':searchSignResult})


@user.route('/api/user/getUserId',methods=['GET'])
def searchName():
    if request.content_type!='application/json':
        return Response(response='錯誤的格式', status=400)
    else:
        name = request.args.get('name')
        searchNameResult = user_Model.searchUser(user='', name = name, department='', employeeId='')
        if searchNameResult == 'error':
            return jsonify({'error':True,'message':'伺服器錯誤'}),500
        else:
            if searchNameResult == []:
                return jsonify({'error':True,'message':'該員工尚未註冊'})
            else:
                return jsonify({'data':searchNameResult})


@user.route('/api/user/setEmployeeDepartment',methods=['PUT'])
def setEmployeeDepartment():
    if request.content_type!='application/json':
        return Response(response='錯誤的格式', status=400)
    else:
        data = request.get_json()
        checkInputRegExp = regExp_Model.checkSetEmployeeDepartmentInfo(data)
        if checkInputRegExp!=None:
            return jsonify(checkInputRegExp)
        else:
            employeeId = data['employeeId']
            departmentId = data['departmentId']
            checkEmployeeInDBresult = user_Model.searchUser(user='',name='',department='',employeeId=employeeId)
            if checkEmployeeInDBresult == 'error':
                return jsonify({'error':True,'message':'伺服器錯誤'}),500
            else:
                if checkEmployeeInDBresult == []:
                    return jsonify({'error':True,'message':'沒有此員工'})
                else:
                    if checkEmployeeInDBresult[0]['departmentId']==0:
                        user_Model.insertDepartmentMember(employeeId,departmentId)
                    else:
                        user_Model.upDateDepartmentMember(departmentId,employeeId)
                    return jsonify({'ok':True,'message':'更新成功'})


@user.route('/api/user/updateGrad',methods=['PATCH'])
def updateGrad():
    if request.content_type!='application/json':
        return Response(response='錯誤的格式', status=400)
    else:
        data = request.get_json()
        checkInputRegExp = regExp_Model.checkUpdateGradInfo(data)
        if checkInputRegExp!=None:
            return jsonify(checkInputRegExp)
        else:
            grad = data['grad']
            employeeId = data['employeeId']
            checkEmployeeInDBresult = user_Model. searchUser(user='',name='',department='',employeeId=employeeId)
            if checkEmployeeInDBresult == 'error':
                return jsonify({'error':True,'message':'伺服器錯誤'}),500
            else:
                if checkEmployeeInDBresult == None:
                    return jsonify({'error':True,'message':'沒有此員工'})
                else:
                    user_Model.updateGrad(grad, employeeId)
                    return jsonify({'ok':True,'message':'更新成功'})


@user.route('/api/user/jpg',methods=['POST'])
def headPigUpload():
    file = request.files.get('files')
    employeeId = request.form['employeeId']
    content_type = request.mimetype
    hint = request.form['hint']
    uxiTime = time.gmtime() # 取得時間元組
    uxiTimeStamp = int(time.mktime(uxiTime)) # 將時間員組轉成時間戳
    #-------------------------------s3新增------------------------------
    try:
        s3Client = boto3.client('s3', region_name = regionData, aws_access_key_id = ACCESS_KEY, aws_secret_access_key = SECRET_KEY)
        s3Client.put_object(Body = file,Bucket='jane-s3',Key = 'simpleERP/' + f'{uxiTimeStamp}-{employeeId}-{hint}',ContentType=content_type)
    except:
        return {'error': True, 'message': 'S3錯誤'}, 500

    url = 'https://jane-s3.s3.amazonaws.com/simpleERP/'+f'{uxiTimeStamp}-{employeeId}-{hint}'
    result = user_Model.jpgUpLoad(url,employeeId,hint)
    if result=='error':
        return jsonify({'error':True,'message':'伺服器錯誤'}),500
    else:
        return {'ok':True}


