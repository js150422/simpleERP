// 待補正則表達
// 待補交易總數連接

let total = 0
let productData
let clientData
let clientName
let createSaleOrderResult
let orderList=[]
let orderListProductName = []
let clientId
let specialPriceData
let inputQ = document.querySelectorAll('input').length;
let selectQ = document.querySelectorAll('select').length;
let productNameQ = document.querySelectorAll('.productName').length

// 等供應商資料庫建立加入可以選供應商的部分
window.addEventListener('load', function(){
    getClientInfo()
	getProductInfo()
});

supplierInput = document.getElementById('clientName')
supplierInput.addEventListener('change', function(){
	renderSelectClientInfo()
});

// 等供應商資料庫建立加入可以選供應商的部分
async function getProductInfo(){
    await getProductApi()
    renderProductInfo()
}

async function getClientSp(){
    await getClientSpApi()
    renderClientSp()
}

async function getClientInfo(){
    await getClientApi()
    renderClientInfo()
}

async function createSaleOrder(saleOrder){
    await createSaleOrderApi(saleOrder)
    renderCreateSaleOrder()
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

function getClientApi(){
	return fetch('/api/client/summary?applicationStatus=審核完成', {
		method: 'GET', headers: new Headers({ 'Content-Type': 'application/json'})
	}).then((response) => {
		return response.json();
	}).then((result) => {
		clientData = result;
	});
}

function getClientSpApi(){
	return fetch('/api/specialPrice/client?clientId='+clientId, {
		method: 'GET', headers: new Headers({ 'Content-Type': 'application/json'})
	}).then((response) => {
		return response.json();
	}).then((result) => {
		specialPriceData = result;
	});
}



function createSaleOrderApi(saleOrder){
	return fetch('/api/saleOrder', {
		method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(saleOrder)
	}).then((response) => {
		return response.json();
	}).then((result) => {
		createSaleOrderResult = result;
	});
}


function renderClientInfo(){
    for (i=0; i < clientData.data.length; i++){
        option = document.createElement('option')
        option.textContent = clientData.data[i]['clientName']
        document.getElementById('clientName').appendChild(option)
    }
}


function renderSelectClientInfo(){

	clientName = document.getElementById('clientName').value

	for (i=0; i < clientData.data.length; i++){

		if(clientName==clientData.data[i]['clientName']){
			document.getElementById('taxId').textContent = clientData.data[i]['taxId']
			document.getElementById('repEmployee').textContent = clientData.data[i]['repEmployee']
			document.getElementById('contactName').textContent = clientData.data[i]['contactName']
			document.getElementById('contactPersonTile').textContent = clientData.data[i]['contactPersonTile']
			document.getElementById('contactPhone').textContent = clientData.data[i]['contactPhone']
			document.getElementById('contactEmail').textContent = clientData.data[i]['contactEmail']
			document.getElementById('clientAddress').textContent = clientData.data[i]['clientAddress']
			document.getElementById('paymentTerm').textContent = clientData.data[i]['paymentTerm']
			document.getElementById('clientCredit').textContent = clientData.data[i]['clientCredit']
			clientId = clientData.data[i]['applicationId']
		}
	}
	for (i=0; i < productNameQ; i++){
		document.querySelectorAll('.salePrice')[i].textContent = ''
		document.querySelectorAll('.productName')[i].selectedIndex = -1
	}

}

function renderProductInfo(){
	// 排除最上面那個選單，i從1開始
	for (i=1; i < selectQ; i++){
		for (m=0; m < productData.data.length; m++){
			option = document.createElement('option')
			option.textContent = productData.data[m]['productName']
			document.querySelectorAll('select')[i].appendChild(option)
		}
		document.querySelectorAll('select')[i].addEventListener('change', getClientSp)
	}
}

function saleOrderSend(){
	orderList=[]
	orderListProductName = []
	if (document.getElementById('preview').textContent == '送出'){
		Sname = document.getElementById('clientName').value
		taxId = document.getElementById('taxId').textContent
		orderDate = document.querySelector('input[type="date"]').value;
		repEmployee = document.getElementById('repEmployee').textContent
		paymentTerm = document.getElementById('paymentTerm').textContent
		clientCredit = document.getElementById('clientCredit').textContent
		contactName = document.getElementById('contactName').textContent
		contactPersonTile = document.getElementById('contactPersonTile').textContent
		contactPhone = document.getElementById('contactPhone').textContent
		contactEmail = document.getElementById('contactEmail').textContent
		clientAddress = document.getElementById('clientAddress').textContent
		for (m = 0; m < productNameQ ;m++){

			productQuantity = document.querySelectorAll('.productQuantity')[m].value
			productName = document.querySelectorAll('.productName')[m].value
			order={}
			if ((productQuantity!='') && (productName!='')){
				orderQ = expression(document.querySelectorAll('.productQuantity')[m].value,'number')
				if (orderQ!=undefined){
					orderProductName = document.querySelectorAll('.productName')[m].value
					orderPrice = document.querySelectorAll('.salePrice')[m].textContent
					order['productName'] = orderProductName
					order['salePrice'] = orderPrice
					order['OrderQuantity'] = orderQ
					orderList.push(order)
					orderListProductName.push(orderProductName)
				}else{
					document.getElementById('errorAlert').textContent = '您輸入的格式有問題'
				}

			}

		}
		checkReaptProductName = [...new Set(orderListProductName)]
		if ((Sname!='') && ( orderDate!='') && (orderList.length!=0)){
			if(orderList.length==checkReaptProductName.length){
				saleOrder = {
					'name':userData['name'],
					'clientName':Sname,
					'taxId':taxId,
					'orderDate':Date.parse(orderDate),
					'repEmployee':repEmployee,
					'paymentTerm':paymentTerm,
					'clientCredit':clientCredit,
					'contactName':contactName,
					'contactPersonTile':contactPersonTile,
					'contactPhone':contactPhone,
					'contactEmail':contactEmail,
					'clientAddress':clientAddress,
					'orderList':orderList,
					'departmentId':userData['departmentId'],
					'grad':userData['grad']}
					createSaleOrder(saleOrder)
					document.getElementById('preview').setAttribute('disabled', true)
					document.getElementById('preview').textContent = '預覽'

					setTimeout(locksend,5000)

			}else{
				document.getElementById('errorAlert').textContent = '請把同品項下在同一列中'
			}
		}else{
			document.getElementById('errorAlert').textContent = '請輸入完整'
		}
		// Date.parse(orderDate)訂購日轉換成時間戳記

    }else{
        for(i = 0; i < inputQ ;i++){
            document.querySelectorAll('input')[i].style.borderStyle = 'none';
            document.querySelectorAll('input')[i].style.backgroundColor = 'rgba(0,0,0,0)'
            document.querySelectorAll('input')[i].onclick = function () {inputChange(); }
        }
		for (m = 0; m < selectQ ;m++){
            document.querySelectorAll('select')[m].style.borderStyle = 'none';
            document.querySelectorAll('select')[m].style.backgroundColor = 'rgba(0,0,0,0)'
            document.querySelectorAll('select')[m].onclick = function () {inputChange(); }

		}
		// 計算總計
		for(n = 0; n < productNameQ ;n++){

			if (document.querySelectorAll('.subtotal')[n].textContent!=null){
				total += Number(document.querySelectorAll('.subtotal')[n].textContent)
			}

		}
		document.getElementById('total').textContent = total
        document.getElementById('preview').textContent = '送出'
    }
}
function inputChange(){
	total = 0
	orderList = []
    for(i = 0; i < inputQ ;i++){
        document.querySelectorAll('input')[i].style.backgroundColor = 'white'
        document.querySelectorAll('input')[i].style.borderStyle = 'solid';
    }
    for(m = 0; m < selectQ ;m++){
        document.querySelectorAll('select')[m].style.backgroundColor = 'white'
        document.querySelectorAll('select')[m].style.borderStyle = 'solid';
    }
    document.getElementById('preview').textContent = '預覽'
}


function count(){
	for (i=0; i < productNameQ; i++){

		productQuantity = document.querySelectorAll('.productQuantity')[i].value
		salePrice = document.querySelectorAll('.salePrice')[i].textContent
		document.querySelectorAll('.subtotal')[i].textContent = Number(salePrice)*Number(productQuantity)


	}
}


function renderCreateSaleOrder(){

	if('error' in createSaleOrderResult){
		document.getElementById('errorAlert').textContent = createSaleOrderResult['message']
	}else{
		document.getElementById('errorAlert').textContent = '訂單編號:' + createSaleOrderResult.data+'申請成功'
		for(i = 0; i < inputQ ;i++){
            document.querySelectorAll('input')[i].value = ''
            document.querySelectorAll('input')[i].style.backgroundColor = 'white'
            document.querySelectorAll('input')[i].style.borderStyle = 'solid';
        }
		for (n=0; n < productNameQ; n++){
			document.querySelectorAll('.productName')[n].selectedIndex = -1
			document.querySelectorAll('.salePrice')[n].textContent = ''
		}
		document.getElementById('clientName').selectedIndex = -1
		document.getElementById('total').textContent=''
		cleanClientData()
	}
}


function renderClientSp(){
	for (i=0; i < productNameQ; i++){
		for(m=0;m<productData.data.length; m++){

			if (document.querySelectorAll('.productName')[i].value == productData.data[m]['productName']){
				document.querySelectorAll('.salePrice')[i].textContent = productData.data[m]['salePrice']
				document.querySelectorAll('.productUnit')[i].textContent = productData.data[m]['productUnit']
			}
		}
	}
	if ('data' in specialPriceData){
		for (i=0; i < productNameQ; i++){
			if (document.querySelectorAll('.productName')[i].value == specialPriceData.data['productName']){
				document.querySelectorAll('.salePrice')[i].textContent = specialPriceData.data['specialPrice']
			}
		}
	}
	for (i=0; i < productNameQ; i++){
		if (document.querySelectorAll('.productName')[i].value == ''){
			document.querySelectorAll('.salePrice')[i].textContent = ''
			document.querySelectorAll('.productUnit')[i].textContent =''
		}
	}

}

function cleanClientData(){
	document.getElementById('clientName').selectedIndex = -1
	document.getElementById('taxId').textContent = ''
	document.getElementById('repEmployee').textContent = ''
	document.getElementById('contactName').textContent = ''
	document.getElementById('contactPersonTile').textContent = ''
	document.getElementById('contactPhone').textContent = ''
	document.getElementById('contactEmail').textContent = ''
	document.getElementById('clientAddress').textContent = ''
	document.getElementById('paymentTerm').textContent = ''
	document.getElementById('clientCredit').textContent = ''
}



document.body.onkeydown = function(e) {
	if (e.keyCode == 13){
        saleOrderSend()
	}
};

function locksend(){
	document.getElementById('preview').removeAttribute('disabled');
}
