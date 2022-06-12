from controller.timeConvert import timeConvert
from controller.express import regExp_Model
from model.comment import comment_Model
from flask import *
import time


comment=Blueprint('comment', __name__)

@comment.route('/api/comment',methods=['POST'])
def insertComment():
    if request.content_type!='application/json':
        return Response(response='錯誤的格式', status=400)
    else:
        data = request.get_json()
        checkInputRegExp = regExp_Model.checkCommentInsert(data)
        if checkInputRegExp!=None:
            return jsonify(checkInputRegExp)
        else:
            applicationId = data['applicationId']
            name = data['name']
            commentText = data['commentText']
            if commentText == 'reject':
                comment = '駁回'
            elif commentText == 'approve':
                comment = '核准'
            else:
                comment = commentText
            uxiTime = time.gmtime() # 取得時間元組
            commentTime = time.mktime(uxiTime) # 將時間員組轉成時間戳
            comment_Model.insertCommentDB(applicationId,name,comment,commentTime)
            insertCommentResult = searchComment({'commentTime':commentTime})
            timeCovertResult = timeConvert(insertCommentResult)
            if timeCovertResult == 'error':
                return jsonify({'error':True,'message':'伺服器錯誤'}),500
            else:
                if timeCovertResult == None:
                    return jsonify({'error':True,'message':'新增失敗'})
                else:
                    return jsonify({'data':timeCovertResult})



@comment.route('/api/comment',methods=['GET'])
def searchComment(commentTime):

    if 'commentTime' in commentTime:
        searchCommentResult = comment_Model.searchCommentDB({'commentTime':commentTime['commentTime']})
        return searchCommentResult
    else:
        applicationId = request.args.get('applicationId')
        searchCommentResult = comment_Model.searchCommentDB({'applicationId':applicationId})
    if searchCommentResult == 'error':
        return jsonify({'error':True,'message':'伺服器錯誤'}),500
    else:
        if searchCommentResult == None:
            return jsonify({'error':True,'message':'新增失敗'})
        else:
            return jsonify({'data':searchCommentResult})
