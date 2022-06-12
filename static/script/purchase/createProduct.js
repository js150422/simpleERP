let createProductResult
let inputQ = document.querySelectorAll('input').length;
let productPig = document.getElementById('productPig')
let productPigUploadResult
let applicationId

// 等供應商資料庫建立加入可以選供應商的部分
window.addEventListener('load', function(){
    getSupplierInfo()

});

productPig.addEventListener('change', checkProductPig, false);


async function getSupplierInfo(){
    await getSupplierApi()
    renderSupplierInfo()
}

async function createProduct(productInfo){
    await createProductApi(productInfo)
    renderCreateProduct(createProductResult)
}

async function productPigUpLoad(){
    await upLoadProductPigApi()
    renderProductPig(productPigUploadResult)
}




function getSupplierApi(){
	return fetch('/api/supplier/summary?applicationStatus=complete', {
		method: 'GET', headers: new Headers({ 'Content-Type': 'application/json'})
	}).then((response) => {
		return response.json();
	}).then((result) => {
		supplierData = result;
	});
}


function createProductApi(productInfo){
	return fetch('/api/product', {
		method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(productInfo)
	}).then((response) => {
		return response.json();
	}).then((result) => {
		createProductResult = result;
	});
}

function upLoadProductPigApi(){

    if (productPig.value!=''){
        productPigFile = this.files;
        let productPigFormData = new FormData();
        productPigFormData.append('files', productPig.files[0])
        productPigFormData.append('applicationId', applicationId)
        return fetch('/api/product/jpg', {
            method:'POST',
            body : productPigFormData
        }).then(function(response){
            productPigUploadResult = response
        });
    }
}


function renderSupplierInfo(){
    for (i=0; i < supplierData.data.length; i++){
        option = document.createElement('option')
        option.textContent = supplierData.data[i]['supplierName']
        document.getElementById('supplierName').appendChild(option)
    }
    document.querySelectorAll('select')[0].style.backgroundColor = 'white'
    document.querySelectorAll('select')[0].style.borderStyle = 'solid';
}



function checkProductPig() {
    let productPigFile = this.files;
    const productPigFileReader =  new FileReader();
    productPigFileReader.readAsDataURL(productPigFile[0]);
    productPigFileReader.onloadend = async function(e){
        document.getElementById('productPigBlock').style.backgroundImage = 'url('+ e.target.result +')'
    }
    document.getElementById('upLoadHint').style.display='none'
	if(!['image/jpeg', 'image/png', 'image/gif'].includes(productPigFile[0].type))
	{
		document.getElementById('errorAlert').textContent = '只接受副檔名為JPG、PNG及GIF';
		document.getElementById('productPig').value = '';
        document.getElementById('preview').setAttribute('disabled', true)
        return;
    }else{
        document.getElementById('preview').removeAttribute('disabled')
    }
    if(productPigFile[0].size > 2 * 1024 * 1024)
    {
    	document.getElementById('errorAlert').textContent = '檔案大小請在 5 MB內';
    	document.getElementById('productPig').value = '';
        document.getElementById('preview').setAttribute('disabled', true)
        return;
    }else{
        document.getElementById('preview').removeAttribute('disabled')
    }

}



function productInfoSend(){
    if (document.getElementById('preview').textContent == '送出'){
        productName = document.getElementById('productName').value
        supplierName = document.getElementById('supplierName').value
        costPrice = expression(document.getElementById('costPrice').value,'number')
        productUnit = document.getElementById('productUnit').value
        productDescription = document.getElementById('productDescription').value
        if(costPrice !=undefined){
            if((productName != '')&(supplierName != '')&( productUnit != '')&(productDescription != '')){
                createProduct({
                    'productName':productName.trim(),
                    'supplierName':supplierName,
                    'costPrice':costPrice,
                    'productUnit':productUnit.trim(),
                    'productDescription':productDescription.trim(),
                    'name':userData['name'],
                    'departmentId':userData['departmentId'],
                    'grad':userData['grad']
                })


                document.getElementById('preview').setAttribute('disabled', true)
                document.getElementById('preview').textContent = '預覽'
                setTimeout(locksend,5000)
            }else{
                renderCreateProduct({'error':true,'message':'請輸入完整'})

            }
        }else{
            renderCreateProduct({'error':true,'message':'您輸入的格式有問題'})
        }

    }else{
        for(let i = 0; i < inputQ ;i++){
            document.querySelectorAll('input')[i].style.borderStyle = 'none';
            document.querySelectorAll('input')[i].style.backgroundColor = 'rgba(0,0,0,0)'
            document.querySelectorAll('input')[i].onclick = function () {inputChange(); }
        }

            document.querySelectorAll('select')[0].style.borderStyle = 'none';
            document.querySelectorAll('select')[0].style.backgroundColor = 'rgba(0,0,0,0)'
            document.querySelectorAll('select')[0].onclick = function () {inputChange(); }

        document.getElementById('preview').textContent = '送出'
    }


}


function renderCreateProduct(createProductResult){
    if('error' in createProductResult){
        document.getElementById('errorAlertForDB').textContent = createProductResult['message']
    }else{
        applicationId = createProductResult.data
        productPigUpLoad()

    }
}


function renderProductPig(productPigUploadResult){
    if('error' in productPigUploadResult){
        document.getElementById('errorAlertForPig').textContent = productPigUploadResult['message']
    }else{
        document.getElementById('errorAlertForDB').textContent = createProductResult.data+'申請新增成功'
        for(i = 0; i < inputQ ;i++){
            document.querySelectorAll('input')[i].value = ''
        }
        document.getElementById('productPigBlock').style.backgroundImage = 'none'
        document.getElementById('upLoadHint').style.display='flex'
    }
}


function inputChange(){
    for(i = 0; i < inputQ ;i++){
        document.querySelectorAll('input')[i].style.backgroundColor = 'white'
        document.querySelectorAll('input')[i].style.borderStyle = 'solid';
    }

    document.getElementById('preview').textContent = '預覽'
}

document.body.onkeydown = function(e) {
	if (e.keyCode == 13){
        productInfoSend()
	}
};



function locksend(){
    document.getElementById('preview').removeAttribute('disabled');
}