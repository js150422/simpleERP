
let productName
let productDescription
let supplierName
let priceStart
let priceEnd
let searchProductResult
page = 0



function getCondition(){
    productName = document.getElementById('productName').value
    productDescription = document.getElementById('productDescription').value
    supplierName = document.getElementById('supplierName').value
    priceStart = document.getElementById('priceStart').value
    priceEnd = document.getElementById('priceEnd').value
    search(productName,productDescription,supplierName,priceStart,priceEnd)



}

async function search(productName,productDescription,supplierName,priceStart,priceEnd){
    await searchProduct(productName,productDescription,supplierName,priceStart,priceEnd)
    renderSearchProduct()
}

function searchProduct(productName='', productDescription='',supplierName='',priceStart='',priceEnd='',applicationId='' ){
    return fetch(
        '/api/product?productName='+productName+
        '&productDescription='+productDescription+
        '&supplierName='+supplierName+
        '&priceStart='+priceStart+
        '&priceEnd='+priceEnd+
        '&applicationId='+applicationId+
        '&page='+page, {
        method: 'GET', headers: new Headers({ 'Content-Type': 'application/json'})
    }).then((response) => {
        return response.json();
    }).then((result) => {
        searchProductResult = result;
    });
}


function renderSearchProduct(){
    errorAlert = document.createElement('div')
    errorAlert.setAttribute('id','errorAlert')

    if('error' in searchProductResult){
        errorAlert.textContent = searchProductResult['message']
        document.getElementById('btn').appendChild(errorAlert)
        document.getElementById('resultTable').style.display = 'none';
    }else{

        if(document.querySelectorAll('tr').length>1){
            trQ = document.querySelectorAll('tr').length
            for(i=1;i<trQ;i++){
                document.getElementById('resultTable').deleteRow(1);
            }
        }

        for(let s=0;s<document.getElementsByClassName('showCondtion').length;s++){
            document.getElementsByClassName('showCondtion')[s].style.display='none'
        }
        showCondition()
        document.getElementById('resultTable').style.display = 'grid'
        document.getElementById('searchBox').style.display = 'none';
        if (searchProductResult.data.length>10){
            searchResult = 10
            document.getElementById('nextPage').style.display = 'block'
        }else{
            searchResult = searchProductResult.data.length
            document.getElementById('nextPage').style.display = 'none'
        }
        if (page >= 10){
            document.getElementById('lastPage').style.display = 'block'
        }else{
            document.getElementById('lastPage').style.display = 'none'
        }


        for(m = 0; m < searchResult; m++){
            tableLine = searchProductResult.data[m] // 列字典
            row = document.createElement('tr')
            row.className = 'row'
            let id = searchProductResult.data[m]['applicationId'] // 沒有寫let 參照的永遠是最後那次m的id
            row.onclick = function (){window.location.href = '/productSingle?applicationId='+id}
            number = document.createElement('td')
            number.textContent = m+1
            number.style.width = '5%'
            row.appendChild(number)
            showApplicationId = document.createElement('td')
            showApplicationId.textContent = searchProductResult.data[m]['applicationId']
            showApplicationId.style.width = '10%'
            row.appendChild(showApplicationId)
            showProductName = document.createElement('td')
            showProductName.textContent = searchProductResult.data[m]['productName']
            showProductName.style.width = '20%'
            row.appendChild(showProductName)
            showSupplierName = document.createElement('td')
            showSupplierName.textContent = searchProductResult.data[m]['supplierName']
            showSupplierName.style.width = '20%'
            row.appendChild(showSupplierName)
            showCostPrice = document.createElement('td')
            showCostPrice.textContent = searchProductResult.data[m]['costPrice']
            showCostPrice.style.width = '10%'
            row.appendChild(showCostPrice)
            showSalePrice = document.createElement('td')
            showSalePrice.textContent = searchProductResult.data[m]['salePrice']
            showSalePrice.style.width = '10%'
            row.appendChild(showSalePrice)
            showProductUnit = document.createElement('td')
            showProductUnit.textContent = searchProductResult.data[m]['productUnit']
            showProductUnit.style.width = '5%'
            row.appendChild(showProductUnit)
            showProductDescription = document.createElement('td')
            showProductDescription.textContent = searchProductResult.data[m]['productDescription']
            showProductDescription.style.width = '20%'
            row.appendChild(showProductDescription)
            document.querySelectorAll('tbody')[0].appendChild(row)
        }
    }
    // 清除input跟select
    inputQ = document.querySelectorAll('input').length
    for(i = 0; i < inputQ ;i++){document.querySelectorAll('input')[i].value=''}
}



function showCondition(){
    if (productName!=''){
        document.querySelectorAll('.showCondtion')[0].textContent = '產品名稱: '+productName
        document.querySelectorAll('.showCondtion')[0].style.display = 'flex'
    }
    if ( productDescription!=''){
        document.querySelectorAll('.showCondtion')[1].textContent = '產品敘述: '+productDescription
        document.querySelectorAll('.showCondtion')[1].style.display = 'flex'
    }
    if (supplierName!=''){
        document.querySelectorAll('.showCondtion')[2].textContent = '供應商: '+ supplierName
        document.querySelectorAll('.showCondtion')[2].style.display = 'flex'
    }
    if (priceStart!=''){
        document.querySelectorAll('.showCondtion')[3].textContent = '價格 : 起始 '+priceStart+'~'
        document.querySelectorAll('.showCondtion')[3].style.display = 'flex'
    }
    if (priceEnd!=''){
        document.querySelectorAll('.showCondtion')[4].textContent = '價格 : 結束 ~'+priceEnd
        document.querySelectorAll('.showCondtion')[4].style.display = 'flex'

    }
    if((productName=='') && (productDescription=='' ) && (supplierName=='') && (priceStart=='') && (priceEnd=='')){

        document.querySelectorAll('.showCondtion')[5].textContent = '全部'
        document.querySelectorAll('.showCondtion')[5].style.display = 'flex'
    }
}

function nextPage(){
    page +=10
    search(productName,productDescription,supplierName,priceStart,priceEnd)
}

function lastPage(){
    page-=10
    search(productName,productDescription,supplierName,priceStart,priceEnd)
}