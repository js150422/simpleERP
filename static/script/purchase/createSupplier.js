let inputQ = document.querySelectorAll('input').length;
let selectQ = document.querySelectorAll('select').length;
let createSupplierResult;
let departmentData;
let department = 'purchase';

window.addEventListener('load', function(){
    getDepartment()
});




async function getDepartment() {
	await getDepartmentUser()
    renderDepartment(departmentData)
}



async function createSupplier(coInfo){
    await createSupplierApi(coInfo)
    renderCreateSupplier(createSupplierResult)
}


function send(){

    expressWrong = {'error':true, 'message':'請輸入完整資資料'}
    if (document.getElementById('preview').textContent == '送出'){
        supplierName = document.getElementById('supplierName').value
        taxId = expression(document.getElementById('taxId').value,'taxId')
        supplierAddress = document.getElementById('supplierAddress').value
        supplierCapital = document.getElementById('supplierCapital').value
        contactName = document.getElementById('contactName').value
        contactPersonTile = document.getElementById('contactPersonTile').value
        contactPhone = expression(document.getElementById('contactPhone').value,'phone')
        contactEmail = expression(document.getElementById('contactEmail').value,'email')

        paymentTerm = document.getElementById('paymentTerm').value
        repEmployee = document.getElementById('repEmployee').value
        supplierNote = document.getElementById('supplierNote').value
        if ((taxId!=undefined) ||  (contactEmail!=undefined) || (contactPhone!=undefined)){
            if((supplierName!='') && (supplierAddress!='') && (supplierCapital!='') && (contactName!='') &&(contactPersonTile!='') && (paymentTerm!='') && (repEmployee!='')){
                console.log(taxId)
                createSupplier({
                    'supplierName':supplierName.trim(),
                    'taxId':taxId.trim(),
                    'supplierAddress':supplierAddress.trim(),
                    'supplierCapital':supplierCapital.trim(),
                    'contactName':contactName.trim(),
                    'contactPersonTile':contactPersonTile.trim(),
                    'contactPhone':contactPhone.trim(),
                    'contactEmail':contactEmail.trim(),
                    'paymentTerm':paymentTerm,
                    'repEmployee':repEmployee,
                    'supplierNote':supplierNote.trim(),
                    'name':userData['name'],
                    'departmentId':userData['departmentId'],
                    'grad':userData['grad']
                })
                document.getElementById('preview').setAttribute('disabled', true)
                document.getElementById('preview').textContent = '預覽'
                setTimeout(locksend,5000)


            }else{
                renderCreateSupplier({'error':true,'message':'請輸入完整'})
            }
        }else{
            renderCreateSupplier({'error':true,'message':'您輸入的格式有問題'})
        }

    }else{
        for(let i = 0; i < inputQ ;i++){
            document.querySelectorAll('input')[i].style.borderStyle = 'none';
            document.querySelectorAll('input')[i].style.backgroundColor = 'rgba(0,0,0,0)'
            document.querySelectorAll('input')[i].onclick = function () {inputChange(); }
        }
        for (let m = 0; m < selectQ ;m++){
            document.querySelectorAll('select')[m].style.borderStyle = 'none';
            document.querySelectorAll('select')[m].style.backgroundColor = 'rgba(0,0,0,0)'
            document.querySelectorAll('select')[m].onclick = function () {inputChange(); }
        }
        document.getElementById('preview').textContent = '送出'
    }
}




function getDepartmentUser(){
	return fetch('/api/user/departmentMember?department='+department, {
		method: 'GET', headers: new Headers({ 'Content-Type': 'application/json'})
	}).then((response) => {
		return response.json();
	}).then((result) => {
		departmentData = result;
	});
}


function createSupplierApi(coInfo){
	return fetch('/api/supplier', {
		method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(coInfo)
	}).then((response) => {
		return response.json();
	}).then((result) => {
		createSupplierResult = result;
	});
}








function renderDepartment(){

    for (i=0; i < departmentData.data.length; i++){
        option = document.createElement('option')
        option.textContent = departmentData.data[i]['name']
        document.getElementById('repEmployee').appendChild(option)
    }
}



function renderCreateSupplier(createSupplierResult){
    if('error' in createSupplierResult){
        document.getElementById('createResult').textContent = createSupplierResult['message']
    }else{
        document.getElementById('createResult').textContent = createSupplierResult.data+'申請成功'
        for(i = 0; i < inputQ ;i++){
            document.querySelectorAll('input')[i].value = ''
            document.querySelectorAll('input')[i].style.backgroundColor = 'white'
            document.querySelectorAll('input')[i].style.borderStyle = 'solid';
        }
        document.getElementById('repEmployee').selectedIndex = -1
    }
}

function inputChange(){
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



document.body.onkeydown = function(e) {
	if (e.keyCode == 13){
        send()
	}
};


function locksend(){
    document.getElementById('preview').removeAttribute('disabled');
}