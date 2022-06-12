let departmentData;
let searchSupplierResult
let department = 'purchase';
let applicationStatus
let applicationId
let taxId
let SupplierName
let repEmployee
let page = 0



window.addEventListener('load', function(){
    getDepartment()
});


// 讓下拉式選單有部門員工的名子
async function getDepartment() {
    await getDepartmentUser()
    renderDepartment()
}

async function search(applicationStatus,applicationId,taxId,supplierName,repEmployee){
    await searchSupplierApi(applicationStatus,applicationId,taxId,supplierName,repEmployee)
    renderSearchSupplier()
}


 function getDepartmentUser(){
    return fetch('/api/user/departmentMember?department='+department, {
        method: 'GET', headers: new Headers({ 'Content-Type': 'application/json'})
    }).then((response) => {
        return response.json();
    }).then((result) => {
        departmentData = result;
    });
}

function searchSupplierApi(applicationStatus='', applicationId='',taxId='',supplierName='',repEmployee=''){
    return fetch('/api/supplier/summary?applicationStatus='+applicationStatus+
    '&applicationId='+applicationId+
    '&taxId='+taxId+
    '&supplierName='+supplierName+
    '&repEmployee='+repEmployee+
    '&page='+page, {
        method: 'GET', headers: new Headers({ 'Content-Type': 'application/json'})
    }).then((response) => {
        return response.json();
    }).then((result) => {
        searchSupplierResult = result;
    });
}

function renderDepartment(){
    for (i=0; i < departmentData.data.length; i++){
        option = document.createElement('option');
        option.textContent = departmentData['data'][i].name;
        document.getElementById('repEmployee').appendChild(option);
    }
}

function getCondition(){
    applicationStatus = document.getElementById('status').value
    applicationId = document.getElementById('applicationId').value
    taxId = document.getElementById('taxId').value
    supplierName = document.getElementById('supplierName').value
    repEmployee = document.getElementById('repEmployee').value
    search(applicationStatus,applicationId,taxId,supplierName,repEmployee)
}

function renderSearchSupplier(){
    errorAlert = document.createElement('div')
    errorAlert.setAttribute('id','errorAlert')
    if('error' in searchSupplierResult){
        errorAlert.textContent = searchSupplierResult['message']
        document.getElementById('btn').appendChild(errorAlert)
        document.getElementById('resultTable').style.display = 'none';
    }else{

        if(document.querySelectorAll('tr').length>1){
            trQ = document.querySelectorAll('tr').length
            for(i=1;i<trQ;i++){
                document.getElementById('resultTable').deleteRow(1);
            }
        }

        for(let s=0;s<document.getElementsByClassName('showCondtion').length;s++){
            document.getElementsByClassName('showCondtion')[s].style.display='none'
        }
        showCondition()
        document.getElementById('resultTable').style.display = 'flex'
        document.getElementById('searchBox').style.display = 'none';

        if (searchSupplierResult.data.length>10){
            searchResult = 10
            document.getElementById('nextPage').style.display = 'block'
        }else{
            searchResult = searchSupplierResult.data.length
            document.getElementById('nextPage').style.display = 'none'
        }
        if (page >= 10){
            document.getElementById('lastPage').style.display = 'block'
        }else{
            document.getElementById('lastPage').style.display = 'none'
        }


        for(m = 0; m < searchResult; m++){
            tableLine = searchSupplierResult.data[m] // 列字典
            row = document.createElement('tr')
            row.className = 'row'
            let id = searchSupplierResult.data[m]['applicationId'] // 沒有寫let 參照的永遠是最後那次m的id
            row.onclick = function (){window.location.href = '/supplierSingle?applicationId='+id+'&department='+department}
            number = document.createElement('td')
            number.textContent = m+1
            row.appendChild(number)
            showApplicationId = document.createElement('td')
            showApplicationId.textContent = searchSupplierResult.data[m]['applicationId']
            row.appendChild(showApplicationId)
            showApplicationStatus = document.createElement('td')
            showApplicationStatus.textContent = searchSupplierResult.data[m]['status']
            row.appendChild(showApplicationStatus)
            showSupplierName = document.createElement('td')
            showSupplierName.textContent = searchSupplierResult.data[m]['supplierName']
            row.appendChild(showSupplierName)
            showTaxId = document.createElement('td')
            showTaxId.textContent = searchSupplierResult.data[m]['taxId']
            row.appendChild(showTaxId)
            showContactName = document.createElement('td')
            showContactName.textContent = searchSupplierResult.data[m]['contactName']
            row.appendChild(showContactName)
            showContactPhone = document.createElement('td')
            showContactPhone.textContent = searchSupplierResult.data[m]['contactPhone']
            row.appendChild(showContactPhone)
            // showPaymentTerm = document.createElement('td')
            // showPaymentTerm.textContent = searchSupplierResult.data[m]['paymentTerm']
            // row.appendChild(showPaymentTerm)
            showRepEmployee = document.createElement('td')
            showRepEmployee.textContent = searchSupplierResult.data[m]['repEmployee']
            row.appendChild(showRepEmployee)
            document.querySelectorAll('tbody')[0].appendChild(row)
        }
    }
    // 清除input跟select
    inputQ = document.querySelectorAll('input').length
    for(i = 0; i < inputQ ;i++){document.querySelectorAll('input')[i].value=''}
    document.getElementById('status').selectedIndex = 0;
    document.getElementById('repEmployee').selectedIndex = 0;
}


function showCondition(){
    if (applicationStatus!=''){
        document.querySelectorAll('.showCondtion')[0].textContent = '申請單狀態: '+applicationStatus
        document.querySelectorAll('.showCondtion')[0].style.display = 'flex'
    }
    if ( applicationId!=''){
        document.querySelectorAll('.showCondtion')[1].textContent = '申請單號碼: '+applicationId
        document.querySelectorAll('.showCondtion')[1].style.display = 'flex'
    }
    if (taxId!=''){
        document.querySelectorAll('.showCondtion')[2].textContent = '統一編號: '+ taxId
        document.querySelectorAll('.showCondtion')[2].style.display = 'flex'
    }
    if (supplierName!=''){
        document.querySelectorAll('.showCondtion')[3].textContent = '廠商名稱: '+supplierName
        document.querySelectorAll('.showCondtion')[3].style.display = 'flex'
    }
    if (repEmployee!=''){
        document.querySelectorAll('.showCondtion')[4].textContent = '負責業務: '+repEmployee
        document.querySelectorAll('.showCondtion')[4].style.display = 'flex'

    }
    if((applicationStatus=='') && (applicationId=='' ) && (taxId=='') && (supplierName=='') && (repEmployee=='')){

        document.querySelectorAll('.showCondtion')[5].textContent = '全部'
        document.querySelectorAll('.showCondtion')[5].style.display = 'flex'
    }
}


function nextPage(){
    page +=10
    search(applicationStatus,applicationId,taxId,supplierName,repEmployee)
}

function lastPage(){
    page-=10
    search(applicationStatus,applicationId,taxId,supplierName,repEmployee)
}
