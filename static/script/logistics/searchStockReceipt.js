
let searchStockReceiptResult
let applicationStatus
let applicationId
let taxId
let supplierName
let repEmployee
let ODS
let ODE
let ODSTimestamp
let ODETimestamp
let RDS
let RDE
let RDSTimestamp
let RDETimestamp
let page = 0
// OD orderDate
// RD receiptDate


async function search(applicationStatus,applicationId,taxId,supplierName,ODSTimestamp,ODETimestamp,RDSTimestamp,RDETimestamp){
    await searchStockReceiptApi(applicationStatus,applicationId,taxId,supplierName,ODSTimestamp,ODETimestamp,RDSTimestamp,RDETimestamp)
    renderSearchStockReceipt()
}


function searchStockReceiptApi(applicationStatus='',applicationId='',taxId='',supplierName='',ODSTimestamp='',ODETimestamp='',RDSTimestamp='',RDETimestamp=''){

    return fetch(
        '/api/StockReceipt/summary?applicationStatus='+applicationStatus+
        '&applicationId='+applicationId+
        '&taxId='+taxId+
        '&supplierName='+supplierName+
        '&ODSTimestamp='+ODSTimestamp+
        '&ODETimestamp='+ODETimestamp+
        '&RDSTimestamp='+RDSTimestamp+
        '&RDETimestamp='+RDETimestamp+
        '&page='+page,{
        method: 'GET', headers: new Headers({ 'Content-Type': 'application/json'})
    }).then((response) => {
        return response.json();
    }).then((result) => {
        searchStockReceiptResult = result;
    });
}


function getCondition(){
    applicationStatus = document.getElementById('status').value
    applicationId = document.getElementById('applicationId').value
    taxId = document.getElementById('taxId').value
    supplierName = document.getElementById('supplierName').value
    ODS = document.getElementById('ODS').value
    ODE = document.getElementById('ODE').value
    RDS = document.getElementById('RDS').value
    RDE = document.getElementById('RDE').value

    if (ODS!=''){ODSTimestamp = Date.parse(ODS)}else{ODSTimestamp=''}
    if (ODE!=''){ODETimestamp = Date.parse(ODE)}else{ODETimestamp=''}
    if (RDS!=''){DDSTimestamp = Date.parse(RDS)}else{RDSTimestamp=''}
    if (RDE!=''){DDETimestamp = Date.parse(RDE)}else{RDETimestamp=''}
    search(applicationStatus,applicationId,taxId,supplierName,ODSTimestamp,ODETimestamp,RDSTimestamp,RDETimestamp)
}

function renderSearchStockReceipt(){
    errorAlert = document.createElement('div')
    errorAlert.setAttribute('id','errorAlert')
    if('error' in searchStockReceiptResult){
        errorAlert.textContent = searchStockReceiptResult['message']
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
        if (searchStockReceiptResult.data.length>10){
            searchResult = 10
            document.getElementById('nextPage').style.display = 'block'
        }else{
            searchResult = searchStockReceiptResult.data.length
            document.getElementById('nextPage').style.display = 'none'
        }
        if (page >= 10){
            document.getElementById('lastPage').style.display = 'block'
        }else{
            document.getElementById('lastPage').style.display = 'none'
        }




        for(m = 0; m < searchStockReceiptResult.data.length; m++){
            tableLine = searchStockReceiptResult.data[m] // ?????????
            row = document.createElement('tr')
            row.className = 'row'
            let id = searchStockReceiptResult.data[m]['applicationId'] // ?????????let ??????????????????????????????m???id
            row.onclick = function (){window.location.href = '/stockReceipt?applicationId='+id}
            number = document.createElement('td')
            number.textContent = m+1
            row.appendChild(number)
            showApplicationId = document.createElement('td')
            showApplicationId.textContent = searchStockReceiptResult.data[m]['applicationId']
            row.appendChild(showApplicationId)
            showApplicationStatus = document.createElement('td')
            showApplicationStatus.textContent = searchStockReceiptResult.data[m]['status']
            row.appendChild(showApplicationStatus)
            showSupplierName = document.createElement('td')
            showSupplierName.textContent = searchStockReceiptResult.data[m]['supplierName']
            row.appendChild(showSupplierName)
            showTaxId = document.createElement('td')
            showTaxId.textContent = searchStockReceiptResult.data[m]['taxId']
            row.appendChild(showTaxId)
            showOrderDate = document.createElement('td')
            showOrderDate.textContent = searchStockReceiptResult.data[m]['orderDate']
            row.appendChild(showOrderDate)
            showReceiptDate = document.createElement('td')
            showReceiptDate.textContent = searchStockReceiptResult.data[m]['receiptDate']
            row.appendChild(showReceiptDate)


            document.querySelectorAll('tbody')[0].appendChild(row)
        }
    }
    // ??????input???select
    inputQ = document.querySelectorAll('input').length
    for(i = 0; i < inputQ ;i++){document.querySelectorAll('input')[i].value=''}
    document.getElementById('status').selectedIndex = 0;

}

