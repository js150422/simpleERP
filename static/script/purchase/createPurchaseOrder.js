
let total = 0
let productData
let supplierData
let supplierName
let createPurchaseOrderResult
let orderList=[]
let orderListProductName = []
let inputQ = document.querySelectorAll('input').length;
let selectQ = document.querySelectorAll('select').length;
let productNameQ = document.querySelectorAll('.productName').length


// 等供應商資料庫建立加入可以選供應商的部分
window.addEventListener('load', function(){
    getSupplierInfo()

});

supplierInput = document.getElementById('supplierName')
supplierInput.addEventListener('change', function(){
	renderSelectSupplierInfo()
});


async function getProductInfo(){
    await getProductApi()
    renderProductInfo()

}

async function getSupplierInfo(){
    await getSupplierApi()
    renderSupplierInfo()
}

async function createPurchaseOrder(purchaseOrder){
    await createPurchaseOrderApi(purchaseOrder)
    renderCreatePurchaseOrder()
}


function getProductApi(){
	return fetch('/api/product?applicationStatus=審核完成'+'&supplierName='+supplierName, {
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

function createPurchaseOrderApi(purchaseOrder){
	return fetch('/api/purchaseOrder', {
		method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(purchaseOrder)
	}).then((response) => {
		return response.json();
	}).then((result) => {
		createPurchaseOrderResult = result;
	});
}


function renderSupplierInfo(){
    for (i=0; i < supplierData.data.length; i++){
        option = document.createElement('option')
        option.textContent = supplierData.data[i]['supplierName']
        document.getElementById('supplierName').appendChild(option)
    }
}


function renderSelectSupplierInfo(){

	supplierName = document.getElementById('supplierName').value
	getProductInfo()
	for (n=0; n < supplierData.data.length; n++){
		if(supplierName==supplierData.data[n]['supplierName']){
			document.getElementById('taxId').textContent = supplierData.data[n]['taxId']
			document.getElementById('repEmployee').textContent = supplierData.data[n]['repEmployee']
			document.getElementById('contactName').textContent = supplierData.data[n]['contactName']
			document.getElementById('contactPersonTile').textContent = supplierData.data[n]['contactPersonTile']
			document.getElementById('contactPhone').textContent = supplierData.data[n]['contactPhone']
			document.getElementById('contactEmail').textContent = supplierData.data[n]['contactEmail']
			document.getElementById('supplierAddress').textContent = supplierData.data[n]['supplierAddress']
			document.getElementById('paymentTerm').textContent = supplierData.data[n]['paymentTerm']
		}
		for (i=0; i < productNameQ; i++){
			document.querySelectorAll('.purchasePrice')[i].textContent = ''
			document.querySelectorAll('.productName')[i].selectedIndex = -1
		}
	}
}

function renderProductInfo(){
	// 排除最上面那個選單，i從1開始
	for (i=1; i < selectQ; i++){

		if(document.querySelectorAll('select')[i].options.length > 0){
			productOptionQ = document.querySelectorAll('select')[i].options.length
			for(n=1;n<productOptionQ;n++){
				document.querySelectorAll('select')[i].options.remove(1)
			}
		}

		for (m=0; m < productData.data.length; m++){
			option = document.createElement('option')
			option.textContent = productData.data[m]['productName']
			document.querySelectorAll('select')[i].appendChild(option)
		}
		document.querySelectorAll('select')[i].addEventListener('change', renderProductPrice)
	}
}

function purchaseOrderSend(){
	if (document.getElementById('preview').textContent == '送出'){
		orderList = []
		orderListProductName = []
		Sname = document.getElementById('supplierName').value
		taxId = document.getElementById('taxId').textContent
		orderDate = document.querySelector('input[type="date"]').value;
		repEmployee = document.getElementById('repEmployee').textContent
		paymentTerm = document.getElementById('paymentTerm').textContent
		contactName = document.getElementById('contactName').textContent
		contactPersonTile = document.getElementById('contactPersonTile').textContent
		contactPhone = document.getElementById('contactPhone').textContent
		contactEmail = document.getElementById('contactEmail').textContent
		supplierAddress = document.getElementById('supplierAddress').textContent
		for (m = 0; m < productNameQ ;m++){
			productQuantity = document.querySelectorAll('.productQuantity')[m].value
			productName = document.querySelectorAll('.productName')[m].value
			order={}
			if ((productQuantity!='') && (productName!='')){
				orderQ = expression(document.querySelectorAll('.productQuantity')[m].value,'number')
				if (orderQ!=undefined){
				orderProductName = document.querySelectorAll('.productName')[m].value
				orderPrice = document.querySelectorAll('.purchasePrice')[m].textContent
				order['productName'] = orderProductName
				order['costPrice'] = orderPrice
				order['OrderQuantity'] = orderQ
				orderList.push(order)
				orderListProductName.push(orderProductName)
				}else{
					document.getElementById('errorAlert').textContent = '您輸入的格式有問題'
				}
			}
		}
		checkReaptProductName = [...new Set(orderListProductName)]
		if ((Sname!='') && (orderDate!='') && (orderList.length!=0)){
			if(orderList.length==checkReaptProductName.length){
			purchaseOrder = {
			'name':userData['name'],
			'supplierName':Sname,
			'taxId':taxId,
			'orderDate':Date.parse(orderDate),
			'repEmployee':repEmployee,
			'paymentTerm':paymentTerm,
			'contactName':contactName,
			'contactPersonTile':contactPersonTile,
			'contactPhone':contactPhone,
			'contactEmail':contactEmail,
			'supplierAddress':supplierAddress,
			'orderList':orderList,
			'departmentId':userData['departmentId'],
			'grad':userData['grad']}
			createPurchaseOrder(purchaseOrder)
			document.getElementById('preview').textContent = '預覽'
			document.getElementById('preview').setAttribute('disabled', true)
			setTimeout(locksend,5000)

			}else{
				document.getElementById('errorAlert').textContent = '請把同品項下在同一列中'
			}
		}else{
			document.getElementById('errorAlert').textContent = '請輸入完整'
		}


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


function renderProductPrice(){
	for (i=0; i < productNameQ; i++){
		for(m=0;m<productData.data.length; m++){

			if (document.querySelectorAll('.productName')[i].value == productData.data[m]['productName']){
				document.querySelectorAll('.purchasePrice')[i].textContent = productData.data[m]['costPrice']
				document.querySelectorAll('.productUnit')[i].textContent = productData.data[m]['productUnit']
			}
			if (document.querySelectorAll('.productName')[i].value == ''){
				document.querySelectorAll('.purchasePrice')[i].textContent = ''
				document.querySelectorAll('.productUnit')[i].textContent = ''
			}
		}
	}
}


function renderCreatePurchaseOrder(){

	if('error' in createPurchaseOrderResult){
		document.getElementById('errorAlert').textContent = createPurchaseOrderResult['message']
	}else{
		document.getElementById('errorAlert').textContent = '訂單編號:' + createPurchaseOrderResult.data+'申請成功'
		for(i = 0; i < inputQ ;i++){
            document.querySelectorAll('input')[i].value = ''
            document.querySelectorAll('input')[i].style.backgroundColor = 'white'
            document.querySelectorAll('input')[i].style.borderStyle = 'solid';
        }
		for (n=0; n < productNameQ; n++){
			document.querySelectorAll('.productName')[n].selectedIndex = -1
			document.querySelectorAll('.purchasePrice')[n].textContent = ''
		}
		document.getElementById('supplierName').selectedIndex = -1
		document.getElementById('total').textContent=''
		cleanClientData()
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
		costPrice = document.querySelectorAll('.purchasePrice')[i].textContent
		document.querySelectorAll('.subtotal')[i].textContent = Number(costPrice)*Number(productQuantity)
	}
}




function cleanClientData(){
	document.getElementById('taxId').textContent = ''
	document.getElementById('repEmployee').textContent = ''
	document.getElementById('contactName').textContent = ''
	document.getElementById('contactPersonTile').textContent = ''
	document.getElementById('contactPhone').textContent = ''
	document.getElementById('contactEmail').textContent = ''
	document.getElementById('supplierAddress').textContent = ''
	document.getElementById('paymentTerm').textContent = ''
  }



  document.body.onkeydown = function(e) {
	if (e.keyCode == 13){
        purchaseOrderSend()
	}
};




function locksend(){
	document.getElementById('preview').removeAttribute('disabled');
}