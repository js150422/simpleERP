
let singleData
let updatePurchaseOrderResult
let receiptSignResult
let inputQ
let purchaseDetailQ
let purchaseItem
let countQ
let inputQcheck
let insertStockRecordeRecord
let deleteStockRecordeRecord
let receiptDetailSend
let deleteData
let auditAction
receiptDataArr = []


async function insertStockRecord(receiptDetailSend){
    await insertStockRecordApi(receiptDetailSend)
    renderInsertStockRecord(auditAction)
}


async function deleteStockRecord(deleteData){
    await  deleteStockRecordApi(deleteData)
    renderDeleteStockRecord()
}

async function receiptSign(stockReceiptSignData){
    await receiptSignApi(stockReceiptSignData)
    renderReceiptSign()
}

async function updateReceiptDate(){
    await updateReceiptDateApi()
    renderUpdateReceiptDate()
}


function getSingleData(applicationId){

    return fetch('/api/receipt?applicationId='+applicationId, {
        method: 'GET', headers: new Headers({ 'Content-Type': 'application/json'})
    }).then((response) => {
        return response.json();
    }).then((result) => {
        singleData = result;
    });
}


function insertStockRecordApi(receiptDetailSend){
	return fetch('/api/stock', {
		method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(receiptDetailSend)
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

function receiptSignApi(receiptData){

	return fetch('/api/applicaton/stockReceipt', {
		method: 'PATCH',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(receiptData)
	}).then((response) => {
		return response.json();
	}).then((result) => {
		receiptSignResult = result;
	});
}

function updateReceiptDateApi(){

	return fetch('/api/purchaseOrder/receiptDate', {
		method: 'PATCH',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({'applicationId':applicationId,'station':singleData.data[0]['station']})
	}).then((response) => {
		return response.json();
	}).then((result) => {
		updatePurchaseOrderResult = result;
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
    document.getElementById('supplierName').textContent = singleData.data[0].supplierName
    document.getElementById('taxId').textContent = singleData.data[0].taxId
    document.getElementById('orderDate').textContent = singleData.data[0].orderDate
    document.getElementById('receiptDate').textContent = singleData.data[0].receiptDate
    document.getElementById('repEmployee').textContent = singleData.data[0].repEmployee
    document.getElementById('contactName').textContent = singleData.data[0].contactName
    document.getElementById('contactPhone').textContent = singleData.data[0].contactPhone
    document.getElementById('contactEmail').textContent = singleData.data[0].contactEmail
    document.getElementById('supplierAddress').textContent = singleData.data[0].supplierAddress
    document.getElementById('applicationInfo').appendChild(applicationStatus)
    document.getElementById('applicationInfo').appendChild(applicationIdElement)
    purchaseOrderDetailQ = (singleData.data[0].purchaseOrderDetail.split(',').length)/4
    purchaseOrderItem = singleData.data[0].purchaseOrderDetail.split(',')

        receiptItemOrigin = []
        receiptItem = []
        for(i=0;i<purchaseOrderDetailQ;i++){
            receiptItemOrigin.push(purchaseOrderItem[(i*4)+1])
        }
        receiptItem = [...new Set(receiptItemOrigin)]
        receiptQ = receiptItem.length

        // 只顯示名稱及數量所以除2
        for(i=0;i< receiptQ ;i++){

            purchaseOrderDetailLine = document.createElement('tr')
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
            document.getElementById('purchaseOrderTitle').after(purchaseOrderDetailLine)
            purchaseOrderDetailLine.appendChild(productName)
            purchaseOrderDetailLine.appendChild(orderQ)
            purchaseOrderDetailLine.appendChild(QdfBox)
            purchaseOrderDetailLine.appendChild(fQ)
            purchaseOrderDetailLine.appendChild(reasonBox)
            QdfBox.appendChild(Qdf)
            reasonBox.appendChild(reason)
            productName.textContent = receiptItem[i]
            inputQ = document.querySelectorAll('input').length;
            for(n=0;n<purchaseOrderDetailQ;n++){
                if((receiptItem[i]==purchaseOrderItem[(n*4)+1]) && (orderQ.textContent=='')){
                    orderQ.textContent = Number(purchaseOrderItem[(n*4)+2])
                }else if((receiptItem[i]==purchaseOrderItem[(n*4)+1]) && (orderQ.textContent!='')){

                    Qdf.value = Number(purchaseOrderItem[(n*4)+2])
                    fQ.textContent = orderQ.textContent+Qdf.value

                    if(purchaseOrderItem[(n*4)+3]!=0){
                        reason.value = purchaseOrderItem[(n*4)+3]
                    }

                }
                fQ.textContent = Number(orderQ.textContent)+Number(Qdf.value)
            }
        }

        renderCommentAndSign()
        receiptPage()
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

function receiptSend(auditAction){
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
        document.getElementById('signReceiptResult').textContent = '您輸入的格式有問題'
    }else{

        receiptDataSend(auditAction)
    }

}



function receiptSend(auditAction){

    stockReceiptSignData = {
        'name':userData['name'],
        'station':singleData.data[0]['station'],
        'grad':userData['grad'],
        'applicationId':singleData.data[0].applicationId,
        'applicationType':singleData.data[0].applicationType,
        'auditAction':auditAction,
        'departmentId':userData['departmentId']
    }
    insertCommentText = auditAction
    receiptDetailSend = {
        'applicationId':singleData.data[0].applicationId
    }
    if (document.getElementById('preview').textContent == '送出'){
        if (userData['grad']=='staff'){
            itemQ = document.querySelectorAll('.productName').length
            item = document.querySelectorAll('.productName')
            for (m=0;m<itemQ;m++){
                stockReceiptData = {}

                for(i=0;i< purchaseOrderDetailQ;i++){
                if (item[m].textContent==purchaseOrderItem[(i*4)+1]){
                    stockReceiptData['productId']=purchaseOrderItem[(i*4)]
                }
                }
                orderQ = document.querySelectorAll('.orderQ')[m].textContent
                stockReceiptData['applicationId']=singleData.data[0].applicationId
                stockReceiptData['Quantity'] = Number(orderQ)
                stockReceiptData['reason']='receipt'
                receiptDataArr.push(stockReceiptData)
                stockReceiptData = {}
                reason = document.querySelectorAll('.reason')[m].value
                Qdf = document.querySelectorAll('.Qdf')[m].value
                if (reason!='' || Qdf!=''){
                    for(i=0;i<purchaseOrderDetailQ;i++){
                        if (item[m].textContent==purchaseOrderItem[(i*4)+1]){
                            stockReceiptData['productId']=purchaseOrderItem[(i*4)]
                        }
                    }
                    stockReceiptData['applicationId']=singleData.data[0].applicationId
                    stockReceiptData['Quantity']=Number(Qdf)
                    reason = document.querySelectorAll('.reason')[m].value
                    stockReceiptData['reason']=reason
                    receiptDataArr.push(stockReceiptData)
                    stockReceiptData = {}
                }
            }
            receiptDetailSend['QchangeData'] = receiptDataArr
            insertStockRecord(receiptDetailSend)
            insertAuditComment(applicationId,userData,commentText)
    }else{

        receiptSign(stockReceiptSignData)
        insertAuditComment(applicationId,userData,commentText)
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
            document.getElementById('signReceiptResult').textContent = insertStockRecordeRecord['message']
        }
    }else{
        receiptSign(stockReceiptSignData)
    }
}


function renderDeleteStockRecord(){
    if('error' in deleteStockRecordeRecord){
        document.getElementById('signReceiptResult').textContent = deleteStockRecordeRecord['message']
    }else{
        insertStockRecord(receiptDetailSend)
    }
}

function renderUpdateReceiptDate(){
    if('error' in updatePurchaseOrderResult){
        document.getElementById('signReceiptResult').textContent = updatePurchaseOrderResult['message']
    }else{
        localStorage.removeItem('applicationList');
        regetApplication()
    }
}

function renderReceiptSign(){
    if('error' in receiptSignResult){
        document.getElementById('signDeliveryResult').textContent = receiptSignResult['message']
    }else{

        if((singleData.data[0]['station']=='middle') && (insertCommentText=='approve')){
                updateReceiptDate()
        }else{

            localStorage.removeItem('applicationList');
            regetApplication()
        }

    }
}


function receiptPage(){

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