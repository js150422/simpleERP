let searchEmployeeIdResult
let changeManagerResult
let getDepartmentNameResult
let grad
let employeeeId
let employeeName
let departmentId
let updateGradResult


// 1. 載入時鮮帶出有那些部門getDepartment()
// 2. 用姓名欄位撈看看要改的姓名是否已經在系統註冊完成
// 3. 填完部門及職等後送出
//     3-1. 先更新員工部門
//     3-2. 更新員工部門沒問題後更新部門


window.addEventListener('load', function(){
    getDepartmentName()
});



async function getDepartmentName() {
	await getDepartmentNameApi()
    renderDepartmentName()
}

async function searchEmployeeId(employeeName){
    await searchEmployeeIdApi(employeeName)
    renderEmployeeId()
}

async function updateGrad(text){
    await updateGradApi(text)
    renderUpdateGrad()
}



async function setEmployeeDepartment(text){
    await setEmployeeDepartmentApi(text)
    renderSetEmployeeDepartment()
}

async function departmentManagerSet(text) {
	await departmentManagerSetApi(text)
    renderDepartmentManagerSet()
}

function getDepartmentNameApi(){
	return fetch('/api/department', {
		method: 'GET',
        headers: new Headers({ 'Content-Type': 'application/json'})
	}).then((response) => {
		return response.json();
	}).then((result) => {
		getDepartmentNameResult = result;
	});
}


function  searchEmployeeIdApi(){
    return fetch('/api/user/getUserId?name='+employeeName,{
        method: 'GET',
        headers: new Headers({ 'Content-Type': 'application/json' })
    }).then((response)=>{
        return response.json()
    }).then((result)=>{
        searchEmployeeIdResult = result
    })
}


function  updateGradApi(text){
    return fetch('/api/user/updateGrad',{
        method: 'PATCH',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(text)
    }).then((response)=>{
        return response.json()
    }).then((result)=>{
        updateGradResult = result
    })
}

function  setEmployeeDepartmentApi(text){

    return fetch('/api/user/setEmployeeDepartment',{
        method: 'PUT',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(text)
    }).then((response)=>{
        return response.json()
    }).then((result)=>{
        setEmployeeDepartmentResult = result
    })
}


function departmentManagerSetApi(text){
    return fetch('/api/department',{
        method: 'PUT',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(text)
    }).then((response)=>{
        return response.json()
    }).then((result)=>{
        changeManagerResult = result
    })
}



function renderDepartmentName(){
    for (i=0; i < getDepartmentNameResult.data.length; i++){
        option = document.createElement('option')
        option.textContent = getDepartmentNameResult.data[i]['departmentName']
        option1 = document.createElement('option')
        option1.textContent = getDepartmentNameResult.data[i]['departmentName']
        document.querySelectorAll('select')[0].appendChild(option)
        document.querySelectorAll('select')[2].appendChild(option1)
    }
}



function employeeDataSearch(){
    employeeName = document.getElementById('employeeName').value
    if (employeeName == ''){
        document.getElementById('levelChangeAlert').textContent = '請輸入姓名'

    }else{
        searchEmployeeId(employeeName)
    }
}



function renderEmployeeId(){
    if('error' in  searchEmployeeIdResult){
        document.getElementById('levelChangeAlert').textContent = searchEmployeeIdResult['message']
    }else{

        document.getElementById('employeeId').textContent =  searchEmployeeIdResult.data[0]['employeeId']
        document.getElementById('levelChangeAlert').textContent = ''
    }
}



function authorize(department){
    employeeName = document.getElementById('employeeName').value
    departmentName = document.querySelectorAll('.department')[0].value
    grad = document.getElementById('grad').value
    if ((department == '') || (grad == '')){
        document.getElementById('levelChangeAlert').textContent = '請輸入部門及職等'
    }else if(searchEmployeeIdResult.data[0]['name'] != employeeName){
        document.getElementById('levelChangeAlert').textContent = '請勿搜搜尋後更動員工姓名'
    }else{
        employeeeId = searchEmployeeIdResult.data[0]['employeeId']
        updateGrad({'employeeId':employeeeId, 'grad':grad})


    }
}


function renderUpdateGrad(){
    workForDepartmentName = document.querySelectorAll('select')[0].value
    if ('error' in updateGradResult){
        document.getElementById('levelChangeAlert').textContent = updateGradResult['message']
    }else{
        for (i=0; i < getDepartmentNameResult.data.length; i++){
            if (workForDepartmentName==getDepartmentNameResult.data[i]['departmentName']){
                departmentId = getDepartmentNameResult.data[i]['departmentId']
                setEmployeeDepartment({'employeeId': employeeeId,'departmentId':departmentId})
            }
        }
    }
}



function renderSetEmployeeDepartment(){
    if ('error' in setEmployeeDepartmentResult){
        document.getElementById('levelChangeAlert').textContent = setEmployeeDepartmentResult['message']
    }else{
        cleanInput()
        document.getElementById('levelChangeAlert').textContent = '更新成功請該員工重新登入系統'

    }

}

function sendSetDepartmentManager(){
    departmentName = document.querySelectorAll('select')[2].value
    managerName = document.getElementById('managerName').value
    if(( departmentName=='') || (managerName=='')){
        document.getElementById('departmentSetError').textContent = '請填入要變更的主管姓名及選取部門'
    }else{
        for (i=0; i < getDepartmentNameResult.data.length; i++){
            if (departmentName==getDepartmentNameResult.data[i]['departmentName']){
                departmentId = getDepartmentNameResult.data[i]['departmentId']
                departmentManagerSet({'departmentId':departmentId,'managerName':managerName})
            }

        }

    }

}






function  renderDepartmentManagerSet(){
    if ('error' in changeManagerResult){
        document.getElementById('departmentSetError').textContent = changeManagerResult['message']
    }else{
        cleanInput()
        document.getElementById('departmentSetError').textContent = '更新成功請該員工重新登入系統'
    }
}



function cleanInput(){
    document.getElementById('employeeId').textContent = ''
    document.getElementById('employeeName').value = ''
    document.querySelectorAll('.department')[0].value = ''
    document.getElementById('grad').value = ''
}


