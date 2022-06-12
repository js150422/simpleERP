from controller.timeConvert import timeConvert
from controller.application import applicationIdGet
from model.supplier import supplier_Model
from controller.express import regExp_Model
from flask import *

supplier = Blueprint('supplier', __name__)


@supplier.route('/api/supplier',methods=['POST'])
def createSupplier():
    if request.content_type!='application/json':
        return Response(response='錯誤的格式', status=400)
    else:
        data = request.get_json()
        checkInputRegExp = regExp_Model.checkSupplierCreateInfo(data)
        if checkInputRegExp!=None:
            return jsonify(checkInputRegExp)
        else:
            taxId = data['taxId']
            grad = data['grad']

            result = supplier_Model.summarySupplierDB(status='',applicationId='',taxId=taxId,supplierName='',repEmployee='',page='')
            if result == 'error':
                return jsonify({'error':True,'message':'伺服器錯誤'}),500
            if  result == []:
                applicationId = applicationIdGet(data['name'],'supplierCreate',grad)
                supplier_Model.increaseSupplier(applicationId,data)
                return jsonify({'data':applicationId})

            else:
                return jsonify({'error':True,'message':'此客戶已存在本系統'})


@supplier.route('/api/supplier/summary',methods=['GET'])
def conditionSearch():
    if request.content_type!='application/json':
        return Response(response='錯誤的格式', status=400)
    else:
        page = request.args.get('page')
        if page == None:
            page = ''
        applicationStatus = request.args.get('applicationStatus')
        if applicationStatus==None:
            applicationStatus=''
        applicationId = request.args.get('applicationId')
        if applicationId == None:
            applicationId =''
        taxId = request.args.get('taxId')
        if taxId == None:
            taxId=''
        supplierName = request.args.get('supplierName')
        if supplierName  == None:
            supplierName =''
        repEmployee = request.args.get('repEmployee')
        if repEmployee == '全部' or repEmployee == None:
            repEmployee = ''
        status = statusCheck(applicationStatus)
    conditionSearchResult = supplier_Model.summarySupplierDB(status,applicationId,taxId,supplierName, repEmployee,page)
    if conditionSearchResult == 'error':
        return jsonify({'error':True,'message':'伺服器錯誤'}),500
    else:
        if conditionSearchResult==[]:
            return jsonify({'error':True,'message':'沒有相關條件的廠商'})
        else:
            return jsonify({'data':timeConvert(conditionSearchResult)})



@supplier.route('/api/supplier/single',methods=['GET'])
def singleSearch():
    if request.content_type!='application/json':
        return Response(response='錯誤的格式', status=400)
    else:
        applicationId = request.args.get('applicationId')
    getSingle = supplier_Model.summarySupplierDB(status='',applicationId=applicationId,taxId='',supplierName='', repEmployee='',page='')

    if getSingle == 'error':
        return jsonify({'error':True,'message':'伺服器錯誤'}),500
    else:
        if getSingle==[]:
            return jsonify({'error':True,'message':'沒有相關條件的廠商'})
        else:
            return jsonify({'data': timeConvert(getSingle)})




def statusCheck(applicationStatus):
    if applicationStatus == '申請中':
        return 'running'
    elif applicationStatus == '審核完成':
        return 'complete'
    else:
        return ''