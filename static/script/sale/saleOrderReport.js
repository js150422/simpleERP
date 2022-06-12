let productData
let clientData
let DepartmentData
let searchSaleOrderResult
let Ygap
let orderDateStart
let orderDateMemo
let orderDateEnd
let sum = 0
let chartName





// charNameItem = document.getElementById('charName')
// charNameItem.addEventListener('change', function(){
// 	if(document.getElementById('chart')){
// 		document.getElementById('chart').remove()
// 	}
// });


async function search(orderDateStart,orderDateEnd){
    await searchSaleOrderApi(orderDateStart,orderDateEnd)
    dataAnalyze()
}





function searchReport(){

    start = document.getElementById('start').value
    end = document.getElementById('end').value
    if (start!=''){
        orderDateStart = Date.parse(start)
    }else{
        orderDateStart=''
    }
    if (end!=''){
        orderDateEnd = Date.parse(end)
    }else{
        orderDateEnd=''
    }
	let timeGap = Date.parse(end) - Date.parse(start);
	if(timeGap < 0){timeGap = timeGap * -1;}
	timeGap = timeGap / (1000*60*60*24);
	if (timeGap<5){
		document.getElementById('errorAlert').textContent = '查詢起始日至結束日不得小於5天'
	}else{
		Ygap = Math.ceil(timeGap/5)
		search(orderDateStart,orderDateEnd)
	}

}


function searchSaleOrderApi(orderDateStart='',orderDateEnd=''){
    return fetch('/api/saleOrder/saleReport?applicationStatus=complete&orderDateStart='+orderDateStart+'&orderDateEnd='+orderDateEnd, {
        method: 'GET', headers: new Headers({ 'Content-Type': 'application/json'})
    }).then((response) => {
        return response.json();
    }).then((result) => {
        searchSaleOrderResult = result;
    });
}

function dataAnalyze(){
	charName = document.getElementById('charName').value
	if (Number(charName)<4){
		doughunt(charName)
	}else{
        lineChart(charName)
    }
  //變數重置lineChart



}


