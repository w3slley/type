
function getQuotes(socket, game){//function that gets the data from quotes API and sends to server via websockets
	/*
	*API CALL
	*/
	let quotes = []
	let authors = []

	let xhr = new XMLHttpRequest()
	let token = 'a0e73df66fca35709b1301fb215bb2ec'
	xhr.open('GET', 'https://favqs.com/api/quotes/?page=2')
	xhr.setRequestHeader("Authorization", 'Token token="' + token+'"')

	xhr.onload = function () {
		// Process our return data
		if (xhr.status >= 200 && xhr.status < 300) {
			// What do when the request is successful
			var json = this.responseText
			var data = JSON.parse(this.responseText)
			for(let i=0;i<5;i++){
				if(data.quotes[i].body.length < game.MAX_CHARS){//max characters the quote will have
					let quote = (data.quotes[i].body).toLowerCase().replace(".","");
					quotes.push(quote)
					authors.push(data.quotes[i].author)

				}
			}
			socket.emit('get quotes', {quotes: quotes, authors: authors})
		}
		else {
			// What do when the request fails
			console.log('The request failed!')
		}
}
xhr.send()

}


function getTotalCharOfQuotes(arr){//function that gets total number of characters in all the quotes that are going to be displayed
	let num = 0
	for(let i=0;i<arr.length;i++){
		for(let j=0;j<arr[i].length;j++){
			num++
		}
	}
	return num
}



//Timer functions - to use later
function stop(){
	//clearTimeout(time)
	$('.word').html('')
	$('.author').html('')
	$('.timer').html('')
	$('.input').css('display', 'none')
	$('.word').css('display', 'none')
	$('.timer').css('display', 'none')
	$('.progress').css('width', '0%')
	$('progress-input').css('widt', "0%")
	c = 0
	quotes=[] //erase all data in the variable quotes.
}

function counter(x){
	if(x >= 0){
		$('.timer').html(x + " s")
		time = setTimeout(function(){counter(x)}, 1000)

		if(x == 0){
			alert('Your time is up!')
			$('.word').html('')
			$('.author').html('')
			$('.input').val('')
			c = 0;
			$('.input').css('display', 'none')
			$('.word').css('display', 'none')
			$('.timer').css('display', 'none')
			$('.progress').css('width', '0%')
			$('.progress-input').css('width', '0%')
		}
		x--//Changed to a decreasing timer.
	}
}


export {getQuotes, getTotalCharOfQuotes}