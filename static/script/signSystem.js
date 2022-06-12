let insertCommentResult
let signApplicatonResult
let signPig
let sign1
let sign2
let sign3
let insertCommentText
applicationId = searchUrl.split('=')[1].split('&')[0]
searchUrl = url.search


signPageCondition = {
'Section Manager':'middle',
'staff':'start',
'Boss':'final'
}


window.addEventListener('load', function(){
    searchSingle()
});



async function searchSingle(){
    await getSingleData(applicationId)
    renderSingle()
}


async function getSignPig(sign1,sign2,sign3){
    await getSignPigApi(sign1,sign2,sign3)
    renderSignPig()
}


async function insertComment(){

    insertCommentText = document.getElementById('insertCommentText').value
    if(insertCommentText==''){
        document.getElementById('insertCommentError').textContent = '請輸入意見'
    }else{
        await insertCommentApi({'applicationId':applicationId,'name':userData['name'],'commentText':insertCommentText})
        renderInsertComment()
    }
}

async function insertAuditComment(){
    await insertCommentApi({'applicationId':applicationId,'name':userData['name'],'commentText':insertCommentText})
    renderInsertComment()

}


async function regetApplication(){
    await runingApplicaton(0)

    window.location.href='/applicationList'
}

function getSignPigApi(sign1='', sign2='',sign3=''){
    return fetch('/api/user/signPig?sign1='+sign1+'&sign2='+sign2+'&sign3='+sign3, {
        method: 'GET', headers: new Headers({ 'Content-Type': 'application/json'})
    }).then((response) => {
        return response.json();
    }).then((result) => {
        signPig = result;
    });
}

function  insertCommentApi(text){
    return fetch('/api/comment',{
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(text)
    }).then((response)=>{
        return response.json()
    }).then((result)=>{
        insertCommentResult = result
    })
}

function auditApplicationApi(text){
    return fetch('/api/application',{
        method: 'PATCH',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(text)
    }).then((response)=>{
        return response.json()
    }).then((result)=>{
        signApplicatonResult = result
    })
}




signPageConditionQ = Object.keys(signPageCondition).length
function signPage(){
// 如果station還不是complete
// 依照職位顯示該站別
// 申請人等於現在的user是同一個人
// 申請單的經理跟user是同一個人
    for(n=0;n<signPageConditionQ;n++){
        signPageConditionKey = Object.keys(signPageCondition)[n]

        if((userData['grad']==Object.keys(signPageCondition)[n]) && (singleData.data[0].station==signPageCondition[signPageConditionKey]) ){

            if((userData['name']==singleData.data[0]['approveName-1st']) || (userData['name']==singleData.data[0]['managerName'])|| (userData['grad']=='Boss')){
                document.getElementById('insertCommentBlock').style.display = 'table-row'
                document.getElementById('signBtn').style.display = 'flex';
            }

        }
    }
}


// --------------------------------------------------------------------------------------------------------------------------------------------------------------
function renderCommentAndSign(){
// 顯示過去的簽核意見
// 將簽名跑fetch圖片的api
    if('comment' in singleData.data[0]){
        if (singleData.data[0]['comment']!=null){
            commentQ = singleData.data[0].comment.length
            for(i = 0;i < commentQ; i++){
                commentLine = document.createElement('div')
                commentLine.textContent = singleData.data[0].comment[i][0]+' '+singleData.data[0].comment[i][1]+' '+singleData.data[0].comment[i][2]
                document.getElementById('commentText').appendChild(commentLine)
            }
        }
    }
    if (singleData.data[0]['approveName-1st']!=null){
        sign1 = singleData.data[0]['approveName-1st']
        document.getElementById('applicantTime').textContent = singleData.data[0]['approveTime-1st']
        if (singleData.data[0]['approveName-2nd']!=null){
        sign2 = singleData.data[0]['approveName-2nd']

            document.getElementById('managerTime').textContent = singleData.data[0]['approveTime-2nd']
        }else{
            sign2 = ''
        }
        if(singleData.data[0]['approveName-3th']!=null){
        sign3 = singleData.data[0]['approveName-3th']

            document.getElementById('bossTime').textContent = singleData.data[0]['approveTime-3th']
        }else{
            sign3=''
        }
    }
    getSignPig(sign1,sign2,sign3)
}


function renderSignPig(){
    for(i=0;i<signPig.data.length;i++){
        if(singleData.data[0]['approveName-1st']!=null ){
            if(singleData.data[0]['approveName-1st']==signPig.data[i]['name']){
                if (signPig.data[i]['signPhoto']!=null){
                    headPhoto = signPig.data[i]['signPhoto'].split('/simpleERP/')[1]
                    document.getElementById('applicantSignPng').style.backgroundImage = 'url(https://d3qig2ybk47ceb.cloudfront.net/simpleERP/'+headPhoto +')'
                }else{
                    document.getElementById('applicantSignPng').textContent = singleData.data[0]['approveName-1st']+'簽'
                }

            }
        }
        if (singleData.data[0]['approveName-2nd']!=null){
            if(singleData.data[0]['approveName-2nd']==signPig.data[i]['name']){
                if (signPig.data[i]['signPhoto']!=null){
                    headPhoto = signPig.data[i]['signPhoto'].split('/simpleERP/')[1]
                    document.getElementById('managerSignPng').style.backgroundImage = 'url(https://d3qig2ybk47ceb.cloudfront.net/simpleERP/'+headPhoto +')'
                }else{
                    document.getElementById('managerSignPng').textContent = singleData.data[0]['approveName-2nd']+'簽'
                }

            }
        }
        if(singleData.data[0]['approveName-3th']!=null){
            if(singleData.data[0]['approveName-3th']==signPig.data[i]['name']){
                if (signPig.data[i]['signPhoto']!=null){
                    headPhoto = signPig.data[i]['signPhoto'].split('/simpleERP/')[1]
                    document.getElementById('bossSignPng').style.backgroundImage = 'url(https://d3qig2ybk47ceb.cloudfront.net/simpleERP/'+headPhoto +')'
                }else{
                    document.getElementById('bossSignPng').textContent = singleData.data[0]['approveName-3th']+'簽'
                }

            }
        }
    }

}



function renderInsertComment(){
    if('error' in insertCommentResult){
        document.getElementById('insertCommentError').textContent = insertCommentResult['message']
    }else{
        document.getElementById('insertCommentText').value = ''
        commentQ = insertCommentResult.data.length
        for(i=0; i < commentQ; i++){
            commentLine = document.createElement('div')
            commentLine.textContent = insertCommentResult.data[i]['commentTime']+' '+insertCommentResult.data[i]['name']+' '+insertCommentResult.data[i]['commentText']
            document.getElementById('commentText').appendChild(commentLine)
        }
    }
}


function renderSignApplication(){
    if('error' in signApplicatonResult ){
        document.getElementById('signResult').textContent = signApplicatonResult['message']
    }else{
       localStorage.removeItem('applicationList');
       regetApplication()
    }
}
