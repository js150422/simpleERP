let headPigUploadResult

window.addEventListener('load', function(){
    getUserPageData()
});

async function getUserPageData() {
	await hasCookie()
    renderUserData()
}

function renderUserData(){
    document.querySelectorAll('.userInfo')[0].textContent = userData['name']
    document.querySelectorAll('.userInfo')[1].textContent = userData['user']
    document.querySelectorAll('.userInfo')[2].textContent = userData['departmentName']
    document.querySelectorAll('.userInfo')[3].textContent = userData['grad']
    document.querySelectorAll('.userInfo')[4].textContent = userData['email']
    if(userData['headPhoto']!=null){
        document.querySelectorAll('.upLoadHint')[0].style.display='none'
        headPhoto = userData['headPhoto'].split('/simpleERP/')[1]
        document.getElementById('employeePig').style.backgroundImage = 'url(https://d3qig2ybk47ceb.cloudfront.net/simpleERP/'+headPhoto +')'
    }
    if(userData['signPhoto']!=null){
        document.querySelectorAll('.upLoadHint')[1].style.display='none'
        signPhoto = userData['signPhoto'].split('/simpleERP/')[1]
        document.getElementById('signPigPreview').style.backgroundImage = 'url(https://d3qig2ybk47ceb.cloudfront.net/simpleERP/'+signPhoto +')'
    }

}


headPig = document.getElementById('headPig')
signPig = document.getElementById('signPig')
headPig.addEventListener('change', headPigUpLoad, false);
signPig.addEventListener('change', signPigUpLoad, false);

function headPigUpLoad() {
    // ---------------------------------預覽圖片------------------------------------------
    let headPigFile = this.files;
    const headPigFileReader =  new FileReader();
    headPigFileReader.readAsDataURL(headPigFile[0]);
    headPigFileReader.onloadend = async function(e){
        document.querySelectorAll('.upLoadHint')[0].style.display='none'
        document.getElementById('employeePig').style.backgroundImage = 'url('+ e.target.result +')'
    }
    // ---------------------------------檢查大小跟附檔名------------------------------------------
	if(!['image/jpeg', 'image/png', 'image/gif'].includes(headPigFile[0].type))
	{
		document.getElementById('errorAlert').textContent = '只接受副檔名為JPG、PNG及GIF';
		document.getElementById('headPig').value = '';
        return;
    }
    if(headPigFile[0].size > 5 * 1024 * 1024)
    {
    	document.getElementById('errorAlert').textContent = '檔案大小請在 5 MB內';
    	document.getElementById('headPig').value = '';
        return;
    }

  }

  function signPigUpLoad() {
    // ---------------------------------預覽圖片------------------------------------------
    let signPigFile = this.files;
    const signPigFileReader =  new FileReader();
    signPigFileReader.readAsDataURL(signPigFile[0]);
    signPigFileReader.onloadend = async function(e){
        document.querySelectorAll('.upLoadHint')[1].style.display='none'
        document.getElementById('signPigPreview').style.backgroundImage = 'url('+ e.target.result +')'
    }
    // ---------------------------------檢查大小跟附檔名------------------------------------------
	if(!['image/jpeg', 'image/png', 'image/gif'].includes(signPigFile[0].type))
	{
		document.getElementById('errorAlert').textContent = '只接受副檔名為JPG、PNG及GIF';
		document.getElementById('signPig').value = '';
        return;
    }
    if(signPigFile[0].size > 5 * 1024 * 1024)
    {
    	document.getElementById('errorAlert').textContent = '檔案大小請在 5 MB內';
    	document.getElementById('signPigs').value = '';
        return;
    }
  }


  function send(){
    if ((headPig.value=='') && (signPig.value=='')){
        document.getElementById('errorAlert').textContent = '請上傳您要更新的圖片';
    }else{
        if (headPig.value!=''){
            headPigFile = this.files;
            let headPigFormData = new FormData();
            headPigFormData.append('files', headPig.files[0])
            headPigFormData.append('employeeId', `${userData['employeeId']}`)
            headPigFormData.append('hint', 'head')
            fetch('/api/user/jpg', {
                method:'POST',
                body : headPigFormData
            }).then(function(response){
                headPigUploadResult = response
                if ('ok' in headPigUploadResult){
                    document.getElementById('errorAlert').textContent = '成功上傳'
                    document.getElementById('headPig').value = '';
                }else{
                    document.getElementById('errorAlert').textContent = '新增失敗'
                    document.getElementById('headPig').value = '';
                }
            });
        }
        if (signPig.value!=''){

            let signPigFormData = new FormData();
            signPigFormData.append('files', signPig.files[0])
            signPigFormData.append('employeeId', `${userData['employeeId']}`)
            signPigFormData.append('hint', 'sign')
            fetch('/api/user/jpg', {
                method:'POST',
                body : signPigFormData
            }).then(function(response){
                signPigUploadResult = response
                if ('ok' in signPigUploadResult){
                    document.getElementById('errorAlert').textContent = '成功上傳'
                    document.getElementById('signPig').value = '';
                }else{
                    document.getElementById('errorAlert').textContent = '新增失敗'
                    document.getElementById('signPig').value = '';
                }
            });
        }
    }
}

function myApplication(){
    window.location.href='/myApplication';
}