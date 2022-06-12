
function doughunt(charName){
	if(document.getElementById('mychart')){
		document.getElementById('mychart').remove()
	}
	searchSaleOrderResultQ = searchSaleOrderResult.data.length
	DataListOrigin = []
	DataList = []
	amountList = []
	totaleAmount = 0
	if(charName==1){
		labelName = 'product'
		chartSubject = '產品貢獻度'
		for(j=0;j<searchSaleOrderResultQ;j++){
			saleOrderDetail = searchSaleOrderResult.data[j].saleOrderDetail.split(',')
			saleOrderItemQ = saleOrderDetail.length
			for(i=0;i<saleOrderItemQ;i++){
				if(i%3==0){
					DataListOrigin.push(saleOrderDetail[i])
				}
			}
		}
		DataList = [...new Set(DataListOrigin)]

		for(n=0;n<DataList.length;n++){
			amount = 0
			for(j=0;j<searchSaleOrderResultQ;j++){
				saleOrderDetail = searchSaleOrderResult.data[j].saleOrderDetail.split(',')
				saleOrderItemQ = saleOrderDetail.length

				for(i=0;i<saleOrderItemQ;i++){
					if(i%3==0){
						if(DataList[n]==saleOrderDetail[i]){
							price = saleOrderDetail[i+1]
							quantity = saleOrderDetail[i+2]
							amount = amount + (Number(price)*Number(quantity))
						}
					}
				}
			}
			totaleAmount+=amount
			amountList.push(amount)
		}
	}

	if(charName==2){
		// charName = 2 客戶貢獻度
		labelName = 'client'
		chartSubject = '客戶貢獻度'
		for(j=0;j<searchSaleOrderResultQ;j++){
		DataListOrigin.push(searchSaleOrderResult.data[j].clientName)
		}
		DataList = [...new Set(DataListOrigin)]
		for(n=0;n<DataListOrigin.length;n++){

			amount = 0
			for(j=0;j<searchSaleOrderResultQ;j++){
				if(DataList[n]==searchSaleOrderResult.data[j].clientName){
					amount = amount + Number(searchSaleOrderResult.data[j]['amout'])
				}

			}
			totaleAmount+=amount
			amountList.push(amount)
		}


	}

	if(charName==3){
		// charName = 2 業務貢獻度
		labelName = 'employee'
		chartSubject = '業務貢獻度'
		for(j=0;j<searchSaleOrderResultQ;j++){
			DataListOrigin.push(searchSaleOrderResult.data[j].repEmployee)
		}
		DataList = [...new Set(DataListOrigin)]

		for(n=0;n<DataList.length;n++){

			amount = 0
			for(j=0;j<searchSaleOrderResultQ;j++){
				if(DataList[n]==searchSaleOrderResult.data[j].repEmployee){
					amount = amount + Number(searchSaleOrderResult.data[j]['amout'])
				}

			}
			totaleAmount+=amount
			amountList.push(amount)
		}
	}

	// -----------------------------整理要分析target種類(重複的資料去掉)--------------------------------------------



	data_datasets = [],

	data_datasets.push({
		label: labelName,
		data: amountList,
		backgroundColor:  ['rgba(229, 152, 155, 0.5)','rgba(72, 202, 228, 0.5)','rgba(126, 188, 137, 0.5)','rgba(178, 150, 125, 0.5)','rgba(136, 140, 137, 0.5)','rgba(241, 135, 1, 0.5)','rgba(96, 150, 186, 0.5)','rgba(102, 102, 102, 0.5)'],
		hoverOffset: 4

	})

	if(document.getElementById('myChart')){document.getElementById('myChart').remove()}
	canvas = document.createElement('canvas')
	canvas.setAttribute('id','myChart')
	document.getElementById('doughnut').before(canvas)


	const myNewChart = new Chart(canvas, {
		type: 'doughnut',
		data: {
				datasets: data_datasets,
				labels: DataList
			},
		options: {
				scales: {
					x: {
						title: {
							display: true,
							text: '日期'
						},
					},
					y: {
						title: {
							display: true,
							text: '金額'
						}
					}
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
				}
			}
		})
		showDoughnutData(charName,DataList,amountList,totaleAmount)



	}


	function showDoughnutData(charName,DataList,amountList,totaleAmount){
		if(document.querySelectorAll('.doughnutSubjectName').length>1){
            trQ = document.querySelectorAll('.doughnutSubjectName').length
            for(i=0;i<trQ;i++){
                document.getElementById('doughnut').deleteRow(1);
            }
        }
		document.getElementById('doughnut').style.display = 'grid'
		document.getElementById('lineChart').style.display = 'none'
		if(charName==1){document.getElementById('subject').textContent = '產品名稱'}
		if(charName==2){document.getElementById('subject').textContent = '廠商名稱'}
		if(charName==3){document.getElementById('subject').textContent = '業務名稱'}
		for(i=0;i<DataList.length;i++){
			subjectLine = document.createElement('tr')
			subjectName = document.createElement('td')
			subjectName.className = 'doughnutSubjectName'
			subjectAmount = document.createElement('td')
			subjectPercentage = document.createElement('td')
			subjectName.textContent = DataList[i]
			subjectAmount . textContent = String(amountList[i]).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
			percentage = Number(amountList[i])/Number(totaleAmount) * 100
			subjectPercentage.textContent = Math.round((percentage + Number.EPSILON) * 100) / 100+'%'

			subjectLine.appendChild(subjectName)
			subjectLine.appendChild(subjectAmount)
			subjectLine.appendChild(subjectPercentage)
			document.getElementById('doughnutTbody').appendChild(subjectLine)


		}

	}