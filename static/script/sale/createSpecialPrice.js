
let clientName
let productName
let productData
let clientData
let clientId
let productId
let setSpecialPriceResult
let inputQ = document.querySelectorAll('input').length;
let selectQ = document.querySelectorAll('select').length;
let searchSpecialPriceResult
let setSpecialPriceData = {}



selectProduct = document.getElementById('searchProductResult')
selectProduct.addEventListener('change', function(){
	getPrice()
});


async function searchClient(clientName) {
    await searchClientApi(clientName)
    renderClient()
}

async function searchProduct(productName) {
    await searchProductApi(productName)
    renderProduct()
}

async function searchSpecialPrice(taxId,clientName,productName){
    await searchSpecialPriceApi(taxId,clientName,productName)
    renderSearchSpecialPrice()
}





function searchClientInput(){
    clientName= document.getElementById('searchClient').value
    if (clientName!=''){
        searchClient(clientName)
    }else{
        document.getElementById('errorAlert').textContent = '請輸入要設定的廠商'
    }
}

function searchProductInput(){
    productName = document.getElementById('searchProduct').value
    if(productName!=''){
        searchProduct(productName)
    }else{
        document.getElementById('errorAlert').textContent = '請輸入要搜尋的廠商'
    }

}


async function setSpecialPrice(setSpecialPriceData) {
    await setSpecialPriceApi(setSpecialPriceData)
    renderSetSpecialPrice()
}




// 等供應商資料庫建立加入可以選供應商的部分
function searchProductApi(productName = ''){
	return fetch('/api/product?applicationStatus=審核完成&productName='+productName, {
		method: 'GET', headers: new Headers({ 'Content-Type': 'application/json'})
	}).then((response) => {
		return response.json();
	}).then((result) => {
		productData = result;
	});
}

function searchClientApi(clientName=''){
	return fetch('/api/client/summary?applicationStatus=審核完成&clientname='+clientName, {
		method: 'GET', headers: new Headers({ 'Content-Type': 'application/json'})
	}).then((response) => {
		return response.json();
	}).then((result) => {
		clientData = result;
	});
}

function searchSpecialPriceApi(clientName='',productName=''){
    return fetch('/api/specialPrice?&clientName='+clientName+'&productName='+productName+'&last= '+latst, {
        method: 'GET', headers: new Headers({ 'Content-Type': 'application/json'})
    }).then((response) => {
        return response.json();
    }).then((result) => {
        searchSpecialPriceResult = result;
    });
}



function setSpecialPriceApi(setSpecial){

	return fetch('/api/specialPrice', {
		method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(setSpecial)
	}).then((response) => {
		return response.json();
	}).then((result) => {
		setSpecialPriceResult = result;
	});
}



function renderClient(){
    document.getElementById('searchClient').value = ''
    if('error' in clientData){
        document.getElementById('errorAlert').textContent = '沒有相關廠商，請重新搜尋'
    }else{
        for (m=0; m < clientData.data.length; m++){
            option = document.createElement('option')
            option.textContent = clientData.data[m]['clientName']
            document.getElementById('searchClientResult').appendChild(option)
            document.getElementById('searchClientResult').style.display = 'inline-block'
        }

    }
}

function renderProduct(){
    document.getElementById('searchProduct').value = ''
    if('error' in productData ){
        document.getElementById('errorAlert').textContent = '沒有相關產品，請重新搜尋'
    }else{
        for (i=0; i < productData.data.length; i++){
            option = document.createElement('option')
            option.textContent = productData.data[i]['productName']
            document.getElementById('searchProductResult').appendChild(option)
            document.getElementById('searchProductResult').style.display = 'inline-block'
        }

    }

}




function getPrice(){
    clientName = document.getElementById('searchClientResult').value
    productName = document.querySelectorAll('select')[1].value
    if ((clientName!='') && (productName!='')){
        searchSpecialPrice(clientName,productName)
    }
}

function renderSearchSpecialPrice(){
    if('error' in searchSpecialPriceResult){
        if(searchSpecialPriceResult['message']=='沒有相關條件的廠商'){
            for(m=0;m<productData.data.length; m++){
                if (document.querySelectorAll('select')[1].value == productData.data[m]['productName']){
                    document.querySelectorAll('input')[2].value = productData.data[m]['salePrice']
                    setSpecialPriceData ['productId'] = productData.data[m]['applicationId']
                }
            }
        }
    }else{

        setSpecialPriceData ['productId'] = searchSpecialPriceResult.data[0]['applicationId']
        document.querySelectorAll('input')[2].value = searchSpecialPriceResult.data[0]['specialPrice']
    }
}


function getSpecialPriceData(){
    client = document.getElementById('searchClientResult').value
    specialPrice = expression(document.getElementById('specialPrice').value,'number')
    specialDescription = document.getElementById('specialDescription').value

        if(client!=''){
            for (j=0; j < clientData.data.length; j++){

                if (client == clientData.data[j]['clientName']){
                    clientId = clientData.data[j]['applicationId']

                }
            }
        }
        if(specialPrice!=undefined){
            if ((clientId=='') ||  (productId=='') || (specialPrice=='') || (specialDescription=='')){
                document.getElementById('createResult').textContent = '請填寫完整'
            }else{
                setSpecialPriceData ['clientId'] = clientId
                setSpecialPriceData ['specialPrice'] = specialPrice
                setSpecialPriceData ['specialDescription'] = specialDescription.trim()
                setSpecialPriceData ['name'] = userData['name']
                setSpecialPriceData ['grad'] = userData['grad']
                setSpecialPriceData ['applicationType'] = 'specialPrice'
                setSpecialPrice(setSpecialPriceData)
                document.getElementById('preview').setAttribute('disabled', true)
                setTimeout(locksend,5000)

            }
        }else{
            document.getElementById('createResult').textContent = '您輸入的格式有問題'
        }

}


function renderSetSpecialPrice(){
    if('error' in setSpecialPriceResult){
        document.getElementById('createResult').textContent = setSpecialPriceResult['message']
    }else{
        document.getElementById('createResult').textContent = setSpecialPriceResult.data+'申請成功'
        for(i = 0; i < inputQ ;i++){
            document.querySelectorAll('input')[i].value = ''
            document.querySelectorAll('input')[i].style.backgroundColor = 'white'
            document.querySelectorAll('input')[i].style.borderStyle = 'solid';
        }
        let selectClientName = document.getElementById('searchClientResult');
        let selectProductName = document.getElementById('searchProductResult');
        selectClientName.selectedIndex = -1
        selectProductName.selectedIndex = -1

        for (n=1; n<selectClientName.length; n++) {
            selectClientName.remove(n);
        }
        for (q=1; q<selectProductName.length; q++) {
            selectProductName.remove(q);
        }


    }
}


document.body.onkeydown = function(e) {
	if (e.keyCode == 13){
        getSpecialPriceData()
	}
};

function locksend(){
	document.getElementById('preview').removeAttribute('disabled');
}

