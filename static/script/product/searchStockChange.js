let supplierData
let productData
let balanceDateSearch
let stockChangeDetailData
let balanceDate
let supplierName
let productName
let startDate
let endDate
let page = 0
Today = new Date();

yy=Today.getFullYear();
mm=Today.getMonth()+1;
dd=Today.getDate();



window.addEventListener('load', function(){
    getSupplierInfo()
	getProductInfo()
});

async function getProductInfo(){
    await getProductApi()
    renderProductInfo()

}

async function getSupplierInfo(){
    await getSupplierApi()
    renderSupplierInfo()
}

async function stockChangeDetail(supplierName,productName,startDate,endDate){
    await stockChangeDetailApi(supplierName,productName,startDate,endDate)
    renderStockChangeDetail()
}



function getProductApi(){
	return fetch('/api/product?applicationStatus=審核完成', {
		method: 'GET', headers: new Headers({ 'Content-Type': 'application/json'})
	}).then((response) => {
		return response.json();
	}).then((result) => {
		productData = result;
	});
}


function getSupplierApi(){
	return fetch('/api/supplier/summary?applicationStatus=審核完成', {
		method: 'GET', headers: new Headers({ 'Content-Type': 'application/json'})
	}).then((response) => {
		return response.json();
	}).then((result) => {
		supplierData = result;
	});
}


function stockChangeDetailApi(supplierName='',productName='',startDate='',endDate=''){
	return fetch('/api/stock/change?supplierName='+supplierName+
    '&productName='+productName+
    '&startDate='+startDate+
    '&endDate='+endDate+
    '&page='+page, {
		method: 'GET', headers: new Headers({ 'Content-Type': 'application/json'})
	}).then((response) => {
		return response.json();
	}).then((result) => {
		stockChangeDetailData = result;
	});
}



function renderSupplierInfo(){

    for (i=0; i < supplierData.data.length; i++){
        option = document.createElement('option')
        option.textContent = supplierData.data[i]['supplierName']
        document.getElementById('supplierName').appendChild(option)
    }
}


function renderProductInfo(){

    for (m=0; m < productData.data.length; m++){
        option = document.createElement('option')
        option.textContent = productData.data[m]['productName']
        document.getElementById('productName').appendChild(option)
    }

}


function getStockChangeDetail(){
    startDateSearch = document.getElementById('startDateSearch').value
    endDateSearch = document.getElementById('endDateSearch').value
    supplierName = document.getElementById('supplierName').value
    productName = document.getElementById('productName').value
    if (startDateSearch!=''){
        startDate = Date.parse(startDateSearch)
    }
    if (endDateSearch!=''){
        endDate = Date.parse(endDateSearch )
    }


    stockChangeDetail(supplierName,productName,startDate,endDate)
}


function renderStockChangeDetail(){

    errorAlert = document.createElement('div')
    errorAlert.setAttribute('id','errorAlert')
 if('error' in stockChangeDetailData){
    errorAlert.textContent = stockChangeDetailData['message']
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
    if (stockChangeDetailData.data.length>10){
        searchResult = 10
        document.getElementById('nextPage').style.display = 'block'
    }else{
        searchResult = stockChangeDetailData.data.length
        document.getElementById('nextPage').style.display = 'none'
    }
    if (page >= 10){
        document.getElementById('lastPage').style.display = 'block'
    }else{
        document.getElementById('lastPage').style.display = 'none'
    }
    for(m = 0; m < searchResult; m++){
        tableLine = stockChangeDetailData.data[m]
        row = document.createElement('tr')
        row.className = 'row'
        let id = stockChangeDetailData.data[m]['applicationId']
        applicationTitle = id.split('')

        if(applicationTitle.slice(0,1)=='D'){
            row.onclick = function (){window.location.href = '/deliveryBill?applicationId='+id}
        }
        if(applicationTitle.slice(0,1)=='R'){
            row.onclick = function (){window.location.href = '/stockReceipt?applicationId='+id}
        }

        number = document.createElement('td')
        number.textContent = m+1
        row.appendChild(number)
        showDate = document.createElement('td')
        showDate.textContent = stockChangeDetailData.data[m]['changeDate']
        row.appendChild(showDate)
        showApplicationId = document.createElement('td')
        showApplicationId.textContent = stockChangeDetailData.data[m]['applicationId']
        row.appendChild(showApplicationId)
        showProductId = document.createElement('td')
        showProductId.textContent = stockChangeDetailData.data[m]['productId']
        row.appendChild(showProductId)
        showProductName = document.createElement('td')
        showProductName.textContent = stockChangeDetailData.data[m]['productName']
        row.appendChild(showProductName)
        showSupplierName = document.createElement('td')
        showSupplierName.textContent = stockChangeDetailData.data[m]['supplierName']
        row.appendChild(showSupplierName)
        showStockInQuantity = document.createElement('td')
        showStockOutQuantity = document.createElement('td')
        showStockInQuantity.textContent = 0
        showStockOutQuantity.textContent = 0

        if(stockChangeDetailData.data[m]['Quantity']>0){
        showStockInQuantity.textContent = String(stockChangeDetailData.data[m]['Quantity']).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')+ ' ' +stockChangeDetailData.data[m]['productUnit']
        }else{
        showStockOutQuantity.textContent =  String(stockChangeDetailData.data[m]['Quantity']).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')+ ' ' +stockChangeDetailData.data[m]['productUnit']
        }

        row.appendChild(showStockInQuantity)
        row.appendChild(showStockOutQuantity)
        document.querySelectorAll('tbody')[0].appendChild(row)
    }
    document.getElementById('productName').selectedIndex = -1;
    document.getElementById('supplierName').selectedIndex = -1;
    document.getElementById('startDateSearch').value = '';
    document.getElementById('endDateSearch').value = '';
 }
}


function showCondition(){
    if (supplierName!=''){
        document.querySelectorAll('.showCondtion')[0].textContent = '供應商名稱: '+supplierName
        document.querySelectorAll('.showCondtion')[0].style.display = 'flex'
    }
    if (productName!=''){
        document.querySelectorAll('.showCondtion')[1].textContent = '統一編號: '+ productName
        document.querySelectorAll('.showCondtion')[1].style.display = 'flex'
    }

    if((startDateSearch!='') && endDateSearch!=''){
        document.querySelectorAll('.showCondtion')[2].textContent = '查詢日期: '+startDateSearch+' ~ '+endDateSearch
        document.querySelectorAll('.showCondtion')[2].style.display = 'flex'
    }
    if((startDateSearch!='') && endDateSearch==''){

        document.querySelectorAll('.showCondtion')[2].textContent = '查詢日期: '+startDateSearch+' ~ '
        document.querySelectorAll('.showCondtion')[2].style.display = 'flex'
    }
    if((startDateSearch=='') && endDateSearch!=''){
        document.querySelectorAll('.showCondtion')[2].textContent = '查詢日期: '+'~ '+endDateSearch
        document.querySelectorAll('.showCondtion')[2].style.display = 'flex'
    }

    if((supplierName=='') && (productName=='' ) && (startDateSearch=='') && (endDateSearch=='')){

        document.querySelectorAll('.showCondtion')[3].textContent = '查詢日期: '+yy+'-'+mm+'-'+dd
        document.querySelectorAll('.showCondtion')[3].style.display = 'flex'
    }

}

function nextPage(){
    page +=10
    stockChangeDetail(supplierName,productName,startDate,endDate)
}

function lastPage(){
    page-=10
    stockChangeDetail(supplierName,productName,startDate,endDate)
}