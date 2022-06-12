let singleData
let clientCreateApplicationSignResult

async function clientCreateApplicationSign(auditAction){
    insertCommentText=auditAction
    await clientCreateApplicationSignApi({
    'name':userData['name'],
    'grad':userData['grad'],
    'applicationId':applicationId,
    'auditAction':auditAction,
    'applicationType':'clientCreate'})
    renderClientCreateSign()
    insertAuditComment(applicationId,userData,insertCommentText)
}



function getSingleData(applicationId){
    return fetch('/api/client/single?applicationId='+applicationId, {
        method: 'GET', headers: new Headers({ 'Content-Type': 'application/json'})
    }).then((response) => {
        return response.json();
    }).then((result) => {
        singleData = result;
    });
}


function clientCreateApplicationSignApi(text){
    return fetch('/api/application/clientCreate',{
        method: 'PATCH',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(text)
    }).then((response)=>{
        return response.json()
    }).then((result)=>{
        clientCreateApplicationSignResult = result
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
        document.getElementById('clientName').textContent = singleData.data[0].clientName
        document.getElementById('taxId').textContent = singleData.data[0].taxId
        document.getElementById('clientAddress').textContent = singleData.data[0].clientAddress
        document.getElementById('clientCapital').textContent = singleData.data[0].clientCapital
        document.getElementById('contactName').textContent = singleData.data[0].contactName
        document.getElementById('contactPersonTile').textContent = singleData.data[0].contactPersonTile
        document.getElementById('contactPhone').textContent = singleData.data[0].contactPhone
        document.getElementById('contactEmail').textContent = singleData.data[0].contactEmail
        document.getElementById('paymentTerm').textContent = singleData.data[0].paymentTerm
        document.getElementById('clientCredit').textContent = singleData.data[0].clientCredit
        document.getElementById('repEmployee').textContent = singleData.data[0].repEmployee
        document.getElementById('clientNotes').textContent = singleData.data[0].clientNotes

        renderCommentAndSign()
        signPage()
    }
}


function renderClientCreateSign(){
    if('error' in clientCreateApplicationSignResult ){
        document.getElementById('signResult').textContent = clientCreateApplicationSignResult['message']
    }else{
       localStorage.removeItem('applicationList');
       regetApplication()
    }
}