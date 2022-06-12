from controller.timeConvert import timeConvert
from model.application import application_Model
from model.department import department_Model
from model.condition import condition_Model
from controller.express import regExp_Model
from datetime import datetime, timedelta
from flask import *
import time
import re


applicaton = Blueprint('applicaton', __name__)

# 個人待簽清單簽核撿查是否存在
@applicaton.route('/api/application/pending',methods=['GET'])
def searchApplication():
    if request.content_type!='application/json':
        return Response(response='錯誤的格式', status=400)
    else:
        name = request.args.get('name')
        grad = request.args.get('grad')
        departmentId = request.args.get('departmentId')
        page = request.args.get('page')
        if page == None:
            page = ''
        station = stationCheck(grad)
        pendingApplicationResult = application_Model.myPendingApplicationDB(name, station, grad, departmentId,page)
        if pendingApplicationResult == 'error':
            return jsonify({'error':True,'message':'伺服器錯誤'}),500
        else:
            if pendingApplicationResult ==[]:
                return jsonify({'error':True,'message':'沒有待簽核的單子'})
            else:
                return jsonify({'data':timeConvert(pendingApplicationResult)})


@applicaton.route('/api/myapplication',methods=['GET'])
def searchMyApplication():
    if request.content_type!='application/json':
        return Response(response='錯誤的格式', status=400)
    else:
        applicationStatus = request.args.get('status')
        if applicationStatus==None:
            applicationStatus=''
        else:
            status = statusCheck(applicationStatus)
        name = request.args.get('name')
        if name == None:
            name = ''
        dateStart = request.args.get('dateStart')
        if  dateStart==None:
             dateStart=''
        dateEnd = request.args.get('dateEnd')
        if dateEnd == None:
             dateEnd = ''
        page = request.args.get('page')
        if page == None:
             page = ''

        result = application_Model.searchMyapplicationDB(name, status, dateStart,dateEnd,page)
        if result == 'error':
            return jsonify({'error':True,'message':'伺服器錯誤'}),500
        else:
            if result==[]:

                return jsonify({'error':True,'message':'沒有相關資料'})
            else:
                return jsonify({'data':timeConvert(result)})



@applicaton.route('/api/application/deliveryBill',methods=['POST'])
def createDeliveryNumber():
    if request.content_type!='application/json':
        return Response(response='錯誤的格式', status=400)
    else:
        data = request.get_json()
        checkInputRegExp = regExp_Model.checkApplicationInfo(data)
        if checkInputRegExp!=None:
            return jsonify(checkInputRegExp)
        else:
            name = data['name']
            station = data['station']
            applicationId = data['applicationId']
            uxiTime = time.gmtime() # 取得時間元組
            uxiTimeStamp = time.mktime(uxiTime) # 將時間員組轉成時間戳
            GMTtime=datetime.fromtimestamp(int(uxiTimeStamp))+timedelta(hours=8)
            SaleOrderCompleteCheck = application_Model.searchPendingDB(name, station, grad='',applicationId=applicationId,applicationType='',departmentId='')
            if SaleOrderCompleteCheck == 'error':
                return jsonify({'error':True,'message':'伺服器錯誤'}),500
            else:
                if SaleOrderCompleteCheck == []:
                    return jsonify({'error':True,'message':'沒有此相關單據'})
                else:
                    deliveryNumberSearchResult = application_Model.searchPendingDB(name='', station='', grad='',applicationId='',applicationType='deliveryBill',departmentId=4)

                    if deliveryNumberSearchResult == 'error':
                        return jsonify({'error':True,'message':'伺服器錯誤'}),500

                    if deliveryNumberSearchResult==[]:
                        deliveryNumber = 'DB'+GMTtime.strftime('%Y').split('20')[1]+GMTtime.strftime('%m')+GMTtime.strftime('%d') + '0001'
                    else:
                        deliveryNumberQ = len(deliveryNumberSearchResult) - 1
                        lastDeliveryNumber = deliveryNumberSearchResult[deliveryNumberQ]['applicationId']
                        nu_letter = '[\u0030-\u0039]+'
                        nu_deliveryNumber = re.findall(nu_letter,lastDeliveryNumber)
                        if nu_deliveryNumber[0][0:6]!=GMTtime.strftime('%Y').split('20')[1]+GMTtime.strftime('%m')+GMTtime.strftime('%d'):
                            deliveryNumber = 'DB'+GMTtime.strftime('%Y').split('20')[1]+GMTtime.strftime('%m')+GMTtime.strftime('%d') + '0001'
                        else:
                            deliveryNumber = 'DB'+str(+int(nu_deliveryNumber[0]) + 1)
                    application_Model.insertDeliveryBill(4,'deliveryBill',deliveryNumber,'running','start')#出貨號碼更新到申請單資料庫
                    return jsonify({'data':deliveryNumber})



