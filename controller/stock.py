from controller.timeConvert import timeConvert
from model.stock import stock_Model
from controller.express import regExp_Model
from flask import *
import time
import re


stock = Blueprint('stock', __name__)


@stock.route('/api/stock',methods=['POST'])
def insertStockRecorde():

    if request.content_type!='application/json':
        return Response(response='錯誤的格式', status=400)
    else:
        data = request.get_json()
        checkInputRegExp = regExp_Model.checkStockInsertInfo(data)
        if checkInputRegExp!=None:
            return jsonify(checkInputRegExp)
        else:
            uxiTime = time.gmtime() # 取得時間元組
            approveTime = time.mktime(uxiTime) # 將時間員組轉成時間戳
            applicationId = data['applicationId']
            QchangeData = data['QchangeData']
            result = stock_Model.searchStock(applicationId)
            if result == 'error':
                return jsonify({'error':True,'message':'伺服器錯誤'}),500
            if  result == []:
                stock_Model.insertStock(QchangeData,approveTime)
                return jsonify({'ok':True,'message':'更新成功'})
            else:
                return jsonify({'error':True,'message':'有重複的存貨紀錄'})


# 條件搜尋
@stock.route('/api/stock/balance',methods=['GET'])
def stockBalanceSearch():
    if request.content_type!='application/json':
        return Response(response='錯誤的格式', status=400)
    else:
        page = request.args.get('page')
        if page == None:
            page = ''
        supplierName = request.args.get('supplierName')
        if supplierName == None or supplierName=='全部':
            supplierName = ''
        productName = request.args.get('productName')
        if productName == None or productName == '全部':
            productName = ''
        balanceDate = request.args.get('balanceDate')
        if balanceDate == None:
            balanceDate = ''
    stockBalanceSearchResult = stock_Model.stockBalanceSearchDB(supplierName,productName,balanceDate,page)
    if stockBalanceSearchResult == 'error':
        return jsonify({'error':True,'message':'伺服器錯誤'}),500
    else:
        if stockBalanceSearchResult==[]:
            return jsonify({'error':True,'message':'沒有相關條件的廠商'})
        else:
            return jsonify({'data':stockBalanceSearchResult})


@stock.route('/api/stock/change',methods=['GET'])
def stockChangeDetail():
    if request.content_type!='application/json':
        return Response(response='錯誤的格式', status=400)
    else:
        page = request.args.get('page')
        if page == None:
            page = ''
        supplierName = request.args.get('supplierName')
        if supplierName == None or supplierName=='全部':
            supplierName = ''
        productName = request.args.get('productName')
        if productName == None or productName == '全部':
            productName = ''
        startDate = request.args.get('startDate')
        if startDate == None:
            startDate = ''
        endDate = request.args.get('endDate')
        if endDate == None:
            endDate = ''
    stockChangeDetailResult = stock_Model.stockChangeDetailDB(supplierName,productName,startDate,endDate,page)
    if stockChangeDetailResult == 'error':
        return jsonify({'error':True,'message':'伺服器錯誤'}),500
    else:
        if stockChangeDetailResult==[]:
            return jsonify({'error':True,'message':'沒有相關條件的廠商'})
        else:
            return jsonify({'data':timeConvert(stockChangeDetailResult)})


@stock.route('/api/stock',methods=['DELETE'])
def deleteStockRecorde():
    if request.content_type!='application/json':
        return Response(response='錯誤的格式', status=400)
    else:
        data = request.get_json()
        if not re.search('^[A-Z]{2}[0-9]{10}', data['applicationId']):
            return jsonify({'error':True,'message':'申請單編號格式有問題'})
        else:
            applicationId = data['applicationId']
            result = stock_Model.searchStock(applicationId)
            if result == 'error':
                return jsonify({'error':True,'message':'伺服器錯誤'}),500
            if  result!= []:
                stock_Model.deleteStockRecord(applicationId)
                return jsonify({'ok':True,'message':'更新成功'})