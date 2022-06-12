

let singleData


async function audit(auditAction){
    insertCommentText=auditAction
    await auditApplicationApi({'name':userData['name'],
        'grad':userData['grad'],
        'applicationId':applicationId,
        'auditAction':auditAction,
        'applicationType':'productCreate',
        'departmentId':userData['departmentId']
    })
    insertAuditComment(applicationId,userData,insertCommentText)
    renderSignApplication()
}


function getSingleData(applicationId){
    return fetch('/api/product/single?applicationId='+applicationId, {
        method: 'GET', headers: new Headers({ 'Content-Type': 'application/json'})
    }).then((response) => {
        return response.json();
    }).then((result) => {
        singleData = result;
    });
}


function renderSingle(){

    document.getElementById('middleBox').style.display='grid'
    applicationStatus = document.createElement('span')
    applicationIdElement = document.createElement('span')
    applicationStatus.setAttribute('id', 'applicationStatus')
    applicationIdElement.setAttribute('id', 'applicationId')
    applicationStatus.textContent = singleData.data[0].status
    applicationIdElement.textContent = singleData.data[0].applicationId
    document.getElementById('applicationInfo').appendChild(applicationStatus)
    document.getElementById('applicationInfo').appendChild(applicationIdElement)
    if (singleData.data[0]['productPig']!=null){
        productPig = singleData.data[0]['productPig'].split('/simpleERP/')[1]
    }

    document.getElementById('productName').value = singleData.data[0]['productName']
    document.getElementById('supplierName').value = singleData.data[0]['supplierName']
    document.getElementById('costPrice').value = singleData.data[0]['costPrice']+' 元/'+singleData.data[0]['productUnit']
    document.getElementById('salePrice').value = singleData.data[0]['salePrice']+' 元/'+singleData.data[0]['productUnit']
    document.getElementById('productDescription').value = singleData.data[0]['productDescription']
    if(singleData.data[0]['productPig']!=null){
        document.getElementById('productPigBlock').style.backgroundImage = 'url(https://d3qig2ybk47ceb.cloudfront.net/simpleERP/'+productPig +')'

    }

    renderCommentAndSign()
    signPage()
}



