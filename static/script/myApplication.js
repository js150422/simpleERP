let applicationName
let dateStart
let dateEnd
let myApplicationData
let applicationStatus = '申請中'
let page = 0

localStorageUserData = JSON.parse(localStorage.getItem('userData'))
applicationName = localStorageUserData['name']



window.addEventListener('load', function(){
    getMyApplicaton(applicationName,applicationStatus,dateStart='',dateEnd='')
});


applicationTypePkg = {
    'clientCreate':'clientSingle',
    'supplierCreate':'supplierSingle',
    'productCreate':'productSingle',
    'saleOrder':'saleOrderSingle',
    'purchaseOrder':'purchaseOrderSingle',
    'specialPrice':'specialPriceSingle',
    'deliveryBill':'deliveryBill',
    'stockReceipt':'stockReceipt'
}

applicationTypePkgQ = Object.keys(applicationTypePkg).length




async function getMyApplicaton(applicationName,applicationStatus,dateStart,dateEnd) {
    await getMyapplicationApi(applicationName,applicationStatus,dateStart,dateEnd)
    renderMyapplication()
}


function getMyapplicationApi(applicationName='',applicationStatus='',dateStart='',dateEnd=''){

	return fetch('/api/myapplication?name='+applicationName+
    '&status='+applicationStatus+
    '&dateStart='+dateStart+
    '&dateEnd='+dateEnd+
    '&page='+page, {
		method: 'GET', headers: new Headers({ 'Content-Type': 'application/json'})
	}).then((response) => {

		return response.json();
	}).then((result) => {
		myApplicationData = result;
	});
}

function renderMyapplication(){
    if ('error' in myApplicationData){

        document.getElementById('errorAlert').textContent = myApplicationData['message']
    }else{

        if(document.querySelectorAll('tr').length>1){
            trQ = document.querySelectorAll('tr').length
            for(i=1;i<trQ;i++){
                document.getElementById('resultTable').deleteRow(1);
            }
        }

        if (myApplicationData.data.length > 10){
            searchResult = 10
            document.getElementById('nextPage').style.display = 'block'
        }else{
            searchResult = myApplicationData.data.length
            document.getElementById('nextPage').style.display = 'none'
        }
        if (page >= 10){
            document.getElementById('lastPage').style.display = 'block'
        }else{
            document.getElementById('lastPage').style.display = 'none'
        }



        for(let i = 0 ; i < searchResult ; i++){
            row = document.createElement('tr')
            row.className = 'row'
            rowNumber = document.createElement('td')
            rowNumber.textContent = Number([i])+1
            let id =  myApplicationData.data[i]['applicationId']


            for(n = 0; n < applicationTypePkgQ; n++){
                if (myApplicationData.data[i]['applicationType']===Object.keys(applicationTypePkg)[n]){
                    // 字典的key

                    let path = Object.keys(applicationTypePkg)[n]
                    // 用key抓出網址
                    row.onclick = function (){window.location.href = '/'+applicationTypePkg[`${path}`]+'?applicationId='+id}
                }
            }


            row.appendChild(rowNumber)
            document.querySelectorAll('tbody')[0].appendChild(row)
            showApplicationId = document.createElement('td')
            showApplicationId.textContent = myApplicationData.data[i]['applicationId']
            row.appendChild(showApplicationId)
            showDepartment = document.createElement('td')
            showDepartment.textContent = myApplicationData.data[i]['departmentName']
            row.appendChild(showDepartment)
            showApplicationType = document.createElement('td')
            showApplicationType.textContent = myApplicationData.data[i]['applicationType']
            row.appendChild(showApplicationType)
            showStatus = document.createElement('td')
            showStatus.textContent = myApplicationData.data[i]['status']
            row.appendChild(showStatus)
            showApproveName = document.createElement('td')
            showApproveName.textContent = myApplicationData.data[i]['approveName-1st']
            row.appendChild(showApproveName)
            showApproveTime = document.createElement('td')
            showApproveTime.textContent = myApplicationData.data[i]['approveTime-1st']
            row.appendChild(showApproveTime)

        }
    }
}


function myApplicationSearch(){
    if(document.querySelectorAll('tr').length>1){
        trQ = document.querySelectorAll('tr').length
        for(i=1;i<trQ;i++){
            document.getElementById('resultTable').deleteRow(1);
        }
    }
    document.getElementById('errorAlert').textContent=''
    applicationStatus = document.getElementById('status').value
    start = document.getElementById('dateStart').value
    end = document.getElementById('dateEnd').value
    if( (applicationStatus!='') || (start!='') || (end!='')){

        if (start!=''){
            dateStart = Date.parse(start)
        }
        if (end!=''){
            dateEnd = Date.parse(end)
        }


        getMyApplicaton(applicationName,applicationStatus,dateStart,dateEnd)
    }else{
        document.getElementById('errorAlert').textContent ='請填入要查詢的資訊'

    }

}

function nextPage(){
    page +=10
    getMyApplicaton(applicationName,applicationStatus,dateStart,dateEnd)
}

function lastPage(){
    page-=10
    getMyApplicaton(applicationName,applicationStatus,dateStart,dateEnd)
}