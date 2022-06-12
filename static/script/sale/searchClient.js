let DepartmentData;
let searchClientResult
let department = 'sale';
let applicationStatus
let applicationId
let taxId
let clientname
let repEmployee
page = 0



window.addEventListener('load', function(){
    getDepartment()
});


// 讓下拉式選單有部門員工的名子
async function getDepartment() {
    await getDepartmentUser()
    renderDepartment()
}

async function search(applicationStatus,applicationId,taxId,clientname,repEmployee){
    await searchClient(applicationStatus,applicationId,taxId,clientname,repEmployee)
    renderSearchClient()
}

// 帶出要搜尋負責員工的名字
 function getDepartmentUser(){
    return fetch('/api/user/departmentMember?department='+department, {
        method: 'GET', headers: new Headers({ 'Content-Type': 'application/json'})
    }).then((response) => {
        return response.json();
    }).then((result) => {
        DepartmentData = result;
    });
}

function searchClient(applicationStatus='', applicationId='',taxId='',clientname='',repEmployee=''){
    return fetch('/api/client/summary?applicationStatus='+applicationStatus+
    '&applicationId='+applicationId+
    '&taxId='+taxId+
    '&clientname='+clientname+
    '&repEmployee='+repEmployee+
    '&page='+page, {
        method: 'GET', headers: new Headers({ 'Content-Type': 'application/json'})
    }).then((response) => {
        return response.json();
    }).then((result) => {
        searchClientResult = result;
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
    applicationId = document.getElementById('applicationId').value
    taxId = document.getElementById('taxId').value
    clientname = document.getElementById('clientname').value
    repEmployee = document.getElementById('repEmployee').value
    search(applicationStatus,applicationId,taxId,clientname,repEmployee)
}

function renderSearchClient(){

    errorAlert = document.createElement('div')
    errorAlert.setAttribute('id','errorAlert')
    if('error' in searchClientResult){
        errorAlert.textContent = searchClientResult['message']
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
        if (searchClientResult.data.length>10){
            searchResult = 10
            document.getElementById('nextPage').style.display = 'block'
        }else{
            searchResult = searchClientResult.data.length
            document.getElementById('nextPage').style.display = 'none'
        }
        if (page >= 10){
            document.getElementById('lastPage').style.display = 'block'
        }else{
            document.getElementById('lastPage').style.display = 'none'
        }

        for(m = 0; m < searchResult; m++){
            tableLine = searchClientResult.data[m] // 列字典
            row = document.createElement('tr')
            row.className = 'row'
            let id = searchClientResult.data[m]['applicationId'] // 沒有寫let 參照的永遠是最後那次m的id
            row.onclick = function (){window.location.href = '/clientSingle?applicationId='+id+'&department='+department}
            number = document.createElement('td')
            number.textContent = m+1
            row.appendChild(number)
            showApplicationId = document.createElement('td')
            showApplicationId.textContent = searchClientResult.data[m]['applicationId']
            row.appendChild(showApplicationId)
            showApplicationStatus = document.createElement('td')
            showApplicationStatus.textContent = searchClientResult.data[m]['status']
            row.appendChild(showApplicationStatus)
            showClientName = document.createElement('td')
            showClientName.textContent = searchClientResult.data[m]['clientName']
            row.appendChild(showClientName)
            showTaxId = document.createElement('td')
            showTaxId.textContent = searchClientResult.data[m]['taxId']
            row.appendChild(showTaxId)
            showContactName = document.createElement('td')
            showContactName.textContent = searchClientResult.data[m]['contactName']
            row.appendChild(showContactName)
            showContactPhone = document.createElement('td')
            showContactPhone.textContent = searchClientResult.data[m]['contactPhone']
            row.appendChild(showContactPhone)
            // showPaymentTerm = document.createElement('td')
            // showPaymentTerm.textContent = searchClientResult.data[m]['paymentTerm']
            // row.appendChild(showPaymentTerm)
            showClientCredit = document.createElement('td')
            showClientCredit.textContent = searchClientResult.data[m]['clientCredit']
            row.appendChild(showClientCredit)
            showRepEmployee = document.createElement('td')
            showRepEmployee.textContent = searchClientResult.data[m]['repEmployee']
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
    if (clientname!=''){
        document.querySelectorAll('.showCondtion')[3].textContent = '客戶名稱: '+clientname
        document.querySelectorAll('.showCondtion')[3].style.display = 'flex'
    }
    if (repEmployee!=''){
        document.querySelectorAll('.showCondtion')[4].textContent = '負責業務: '+repEmployee
        document.querySelectorAll('.showCondtion')[4].style.display = 'flex'

    }
    if((applicationStatus=='') && (applicationId=='' ) && (taxId=='') && (clientname=='') && (repEmployee=='')){

        document.querySelectorAll('.showCondtion')[5].textContent = '全部'
        document.querySelectorAll('.showCondtion')[5].style.display = 'flex'
    }
}

function nextPage(){
    page +=10
    search(applicationStatus,applicationId,taxId,clientname,repEmployee)
}

function lastPage(){
    page-=10
    search(applicationStatus,applicationId,taxId,clientname,repEmployee)
}