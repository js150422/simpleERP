let singleData
let updateSaleOrderResult
let deliveryBillCreateResult
let applicationTurnResult
let deliveryNumber
let updateSaleOrderCompleteResult
let applicationInfo
let updataData


async function audit(auditAction){
    insertCommentText=auditAction
    await auditApplicationApi({
        'name':userData['name'],
        'grad':userData['grad'],
        'applicationId':applicationId,
        'auditAction':auditAction,
        'applicationType':'saleOrder',
        'departmentId':userData['departmentId']
        })

    insertAuditComment(applicationId,userData,insertCommentText)
    renderSignApplication()
    }


async function delivery(){
    await getDeliveryNumber({'name':userData['name'],'station':singleData.data[0]['station'],'applicationId':applicationId})
    renderDeliveryNumber()

}

async function applicationTurn(applicationInfo){
    await applicationTurnApi(applicationInfo)
    renderApplicationTurn()

}

async function updateSaleOrderComplete(updataData){
    await updateSaleOrderCompleteApi(updataData)
    renderUpdateSaleOrderComplete()

}


function getSingleData(applicationId){
    return fetch('/api/saleOrder/single?applicationId='+applicationId, {
        method: 'GET', headers: new Headers({ 'Content-Type': 'application/json'})
    }).then((response) => {
        return response.json();
    }).then((result) => {
        singleData = result;
    });
}

function getDeliveryNumber(text){
    return fetch('/api/application/deliveryBill',{
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(text)
    }).then((response)=>{
        return response.json()
    }).then((result)=>{
        deliveryBillCreateResult = result
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

function updateSaleOrderCompleteApi(text){
    return fetch('/api/saleOrder/deliveryNumber',{
        method: 'PATCH',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(text)
    }).then((response)=>{
        return response.json()
    }).then((result)=>{
        updateSaleOrderCompleteResult = result
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
    document.getElementById('clientName').textContent = singleData.data[0].clientName
    document.getElementById('taxId').textContent = singleData.data[0].taxId
    document.getElementById('orderDate').textContent = singleData.data[0].orderDate
    document.getElementById('repEmployee').textContent = singleData.data[0].repEmployee
    document.getElementById('contactName').textContent = singleData.data[0].contactName
    document.getElementById('contactPersonTile').textContent = singleData.data[0].contactPersonTile
    document.getElementById('contactPhone').textContent = singleData.data[0].contactPhone
    document.getElementById('contactEmail').textContent = singleData.data[0].contactEmail
    document.getElementById('clientAddress').textContent = singleData.data[0].clientAddress
    document.getElementById('total').textContent = singleData.data[0].amout.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
    // ----------------------訂單明細------------------------------------
    saleOrderDetailQ=(singleData.data[0].saleOrderDetail.split(',').length)/3
    saleOrderDetail=singleData.data[0].saleOrderDetail.split(',')
    for(i=0;i<saleOrderDetailQ;i++){
        saleOrderDetailLine = document.createElement('tr')
        document.getElementById('saleOrderTitle').after(saleOrderDetailLine)

        for(m=0;m<3;m++){

            saleOrderDetailColumn = document.createElement('td')
            saleOrderDetailLine.appendChild(saleOrderDetailColumn)
            saleOrderDetailColumn.textContent = saleOrderDetail[(i*3)+m]
            if(m==0){
                saleOrderDetailColumn.className = 'labels'
            }
        }
        saleOrderDetailColumn = document.createElement('td')
        saleOrderDetailLine.appendChild(saleOrderDetailColumn)
        subTotal = String(Number(saleOrderDetail[(i*3)+1])*Number(saleOrderDetail[(i*3)+2]))
        saleOrderDetailColumn.textContent = subTotal.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
    }
    if (singleData.data[0]['deliveryDate']!=null){
        document.getElementById('deliveryDate').textContent = singleData.data[0].deliveryDate
    }
    if (singleData.data[0]['deliveryNumber']!=null){
        document.getElementById('deliveryNumber').textContent = singleData.data[0].deliveryNumber
    }

    renderCommentAndSign()
    signPage()
    showDeliveryBtn()

}


 function renderDeliveryNumber(){
    if('error' in deliveryBillCreateResult ){
        document.getElementById('dbCreateResult').textContent = deliveryBillCreateResult['message']
    }else{
        deliveryNumber = deliveryBillCreateResult.data
        applicationTurn({'name':userData['name'],'applicationId':applicationId})
    }

 }

function  renderApplicationTurn(){
    if ('error' in applicationTurnResult){
        document.getElementById('dbCreateResult').textContent = applicationTurnResult['message']
    }else{
        updateSaleOrderComplete({'name':userData['name'],
        'departmentId':userData['departmentId'],
        'grad':userData['grad'],
        'station':singleData.data[0]['station'],
        'applicationId':applicationId,
        'deliveryNumber':deliveryNumber})
    }
}



function  renderUpdateSaleOrderComplete(){
    if ('error' in updateSaleOrderCompleteResult){
        document.getElementById('dbCreateResult').textContent = updateSaleOrderCompleteResult['message']
    }else{
        document.getElementById('dbCreateResult').textContent = applicationId+'已轉出貨單單號:'+deliveryNumber
        document.getElementById('dbCreateResult').style.color = '#C1121F'
        document.getElementById('dbCreateResult').style.margin = '20px 36px 0px 0px'
        localStorage.removeItem('applicationList');
        runingApplicaton()
    }
}


function showDeliveryBtn(){

    if ((singleData.data[0]['approveName-1st']==userData['name']) && (singleData.data[0].status=='審核完成') && (singleData.data[0].turn==null)){
        document.getElementById('deliveryChange').style.display='flex'
        document.getElementById('insertCommentBlock').style.display = 'none'
        document.getElementById('signBtn').style.display = 'none'

    }

}