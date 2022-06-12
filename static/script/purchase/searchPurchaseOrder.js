let DepartmentData;
let searchPurchaseOrderResult
let department = 'purchase';
let applicationStatus
let orderNumber
let taxId
let supplierName
let repEmployee
let orderDateStart
let orderDateEnd
let start
let end
let page = 0



window.addEventListener('load', function(){
    getDepartment()
});

// 讓下拉式選單有部門員工的名子
async function getDepartment() {
    await getDepartmentUser()
    renderDepartment()
}

async function search(applicationStatus,orderNumber,taxId,supplierName,repEmployee,orderDateStart,orderDateEnd){
    await searchPurchaseOrderApi(applicationStatus,orderNumber,taxId,supplierName,repEmployee,orderDateStart,orderDateEnd)
    renderSearchPurchaseOrder()
}


 function getDepartmentUser(){
    return fetch('/api/user/departmentMember?department='+department, {
        method: 'GET', headers: new Headers({ 'Content-Type': 'application/json'})
    }).then((response) => {
        return response.json();
    }).then((result) => {
        DepartmentData = result;
    });
}

function searchPurchaseOrderApi(applicationStatus='', orderNumber='',taxId='',supplierName='',repEmployee='',orderDateStart='',orderDateEnd=''){

    return fetch('/api/purchaseOrder/summary?applicationStatus='+applicationStatus+
    '&applicationId='+orderNumber+
    '&taxId='+taxId+
    '&supplierName='+supplierName+
    '&repEmployee='+repEmployee+
    '&orderDateStart='+orderDateStart+
    '&orderDateEnd='+orderDateEnd+
    '&page='+page, {
        method: 'GET', headers: new Headers({ 'Content-Type': 'application/json'})
    }).then((response) => {
        return response.json();
    }).then((result) => {
        searchPurchaseOrderResult = result;
    });
}

function renderDepartment(){
    for (i=0; i < DepartmentData.data.length; i++){
        option = document.createElement('option');
        option.textContent = DepartmentData['data'][i].name;
        document.getElementById('repEmployee').appendChild(option);
    }
}

function getCondition(){
    applicationStatus = document.getElementById('status').value
    orderNumber = document.getElementById('orderNumber').value
    taxId = document.getElementById('taxId').value
    supplierName = document.getElementById('suppliername').value
    repEmployee = document.getElementById('repEmployee').value
    start = document.getElementById('orderDateStart').value
    end = document.getElementById('orderDateEnd').value
    if (start!=''){
        orderDateStart = Date.parse(start)
    }else{
        orderDateStart=''
    }
    if (end!=''){
        orderDateEnd = Date.parse(end)
    }else{
        orderDateEnd=''
    }

    search(applicationStatus,orderNumber,taxId,supplierName,repEmployee,orderDateStart,orderDateEnd)
}

function renderSearchPurchaseOrder(){
    errorAlert = document.createElement('div')
    errorAlert.setAttribute('id','errorAlert')
    if('error' in searchPurchaseOrderResult){
        errorAlert.textContent = searchPurchaseOrderResult['message']
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
        if (searchPurchaseOrderResult.data.length>10){
            searchResult = 10
            document.getElementById('nextPage').style.display = 'block'
        }else{
            searchResult = searchPurchaseOrderResult.data.length
            document.getElementById('nextPage').style.display = 'none'
        }

        for(m = 0; m < searchResult; m++){
            tableLine = searchPurchaseOrderResult.data[m] // 列字典
            row = document.createElement('tr')
            row.className = 'row'
            let id = searchPurchaseOrderResult.data[m]['orderNumber'] // 沒有寫let 參照的永遠是最後那次m的id
            row.onclick = function (){window.location.href = '/purchaseOrderSingle?orderNumber='+id+'&department='+department}
            number = document.createElement('td')
            number.textContent = m+1
            row.appendChild(number)
            showApplicationId = document.createElement('td')
            showApplicationId.textContent = searchPurchaseOrderResult.data[m]['orderNumber']
            row.appendChild(showApplicationId)
            showApplicationStatus = document.createElement('td')
            showApplicationStatus.textContent = searchPurchaseOrderResult.data[m]['status']
            row.appendChild(showApplicationStatus)
            showOrderDate = document.createElement('td')
            showOrderDate.textContent = searchPurchaseOrderResult.data[m]['orderDate']
            row.appendChild(showOrderDate)
            showSupplierName = document.createElement('td')
            showSupplierName.textContent = searchPurchaseOrderResult.data[m]['supplierName']
            row.appendChild(showSupplierName)
            showTaxId = document.createElement('td')
            showTaxId.textContent = searchPurchaseOrderResult.data[m]['taxId']
            row.appendChild(showTaxId)
            showRepEmployee = document.createElement('td')
            showRepEmployee.textContent = searchPurchaseOrderResult.data[m]['repEmployee']
            row.appendChild(showRepEmployee)
            showPaymentTerm = document.createElement('td')
            showPaymentTerm.textContent = searchPurchaseOrderResult.data[m]['paymentTerm']
            row.appendChild(showPaymentTerm)
            showAmount = document.createElement('td')
            showAmount.textContent = searchPurchaseOrderResult.data[m]['amout'].replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
            row.appendChild(showAmount)
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
    if (orderNumber!=''){
        document.querySelectorAll('.showCondtion')[1].textContent = '申請單號碼: '+orderNumber
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
    if((start!='') && end!=''){
        document.querySelectorAll('.showCondtion')[6].textContent = '訂購日期: '+start+' ~ '+end
        document.querySelectorAll('.showCondtion')[6].style.display = 'flex'
    }
    if((start!='') && end==''){

        document.querySelectorAll('.showCondtion')[6].textContent = '訂購日期: '+start+' ~ '
        document.querySelectorAll('.showCondtion')[6].style.display = 'flex'
    }
    if((start=='') && end!=''){
        document.querySelectorAll('.showCondtion')[6].textContent = '訂購日期: '+'~ '+end
        document.querySelectorAll('.showCondtion')[6].style.display = 'flex'
    }

    if((applicationStatus=='') && (orderNumber=='' ) && (taxId=='') && (supplierName=='') && (repEmployee=='') && (start=='') && (end=='')){

        document.querySelectorAll('.showCondtion')[7].textContent = '全部'
        document.querySelectorAll('.showCondtion')[7].style.display = 'flex'
    }
}


function nextPage(){
    page +=10
    search(applicationStatus,orderNumber,taxId,supplierName,repEmployee,orderDateStart,orderDateEnd)
}

function lastPage(){
    page-=10
    search(applicationStatus,orderNumber,taxId,supplierName,repEmployee,orderDateStart,orderDateEnd)
}