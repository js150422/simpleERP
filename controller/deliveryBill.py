from controller.timeConvert import timeConvert
from model.deliveryBill import deliveryBill_Model
from flask import *


deliveryBill = Blueprint('deliveryBill', __name__)


# 條件搜尋
@deliveryBill.route('/api/deliveryBill',methods=['GET'])
def singleSearch():
    if request.content_type!='application/json':
        return Response(response='錯誤的格式', status=400)
    applicationId = request.args.get('applicationId')
    singleSearchResult = deliveryBill_Model.searchSingleDeliveryDB(station='',applicationId=applicationId)
    if singleSearchResult == 'error':
        return jsonify({'error':True,'message':'伺服器錯誤'}),500
    else:
        if singleSearchResult==[]:
            return jsonify({'error':True,'message':'沒有相關條件的廠商'})
        else:
            return jsonify({'data':timeConvert(singleSearchResult)})


# 條件搜尋
@deliveryBill.route('/api/deliveryBill/summary',methods=['GET'])
def conditionSearch():
    if request.content_type!='application/json':
        return Response(response='錯誤的格式', status=400)
    else:
        page = request.args.get('page')
        if page == None:
            page =''
        applicationId = request.args.get('applicationId')
        if applicationId == None:
            applicationId =''
        applicationStatus = request.args.get('applicationStatus')
        if applicationStatus==None:
            applicationStatus=''
        status = statusCheck(applicationStatus)
        taxId = request.args.get('taxId')
        if taxId == None:
            taxId = ''
        clientName = request.args.get('clientName')
        if clientName ==None:
            clientName=''
        ODS = request.args.get('ODSTimestamp')
        if ODS == None:
            ODS = ''
        ODE = request.args.get('ODETimestamp')
        if ODE == None:
            ODE =''
        DDS = request.args.get('DDSTimestamp')
        if DDS == None:
            DDS=''
        DDE = request.args.get('DDSTimestamp')
        if DDE == None:
            DDE=''


    stockChangeDeliveryBil = deliveryBill_Model.conditionSearchDeliveryBill(applicationId,status,taxId,ODS,ODE,DDS,DDE,clientName,page)
    if stockChangeDeliveryBil == 'error':
        return jsonify({'error':True,'message':'伺服器錯誤'}),500
    else:
        if stockChangeDeliveryBil!=[]:
            return jsonify({'data':timeConvert(stockChangeDeliveryBil)})
        else:
             return jsonify({'error':True,'message':'沒有相關條件的廠商'})




def statusCheck(applicationStatus):
    if applicationStatus == '申請中':
        return 'running'
    elif applicationStatus == '審核完成':
        return 'complete'
    else:
        return ''