@applicaton.route('/api/application/receipt',methods=['POST'])
def createReceiptNumber():
    if request.content_type!='application/json':
        return Response(response='錯誤的格式', status=400)
    else:
        data = request.get_json()
        checkInputRegExp = regExp_Model.checkApplicationInfo(data)
        if checkInputRegExp!=None:
            return jsonify(checkInputRegExp)
        else:
            uxiTime = time.gmtime() # 取得時間元組
            uxiTimeStamp = time.mktime(uxiTime) # 將時間員組轉成時間戳
            GMTtime=datetime.fromtimestamp(int(uxiTimeStamp))+timedelta(hours=8)
            # 因為是幫物流創單，所以不帶入自己部門號碼
            name = data['name']
            station = data['station']
            applicationId = data['applicationId']
            purchaseOrderCompleteCheck = application_Model.searchPendingDB(name, station, grad='',applicationId=applicationId,applicationType='',departmentId='')
            if purchaseOrderCompleteCheck == 'error':
                return jsonify({'error':True,'message':'伺服器錯誤'}),500
            else:

                if purchaseOrderCompleteCheck == []:
                    return jsonify({'error':True,'message':'沒有此相關單據'})

                else:
                    receiptNumberSearchResult = application_Model.searchPendingDB(name='', station='', grad='',applicationId='',applicationType='stockReceipt',departmentId=4)
                    if receiptNumberSearchResult == 'error':
                        return jsonify({'error':True,'message':'伺服器錯誤'}),500

                    if receiptNumberSearchResult==[]:
                        receiptNumber = 'RT'+GMTtime.strftime('%Y').split('20')[1]+GMTtime.strftime('%m')+GMTtime.strftime('%d') + '0001'
                    else:
                        receiptNumberQ = len(receiptNumberSearchResult) - 1
                        lastReceiptNumber = receiptNumberSearchResult[receiptNumberQ]['applicationId']
                        nu_letter = '[\u0030-\u0039]+'
                        nu_receiptNumber = re.findall(nu_letter,lastReceiptNumber)
                        if nu_receiptNumber[0][0:6]!=GMTtime.strftime('%Y').split('20')[1]+GMTtime.strftime('%m')+GMTtime.strftime('%d'):
                            receiptNumber = 'RT'+GMTtime.strftime('%Y').split('20')[1]+GMTtime.strftime('%m')+GMTtime.strftime('%d') + '0001'
                        else:
                            receiptNumber = 'RT'+str(+int(nu_receiptNumber[0]) + 1)
                    application_Model.insertDeliveryBill(4,'stockReceipt',receiptNumber,'running','start')#出貨號碼更新到申請單資料庫
                    return jsonify({'data':receiptNumber})



