let singleData
let updatePurchaseOrderResult
let receiptCreateResult
let applicationTurnResult
let receiptNumber
let updatePurchaseOrderCompleteResult
let applicationInfo
let updataData


async function audit(auditAction){
    insertCommentText=auditAction
    await auditApplicationApi({'name':userData['name'],
     'grad':userData['grad'],
    'applicationId':applicationId,
    'auditAction':auditAction,
    'applicationType':'purchaseOrder',
    'departmentId':userData['departmentId']})
    insertAuditComment(applicationId,userData,insertCommentText)
    renderSignApplication()
    }


    async function receipt(){
        await getReceiptNumber({'name':userData['name'],'station':singleData.data[0]['station'],'applicationId':applicationId})
        renderReceiptNumber()

    }

    async function applicationTurn(applicationInfo){
        await applicationTurnApi(applicationInfo)
        renderApplicationTurn()

    }

    async function updatePurchaseOrderComplete(updataData){
        await updatePurchaseOrderCompleteApi(updataData)
        renderUpdatePurchaseOrderComplete()

    }





function getSingleData(applicationId){
    return fetch('/api/purchaseOrder/single?applicationId='+applicationId, {
        method: 'GET', headers: new Headers({ 'Content-Type': 'application/json'})
    }).then((response) => {
        return response.json();
    }).then((result) => {
        singleData = result;
    });
}

function getReceiptNumber(text){
    return fetch('/api/application/receipt',{
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(text)
    }).then((response)=>{
        return response.json()
    }).then((result)=>{
        receiptCreateResult = result
    })
}


function applicationTurnApi(text){
    return fetch('/api/applicaton/turn',{
        method: 'PATCH',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(text)
    }).then((response)=>{
        return response.json()
    }).then((result)=>{
        applicationTurnResult = result
    })
}

function updatePurchaseOrderCompleteApi(text){
    return fetch('/api/purchaseOrder/receiptNumber',{
        method: 'PATCH',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(text)
    }).then((response)=>{
        return response.json()
    }).then((result)=>{
        updatePurchaseOrderCompleteResult = result
    })
}




function renderSingle(){

    // ----------------------申請單單號及狀態資訊------------------------------------
    document.getElementById('middleBox').style.display='grid'
    applicationStatus = document.createElement('span')
    applicationIdElement = document.createElement('span')
    applicationStatus.setAttribute('id', 'applicationStatus')
    applicationIdElement.setAttribute('id', 'applicationId')
    applicationStatus.textContent = singleData.data[0].status
    applicationIdElement.textContent = singleData.data[0].orderNumber
    document.getElementById('applicationInfo').appendChild(applicationStatus)
    document.getElementById('applicationInfo').appendChild(applicationIdElement)
    // ----------------------申請單本身資訊------------------------------------
    document.getElementById('supplierName').textContent = singleData.data[0].supplierName
    document.getElementById('taxId').textContent = singleData.data[0].taxId
    document.getElementById('orderDate').textContent = singleData.data[0].orderDate

    document.getElementById('repEmployee').textContent = singleData.data[0].repEmployee
    document.getElementById('contactName').textContent = singleData.data[0].contactName
    document.getElementById('contactPersonTile').textContent = singleData.data[0].contactPersonTile
    document.getElementById('contactPhone').textContent = singleData.data[0].contactPhone
    document.getElementById('contactEmail').textContent = singleData.data[0].contactEmail
    document.getElementById('supplierAddress').textContent = singleData.data[0].supplierAddress
    document.getElementById('total').textContent = singleData.data[0].amout.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
    // ----------------------訂單明細------------------------------------
    purchaseOrderDetailQ=(singleData.data[0].purchaseOrderDetail.split(',').length)/3
    purchaseOrderDetail=singleData.data[0].purchaseOrderDetail.split(',')
    for(i=0;i<purchaseOrderDetailQ;i++){
        purchaseOrderDetailLine = document.createElement('tr')
        document.getElementById('purchaseOrderTitle').after(purchaseOrderDetailLine)

        for(m=0;m<3;m++){

            purchaseOrderDetailColumn = document.createElement('td')
            purchaseOrderDetailLine.appendChild(purchaseOrderDetailColumn)
            purchaseOrderDetailColumn.textContent = purchaseOrderDetail[(i*3)+m]
            if(m==0){
                purchaseOrderDetailColumn.className = 'labels'
            }
        }
        purchaseOrderDetailColumn = document.createElement('td')
        purchaseOrderDetailLine.appendChild(purchaseOrderDetailColumn)
        subTotal = String(Number(purchaseOrderDetail[(i*3)+1])*Number(purchaseOrderDetail[(i*3)+2]))
        purchaseOrderDetailColumn.textContent = subTotal.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
    }

    if (singleData.data[0]['receiptDate']!=null){
        document.getElementById('receiptDate').textContent = singleData.data[0].receiptDate
    }
    if (singleData.data[0]['receiptNumber']!=null){
        document.getElementById('receiptNumber').textContent = singleData.data[0].receiptNumber
    }
    renderCommentAndSign()
    signPage()
    showReceiptBtn()
}


function renderReceiptNumber(){
    if('error' in receiptCreateResult ){
        document.getElementById('rtCreateResult').textContent = receiptCreateResult['message']
    }else{
        receiptNumber = receiptCreateResult.data
        applicationTurn({'name':userData['name'],'applicationId':applicationId})
    }
 }

 function  renderApplicationTurn(){
    if ('error' in applicationTurnResult){
        document.getElementById('rtCreateResult').textContent = applicationTurnResult['message']
    }else{
        updatePurchaseOrderComplete({
        'name':userData['name'],
        'departmentId':userData['departmentId'],
        'grad':userData['grad'],
        'station':singleData.data[0]['station'],
        'applicationId':applicationId,
        'receiptNumber':receiptNumber})
    }
}



function  renderUpdatePurchaseOrderComplete(){
    if ('error' in updatePurchaseOrderCompleteResult){
        document.getElementById('rtCreateResult').textContent = updatePurchaseOrderCompleteResult['message']
    }else{
        document.getElementById('rtCreateResult').textContent = applicationId+'已轉進貨單單號:'+receiptNumber
        document.getElementById('rtCreateResult').style.color = '#C1121F'
        document.getElementById('rtCreateResult').style.margin = '20px 36px 0px 0px'
        localStorage.removeItem('applicationList');
        runingApplicaton()
    }
}




function showReceiptBtn(){

    if ((singleData.data[0]['approveName-1st']==userData['name']) && (singleData.data[0].status=='審核完成') && (singleData.data[0].turn==null)){
        document.getElementById('receiptChange').style.display='flex'
        document.getElementById('insertCommentBlock').style.display = 'none'
        document.getElementById('signBtn').style.display = 'none'

    }

}