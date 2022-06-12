from controller.application import applicationIdGet
from controller.timeConvert import timeConvert
from model.purchaseOrder import purchaseOrder_Model
from model.application import application_Model
from controller.express import regExp_Model
from flask import *
import time

purchaseOrder = Blueprint('purchaseOrder', __name__)


@purchaseOrder.route('/api/purchaseOrder',methods=['POST'])
def createPurchaseOrder():
    if request.content_type!='application/json':
        return Response(response='錯誤的格式', status=400)
    else:
        data = request.get_json()
        checkInputRegExp = regExp_Model.checkPurchaseOrderCreateInfo(data)
        if checkInputRegExp!=None:
            return jsonify(checkInputRegExp)
        else:
            name = data['name']
            grad = data['grad']
            supplierName = data['supplierName']
            taxId = data['taxId']
            orderDate = data['orderDate']
            repEmployee = data['repEmployee']
            paymentTerm = data['paymentTerm']
            contactName = data['contactName']
            contactPersonTile = data['contactPersonTile']
            contactPhone = data['contactPhone']
            contactEmail = data['contactEmail']
            supplierAddress = data['supplierAddress']
            orderList = data['orderList']
            applicationId = applicationIdGet(name,'purchaseOrder',grad)
            purchaseOrder_Model.insertPurchaseOrder(applicationId,supplierName,taxId,orderDate,repEmployee,paymentTerm,contactName,contactPersonTile,contactPhone,contactEmail,supplierAddress)
            purchaseOrder_Model.insertPurchaseOrderDetail(applicationId,orderList)
            return jsonify({'data':applicationId})


@purchaseOrder.route('/api/purchaseOrder/receiptDate',methods=['PATCH'])
def updateReceiptData():
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
                    purchaseOrder_Model.updateReceiptDate(approveTime,applicationId)
                    return jsonify({'ok':True,'message':'更新完成'})
                else:
                    return jsonify({'error':True,'message':'申請單錯誤'})



@purchaseOrder.route('/api/purchaseOrder/receiptNumber',methods=['PATCH'])
def updateReceiptNumber():
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
            receiptNumber = data['receiptNumber']
            result = application_Model.searchPendingDB(name,station,grad,applicationId,applicationType='',departmentId=departmentId)
            if result == 'error':
                return jsonify({'error':True,'message':'伺服器錯誤'}),500
            else:
                if result!=[]:
                    purchaseOrder_Model.updatePurchaseOrderDB(receiptNumber,applicationId)
                    return jsonify({'ok':True,'message':'更新完成'})
                else:
                    return jsonify({'error':True,'message':'申請單錯誤'})



# 單一頁面客戶資料搜尋
@purchaseOrder.route('/api/purchaseOrder/single',methods=['GET'])
def singleSearch():
    if request.content_type!='application/json':
        return Response(response='錯誤的格式', status=400)
    else:
        orderNumber = request.args.get('applicationId')
    getSingle = purchaseOrder_Model.searchPurchaseOrder(orderNumber= orderNumber, status='', supplierName='', taxId='', repEmployee='', orderDateStart='', orderDateEnd='', page='')
    if getSingle == 'error':
        return jsonify({'error':True,'message':'伺服器錯誤'}),500
    else:
        if getSingle==[]:
            return jsonify({'error':True,'message':'沒有相關條件的廠商'})
        else:
            return jsonify({'data': timeConvert(getSingle)})



# 單一頁面客戶資料搜尋
@purchaseOrder.route('/api/purchaseOrder/summary',methods=['GET'])
def conditionSearch():
    if request.content_type!='application/json':
        return Response(response='錯誤的格式', status=400)
    else:
        orderNumber = request.args.get('applicationId')
        applicationStatus = request.args.get('applicationStatus')
        status = statusCheck(applicationStatus)
        supplierName = request.args.get('supplierName')
        taxId = request.args.get('taxId')
        repEmployee = request.args.get('repEmployee')
        orderDateStart = request.args.get('orderDateStart')
        orderDateEnd = request.args.get('orderDateEnd')
        page = request.args.get('page')
    conditionSearchResult = purchaseOrder_Model.searchPurchaseOrder(orderNumber,status,supplierName,taxId,repEmployee,orderDateStart,orderDateEnd,page)
    if conditionSearchResult == 'error':
        return jsonify({'error':True,'message':'伺服器錯誤'}),500
    else:
        if conditionSearchResult==[]:
            return jsonify({'error':True,'message':'沒有相關條件的廠商'})
        else:
            return jsonify({'data': timeConvert(conditionSearchResult)})




def statusCheck(applicationStatus):
    if applicationStatus == '申請中':
        return 'running'
    elif applicationStatus == '審核完成':
        return 'complete'
    else:
        return ''