@applicaton.route('/api/application',methods=['PATCH'])
def signApplication():

    if request.content_type!='application/json':
        return Response(response='錯誤的格式', status=400)
    else:
        data = request.get_json()
        checkInputRegExp = regExp_Model.checkSignApplicationInfo(data)
        if checkInputRegExp!=None:
            return jsonify(checkInputRegExp)
        else:
            name = data['name']
            grad = data['grad']
            applicationId = data['applicationId']
            auditAction = data['auditAction']
            applicationType = data['applicationType']
            departmentId = data['departmentId']
            station = stationCheck(grad)
            uxiTime = time.gmtime() # 取得時間元組
            approveTime = time.mktime(uxiTime) # 將時間員組轉成時間戳
            result = application_Model.searchPendingDB(name,station,grad,applicationId,applicationType,departmentId)
            if result == []:
                return jsonify({'error':True,'message':'申請單錯誤'})
            else:
        # -----------------------------------駁回---------------------------------------------------
                applicatePerson = result[0]['approveName-1st']
                managerName = result[0]['managerName']
                if 'paymentTerm' in result[0]:
                    paymentTerm = result[0]['paymentTerm']
                else:
                    paymentTerm=''

                newStation = newStationCheck(auditAction,station,applicationType,managerName,applicatePerson,paymentTerm)
                if auditAction == 'reject':
                    application_Model.rejectApplicationDB(newStation,applicationId)
        # -----------------------------------核准(待補saleOrder金額判斷)---------------------------------------------------
                else:
                    application_Model.signApplicationDB(grad,newStation,name, approveTime,applicationId,managerName,applicatePerson)
                    return jsonify({'ok':True,'message':'簽核完成'})



@applicaton.route('/api/application/clientCreate',methods=['PATCH'])
def clientCreateSign():
    if request.content_type!='application/json':
        return Response(response='錯誤的格式', status=400)
    else:
        data = request.get_json()

        checkInputRegExp = regExp_Model.checkSignApplicationInfo(data)
        if checkInputRegExp!=None:
            return jsonify(checkInputRegExp)
        else:
            uxiTime = time.gmtime() # 取得時間元組
            approveTime = time.mktime(uxiTime) # 將時間員組轉成時間戳
            name = data['name']
            grad = data['grad']
            applicationId = data['applicationId']
            auditAction = data['auditAction']
            applicationType = data['applicationType']
            station = stationCheck(grad)
            result = application_Model.clientCreateSignDB(name, station, grad, applicationId, applicationType)
            if result == []:
                return jsonify({'error':True,'message':'申請單錯誤'})
            else:
        # -----------------------------------駁回---------------------------------------------------
                applicatePerson = result[0]['approveName-1st']
                paymentTerm = result[0]['paymentTerm']
                managerName = result[0]['managerName']
                newStation = newStationCheck(auditAction,station,applicationType,managerName,applicatePerson,paymentTerm)
                if auditAction == 'reject':
                    application_Model.rejectApplicationDB(newStation,applicationId)
        # -----------------------------------核准(待補saleOrder金額判斷)---------------------------------------------------
                else:
                    application_Model.signApplicationDB(grad,newStation,name, approveTime,applicationId,managerName,applicatePerson)
                    return jsonify({'ok':True,'message':'簽核完成'})


@applicaton.route('/api/application/supplierCreate',methods=['PATCH'])
def supplierCreateSign():

    if request.content_type!='application/json':
        return Response(response='錯誤的格式', status=400)
    else:
        data = request.get_json()
        checkInputRegExp = regExp_Model.checkSignApplicationInfo(data)
        if checkInputRegExp!=None:
            return jsonify(checkInputRegExp)
        else:
            uxiTime = time.gmtime() # 取得時間元組
            approveTime = time.mktime(uxiTime) # 將時間員組轉成時間戳
            name = data['name']
            grad = data['grad']
            applicationId = data['applicationId']
            auditAction = data['auditAction']
            applicationType = data['applicationType']
            station = stationCheck(grad)
            result = application_Model.supplierCreateSignDB(name, station, grad, applicationId, applicationType)
            if result == []:
                return jsonify({'error':True,'message':'申請單錯誤'})
            else:
        # -----------------------------------駁回---------------------------------------------------
                applicatePerson = result[0]['approveName-1st']
                paymentTerm = result[0]['paymentTerm']
                managerName = result[0]['managerName']
                newStation = newStationCheck(auditAction,station,applicationType,managerName,applicatePerson,paymentTerm)
                if auditAction == 'reject':
                    application_Model.rejectApplicationDB(newStation,applicationId)
        # -----------------------------------核准(待補saleOrder金額判斷)---------------------------------------------------
                else:
                    application_Model.signApplicationDB(grad,newStation,name, approveTime,applicationId,managerName,applicatePerson)
                    return jsonify({'ok':True,'message':'簽核完成'})




