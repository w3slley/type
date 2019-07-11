var input = document.getElementById('input');
var word = document.querySelector('.word');
var text = document.getElementById('text');
var timer = document.querySelector('.timer');
var btnStart = document.querySelector('.btnStart');
let progress = document.querySelector('.progress');
let progressInput = document.querySelector('.progress-input');



var count = 1; //Changed to upward timer.
var c = 0
//var firstLevel = ['porta', 'cadeira', 'palavra', "era uma casa muito engraçada", 12345, "era uma vez", "um lugar tão, tão distante", "eu consigo voar", "cada macaco no seu galho", "filho de peixe, peixinho é"];
var level;
/*API CALL*/
let quotes = [];
let authors = [];

function getQuotes(){
	let xhr = new XMLHttpRequest();
	let token = 'a0e73df66fca35709b1301fb215bb2ec';
	xhr.open('GET', 'https://favqs.com/api/quotes/');
	xhr.setRequestHeader("Authorization", 'Token token="' + token+'"');

	xhr.onload = function () {
	    // Process our return data
	    if (xhr.status >= 200 && xhr.status < 300) {
	        // What do when the request is successful
	        var json = this.responseText;
	        var data = JSON.parse(this.responseText);
	        //console.log(data);

	        for(let i=0;i<25;i++){
	        	if(data.quotes[i].body.length < 60){
	        		quotes.push(data.quotes[i].body);
	            	//authors.push(data.quotes[i].author);
	        	}
	        }
	        word.innerHTML = quotes[c];
	        console.log(data);

	        
	        

	    } else {
	        // What do when the request fails
	        console.log('The request failed!');
	    }
	};
	xhr.send();


}



btnStart.onclick = function(){
	var t = counter(count)
	
	input.style.display = 'block';
	word.style.display = 'block';
	timer.style.display = 'block';
	getQuotes();
	
}



let pos = 1;
input.onkeyup = function(){

	/*Progress while typing*/
	let lengthInput = input.value.length; //length of input text
	let lengthQuote = quotes[c].length; //length of the quote the user need to write
	let stringQuote = quotes[c].substring(0, lengthInput);

	//console.log(input.value, stringQuote);

	if(input.value == stringQuote){
		pos++;
		//console.log(lengthInput/lengthQuote)
		progressInput.style.backgroundColor = 'green';
		progressInput.style.width = (lengthInput/lengthQuote)*100+"%";
		
	}
	else{
		progressInput.style.backgroundColor = 'red';
	}
	if(input.value==''){
		pos = 1;
	}


	//When phrase is typed correctally
	if(input.value == word.innerHTML){
		input.value = '';
		c++;
		fraction = (c/quotes.length)*100;
		progress.style.width = fraction+"%";
		progressInput.style.width = "0%";
		clearTimeout(time);
		word.innerHTML = quotes[c];
		counter(count);

		

		if (c == quotes.length){
			word.innerHTML = '';
			timer.innerHTML = '';
			input.style.display = 'none';
			word.style.display = 'none';
			timer.style.display = 'none';
			progress.style.width = "0%";
			progressInput.style.width ="0%"
			c = 0;
			clearTimeout(time);
			quotes=[]; //erase all data in the variable quotes.

			//input.style.display = 'none';
			//word.style.display = 'none';
			//clearTimeout(time);
			
		}
		
	}
	
}

var time; //This allows me to stop the setTimeout function!
function counter(x){
	if(x >= 0){
		timer.innerHTML = x + " s";
		time = setTimeout(function(){counter(x)}, 1000);

		if(x == 0){
			alert('Your time is up!');
			word.innerHTML = '';
			input.value = '';
			c = 0;
			input.style.display = 'none';
			word.style.display = 'none';
			timer.style.display = 'none';
		}
		x++;//Changed to upward timer.

	}
	
	
	
}
