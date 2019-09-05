const socket = io()
//let count = 60 //Changed to a decreasing timer.
let c = 0 //variable which is increased to display notes in the page
//var firstLevel = ['porta', 'cadeira', 'palavra', "era uma casa muito engraçada", 12345, "era uma vez", "um lugar tão, tão distante", "eu consigo voar", "cada macaco no seu galho", "filho de peixe, peixinho é"];


function getTotalCharOfQuotes(arr){//function that gets total number of characters in all the quotes that are going to be displayed
	num = 0
	for(let i=0;i<arr.length;i++){
		for(let j=0;j<arr[i].length;j++){
			num++
		}
	}
	return num
}
function getQuotes(){//function that gets the data from quotes API and sends to server via websockets
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
					//console.log(data);
					for(let i=0;i<5;i++){
						if(data.quotes[i].body.length < 100){//max characters the quote will have
							quotes.push(data.quotes[i].body)
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



$('.btnStart').click(function(){//when clicked in the start button
	getQuotes() //function is activated and quote is stored in the server
	socket.emit('start') //starts an event for the beginning of the game

})

//INTERACTION WITH SERVER
//Starting game
socket.on('start', ()=>{//event that removes the button and displays the text and input

	$('.input').focus()
	//var t = counter(count)
	$('.input').css('display', 'block')
	$('.word').css('display', 'block')
	$('.author').css('display', 'block')
	$('.btnStart').css('display', 'none')
	$('.btnStop').css('display','none')
	//timer.style.display = 'block'
})

socket.on('get quotes', (quotesServer)=>{//function that gets quotes and authors from the server and implements logic

	let quotes = quotesServer.quotes
	let authors = quotesServer.authors

	$('.word').html(quotes[c])
	$('.author').html(authors[c])

	let overallProgress = 0
	let inputArray = [0]
	$('.input').keyup(function(){//When user is typing
		/*Progress while typing*/
		console.log('test')
		let lengthInput = $('.input').val().length//length of input text
		let lengthQuote = quotes[c].length //length of the quote the user need to write
		let stringQuote = quotes[c].substring(0, lengthInput)
		let progressQuote = lengthInput/lengthQuote
		let totalCharacters = getTotalCharOfQuotes(quotes)

		//When phrase is typed correctally
		if($('.input').val() == $('.word').html()){
			inputArray.push(lengthInput) //gets the last value of the lengh input and saves it into the array. The total number of correct characters typed will be the sum of each round of length inputs.
			$('.input').val('')
			c++;
			overallProgress = c/quotes.length
			let fraction = overallProgress*100
			$('.progress').css('width', fraction+"%")
			$('.progress-input').css('width', '0%')
			$('.word').html(quotes[c])
			$('.author').html(authors[c])

			if (c == quotes.length){
				socket.emit('game over')
				$('.word').html('')
				$('.author').html('')
				$('.timer').html('')
				$('.input').css('display', 'none')
				$('.word').css('display', 'none')
				$('.timer').css('display', 'none')
				$('.progress').css('width', '0%')
				$('.progress-input').css('width', '0%')
				$('.btnStart').css('display', 'block')
				$('.btnStop').css('display','block')
				c = 0
				overallProgress = 0
				//clearTimeout(time)
				quotes=[] //erase all data in the variable quotes.
			}
		}
		if($('.input').val() == stringQuote){//If user input is equal to quote input at that position (or, in other words, if user got the letter right)
			$('.progress-input').css('backgroundColor', 'green')
			$('.progress-input').css('width', (progressQuote*100)+"%")

			correctInputs = lengthInput+inputArray.reduce((a,b)=>a+b) //number of correct inputs. correctInputs/totalCharacters gives you the porcentage of completion of the quotes.

			socket.emit('user progress', (correctInputs/totalCharacters))
		}
		else{
			$('.progress-input').css('backgroundColor', 'red')
		}
	})
})



$('.setUsername').submit((e)=>{//sending username to server (will be stored in a session)
  e.preventDefault
  socket.emit('joined', $('.user').val())
  $('.username').css('display','none')
  $('.main').css('display','block')
  return false

})

socket.on('joined', (usernames)=>{
	tag = ''
  for(username of usernames){tag += '<span>'+username+'</span><div class="user-item '+username+'"></div>'}
	$('.dashboard').html(tag)
})
socket.on('user progress', (data)=>{
	$('.'+data.username+'').css('width', data.progress+'%')

})
socket.on('game over', (winner)=>{
	$('.main').text(winner+' won the game!!!')

})

socket.on('left', (username)=>{
	$('.'+username+'').remove()
})





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
