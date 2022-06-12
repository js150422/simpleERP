let access_token=document.cookie.split('=')[1]
let userData
let applicatonAlertData    //簽核通知
// --------- for 各申請單單一頁面----------
getUrlString = location.href;
url = new URL(getUrlString);
searchUrl = url.search
pathname = url.pathname


// --------- 簽名欄位用----------


salePage = ['createClient','createSaleOrder','createSpecialPrice']
purchasePage = ['createSupplier','createProduct','createPurchaseOrder']
applicationPage = ['searchProduct','searchClient','searchSaleOrder','searchSpecialPrice','searchPurchaseOrder','searchSupplier','searchDeliveryBill','searchStockReceipt','searchStockBalance','searchStockChange']
reportPage = ['saleOrderReport']



window.addEventListener('load', function(){

	if (document.cookie.length!=0){
		hasCookie()
	}else{
		window.location.href = '/'
	}
});




async function hasCookie() {

	await useToken(access_token)
    renderCookie(userData)
    runingApplicaton()
}



async function runingApplicaton() {
    name = userData['name']
    grad = userData['grad']
    departmentId = userData['departmentId']
    if ((grad!=null) && (userData['departmentId']!=undefined)){
        await getApplicatonApi(name, grad,departmentId)
        renderApplicatonAlert()
    }

}

function useToken(access_token){
	return fetch('/api/user', {
		method: 'GET', headers: new Headers({ 'Content-Type': 'application/json','authorization': `Bearer ${access_token}`})
	}).then((response) => {
		return response.json();
	}).then((result) => {
		userData = result;


	});
}

function getApplicatonApi(name,grad,departmentId){

	return fetch('/api/application/pending?name='+name+'&grad='+grad+'&departmentId='+departmentId, {
		method: 'GET',
        headers: new Headers({ 'Content-Type': 'application/json'})
	}).then((response) => {
		return response.json();
	}).then((result) => {
		applicatonAlertData = result;
	});
}

function logout(){
    fetch('/api/user', {
		method: 'DELETE', headers: new Headers({ 'Content-Type': 'application/json'})
	}).then((response) => {
		return response.json();
	}).then((result) => {
        localStorage.removeItem('userData');
		if (result['ok']==true){
            window.location.href = '/'
        }
	});
}


function renderCookie(userData){
    if ('error' in userData){
        localStorage.removeItem('userData');
        window.location.href = '/';
    }else{
        if (userData['headPhoto']!=null){
            document.getElementById('user').style.backgroundImage='url('+userData['headPhoto']+')'
        }else{
            document.getElementById('user').style.backgroundImage='url(/image/user.png)'
        }

        document.getElementById('welcome').textContent = '歡迎回來~ '+userData['name']
        localStorage.setItem('userData',JSON.stringify(userData));
    }
}


function renderApplicatonAlert(){

    if('data' in applicatonAlertData) {

            if (applicatonAlertData.data.length!=0){

                document.getElementById('applcationNumber').textContent = applicatonAlertData.data.length
                document.getElementById('applcationNumber').style.display = 'block'
            }

            localStorage.setItem('applicationList',JSON.stringify(applicatonAlertData.data));

    }
}

// -------------------------------------------------------------頁面權限設置--------------------------------------
function pageSale(goPage){
    salePageQ = salePage.length
    for(m=0;m<salePageQ;m++){
        if (goPage==salePage[m]){
            if ((userData['departmentName'] == 'admin') || (userData['departmentName'] == 'sale')){
                window.location.href = '/'+goPage;
            }else{
                document.getElementById('authorizeError').textContent = '您沒有這個權限'
            }
        }
    }
}

function application(goPage){
    applicationPageQ = applicationPage.length
    if((userData['grad']!=null) && (userData['departmentId']!=null)){
        for(n=0;n<applicationPageQ;n++){
            if (goPage==applicationPage[n]){
                    window.location.href = '/'+goPage;

            }
        }
    }else{
        document.getElementById('authorizeError').textContent = '您沒有這個權限'
    }

}

function pageReport(goPage){
    reportPageQ = reportPage.length
    if((userData['grad']!=null) && (userData['departmentId']!=null)){
        for(t=0;t<reportPageQ;t++){
            if (goPage==reportPage[t]){
                    window.location.href = '/'+goPage;
            }
        }
    }else{
        document.getElementById('authorizeError').textContent = '您沒有這個權限'
    }
}



function pagePurchase(goPage){
    purchasePageQ = purchasePage.length
    for(j=0;j<purchasePageQ;j++){
        if (goPage==purchasePage[j]){
            if ((userData['departmentName'] == 'admin') || (userData['departmentName'] == 'purchase')){
                window.location.href = '/'+goPage;
            }else{
                document.getElementById('authorizeError').textContent = '您沒有這個權限'
            }
        }
    }
}


function pageAdmin(goPage){
    if (goPage=='newStaff'){
        if ((userData['departmentName'] == 'admin') && (userData['grad'] != 'Boss')){
            window.location.href = '/'+goPage;
        }else{
            document.getElementById('authorizeError').textContent = '您沒有這個權限'
        }
    }
}
// --------------------側邊menu左右開合--------------------------------------

  function moveMenu() {
    subTitle = document.querySelectorAll('.subTitle').length
    smallTitle = document.querySelectorAll('.smallTitle').length

      if (document.getElementById('menu').style.width=='250px') {
        document.getElementById('menu').style.width = '0px';
        for (i=0;i<subTitle;i++){
            document.querySelectorAll('.subTitle')[i].style.right= '250px';
        }
        for (m=0;m<smallTitle;m++){
            document.querySelectorAll('.smallTitle')[m].style.right= '250px';
        }

      }else{
        document.getElementById('menu').style.width = '250px';
        for (i=0;i<subTitle;i++){
            document.querySelectorAll('.subTitle')[i].style.right = '0px';
        }
        for (m=0;m<smallTitle;m++){
            document.querySelectorAll('.smallTitle')[m].style.right = '0px';
        }
      }

  }

// --------------------側邊menu小項目上下開合--------------------------------------

function toggleMenu(number){
    let menu = document.querySelectorAll('.subMenu')[number];
    menu.classList.toggle('show');
}

// --------------------查詢小視窗--------------------------------------
function openSW(){
    document.getElementById('searchBox').style.display = 'block';
}

function closeSW(){
    document.getElementById('searchBox').style.display = 'none';
}




function expression(input,expressionHint){
    let numberRegex=/^[0-9]*[1-9][0-9]*$/;
    if (expressionHint=='number'){
		if(input.match(numberRegex)){
			return input
        }
    }
    let taxIdRegex = /^[0-9]{8}$/;
    if (expressionHint=='taxId'){
		if(input.match(taxIdRegex)){
			return input
        }
    }
    let emailRegex=/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
    if (expressionHint=='email'){
		if(input.match(emailRegex)){
			return input
        }
    }
    let photoRegex=/^[0-9()-]{6,15}$/;
    if (expressionHint=='phone'){
		if(input.match(photoRegex)){
			return input
        }
    }
}