@applicaton.route('/api/applicaton/deliveryBillSign',methods=['PATCH'])
def deliveryBillSign():
    if request.content_type!='application/json':
        return Response(response='錯誤的格式', status=400)
    else:
        data = request.get_json()
        checkInputRegExp = regExp_Model.checkSignApplicationInfo(data)
        if checkInputRegExp!=None:
            return jsonify(checkInputRegExp)
        else:
            uxiTime = time.gmtime() # 取得時間元組
            approveTime = time.mktime(uxiTime) # 將時間員組轉成時間戳
            name =  data['name']
            grad =  data['grad']
            applicationId = data['applicationId']
            auditAction = data['auditAction']
            applicationType = data['applicationType']
            departmentId = data['departmentId']
            station = data['station']
            result = application_Model.searchPendingDB(name,station,grad,applicationId,applicationType,departmentId)
            newStation = deliveryBillStationCheck(station,auditAction)
            if result == []:
                return jsonify({'error':True,'message':'申請單錯誤'})
            else:
                application_Model.deliveryApplicationSign(grad,station,newStation, name, approveTime, applicationId)
                return jsonify({'ok':True,'message':'更新成功'})



@applicaton.route('/api/applicaton/stockReceipt',methods=['PATCH'])
def stockReceiptSign():
    uxiTime = time.gmtime() # 取得時間元組
    approveTime = time.mktime(uxiTime) # 將時間員組轉成時間戳
    if request.content_type!='application/json':
        return Response(response='錯誤的格式', status=400)
    else:
        data = request.get_json()
        checkInputRegExp = regExp_Model.checkSignApplicationInfo(data)
        if checkInputRegExp!=None:
            return jsonify(checkInputRegExp)
        else:
            name =  data['name']
            grad =  data['grad']
            applicationId = data['applicationId']
            auditAction = data['auditAction']
            applicationType = data['applicationType']
            departmentId = data['departmentId']
            station = data['station']
            result = application_Model.searchPendingDB(name,station,grad,applicationId,applicationType,departmentId)
            newStation = stockReciptStationCheck(station,auditAction)
            if result == []:
                return jsonify({'error':True,'message':'申請單錯誤'})
            else:
                application_Model.receiptApplicationSign(grad,station,newStation, name, approveTime, applicationId)
                return jsonify({'ok':True,'message':'更新成功'})



@applicaton.route('/api/applicaton/turn',methods=['PATCH'])
def applicationTurn():
    if request.content_type!='application/json':
        return Response(response='錯誤的格式', status=400)
    else:
        data = request.get_json()
        checkInputRegExp = regExp_Model.checkApplicationTurnInfo(data)
        if checkInputRegExp!=None:
            return jsonify(checkInputRegExp)
        else:
            name =  data['name']
            applicationId = data['applicationId']
            result = application_Model.searchMySOcomplete(name,applicationId)
            if result == []:
                return jsonify({'error':True,'message':'申請單錯誤'})
            else:
                application_Model.applicationTurnDB(applicationId)
                return jsonify({'ok':True,'message':'更新成功'})


