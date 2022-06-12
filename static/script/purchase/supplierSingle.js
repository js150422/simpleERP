let singleData
let supplierCreateApplicationSignResult

async function supplierCreateApplicationSign(auditAction){
    insertCommentText=auditAction
    await supplierCreateApplicationSignApi({
    'name':userData['name'],
    'grad':userData['grad'],
    'applicationId':applicationId,
    'auditAction':auditAction,
    'applicationType':'supplierCreate'})
    insertAuditComment(applicationId,userData,insertCommentText)
    renderSupplierCreateSign()
}

function getSingleData(applicationId){
    return fetch('/api/supplier/single?applicationId='+applicationId, {
        method: 'GET', headers: new Headers({ 'Content-Type': 'application/json'})
    }).then((response) => {
        return response.json();
    }).then((result) => {
        singleData = result;
    });
}


function supplierCreateApplicationSignApi(text){
    return fetch('/api/application/supplierCreate',{
        method: 'PATCH',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(text)
    }).then((response)=>{
        return response.json()
    }).then((result)=>{
        supplierCreateApplicationSignResult = result
    })
}




function renderSingle(){
    if ('error' in singleData){
        document.getElementById('signResult').textContent = singleData['message']
    }else{
        // ----------------------------增加表頭資訊------------------------------------
        document.getElementById('middleBox').style.display='grid'
        applicationStatus = document.createElement('span')
        applicationIdElement = document.createElement('span')
        applicationStatus.setAttribute('id', 'applicationStatus')
        applicationIdElement.setAttribute('id', 'applicationId')
        applicationStatus.textContent = singleData.data[0].status
        applicationIdElement.textContent = singleData.data[0].applicationId
        document.getElementById('applicationInfo').appendChild(applicationStatus)
        document.getElementById('applicationInfo').appendChild(applicationIdElement)
        // ----------------------------增加表單資訊------------------------------------
        document.getElementById('supplierName').textContent = singleData.data[0].supplierName
        document.getElementById('taxId').textContent = singleData.data[0].taxId
        document.getElementById('supplierAddress').textContent = singleData.data[0].supplierAddress
        document.getElementById('supplierCapital').textContent = singleData.data[0].supplierCapital
        document.getElementById('contactName').textContent = singleData.data[0].contactName
        document.getElementById('contactPersonTile').textContent = singleData.data[0].contactPersonTile
        document.getElementById('contactPhone').textContent = singleData.data[0].contactPhone
        document.getElementById('contactEmail').textContent = singleData.data[0].contactEmail
        document.getElementById('paymentTerm').textContent = singleData.data[0].paymentTerm
        document.getElementById('repEmployee').textContent = singleData.data[0].repEmployee
        document.getElementById('supplierNotes').textContent = singleData.data[0].supplierNotes

        renderCommentAndSign()
        signPage()

    }
}

function renderSupplierCreateSign(){
    if('error' in supplierCreateApplicationSignResult ){
        document.getElementById('signResult').textContent = supplierCreateApplicationSignResult['message']
    }else{
       localStorage.removeItem('applicationList');
       regetApplication()
    }
}