from controller.timeConvert import timeConvert
from controller.application import applicationIdGet
from dotenv import load_dotenv
from model.specialPrice import specialPrice_Model
from controller.express import regExp_Model
from flask import *




specialPrice = Blueprint('specialPrice', __name__)

load_dotenv()


@specialPrice.route('/api/specialPrice',methods=['POST'])
def createSpecialPrice():
    if request.content_type!='application/json':
        return Response(response='錯誤的格式', status=400)
    else:
        data = request.get_json()
        checkInputRegExp = regExp_Model.checkSpecialPriceInfo(data)
        if checkInputRegExp!=None:
            return jsonify(checkInputRegExp)
        else:
            clientId = data['clientId']
            productId = data['productId']
            specialPrice = data['specialPrice']
            specialDescription = data['specialDescription']
            name = data['name']
            grad = data['grad']
            result = specialPrice_Model.searchSpecialPriceDB(applicationId='',status='',clientId=clientId,productId=productId,clientName='',productName='',taxId='',page='')
            if result == 'error':
                return jsonify({'error':True,'message':'伺服器錯誤'}),500
            else:
                if result != []:
                    for i in range(len(result)):
                        version = int(result[i]['version'])+1
                else:
                    version = 1
                applicationId = applicationIdGet(name,'specialPrice',grad)
                specialPrice_Model.insertSpecialPrice(applicationId,clientId,productId,specialPrice,specialDescription,version)
                return jsonify({'data':applicationId})



@specialPrice.route('/api/specialPrice',methods=['GET'])
def searchSpecialPrice():
    if request.content_type!='application/json':
        return Response(response='錯誤的格式', status=400)
    else:
        page = request.args.get('page')
        if page==None:
            page=''
        applicationId = request.args.get('applicationId')
        if applicationId==None:
            applicationId=''
        status = request.args.get('status')
        if status==None:
            status=''
        clientId = request.args.get('clientId')
        if clientId==None:
            clientId=''
        taxId = request.args.get('taxId')
        if taxId==None:
            taxId=''
        productId = request.args.get('productId')
        if productId == None:
            productId=''
        clientName = request.args.get('clientName')
        if clientName == None:
            clientName=''
        productName = request.args.get('productName')
        if productName == None:
            productName=''
    getSingle = specialPrice_Model.searchSpecialPriceDB(applicationId,status,clientId,taxId,productId,clientName,productName,page='')


    if getSingle == 'error':
        return jsonify({'error':True,'message':'伺服器錯誤'}),500
    else:
        if getSingle==[]:
            return jsonify({'error':True,'message':'沒有相關條件的廠商'})
        else:
            return jsonify({'data': timeConvert(getSingle)})



@specialPrice.route('/api/specialPrice/client',methods=['GET'])
def searchClientSpecialPrice():
    if request.content_type!='application/json':
        return Response(response='錯誤的格式', status=400)
    else:

        clientId = request.args.get('clientId')
        getSpecialPrice = specialPrice_Model.searchClientSpecialPriceDB(clientId)
        if getSpecialPrice == 'error':
            return jsonify({'error':True,'message':'伺服器錯誤'}),500
        else:
            if getSpecialPrice==None:
                return jsonify({'error':True,'message':'沒有優惠價格'})
            else:
                return jsonify({'data': getSpecialPrice})