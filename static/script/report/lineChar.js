function lineChart(charName){

	X = []
	dataListOrigin = []
	dataList = []
	amountList = []
	orderDateMemo = orderDateStart
	for(m=0;m<5;m++){
		orderDateMemo+=Ygap*(1000*60*60*24)  // 把訂單時間加上時間間隔成為X軸
		Xvalue = new Date(orderDateMemo)
		X.push( Xvalue.getFullYear()+'/'+(Xvalue.getMonth()+1)+'/'+Xvalue.getDate())// X軸設定成5格，人可以看的
	}
	searchSaleOrderResultQ = searchSaleOrderResult.data.length
	if(charName==4){
		chartSubject ='產品趨勢圖'
		for(j=0;j<searchSaleOrderResultQ;j++){
				saleOrderDetail = searchSaleOrderResult.data[j].saleOrderDetail.split(',')
				saleOrderItemQ = saleOrderDetail.length
				for(i=0;i<saleOrderItemQ;i++){
					if(i%3==0){
						dataListOrigin.push(saleOrderDetail[i])
				}
			}
		}
		// ------------------------------------整理要分析target種類(重複的資料去掉)--------------------------------------------
		dataList = [...new Set(dataListOrigin)]
		// --------------------------------------整理目標金額----------------------------------------------------------------
		for(n=0;n<dataList.length;n++){
			orderDateMemo = orderDateStart

			for(m=0;m<5;m++){
				amount = 0
				// quantity = 0
				for(j=0;j<searchSaleOrderResultQ;j++){
					if((Date.parse(searchSaleOrderResult.data[j].orderDate) > orderDateMemo) && (Date.parse(searchSaleOrderResult.data[j].orderDate) < (orderDateMemo+Ygap*(1000*60*60*24)))){
						saleOrderDetail = searchSaleOrderResult.data[j].saleOrderDetail.split(',')
						saleOrderItemQ = saleOrderDetail.length
						for(i=0;i<saleOrderItemQ;i++){
							if(i%3==0){
								if(dataList[n]==saleOrderDetail[i]){
									price = saleOrderDetail[i+1]
									quantity = saleOrderDetail[i+2]
									amount = amount + (Number(price)*Number(quantity))
								}
							}
						}
					}

				}
				// quantityList.push(quantity)
				amountList.push(amount)
				orderDateMemo+=Ygap*(1000*60*60*24)
			}
		}
	}
	if(charName==5){
		chartSubject ='客戶趨勢圖'
		for(j=0;j<searchSaleOrderResultQ;j++){
			dataListOrigin.push(searchSaleOrderResult.data[j].clientName)
		}
		// -----------------------------整理要分析target種類(重複的資料去掉)--------------------------------------------
		dataList = [...new Set(dataListOrigin)]
		// -----------------------------整理目標金額--------------------------------------------
		for(n=0;n<dataList.length;n++){
			orderDateMemo = orderDateStart

			for(m=0;m<5;m++){
				amount = 0
				for(j=0;j<searchSaleOrderResultQ;j++){
					if((Date.parse(searchSaleOrderResult.data[j].orderDate) > orderDateMemo) && (Date.parse(searchSaleOrderResult.data[j].orderDate) < (orderDateMemo+Ygap*(1000*60*60*24)))){
						if(dataList[n]==searchSaleOrderResult.data[j].clientName){
							amount = amount + Number(searchSaleOrderResult.data[j]['amout'])

						}
					}

				}

				amountList.push(amount)
				orderDateMemo+=Ygap*(1000*60*60*24)
			}

		}

	}
	if(charName==6){
		chartSubject ='業務趨勢圖'
		for(j=0;j<searchSaleOrderResultQ;j++){
			dataListOrigin.push(searchSaleOrderResult.data[j].repEmployee)
		}
		// -----------------------------整理要分析target種類(重複的資料去掉)--------------------------------------------
		dataList = [...new Set(dataListOrigin)]
		// -----------------------------整理目標金額--------------------------------------------
		for(n=0;n<dataList.length;n++){
			orderDateMemo = orderDateStart

			for(m=0;m<5;m++){
				amount = 0
				for(j=0;j<searchSaleOrderResultQ;j++){
					if((Date.parse(searchSaleOrderResult.data[j].orderDate) > orderDateMemo) && (Date.parse(searchSaleOrderResult.data[j].orderDate) < (orderDateMemo+Ygap*(1000*60*60*24)))){
						if(dataList[n]==searchSaleOrderResult.data[j].repEmployee){
							amount = amount + Number(searchSaleOrderResult.data[j]['amout'])

						}
					}

				}
				amountList.push(amount)
				orderDateMemo+=Ygap*(1000*60*60*24)
			}
		}
	}

	data_datasets = [],
	bg = ['rgba(229, 152, 155, 0.5)','rgba(72, 202, 228, 0.5)','rgba(126, 188, 137, 0.5)','rgba(178, 150, 125, 0.5)','rgba(136, 140, 137, 0.5)','rgba(241, 135, 1, 0.5)','rgba(96, 150, 186, 0.5)','rgba(102, 102, 102, 0.5)'],
	bc = ['rgb(229, 152, 155)','rgb(72, 202, 228)','rgb(126, 188, 137)','rgb(178, 150, 125)','rgb(136, 140, 137)','rgb(241, 135, 1)','rgb(96, 150, 186)','rgb(102, 102, 102)']

    for (w=1; w < dataList.length+1; w++) {
        data_datasets.push({
            label: dataList[w-1],
            data: amountList.slice((w-1)*5, 5*(w)),
            // backgroundColor: bg[w - 1],
			fill: false,
            borderColor: bc[w - 1],
			pointStyle: 'circle',
			pointRadius: 5,
			pointHoverRadius: 8,
			lineTension: 0

        })
    }
	if(document.getElementById('myChart')){document.getElementById('myChart').remove()}
	canvas = document.createElement('canvas')
	canvas.setAttribute('id','myChart')
	document.getElementById('doughnut').before(canvas)


	const myNewChart = new Chart(canvas, {
			type: 'line',
			data: {
				datasets: data_datasets,
				labels: X
			},
			options: {
				scales: {
					x: {
						title: {
							display: true,
							text: '日期'
						},
					},
					yAxes: [{
						ticks: {
						  beginAtZero: true,
						  callback: function(value, index, values) {
							if(parseInt(value) >= 1000){
							  return '$' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
							} else {
							  return '$' + value;
							}
						  }
						}
					  }]
				},
				plugins: {
					title: {
						display: true,
						text: chartSubject,
						font: {
							size: 18
						}
					},
					legend: {
						display: true
					}
				},
				tooltips:{
					bodyFontSize:18
				}
			}
		})

		showLineChartData(charName,dataList,amountList,X)
}

