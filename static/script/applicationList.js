

let searchResult = 0
let page = 0

applicationTypePkg = {}
applicationTypePkg['clientCreate']='clientSingle'
applicationTypePkg['supplierCreate']='supplierSingle'
applicationTypePkg['productCreate']='productSingle'
applicationTypePkg['saleOrder']='saleOrderSingle'
applicationTypePkg['purchaseOrder']='purchaseOrderSingle'
applicationTypePkg['specialPrice']='specialPriceSingle'
applicationTypePkg['deliveryBill']='deliveryBill'
applicationTypePkg['stockReceipt']='stockReceipt'



// 取得字典的長度

window.addEventListener('load', function(){
    showPendingApplication()
});

applicationList = JSON.parse(localStorage.getItem('applicationList'))



function showPendingApplication(){
    if (applicationList != null){

        if (applicationList.length>10) {
            if (searchResult < applicationList.length){
                searchResult += 10
            }

            document.getElementById('nextPage').style.display = 'block'
        }else{
            searchResult = applicationList.length
            document.getElementById('nextPage').style.display = 'none'
        }
        if (page >= 10){
            document.getElementById('lastPage').style.display = 'block'
        }else{
            document.getElementById('lastPage').style.display = 'none'
        }
        if(document.querySelectorAll('tr').length>1){
            trQ = document.querySelectorAll('tr').length
            for(i=1;i<trQ;i++){
                document.getElementById('resultTable').deleteRow(1);
            }
        }

        applicationTypePkgQ = Object.keys(applicationTypePkg).length

        for(i = page ; i < searchResult; i++){
            row = document.createElement('tr')
            row.className = 'row'
            rowNumber = document.createElement('td')
            rowNumber.textContent = Number([i])+1
            let id = applicationList[i]['applicationId']
            for(n = 0; n < applicationTypePkgQ; n++){
                if (applicationList[i]['applicationType']===Object.keys(applicationTypePkg)[n]){
                    // 字典的key

                    let path = Object.keys(applicationTypePkg)[n]
                    // 用key抓出網址
                    row.onclick = function (){window.location.href = '/'+applicationTypePkg[`${path}`]+'?applicationId='+id}
                }
            }
            row.appendChild(rowNumber)
            document.querySelectorAll('tbody')[0].appendChild(row)
            showApplicationId = document.createElement('td')
            showApplicationId.textContent = applicationList[i]['applicationId']
            row.appendChild(showApplicationId)
            showDepartment = document.createElement('td')
            showDepartment.textContent = applicationList[i]['departmentName']
            row.appendChild(showDepartment)
            showApplicationType = document.createElement('td')
            showApplicationType.textContent = applicationList[i]['applicationType']
            row.appendChild(showApplicationType)
            showStatus = document.createElement('td')
            showStatus.textContent = applicationList[i]['status']
            row.appendChild(showStatus)
            showApproveName = document.createElement('td')
            showApproveName.textContent = applicationList[i]['approveName-1st']
            row.appendChild(showApproveName)
            showApproveTime = document.createElement('td')
            showApproveTime.textContent = applicationList[i]['approveTime-1st']
            row.appendChild(showApproveTime)

        }


    }

}





function nextPage(){

    page+=10
    searchResult +=10
    if (searchResult > applicationList.length){
        searchResult+= (applicationList.length-searchResult)
    }
    showPendingApplication()
}

function lastPage(){
    page -=10
    searchResult -=10
    if (searchResult <=10){
        searchResult = 0
    }
    showPendingApplication()

}