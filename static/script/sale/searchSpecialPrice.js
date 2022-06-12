
let searchSpecialPriceResult
let department = 'sale';
let applicationStatus
let applicationId
let taxId
let clientName
let productName
let page = 0



async function search(applicationStatus,applicationId,taxId,clientname,productName){
    await searchSpecialPriceApi(applicationStatus,applicationId,taxId,clientname,productName)
    renderSearchSpecialPrice()
}


function searchSpecialPriceApi(applicationStatus='', applicationId='',taxId='',clientName='',productName=''){
    return fetch('/api/specialPrice?applicationStatus='+applicationStatus+
    '&applicationId='+applicationId+
    '&taxId='+taxId+
    '&clientName='+clientName+
    '&productName='+productName+
    '&page='+page, {
        method: 'GET', headers: new Headers({ 'Content-Type': 'application/json'})
    }).then((response) => {
        return response.json();
    }).then((result) => {
        searchSpecialPriceResult = result;
    });
}


function getCondition(){
    applicationStatus = document.getElementById('status').value
    applicationId = document.getElementById('applicationId').value
    taxId = document.getElementById('taxId').value
    clientName = document.getElementById('clientName').value
    productName = document.getElementById('productName').value

    search(applicationStatus,applicationId,taxId,clientName,productName)
}

function renderSearchSpecialPrice(){
    errorAlert = document.createElement('div')
    errorAlert.setAttribute('id','errorAlert')
    if('error' in searchSpecialPriceResult){
        errorAlert.textContent = searchSpecialPriceResult['message']
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

        if (searchSpecialPriceResult.data.length>10){
            searchResult = 10
            document.getElementById('nextPage').style.display = 'block'
        }else{
            searchResult = searchSpecialPriceResult.data.length
            document.getElementById('nextPage').style.display = 'none'
        }
        if (page >= 10){
            document.getElementById('lastPage').style.display = 'block'
        }else{
            document.getElementById('lastPage').style.display = 'none'
        }



        for(m = 0; m < searchResult; m++){
            tableLine = searchSpecialPriceResult.data[m] // 列字典
            row = document.createElement('tr')
            row.className = 'row'
            let id = searchSpecialPriceResult.data[m]['applicationId'] // 沒有寫let 參照的永遠是最後那次m的id
            row.onclick = function (){window.location.href = '/specialPriceSingle?applicationId='+id+'&department='+department}
            number = document.createElement('td')
            number.textContent = m+1
            row.appendChild(number)
            showApplicationId = document.createElement('td')
            showApplicationId.textContent = searchSpecialPriceResult.data[m]['applicationId']
            row.appendChild(showApplicationId)
            showApplicationStatus = document.createElement('td')
            showApplicationStatus.textContent = searchSpecialPriceResult.data[m]['status']
            row.appendChild(showApplicationStatus)
            showApplicationDate = document.createElement('td')
            showApplicationDate.textContent = searchSpecialPriceResult.data[m]['approveTime-1st']
            row.appendChild(showApplicationDate)
            showClientName = document.createElement('td')
            showClientName.textContent = searchSpecialPriceResult.data[m]['clientName']
            row.appendChild(showClientName)
            showProductName = document.createElement('td')
            showProductName.textContent = searchSpecialPriceResult.data[m]['productName']
            row.appendChild(showProductName)
            showSalePrice = document.createElement('td')
            showSalePrice.textContent = searchSpecialPriceResult.data[m]['salePrice']
            row.appendChild(showSalePrice)
            showSpecialPrice = document.createElement('td')
            showSpecialPrice.textContent = searchSpecialPriceResult.data[m]['specialPrice']
            row.appendChild(showSpecialPrice)
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
    if (productName!=''){
        document.querySelectorAll('.showCondtion')[4].textContent = '產品名稱: '+productName
        document.querySelectorAll('.showCondtion')[4].style.display = 'flex'

    }

    if((applicationStatus=='') && (applicationId=='' ) && (taxId=='') && (clientName=='') && (productName=='')){

        document.querySelectorAll('.showCondtion')[5].textContent = '全部'
        document.querySelectorAll('.showCondtion')[5].style.display = 'flex'
    }
}


function nextPage(){
    page +=10
    search(applicationStatus,applicationId,taxId,clientName,productName)
}

function lastPage(){
    page-=10
    search(applicationStatus,applicationId,taxId,clientName,productName)
}