function showLineChartData(charName,dataList,amountList,X){
	if(document.querySelectorAll('.lineChartSubjectName').length>1){
		trQ = document.querySelectorAll('.lineChartSubjectName').length
		for(i=0;i<trQ;i++){
			document.getElementById('lineChart').deleteRow(1);
		}
	}

	subjetctTotaAmount = 0
	document.getElementById('doughnut').style.display = 'none'
	document.getElementById('lineChart').style.display = 'flex'
	if(charName==4){document.getElementById('subject').textContent = '產品名稱'}
	if(charName==5){document.getElementById('subject').textContent = '廠商名稱'}
	if(charName==6){document.getElementById('subject').textContent = '業務名稱'}
	document.getElementById('time0').textContent = X[0]
	document.getElementById('time1').textContent = X[1]
	document.getElementById('time2').textContent = X[2]
	document.getElementById('time3').textContent = X[3]
	document.getElementById('time4').textContent = X[4]
		for (w=0; w < dataList.length; w++) {
			subjectLine = document.createElement('tr')
			subjectName = document.createElement('td')
			subjectName.className = 'lineChartSubjectName'
			subjectAmount0 = document.createElement('td')
			subjectAmount1 = document.createElement('td')
			subjectAmount2 = document.createElement('td')
			subjectAmount3 = document.createElement('td')
			subjectAmount4 = document.createElement('td')
			subjectTotal = document.createElement('td')
			subjectName.textContent = dataList[w]
			subjectAmount0.textContent = String(amountList[(w*5)]).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
			subjetctTotaAmount += amountList[(w*5)]
			subjectAmount1.textContent = String(amountList[(w*5)+1]).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
			subjetctTotaAmount += amountList[(w*5)+1]
			subjectAmount2.textContent = String(amountList[(w*5)+2]).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
			subjetctTotaAmount += amountList[(w*5)+2]
			subjectAmount3.textContent = String(amountList[(w*5)+3]).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
			subjetctTotaAmount += amountList[(w*5)+3]
			subjectAmount4.textContent = String(amountList[(w*5)+4]).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
			subjetctTotaAmount += amountList[(w*5)+4]

			subjectTotal.textContent = String(subjetctTotaAmount).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
			subjectLine.appendChild(subjectName)
			subjectLine.appendChild(subjectAmount0)
			subjectLine.appendChild(subjectAmount1)
			subjectLine.appendChild(subjectAmount2)
			subjectLine.appendChild(subjectAmount3)
			subjectLine.appendChild(subjectAmount4)
			subjectLine.appendChild(subjectTotal)
			document.getElementById('lineChartTbody').appendChild(subjectLine)

		}

}