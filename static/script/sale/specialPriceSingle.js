
let updateSaleOrderResult
let singleData


async function audit(auditAction){
    insertCommentText=auditAction
    await auditApplicationApi({
        'name':userData['name'],
        'grad':userData['grad'],
        'applicationId':applicationId,
        'auditAction':auditAction,
        'applicationType':'specialPrice',
        'departmentId':userData['departmentId']})
    insertAuditComment(applicationId,userData,insertCommentText)
    renderSignApplication()
    }




function getSingleData(applicationId){
    return fetch('/api/specialPrice?applicationId='+applicationId, {
        method: 'GET', headers: new Headers({ 'Content-Type': 'application/json'})
    }).then((response) => {
        return response.json();
    }).then((result) => {
        singleData = result;
    });
}


function renderSingle(){


    // ----------------------申請單單號及狀態資訊------------------------------------
    document.getElementById('middleBox').style.display='grid'
    applicationStatus = document.createElement('span')
    applicationIdElement = document.createElement('span')
    applicationStatus.setAttribute('id', 'applicationStatus')
    applicationIdElement.setAttribute('id', 'applicationId')
    applicationStatus.textContent = singleData.data[0].status
    applicationIdElement.textContent = singleData.data[0].applicationId
    document.getElementById('applicationInfo').appendChild(applicationStatus)
    document.getElementById('applicationInfo').appendChild(applicationIdElement)
    // ----------------------申請單本身資訊------------------------------------
    document.getElementById('clientName').textContent = singleData.data[0].clientName
    document.getElementById('productName').textContent = singleData.data[0].productName
    document.getElementById('salePrice').textContent = singleData.data[0].salePrice
    document.getElementById('specialPrice').textContent = singleData.data[0].specialPrice
    document.getElementById('specialDescription').textContent = singleData.data[0].specialDescription


    renderCommentAndSign()
    signPage()

}

