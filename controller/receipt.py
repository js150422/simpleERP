from controller.timeConvert import timeConvert
from model.receipt import receipt_Model
from flask import *





receipt = Blueprint('receipt', __name__)


# 條件搜尋
@receipt.route('/api/receipt',methods=['GET'])
def singleSearch():
    if request.content_type!='application/json':
        return Response(response='錯誤的格式', status=400)
    applicationId = request.args.get('applicationId')
    singleSearchResult = receipt_Model.searchSingleReceiptDB(station='',applicationId=applicationId)
    if singleSearchResult == 'error':
        return jsonify({'error':True,'message':'伺服器錯誤'}),500
    else:
        if singleSearchResult==[]:
            return jsonify({'error':True,'message':'沒有相關條件的廠商'})
        else:
            return jsonify({'data':timeConvert(singleSearchResult)})



# 條件搜尋
@receipt.route('/api/StockReceipt/summary',methods=['GET'])
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
        supplierName = request.args.get('supplierName')
        if supplierName ==None:
            supplierName=''
        ODS = request.args.get('ODSTimestamp')
        if ODS == None:
            ODS = ''
        ODE = request.args.get('ODETimestamp')
        if ODE == None:
            ODE =''
        RDS = request.args.get('RDSTimestamp')
        if RDS == None:
            RDS=''
        RDE = request.args.get('RDSTimestamp')
        if RDE == None:
            RDE=''


    stockChangeReceipt = receipt_Model.conditionSearchReceipt(applicationId,status,taxId,ODS,ODE,RDS,RDE,supplierName,page)
    if stockChangeReceipt == 'error':
        return jsonify({'error':True,'message':'伺服器錯誤'}),500
    else:
        if stockChangeReceipt!=[]:
            return jsonify({'data':timeConvert(stockChangeReceipt)})
        else:
             return jsonify({'error':True,'message':'沒有相關條件的廠商'})





def statusCheck(applicationStatus):
    if applicationStatus == '申請中':
        return 'running'
    elif applicationStatus == '審核完成':
        return 'complete'
    else:
        return ''