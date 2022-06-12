let DepartmentData;
let searchSaleOrderResult
let department = 'sale';
let applicationStatus
let orderNumber
let taxId
let clientName
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

async function search(applicationStatus,orderNumber,taxId,clientname,repEmployee,orderDateStart,orderDateEnd){
    await searchSaleOrderApi(applicationStatus,orderNumber,taxId,clientname,repEmployee,orderDateStart,orderDateEnd)
    renderSearchSaleOrder()
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

function searchSaleOrderApi(applicationStatus='', orderNumber='',taxId='',clientName='',repEmployee='',orderDateStart='',orderDateEnd=''){
    return fetch('/api/saleOrder/summary?applicationStatus='+applicationStatus+
    '&applicationId='+orderNumber+
    '&taxId='+taxId+
    '&clientName='+clientName+
    '&repEmployee='+repEmployee+
    '&orderDateStart='+orderDateStart+
    '&orderDateEnd='+orderDateEnd+
    '&page='+page, {
        method: 'GET', headers: new Headers({ 'Content-Type': 'application/json'})
    }).then((response) => {
        return response.json();
    }).then((result) => {
        searchSaleOrderResult = result;
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
    clientName = document.getElementById('clientname').value
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

    search(applicationStatus,orderNumber,taxId,clientName,repEmployee,orderDateStart,orderDateEnd)
}

function renderSearchSaleOrder(){
    if (page >= 10){
        document.getElementById('lastPage').style.display = 'block'
    }else{
        document.getElementById('lastPage').style.display = 'none'
    }
    errorAlert = document.createElement('div')
    errorAlert.setAttribute('id','errorAlert')
    if('error' in searchSaleOrderResult){
        errorAlert.textContent = searchSaleOrderResult['message']
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

        if (searchSaleOrderResult.data.length>10){
            searchResult = 10
            document.getElementById('nextPage').style.display = 'block'
        }else{
            searchResult = searchSaleOrderResult.data.length
            document.getElementById('nextPage').style.display = 'none'
        }

        for(m = 0; m < searchResult; m++){
            tableLine = searchSaleOrderResult.data[m] // 列字典
            row = document.createElement('tr')
            row.className = 'row'
            let id = searchSaleOrderResult.data[m]['orderNumber'] // 沒有寫let 參照的永遠是最後那次m的id
            row.onclick = function (){window.location.href = '/saleOrderSingle?orderNumber='+id+'&department='+department}
            number = document.createElement('td')
            number.textContent = m+1
            row.appendChild(number)
            showApplicationId = document.createElement('td')
            showApplicationId.textContent = searchSaleOrderResult.data[m]['orderNumber']
            row.appendChild(showApplicationId)
            showApplicationStatus = document.createElement('td')
            showApplicationStatus.textContent = searchSaleOrderResult.data[m]['status']
            row.appendChild(showApplicationStatus)
            showOrderDate = document.createElement('td')
            showOrderDate.textContent = searchSaleOrderResult.data[m]['orderDate']
            row.appendChild(showOrderDate)
            showClientName = document.createElement('td')
            showClientName.textContent = searchSaleOrderResult.data[m]['clientName']
            row.appendChild(showClientName)
            showTaxId = document.createElement('td')
            showTaxId.textContent = searchSaleOrderResult.data[m]['taxId']
            row.appendChild(showTaxId)
            showRepEmployee = document.createElement('td')
            showRepEmployee.textContent = searchSaleOrderResult.data[m]['repEmployee']
            row.appendChild(showRepEmployee)
            showPaymentTerm = document.createElement('td')
            showPaymentTerm.textContent = searchSaleOrderResult.data[m]['paymentTerm']
            row.appendChild(showPaymentTerm)
            showClientCredit = document.createElement('td')
            showClientCredit.textContent = searchSaleOrderResult.data[m]['clientCredit']
            row.appendChild(showClientCredit)
            showAmount = document.createElement('td')
            showAmount.textContent = searchSaleOrderResult.data[m]['amout'].replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
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
    if (clientName!=''){
        document.querySelectorAll('.showCondtion')[3].textContent = '客戶名稱: '+clientName
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

    if((applicationStatus=='') && (orderNumber=='' ) && (taxId=='') && (clientName=='') && (repEmployee=='') && (start=='') && (end=='')){

        document.querySelectorAll('.showCondtion')[7].textContent = '全部'
        document.querySelectorAll('.showCondtion')[7].style.display = 'flex'
    }
}

function nextPage(){
    page +=10
    search(applicationStatus,orderNumber,taxId,clientName,repEmployee,orderDateStart,orderDateEnd)
}

function lastPage(){
    page-=10
    search(applicationStatus,orderNumber,taxId,clientName,repEmployee,orderDateStart,orderDateEnd)
}