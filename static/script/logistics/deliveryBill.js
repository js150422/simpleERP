
let singleData
let updateSaleOrderResult
let deliverySignResult
let inpuQ
let saleOrderDetailQ
let saleOrderItem
let countQ
let inputQcheck
let insertStockRecordeRecord
let deleteStockRecordeRecord
let deliveryDetailSend
let deleteData
let auditAction
deliveryItemData = []




async function insertStockRecord(deliveryDetailSend){
    await insertStockRecordApi(deliveryDetailSend)
    renderInsertStockRecord(auditAction)
}

async function deleteStockRecord(deleteData){
    await  deleteStockRecordApi(deleteData)
    renderDeleteStockRecord()
}


async function deliverySign(deliveryBillSignData){
    await deliverySignApi(deliveryBillSignData)
    renderDeliverySign()
}

async function updateDeliveryDate(){
    await updateDeliveryDateApi()
    renderUpdateDeliveryDate()
}


function getSingleData(applicationId){
    return fetch('/api/deliveryBill?applicationId='+applicationId, {
        method: 'GET', headers: new Headers({ 'Content-Type': 'application/json'})
    }).then((response) => {
        return response.json();
    }).then((result) => {
        singleData = result;
    });
}

function insertStockRecordApi(deliveryDetailSend){
	return fetch('/api/stock', {
		method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(deliveryDetailSend)
	}).then((response) => {
		return response.json();
	}).then((result) => {
		insertStockRecordeRecord = result;
	});
}

function deleteStockRecordApi(deleteData){

	return fetch('/api/stock', {
		method: 'DELETE',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(deleteData)
	}).then((response) => {
		return response.json();
	}).then((result) => {
		deleteStockRecordeRecord = result;
	});
}


function deliverySignApi(deliveryData){

	return fetch('/api/applicaton/deliveryBillSign', {
		method: 'PATCH',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(deliveryData)
	}).then((response) => {
		return response.json();
	}).then((result) => {
		deliverySignResult = result;
	});
}


