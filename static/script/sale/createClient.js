let inputQ = document.querySelectorAll('input').length;
let selectQ = document.querySelectorAll('select').length;
let reateClientResult;
let DepartmentData;
let department = 'sale';

window.addEventListener('load', function(){
    getDepartment()
});


async function getDepartment() {
	await getDepartmentUser()
    renderDepartment(DepartmentData)
}

function send(){

    expressWrong = {'error':true, 'message':'請輸入完整資資料'}
    if (document.getElementById('preview').textContent == '送出'){

        clientName = document.getElementById('clientName').value
        taxId = expression(document.getElementById('taxId').value,'taxId')
        clientAddress = document.getElementById('clientAddress').value
        clientCapital = document.getElementById('clientCapital').value
        clientPerson = document.getElementById('clientPerson').value
        contactPersonTile = document.getElementById('contactPersonTile').value
        contactPhone = expression(document.getElementById('contactPhone').value,'phone')
        contactEmail = expression(document.getElementById('contactEmail').value,'email')
        paymentTerm = document.getElementById('paymentTerm').value
        clientCredit = document.getElementById('clientCredit').value
        repEmployee = document.getElementById('repEmployee').value
        clientNote = document.getElementById('clientNote').value
        if ((taxId!=undefined) &&  (contactEmail!=undefined) && (contactPhone!=undefined)){
            if((clientName!='') && (clientAddress!='') && (clientCapital!='') && (clientPerson!='') && (contactPersonTile!='') && (paymentTerm!='') && (clientCredit!='') && (repEmployee!='')){

                createClient({
                    'clientName':clientName.trim(),
                    'taxId':taxId.trim(),
                    'clientAddress':clientAddress.trim(),
                    'clientCapital':clientCapital.trim(),
                    'contactName':clientPerson.trim(),
                    'contactPersonTile':contactPersonTile.trim(),
                    'contactPhone':contactPhone.trim(),
                    'contactEmail':contactEmail.trim(),
                    'paymentTerm':paymentTerm,
                    'clientCredit':clientCredit,
                    'repEmployee':repEmployee,
                    'clientNote':clientNote.trim(),
                    'name':userData['name'],
                    'departmentId':userData['departmentId'],
                    'grad':userData['grad']
                })
                document.getElementById('preview').setAttribute('disabled', true)
                document.getElementById('preview').textContent = '預覽'
                setTimeout(locksend,5000)


            }else{
                renderCreateClient({'error':true,'message':'請輸入完整'})
            }
        }else{
            renderCreateClient({'error':true,'message':'您輸入的格式有問題'})
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

async function createClient(coInfo){
    await createClientDatabase(coInfo)
    renderCreateClient(createClientResult)
}



function createClientDatabase(coInfo){
	return fetch('/api/client', {
		method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(coInfo)
	}).then((response) => {
		return response.json();
	}).then((result) => {
		createClientResult = result;
	});
}



function getDepartmentUser(){
	return fetch('/api/user/departmentMember?department='+department, {
		method: 'GET', headers: new Headers({ 'Content-Type': 'application/json'})
	}).then((response) => {
		return response.json();
	}).then((result) => {
		DepartmentData = result;
	});
}


function renderCreateClient(createClientResult){
    if ('error' in createClientResult){
        document.getElementById('createResult').textContent = createClientResult['message']
    }else{

        document.getElementById('createResult').textContent = createClientResult.data+'申請成功'
        for(i = 0; i < inputQ ;i++){
            document.querySelectorAll('input')[i].value = ''
            document.querySelectorAll('input')[i].style.backgroundColor = 'white'
            document.querySelectorAll('input')[i].style.borderStyle = 'solid';
        }
		document.getElementById('repEmployee').selectedIndex = -1

    }
}

function renderDepartment(){

    for (i=0; i < DepartmentData.data.length; i++){
        option = document.createElement('option')
        option.textContent = DepartmentData.data[i]['name']
        document.getElementById('repEmployee').appendChild(option)
    }
}




document.body.onkeydown = function(e) {
	if (e.keyCode == 13){
        send()
	}
};



function locksend(){
    document.getElementById('preview').removeAttribute('disabled');
}
