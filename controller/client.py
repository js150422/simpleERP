from controller.application import applicationIdGet
from controller.timeConvert import timeConvert
from controller.express import regExp_Model
from model.client import client_Model
from flask import *


client = Blueprint('client', __name__)


@client.route('/api/client',methods=['POST'])
def createClient():
    if request.content_type!='application/json':
        return Response(response='錯誤的格式', status=400)
    else:
        data = request.get_json()
        checkInputRegExp = regExp_Model.checkClientCreateInfo(data)
        if checkInputRegExp!=None:
            return jsonify(checkInputRegExp)
        else:
            taxId = data['taxId']
            grad = data['grad']
            # 搜尋統一編號看有沒有建立過
            result = client_Model.summaryClientDB(status='',applicationId='',taxId=taxId,clientName='',repEmployee='',page='')
            if result == 'error':
                return jsonify({'error':True,'message':'伺服器錯誤'}),500
            if  result == []:
                #創造一個createClient新的聲請編號
                applicationId = applicationIdGet(data['name'],'clientCreate', grad)
                client_Model.increaseClient(applicationId,data)
                return jsonify({'data':applicationId})
            else:
                return jsonify({'error':True,'message':'此客戶已存在本系統'})


# 條件搜尋
@client.route('/api/client/summary',methods=['GET'])
def conditionSearch():
    if request.content_type!='application/json':
        return Response(response='錯誤的格式', status=400)
    else:
        page = request.args.get('page')
        if page == None:
            page = ''
        applicationStatus = request.args.get('applicationStatus')
        if applicationStatus == None:
            applicationStatus = ''
        status = statusCheck(applicationStatus)
        applicationId = request.args.get('applicationId')
        if applicationId ==None:
            applicationId = ''
        taxId = request.args.get('taxId')
        if taxId==None:
            taxId=''
        clientname = request.args.get('clientname')
        if clientname == None:
            clientname=''
        repEmployee = request.args.get('repEmployee')

        if repEmployee == '全部' or repEmployee==None:
            repEmployee = ''

    conditionSearchResult = client_Model.summaryClientDB(status,applicationId,taxId,clientname, repEmployee,page)
    if conditionSearchResult == 'error':
        return jsonify({'error':True,'message':'伺服器錯誤'}),500
    else:
        if conditionSearchResult==[]:
            return jsonify({'error':True,'message':'沒有相關條件的廠商'})
        else:
            return jsonify({'data':timeConvert(conditionSearchResult)})

# 單一頁面客戶資料搜尋
@client.route('/api/client/single',methods=['GET'])
def singleSearch():
    if request.content_type!='application/json':
        return Response(response='錯誤的格式', status=400)
    else:
        applicationId = request.args.get('applicationId')
    getSingle = client_Model.summaryClientDB(status='',applicationId=applicationId,taxId='',clientName='', repEmployee='',page='')

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
