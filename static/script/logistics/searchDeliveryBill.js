
let searchDeliveryBillResult
let applicationStatus
let applicationId
let taxId
let clientName
let repEmployee
let ODS
let ODE
let ODSTimestamp
let ODETimestamp
let DDS
let DDE
let DDSTimestamp
let DDETimestamp
let page = 0

// OD orderDate
// DD deliveryDate
errorAlert = document.createElement('div')
errorAlert.setAttribute('id','errorAlert')

async function search(applicationStatus,applicationId,taxId,clientName,ODSTimestamp,ODETimestamp,DDSTimestamp,DDETimestamp){
    await searchDeliveryBillApi(applicationStatus,applicationId,taxId,clientName,ODSTimestamp,ODETimestamp,DDSTimestamp,DDETimestamp)
    renderSearchDeliveryBill()
}


function searchDeliveryBillApi(applicationStatus='',applicationId='',taxId='',clientName='',ODSTimestamp='',ODETimestamp='',DDSTimestamp='',DDETimestamp=''){

    return fetch(
        '/api/deliveryBill/summary?applicationStatus='+applicationStatus+
        '&applicationId='+applicationId+
        '&taxId='+taxId+
        '&clientName='+clientName+
        '&ODSTimestamp='+ODSTimestamp+
        '&ODETimestamp='+ODETimestamp+
        '&DDSTimestamp='+DDSTimestamp+
        '&DDETimestamp='+DDETimestamp+
        '&page='+page,{
        method: 'GET', headers: new Headers({ 'Content-Type': 'application/json'})
    }).then((response) => {
        return response.json();
    }).then((result) => {
        searchDeliveryBillResult = result;
    });
}


function getCondition(){
    applicationStatus = document.getElementById('status').value
    applicationId = document.getElementById('applicationId').value
    taxId = document.getElementById('taxId').value
    clientName = document.getElementById('clientname').value
    ODS = document.getElementById('ODS').value
    ODE = document.getElementById('ODE').value
    DDS = document.getElementById('DDS').value
    DDE = document.getElementById('DDE').value

    if (ODS!=''){ODSTimestamp = Date.parse(ODS)}else{ODSTimestamp=''}
    if (ODE!=''){ODETimestamp = Date.parse(ODE)}else{ODETimestamp=''}
    if (DDS!=''){DDSTimestamp = Date.parse(DDS)}else{DDSTimestamp=''}
    if (DDE!=''){DDETimestamp = Date.parse(DDE)}else{DDETimestamp=''}
    search(applicationStatus,applicationId,taxId,clientName,ODSTimestamp,ODETimestamp,DDSTimestamp,DDETimestamp)
}

function renderSearchDeliveryBill(){

    if('error' in searchDeliveryBillResult){
        errorAlert.textContent = searchDeliveryBillResult['message']
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
        if (searchDeliveryBillResult.data.length>10){
            searchResult = 10
            document.getElementById('nextPage').style.display = 'block'
        }else{
            searchResult = searchDeliveryBillResult.data.length
            document.getElementById('nextPage').style.display = 'none'
        }
        if (page >= 10){
            document.getElementById('lastPage').style.display = 'block'
        }else{
            document.getElementById('lastPage').style.display = 'none'
        }


        for(m = 0; m < searchResult; m++){
            tableLine = searchDeliveryBillResult.data[m] // 列字典
            row = document.createElement('tr')
            row.className = 'row'
            let id = searchDeliveryBillResult.data[m]['applicationId'] // 沒有寫let 參照的永遠是最後那次m的id
            row.onclick = function (){window.location.href = '/deliveryBill?applicationId='+id}
            number = document.createElement('td')
            number.textContent = m+1
            row.appendChild(number)
            showApplicationId = document.createElement('td')
            showApplicationId.textContent = searchDeliveryBillResult.data[m]['applicationId']
            row.appendChild(showApplicationId)
            showApplicationStatus = document.createElement('td')
            showApplicationStatus.textContent = searchDeliveryBillResult.data[m]['status']
            row.appendChild(showApplicationStatus)
            showClientName = document.createElement('td')
            showClientName.textContent = searchDeliveryBillResult.data[m]['clientName']
            row.appendChild(showClientName)
            showTaxId = document.createElement('td')
            showTaxId.textContent = searchDeliveryBillResult.data[m]['taxId']
            row.appendChild(showTaxId)
            showOrderDate = document.createElement('td')
            showOrderDate.textContent = searchDeliveryBillResult.data[m]['orderDate']
            row.appendChild(showOrderDate)
            showDeliveryDate = document.createElement('td')
            showDeliveryDate.textContent = searchDeliveryBillResult.data[m]['deliveryDate']
            row.appendChild(showDeliveryDate)


            document.querySelectorAll('tbody')[0].appendChild(row)
        }
    }
    // 清除input跟select
    inputQ = document.querySelectorAll('input').length
    for(i = 0; i < inputQ ;i++){document.querySelectorAll('input')[i].value=''}
    document.getElementById('status').selectedIndex = 0;

}

function showCondition(){
    if (applicationStatus!=''){
        document.querySelectorAll('.showCondtion')[0].textContent = '申請單狀態: '+applicationStatus
        document.querySelectorAll('.showCondtion')[0].style.display = 'flex'
    }
    if (applicationId!=''){
        document.querySelectorAll('.showCondtion')[1].textContent = '申請單號碼: '+applicationId
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

    if((ODS!='') && ODE!=''){
        document.querySelectorAll('.showCondtion')[4].textContent = '預計交貨日: '+ODS+' ~ '+ODE
        document.querySelectorAll('.showCondtion')[4].style.display = 'flex'
    }
    if((ODS!='') && ODE==''){

        document.querySelectorAll('.showCondtion')[4].textContent = '預計交貨日: '+ODS+' ~ '
        document.querySelectorAll('.showCondtion')[4].style.display = 'flex'
    }
    if((ODS=='') && ODE!=''){
        document.querySelectorAll('.showCondtion')[4].textContent = '預計交貨日: '+'~ '+ODE
        document.querySelectorAll('.showCondtion')[4].style.display = 'flex'
    }
    if((DDS!='') && DDE!=''){
        document.querySelectorAll('.showCondtion')[5].textContent = '實際交貨日: '+DDS+' ~ '+DDE
        document.querySelectorAll('.showCondtion')[5].style.display = 'flex'
    }
    if((DDS!='') && DDE==''){

        document.querySelectorAll('.showCondtion')[5].textContent = '預計交貨日: '+DDS+' ~ '
        document.querySelectorAll('.showCondtion')[5].style.display = 'flex'
    }
    if((DDS=='') && DDE!=''){
        document.querySelectorAll('.showCondtion')[5].textContent = '預計交貨日: '+'~ '+DDE
        document.querySelectorAll('.showCondtion')[5].style.display = 'flex'
    }

    if((applicationStatus=='') && (applicationId=='' ) && (taxId=='') && (clientName=='') && (repEmployee=='') && (ODS=='') && (ODE=='')&& (DDS=='') && (DDE=='')){

        document.querySelectorAll('.showCondtion')[7].textContent = '全部'
        document.querySelectorAll('.showCondtion')[7].style.display = 'flex'
    }
}

function nextPage(){
    page +=10
    search(applicationStatus,applicationId,taxId,clientName,ODSTimestamp,ODETimestamp,DDSTimestamp,DDETimestamp)
}

function lastPage(){
    page-=10
    search(applicationStatus,applicationId,taxId,clientName,ODSTimestamp,ODETimestamp,DDSTimestamp,DDETimestamp)
}