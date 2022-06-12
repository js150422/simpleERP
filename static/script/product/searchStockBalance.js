let supplierData
let productData
let balanceDateSearch
let stockBalanceData
let balanceDate
let supplierName
let productName
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

async function getStockBalance(supplierName,productName,balanceDate){
    await getStockBalanceApi(supplierName,productName,balanceDate)
    renderStockBalance()
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


function getStockBalanceApi(supplierName='',productName='',balanceDate=''){
	return fetch('/api/stock/balance?supplierName='+supplierName+
    '&productName='+productName+
    '&balanceDate='+balanceDate+
    '&page='+page, {
		method: 'GET', headers: new Headers({ 'Content-Type': 'application/json'})
	}).then((response) => {
		return response.json();
	}).then((result) => {
		stockBalanceData = result;
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


function getCondition(){
    balanceDateSearch = document.getElementById('balanceDateSearch').value
    supplierName = document.getElementById('supplierName').value
    productName = document.getElementById('productName').value
    if (balanceDateSearch!=''){
        balanceDate = Date.parse(balanceDateSearch)
    }

    if(document.querySelectorAll('tr').length>1){
        trQ = document.querySelectorAll('tr').length
        for(i=1;i<trQ;i++){
            document.getElementById('resultTable').deleteRow(1);
        }
    }
    getStockBalance(supplierName,productName,balanceDate)
}


function renderStockBalance(){
    console.log(stockBalanceData.data)
    errorAlert = document.createElement('div')
    errorAlert.setAttribute('id','errorAlert')
 if('error' in stockBalanceData){
    errorAlert.textContent = stockBalanceData['message']
    document.getElementById('btn').appendChild(errorAlert)
    document.getElementById('resultTable').style.display = 'none';

 }else{

    for(let s=0;s<document.getElementsByClassName('showCondtion').length;s++){
        document.getElementsByClassName('showCondtion')[s].style.display='none'
    }
    showCondition()
    document.getElementById('resultTable').style.display = 'flex'
    document.getElementById('searchBox').style.display = 'none';
    if (stockBalanceData.data.length>10){
        searchResult = 10
        document.getElementById('nextPage').style.display = 'block'
    }else{
        searchResult = stockBalanceData.data.length
        document.getElementById('nextPage').style.display = 'none'
    }
    if (page >= 10){
        document.getElementById('lastPage').style.display = 'block'
    }else{
        document.getElementById('lastPage').style.display = 'none'
    }
    for(m = 0; m < searchResult; m++){
        tableLine = stockBalanceData.data[m]
        row = document.createElement('tr')
        row.className = 'row'
        id = stockBalanceData.data[m]['applicationId']
        number = document.createElement('td')
        number.textContent = m+1
        row.appendChild(number)
        showApplicationId = document.createElement('td')
        showApplicationId.textContent = stockBalanceData.data[m]['productId']
        row.appendChild(showApplicationId)
        showProductName = document.createElement('td')
        showProductName.textContent = stockBalanceData.data[m]['productName']
        row.appendChild(showProductName)
        showSupplierName = document.createElement('td')
        showSupplierName.textContent = stockBalanceData.data[m]['supplierName']
        row.appendChild(showSupplierName)
        showStockInQuantity = document.createElement('td')
        showStockInQuantity.textContent = stockBalanceData.data[m]['stockIn'].replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')+ ' ' +stockBalanceData.data[m]['productUnit']
        row.appendChild(showStockInQuantity)
        showStockOutQuantity = document.createElement('td')
        showStockOutQuantity.textContent = stockBalanceData.data[m]['stockOut'].replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')+ ' ' +stockBalanceData.data[m]['productUnit']
        row.appendChild(showStockOutQuantity)
        showBalanceQuantity = document.createElement('td')
        showBalanceQuantity.textContent = stockBalanceData.data[m]['balance'].replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',') + ' ' +stockBalanceData.data[m]['productUnit']
        row.appendChild(showBalanceQuantity)
        document.querySelectorAll('tbody')[0].appendChild(row)
    }
    document.getElementById('productName').selectedIndex = -1;
    document.getElementById('supplierName').selectedIndex = -1;
    document.getElementById('balanceDateSearch').value = '';
 }
}


function showCondition(){
    if (balanceDateSearch!=''){
        document.querySelectorAll('.showCondtion')[0].textContent = '查詢日期: '+balanceDateSearch
        document.querySelectorAll('.showCondtion')[0].style.display = 'flex'
    }
    if (supplierName!=''){
        document.querySelectorAll('.showCondtion')[1].textContent = '供應商名稱: '+supplierName
        document.querySelectorAll('.showCondtion')[1].style.display = 'flex'
    }
    if (productName!=''){
        document.querySelectorAll('.showCondtion')[2].textContent = '統一編號: '+ productName
        document.querySelectorAll('.showCondtion')[2].style.display = 'flex'
    }

    if((balanceDateSearch=='') && (supplierName=='' ) && (productName=='')){
        document.querySelectorAll('.showCondtion')[3].textContent = '查詢日期: '+yy+'-'+mm+'-'+dd
        document.querySelectorAll('.showCondtion')[3].style.display = 'flex'
    }

}

function nextPage(){
    page +=10
    getStockBalance(supplierName,productName,balanceDate)
}

function lastPage(){
    page-=10
    getStockBalance(supplierName,productName,balanceDate)
}