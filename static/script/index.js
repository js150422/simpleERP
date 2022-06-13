let methods
let userData
let access_token=document.cookie.split('=')[1]

window.addEventListener('load', function(){
	if (document.cookie.length!=0){
		hasCookie()
	}
    testUser()
});

async function hasCookie() {
	await useToken(access_token)
    renderCookie(userData)
}

async function sign(text){
    await getUserData(text)
    renderUserData(userData)
}

function getData(hint){
    let signinUser = document.getElementById('signinUser').value;
    let signinPassword = document.getElementById('signinPassword').value;
    let signupName = document.getElementById('signupName').value;
    let signupEmail = document.getElementById('signupEmail').value;
    let signupUser = document.getElementById('signupUser').value;
    let signupPassword = document.getElementById('signupPassword').value;
    let nameRegex = /[a-zA-Z\u4e00-\u9fa5]{1,14}$/;
    let userRegex =  /^[a-z0-9_-]{3,15}$/;
	let emailRegex = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
	let passwordRegex = /[a-zA-Z0-9]{4,14}$/;
    if(hint=='signup'){
		if((signupName.match(nameRegex)) && (signupEmail.match(emailRegex)) && (signupPassword.match(passwordRegex)) && (signupUser.match(userRegex))){
			let signupText = {'name':signupName, 'email': signupEmail, 'user' : signupUser, 'password': signupPassword}
			methods='POST';
			sign(text = signupText);
		}else{
            document.getElementById('hint').textContent = '資料格式有問題'

        }
    }else{
		if((signinUser.match(userRegex)) && (signinPassword.match(passwordRegex))){
			let signinText = {'user': signinUser, 'password': signinPassword}
			methods='PATCH';
			sign(text = signinText);
		}else{
            document.getElementById('hint').textContent = '資料格式有問題'
        }
    }
    inputClean()
}

function getUserData(text){
	return fetch('/api/user', {
		method: methods,
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(text)
	}).then((response) => {
		return response.json();
	}).then((result) => {
		userData = result;
	});
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

function renderUserData(userData){
    if ('error' in userData){
        document.getElementById('hint').textContent = userData['message']
    }else{
        if ('ok' in userData){
            document.getElementById('hint').textContent =userData['message']
        }else{
            window.location.href = '/main';
        }

    }
}


// function error(expressWrong){
//     document.getElementById('hint').textContent = expressWrong['message']
// }

function renderCookie(userData){
    if (!('error' in userData)){
        window.location.href = '/main';
    }
}

function navChange(){
    let signinBlock = document.getElementById('signinBlock');
    let signupBlock = document.getElementById('signupBlock');
    if(signinBlock.style.display=='none'){
        signupBlock.style.display='none';
        signinBlock.style.display='block';
    }else{
        signupBlock.style.display='block';
        signinBlock.style.display='none';
    }
}

function inputClean(){
    signinUser = '';
    signinPassword = '';
    signupName.value = '';
    signupEmail.value = '';
    signupUser.value = '';
    signupPassword.value = '';
}

function testUser(){
    document.getElementById('signinUser').value = 'cccc'
    document.getElementById('signinPassword').value = '123456'
}