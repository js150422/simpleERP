from controller.application import applicationIdGet
from controller.timeConvert import timeConvert
from model.saleOrder import saleOrder_Model
from model.application import application_Model
from controller.express import regExp_Model
from flask import *
import time


saleOrder = Blueprint('saleOrder', __name__)


@saleOrder.route('/api/saleOrder',methods=['POST'])
def createSaleOrder():
    if request.content_type!='application/json':
        return Response(response='錯誤的格式', status=400)
    else:
        data = request.get_json()
        checkInputRegExp = regExp_Model.checkSaleOrderCreateInfo(data)
        if checkInputRegExp!=None:
            return jsonify(checkInputRegExp)
        else:
            clientName = data['clientName']
            taxId = data['taxId']
            orderDate = data['orderDate']
            repEmployee = data['repEmployee']
            paymentTerm = data['paymentTerm']
            clientCredit = data['clientCredit']
            contactName = data['contactName']
            contactPersonTile = data['contactPersonTile']
            contactPhone = data['contactPhone']
            contactEmail = data['contactEmail']
            clientAddress = data['clientAddress']
            name = data['name']
            grad = data['grad']
            orderList = data['orderList']
            applicationId = applicationIdGet(name,'saleOrder',grad)
            saleOrder_Model.insertSaleOrder(applicationId,clientName,taxId,orderDate,repEmployee,paymentTerm,clientCredit,contactName,contactPersonTile,contactPhone,contactEmail,clientAddress)
            saleOrder_Model.insertSaleOrderDetail(applicationId,orderList)
            return jsonify({'data':applicationId})


@saleOrder.route('/api/saleOrder/deliveryDate',methods=['PATCH'])
def updateDeliveryData():
    if request.content_type!='application/json':
        return Response(response='錯誤的格式', status=400)
    else:

        data = request.get_json()
        checkInputRegExp = regExp_Model.checkApplicationInfo(data)
        if checkInputRegExp!=None:
            return jsonify(checkInputRegExp)
        else:
            applicationId = data['applicationId']
            station = data['station']
            result = application_Model.searchPendingDB(name='',station=station,grad='',applicationId=applicationId,applicationType='',departmentId='')
            if result == 'error':
                return jsonify({'error':True,'message':'伺服器錯誤'}),500
            else:
                if result!=[]:
                    uxiTime = time.gmtime() # 取得時間元組
                    approveTime = time.mktime(uxiTime) # 將時間員組轉成時間戳
                    saleOrder_Model.updateDeliveryDate(approveTime,applicationId)
                    return jsonify({'ok':True,'message':'更新完成'})
                else:
                    return jsonify({'error':True,'message':'申請單錯誤'})


@saleOrder.route('/api/saleOrder/deliveryNumber',methods=['PATCH'])
def updateDeliveryNumber():
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
            departmentId = data['departmentId']
            station = data['station']
            deliveryNumber = data['deliveryNumber']
            result = application_Model.searchPendingDB(name,station,grad,applicationId,applicationType='',departmentId=departmentId)
            if result == 'error':
                return jsonify({'error':True,'message':'伺服器錯誤'}),500
            else:
                if result!=[]:
                    saleOrder_Model.updateSaleOrderDB(deliveryNumber,applicationId)
                    return jsonify({'ok':True,'message':'更新完成'})
                else:
                    return jsonify({'error':True,'message':'申請單錯誤'})




# 單一頁面客戶資料搜尋
@saleOrder.route('/api/saleOrder/single',methods=['GET'])
def singleSearch():
    if request.content_type!='application/json':
        return Response(response='錯誤的格式', status=400)
    else:
        orderNumber = request.args.get('applicationId')
    getSingle = saleOrder_Model.searchSaleOrder(orderNumber=orderNumber,status='',clientName='',taxId='',repEmployee='',orderDateStart='',orderDateEnd='',page='')
    if getSingle == 'error':
        return jsonify({'error':True,'message':'伺服器錯誤'}),500
    else:
        if getSingle==[]:
            return jsonify({'error':True,'message':'沒有相關條件的廠商'})
        else:
            return jsonify({'data': timeConvert(getSingle)})



# 單一頁面客戶資料搜尋
@saleOrder.route('/api/saleOrder/summary',methods=['GET'])
def conditionSearch():
    if request.content_type!='application/json':
        return Response(response='錯誤的格式', status=400)
    else:
        orderNumber = request.args.get('applicationId')
        applicationStatus = request.args.get('applicationStatus')
        clientName = request.args.get('clientName')
        taxId = request.args.get('taxId')
        repEmployee = request.args.get('repEmployee')
        orderDateStart = request.args.get('orderDateStart')
        orderDateEnd = request.args.get('orderDateEnd')
        status = statusCheck(applicationStatus)
        page = request.args.get('page')
    conditionSearchResult = saleOrder_Model.searchSaleOrder(orderNumber,status,clientName,taxId,repEmployee,orderDateStart,orderDateEnd,page)

    if conditionSearchResult == 'error':
        return jsonify({'error':True,'message':'伺服器錯誤'}),500
    else:
        if conditionSearchResult==[]:
            return jsonify({'error':True,'message':'沒有相關條件的廠商'})
        else:
            return jsonify({'data': timeConvert(conditionSearchResult)})


# 單一頁面客戶資料搜尋
@saleOrder.route('/api/saleOrder/saleReport',methods=['GET'])
def searchSaleReport():
    if request.content_type!='application/json':
        return Response(response='錯誤的格式', status=400)
    else:
        orderDateStart = request.args.get('orderDateStart')
        orderDateEnd = request.args.get('orderDateEnd')
    searchSaleReportReport = saleOrder_Model.searchSaleOrder(orderNumber='',status='',clientName='',taxId='',repEmployee='',orderDateStart=orderDateStart,orderDateEnd=orderDateEnd,page='')
    if searchSaleReportReport == 'error':
        return jsonify({'error':True,'message':'伺服器錯誤'}),500
    else:
        if searchSaleReportReport==[]:
            return jsonify({'error':True,'message':'沒有相關條件的廠商'})
        else:
            return jsonify({'data': timeConvert(searchSaleReportReport)})


def statusCheck(applicationStatus):
    if applicationStatus == '申請中':
        return 'running'
    elif applicationStatus == '審核完成':
        return 'complete'
    else:
        return ''