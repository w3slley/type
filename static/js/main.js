import {getQuotes, getTotalCharOfQuotes} from './utils.js';
import {Game} from './Game.js';

const socket = io()
//let count = 60 //Changed to a decreasing timer.
const game = new Game();



$('.btnStart').click(function(){//when clicked in the start button
	getQuotes(socket, game) //function is activated and quote is stored in the server
	socket.emit('start') //starts an event for the beginning of the game
	$('.input').val('')
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

	$('.word').html(quotes[game.pos])
	$('.author').html(authors[game.pos])

	let overallProgress = 0
	let inputArray = [0]
	$('.input').keyup(function(){//When user is typing
		/*Progress while typing*/
		//console.log('test')
		let lengthInput = $('.input').val().length//length of input text
		let lengthQuote = quotes[game.pos].length //length of the quote the user need to write
		let stringQuote = quotes[game.pos].substring(0, lengthInput)
		let progressQuote = lengthInput/lengthQuote
		let totalCharacters = getTotalCharOfQuotes(quotes)

		//When phrase is typed correctally
		if($('.input').val() == $('.word').html()){
			inputArray.push(lengthInput) //gets the last value of the lengh input and saves it into the array. The total number of correct characters typed will be the sum of each round of length inputs.
			$('.input').val('')
			game.pos++;
			overallProgress = game.pos/quotes.length
			let fraction = overallProgress*100
			$('.progress').css('width', fraction+"%")
			$('.progress-input').css('width', '0%')
			$('.word').html(quotes[game.pos])
			$('.author').html(authors[game.pos])

			if (game.pos == quotes.length){
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
				game.pos = 0
				overallProgress = 0
				//clearTimeout(time)
				quotes=[] //erase all data in the variable quotes.
			}
		}
		if($('.input').val() == stringQuote){//If user input is equal to quote input at that position (or, in other words, if user got the letter right)
			$('.progress-input').css('backgroundColor', 'green')
			$('.progress-input').css('width', (progressQuote*100)+"%")

			let correctInputs = lengthInput+inputArray.reduce((a,b)=>a+b) //number of correct inputs. correctInputs/totalCharacters gives you the porcentage of completion of the quotes.

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
	let tag = ''
  	for(let username of usernames){tag += '<span>'+username+'</span><div class="user-item '+username+'"></div>'}
	$('.dashboard').html(tag)
})
socket.on('user progress', (data)=>{
	$('.'+data.username+'').css('width', data.progress+'%')

})
socket.on('game over', (winner)=>{
	$('.main').html('<div class="winner">'+winner+' won the game!</div>')
})

socket.on('left', (username)=>{
	$('.'+username+'').remove()
})