function updateDeliveryDateApi(){
	return fetch('/api/saleOrder/deliveryDate', {
		method: 'PATCH',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({'applicationId':applicationId,'station':singleData.data[0]['station']})
	}).then((response) => {
		return response.json();
	}).then((result) => {
		updateSaleOrderResult = result;
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
    document.getElementById('clientName').textContent = singleData.data[0].clientName
    document.getElementById('taxId').textContent = singleData.data[0].taxId
    document.getElementById('orderDate').textContent = singleData.data[0].orderDate
    document.getElementById('deliveryDate').textContent = singleData.data[0].deliveryDate
    document.getElementById('repEmployee').textContent = singleData.data[0].repEmployee
    document.getElementById('contactName').textContent = singleData.data[0].contactName
    document.getElementById('contactPhone').textContent = singleData.data[0].contactPhone
    document.getElementById('contactEmail').textContent = singleData.data[0].contactEmail
    document.getElementById('clientAddress').textContent = singleData.data[0].clientAddress
    document.getElementById('applicationInfo').appendChild(applicationStatus)
    document.getElementById('applicationInfo').appendChild(applicationIdElement)
    saleOrderDetailQ = (singleData.data[0].saleOrderDetail.split(',').length)/4
    saleOrderItem = singleData.data[0].saleOrderDetail.split(',')

        deliveryItemOrigin = []
        deliveryItem = []
        for(i=0;i<saleOrderDetailQ;i++){
            deliveryItemOrigin.push(saleOrderItem[(i*4)+1])
        }
        deliveryItem = [...new Set(deliveryItemOrigin)]
        deliveryQ = deliveryItem.length

        // 只顯示名稱及數量所以除2
        for(i=0;i< deliveryQ ;i++){

            saleOrderDetailLine = document.createElement('tr')
            productName = document.createElement('td')
            orderQ = document.createElement('td')
            QdfBox = document.createElement('td')
            Qdf = document.createElement('input')
            fQ = document.createElement('td')
            reasonBox = document.createElement('td')
            reason = document.createElement('input')
            Qdf.addEventListener('change', count)
            Qdf.type = 'text'
            reason.type='text'
            productName.className = 'productName'
            orderQ.className = 'orderQ'
            Qdf.className = 'Qdf'
            fQ.className = 'finalQ'
            reasonBox.className = 'reasonBox'
            reason.className = 'reason'
            document.getElementById('saleOrderTitle').after(saleOrderDetailLine)
            saleOrderDetailLine.appendChild(productName)
            saleOrderDetailLine.appendChild(orderQ)
            saleOrderDetailLine.appendChild(QdfBox)
            saleOrderDetailLine.appendChild(fQ)
            saleOrderDetailLine.appendChild(reasonBox)
            QdfBox.appendChild(Qdf)
            reasonBox.appendChild(reason)
            productName.textContent = deliveryItem[i]
            inputQ = (document.querySelectorAll('input').length);
            for(n=0;n<saleOrderDetailQ;n++){
                if((deliveryItem[i]==saleOrderItem[(n*4)+1]) && (orderQ.textContent=='')){
                    orderQ.textContent = Math.abs(Number(saleOrderItem[(n*4)+2]))
                }else if((deliveryItem[i]==saleOrderItem[(n*4)+1]) && (orderQ.textContent!='')){
                    currentQ = orderQ.textContent
                    orderQ.textContent = (Number(currentQ))+(-Number(saleOrderItem[(n*4)+2]))
                    Qdf.value = Number(saleOrderItem[(n*4)+2])

                    if(saleOrderItem[(n*4)+3]!=0){
                        reason.value = saleOrderItem[(n*4)+3]
                    }

                }
                fQ.textContent = Number(orderQ.textContent)+Number(Qdf.value)
            }
        }
        renderCommentAndSign()
        deliveryPage()


    }


function count(){
    countQ = (document.querySelectorAll('input').length)-1;
    for(i=0;i<countQ;i++){
        if(i%2==0){
            QdfValue = document.querySelectorAll('input')[i].value
            orderQvalue = document.querySelectorAll('.orderQ')[i/2].textContent
            document.querySelectorAll('.finalQ')[i/2].textContent = Number(orderQvalue)+Number(QdfValue)
        }
    }
}

function deliverySend(auditAction){
    inputQcheck = 1
    document.getElementById('signDeliveryResult').textContent = ''
    currentQdf = document.querySelectorAll('.Qdf')
    for(q=0;q<currentQdf.length;q++){
        if(q%2==0){
            if(document.querySelectorAll('input')[q].value==''){
                inputQcheck+=0
            }else{
                inputQcheck+=Number(document.querySelectorAll('input')[q].value)
            }
        }
    }

    if (isNaN(inputQcheck)){
        document.getElementById('signDeliveryResult').textContent = '您輸入的格式有問題'
    }else{

        deliveryDataSend(auditAction)
    }

}


function deliveryDataSend(auditAction){

    deliveryBillSignData = {
        'name':userData['name'],
        'station':singleData.data[0]['station'],
        'grad':userData['grad'],
        'applicationId':singleData.data[0].applicationId,
        'applicationType':singleData.data[0].applicationType,
        'auditAction':auditAction,
        'departmentId':userData['departmentId']
    }
    insertCommentText = auditAction
    deliveryDetailSend = {
        'applicationId':singleData.data[0].applicationId
    }
    if (document.getElementById('preview').textContent == '送出'){
        if (userData['grad']=='staff'){
            itemQ = document.querySelectorAll('.productName').length
            item = document.querySelectorAll('.productName')
            for (m=0;m<itemQ;m++){

                deliveryData = {}
                for(i=0;i<saleOrderDetailQ;i++){
                    if (item[m].textContent==saleOrderItem[(i*4)+1]){
                        deliveryData['productId']=saleOrderItem[(i*4)]
                    }
                }
                deliveryData['applicationId']=singleData.data[0].applicationId
                finalQuantity = document.querySelectorAll('.finalQ')[m].textContent
                deliveryData['Quantity']=-Number(finalQuantity)
                deliveryData['reason']='delivery'
                deliveryItemData.push(deliveryData)
                deliveryData = {}
                reason = document.querySelectorAll('.reason')[m].value
                Qdf = document.querySelectorAll('.Qdf')[m].value
                if (reason!='' || Qdf!='' ){
                    for(i=0;i<saleOrderDetailQ;i++){
                        if (item[m].textContent==saleOrderItem[(i*4)+1]){
                            deliveryData['productId']=saleOrderItem[(i*4)]
                        }
                    }
                    deliveryData['applicationId']=singleData.data[0].applicationId
                    deliveryData['Quantity']=Number(Qdf)
                    reason = document.querySelectorAll('.reason')[m].value
                    deliveryData['reason']=reason
                    deliveryItemData.push(deliveryData)
                    deliveryData = {}
                }
            }
                deliveryDetailSend['QchangeData'] = deliveryItemData
                insertStockRecord(deliveryDetailSend)
                insertAuditComment(applicationId,userData,insertCommentText)

        }else{

            deliverySign(deliveryBillSignData)
            insertAuditComment(applicationId,userData,insertCommentText)
        }


    }else{
        for(let i = 0; i < inputQ ;i++){
            document.querySelectorAll('input')[i].style.borderStyle = 'none';
            document.querySelectorAll('input')[i].style.backgroundColor = 'rgba(0,0,0,0)'
            document.querySelectorAll('input')[i].onclick = function () {inputChange(); }
        }
        document.getElementById('preview').textContent = '送出'
    }

}

function inputChange(){
    for(i = 0; i < inputQ ;i++){
        document.querySelectorAll('input')[i].style.backgroundColor = 'white'
        document.querySelectorAll('input')[i].style.borderStyle = 'solid';
    }
    document.getElementById('preview').textContent = '預覽'
}




function renderInsertStockRecord(){
    if('error' in insertStockRecordeRecord){
        if(insertStockRecordeRecord['message']=='有重複的存貨紀錄'){
            deleteStockRecord({'applicationId':applicationId})
        }else{
            document.getElementById('signDeliveryResult').textContent = insertStockRecordeRecord['message']
        }
    }else{
        deliverySign(deliveryBillSignData)
    }
}

function renderDeleteStockRecord(){
    if('error' in deleteStockRecordeRecord){
        document.getElementById('signDeliveryResult').textContent = deleteStockRecordeRecord['message']
    }else{
        insertStockRecord(deliveryDetailSend)
    }
}

function renderUpdateDeliveryDate(){
    if('error' in updateSaleOrderResult){
        document.getElementById('signDeliveryResult').textContent = updateSaleOrderResult['message']
    }else{
        localStorage.removeItem('applicationList');
        regetApplication()
    }
}

function renderDeliverySign(){
    if('error' in deliverySignResult){
        document.getElementById('signDeliveryResult').textContent = deliverySignResult['message']
    }else{

        if((singleData.data[0]['station']=='final') && (insertCommentText=='approve')){
                updateDeliveryDate()
        }else{

            localStorage.removeItem('applicationList');
            regetApplication()
        }

    }
}


function deliveryPage(){

    if((singleData.data[0].status!='審核完成') && (userData['departmentName']=='logistics' )){
        if((singleData.data[0].station=='start') && (userData['grad']=='staff')){
            document.getElementById('preview').style.display = 'block';
        }
        if((singleData.data[0].station=='middle') && (userData['grad']=='Section Manager')){
            document.getElementById('rejectBtn').style.display = 'block'
            document.getElementById('preview').style.display = 'block';
            document.getElementById('insertCommentBlock').style.display = 'table-row';
            hideInput(inputQ-1)
        }
        if((singleData.data[0].station=='final') && (userData['grad']=='driver')){
            document.getElementById('preview').style.display = 'block';
            hideInput(inputQ)
        }
    }else{
        hideInput(inputQ)
    }
}


function hideInput(Q){
    for(let i = 0; i < Q ;i++){
        document.querySelectorAll('input')[i].style.borderStyle = 'none';
        document.querySelectorAll('input')[i].style.backgroundColor = 'rgba(0,0,0,0)'
        document.querySelectorAll('input')[i].setAttribute('placeholder','')
    }
}