# 取得申請單編號(DB及RT另外)
def applicationIdGet(name,applicationType,grad):
    if applicationType == 'saleOrder':
        applicationIdHead = 'SO'
        departmentId = 1
    if applicationType == 'clientCreate':
        applicationIdHead = 'CC'
        departmentId = 1
    if applicationType == 'supplierCreate':
        applicationIdHead = 'SC'
        departmentId = 2
    if applicationType == 'productCreate':
        applicationIdHead = 'PC'
        departmentId = 2
    if applicationType == 'purchaseOrder':
        applicationIdHead = 'PO'
        departmentId = 2
    if applicationType == 'specialPrice':
        applicationIdHead = 'SP'
        departmentId = 1
    uxiTime = time.gmtime() # 取得時間元組
    uxiTimeStamp = time.mktime(uxiTime) # 將時間員組轉成時間戳
    GMTtime=datetime.fromtimestamp(int(uxiTimeStamp))+timedelta(hours=8)
    applicationIdGetResult = application_Model.searchPendingDB(name='', station='', grad='',applicationId='', applicationType = applicationType, departmentId='')
    status = 'running'
    if grad != 'Boss':
        departmentManager = department_Model.searchDepartmentManageDB(departmentId)
        if name == departmentManager['name']:
            station = 'final'
        else:
            station = 'middle'
    else:
        status = 'complete'
        station = 'complete'

    if applicationIdGetResult == 'error':
        return jsonify({'error':True,'message':'伺服器錯誤'}),500
    # 本種類的第一張單
    if applicationIdGetResult==[]:
        newApplicationId = applicationIdHead+GMTtime.strftime('%Y').split('20')[1]+GMTtime.strftime('%m')+GMTtime.strftime('%d') + '0001'
        application_Model.insertApplicaiton(name, departmentId,applicationType, newApplicationId, status, uxiTimeStamp ,station)
        return newApplicationId
    # 已有號碼
    else:

        applicationQ = len(applicationIdGetResult) - 1
        lastApplicationId = applicationIdGetResult[applicationQ]['applicationId']
        nu_letter = '[\u0030-\u0039]+'
        nu_application = re.findall(nu_letter,lastApplicationId)
        if nu_application[0][0:6]!=GMTtime.strftime('%Y').split('20')[1]+GMTtime.strftime('%m')+GMTtime.strftime('%d'):
            newApplicationId = applicationIdHead+GMTtime.strftime('%Y').split('20')[1]+GMTtime.strftime('%m')+GMTtime.strftime('%d') + '0001'
        else:
            newApplicationId = applicationIdHead+str(+int(nu_application[0]) + 1)
        application_Model.insertApplicaiton(name, departmentId,applicationType, newApplicationId, status,uxiTimeStamp,station)
        return newApplicationId



def newStationCheck(auditAction,station,applicationType,managerName,applicatePerson,paymentTerm):

    if auditAction == 'reject':
        if station == 'middle':
            return 'start'
        elif station == 'final' and managerName!=applicatePerson:
            return 'middle'
        else:
            return 'start'
    else:
        if station == 'final':
            newStation = 'complete'
        elif station == 'start' and managerName==applicatePerson:
            newStation = 'final'
        elif station == 'start':
            newStation = 'middle'
        elif station == 'middle':
            newStation = 'final'
            # 廠商的付款條件簽核站別確認
            if applicationType == 'clientCreate':
                conditions = condition_Model.searchCondition(applicationType)
                for condition in conditions:
                    if paymentTerm == condition['conditionExclude']:
                        newStation = 'complete'
            if applicationType == 'productCreate':
                if station == 'middle':
                    newStation = 'complete'
        return newStation






def deliveryBillStationCheck(station,commentText):
    if commentText=='approve':
        if station == 'start':
            return 'middle'
        elif station =='middle':
            return 'final'
        elif station =='final':
            return 'complete'
    else:
        # 最末端考慮從出貨單退回成訂購單
        if station =='middle':
            return 'start'
        elif station =='final':
            return 'middle'


def stockReciptStationCheck(station,commentText):
    if commentText=='approve':
        if station == 'start':
            return 'middle'
        elif station =='middle':
            return 'complete'
    else:
        # 最末端考慮從出貨單退回成訂購單
        if station =='middle':
            return 'start'


def stationCheck(grad):
    if grad == 'Section Manager':
        return 'middle'
    elif grad == 'Boss' or grad == 'driver':
        return 'final'
    else:
        return 'start'


def statusCheck(applicationStatus):
    if applicationStatus=='申請中':
        return 'running'
    elif applicationStatus=='審核完成':
        return 'complete'
    elif applicationStatus=='全部' or applicationStatus=='':
        return ''