function showCondition(){
    if (applicationStatus!=''){
        document.querySelectorAll('.showCondtion')[0].textContent = '???????????????: '+applicationStatus
        document.querySelectorAll('.showCondtion')[0].style.display = 'flex'
    }
    if (applicationId!=''){
        document.querySelectorAll('.showCondtion')[1].textContent = '???????????????: '+applicationId
        document.querySelectorAll('.showCondtion')[1].style.display = 'flex'
    }
    if (taxId!=''){
        document.querySelectorAll('.showCondtion')[2].textContent = '????????????: '+ taxId
        document.querySelectorAll('.showCondtion')[2].style.display = 'flex'
    }
    if (supplierName!=''){
        document.querySelectorAll('.showCondtion')[3].textContent = '????????????: '+supplierName
        document.querySelectorAll('.showCondtion')[3].style.display = 'flex'
    }

    if((ODS!='') && ODE!=''){
        document.querySelectorAll('.showCondtion')[4].textContent = '???????????????: '+ODS+' ~ '+ODE
        document.querySelectorAll('.showCondtion')[4].style.display = 'flex'
    }
    if((ODS!='') && ODE==''){

        document.querySelectorAll('.showCondtion')[4].textContent = '???????????????: '+ODS+' ~ '
        document.querySelectorAll('.showCondtion')[4].style.display = 'flex'
    }
    if((ODS=='') && ODE!=''){
        document.querySelectorAll('.showCondtion')[4].textContent = '???????????????: '+'~ '+ODE
        document.querySelectorAll('.showCondtion')[4].style.display = 'flex'
    }
    if((RDS!='') && RDE!=''){
        document.querySelectorAll('.showCondtion')[5].textContent = '???????????????: '+RDS+' ~ '+RDE
        document.querySelectorAll('.showCondtion')[5].style.display = 'flex'
    }
    if((RDS!='') && RDE==''){

        document.querySelectorAll('.showCondtion')[5].textContent = '???????????????: '+RDS+' ~ '
        document.querySelectorAll('.showCondtion')[5].style.display = 'flex'
    }
    if((RDS=='') && RDE!=''){
        document.querySelectorAll('.showCondtion')[5].textContent = '???????????????: '+'~ '+RDE
        document.querySelectorAll('.showCondtion')[5].style.display = 'flex'
    }

    if((applicationStatus=='') && (applicationId=='' ) && (taxId=='') && (supplierName=='') && (repEmployee=='') && (ODS=='') && (ODE=='')&& (RDS=='') && (RDE=='')){

        document.querySelectorAll('.showCondtion')[7].textContent = '??????'
        document.querySelectorAll('.showCondtion')[7].style.display = 'flex'
    }
}

function nextPage(){
    page +=10
    search(applicationStatus,applicationId,taxId,supplierName,ODSTimestamp,ODETimestamp,RDSTimestamp,RDETimestamp)
}

function lastPage(){
    page-=10
    search(applicationStatus,applicationId,taxId,supplierName,ODSTimestamp,ODETimestamp,RDSTimestamp,RDETimestamp)
}