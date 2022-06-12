from controller.express import regExp_Model
from model.department import department_Model
from model.user import user_Model
from flask import *

department=Blueprint('department', __name__)




@department.route('/api/department',methods=['PUT'])
def setDepartmentManager():
    if request.content_type!='application/json':
        return Response(response='錯誤的格式', status=400)
    else:
        data = request.get_json()
        checkInputRegExp = regExp_Model.checkManagerInsert(data)
        if checkInputRegExp!=None:
            return jsonify(checkInputRegExp)
        else:
            departmentId = data['departmentId']
            managerName = data['managerName']
            searchManagerName = user_Model.searchUser(user = '',name=managerName,department = '',employeeId='')
            searchDepartmentResult = department_Model.searchDepartmentName(departmentId)
            # 先確認資料是否是真的是員工真的有這個部門
            if searchManagerName == 'error' or searchDepartmentResult=='error':
                return jsonify({'error':True,'message':'伺服器錯誤'}),500
            else:
                if searchManagerName==None or searchDepartmentResult==None:
                    return jsonify({'error':True,'message':'請填寫正確的員工姓名'})
                else:
                    # 取得部門編號
                    hasManager = department_Model.searchDepartment(departmentId)
                    if hasManager!=None:
                        department_Model.updateDepartmentManager(searchManagerName[0]['employeeId'],departmentId)
                    else:
                        department_Model.insertDepartmentManager(departmentId,searchManagerName[0]['employeeId'])
                    return jsonify({'ok':True,'message':'更新成功'})



@department.route('/api/department',methods=['GET'])
def departmentName():
    if request.content_type!='application/json':
        return Response(response='錯誤的格式', status=400)
    else:
        result = department_Model.searchDepartmentName(departmentId='')
        if result == 'error':
            return jsonify({'error':True,'message':'伺服器錯誤'}),500
        else:
            if result==None:
                return jsonify({'error':True,'message':'沒有相關條件的廠商'})
            else:
                return jsonify({'data':result})


