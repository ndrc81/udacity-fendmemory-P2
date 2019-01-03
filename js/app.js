/*
 * Create a list that holds all of your cards
 */

const cardsInDeck = ['fa-diamond',
					'fa-paper-plane-o',
					'fa-anchor',
					'fa-bolt',
					'fa-cube',
					'fa-leaf',
					'fa-bicycle',
					'fa-bomb',
				  ];

const cardsList = cardsInDeck.concat(cardsInDeck);

function createCard(card){
	return `<li class="card" data-card="${card}"><i class="fa ${card}"></i></li>`;
}

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

//this function creates the Stars
function drawStars(starPoints) {
	const starHTML = document.querySelector(('.stars'));
	const starHTMLtext = `<li><i class="fa fa-star"></i></li>`;
	const starList = [];

	for (let i = 0; i < starPoints; i++) {
		starList.push(starHTMLtext);
	}

	starHTML.innerHTML = starList.join('');
}

//initialize the game
function startGame(){
	const cardDeck = document.querySelector('.deck');
	const cardHTML = shuffle(cardsList).map(function(card) {
		return createCard(card);
	});

	cardDeck.innerHTML = cardHTML.join('');
	starPoints = 3;
	drawStars(starPoints);
	startTime();
}

function startTime() {
	gameTimer = setInterval(function() {
		gameTime++;
		timerCounter.innerHTML = gameTime;
	}, 1000);
}

function openCards(card) {
	gameCardsOpen.push(card);
	card.classList.add('open', 'show');
}


/*this function will display the cards it works in the following way
- Checks if the click contains a card class element
- Then checks tht the card is not already opened, matched or showing AND if true opens the card and increments the move counter
- Then checks
	1) if the card is a match and calls the show function if they are a match
	2) if that specifc match has won the game (i.e. it is the final matched pair)
- Then hides the cards if they are not a match
*/
function showCard(evnt) {

	const cardClick = evnt.target;

	if (cardClick.classList.contains('card')) {

		if (!cardClick.classList.contains('open') && !cardClick.classList.contains('show') && !cardClick.classList.contains('match')){
			openCards(cardClick);
			increaseMove();

			if (gameCardsOpen.length === 2) {
				// check if player matched cards
				if (gameCardsOpen[0].dataset.card === gameCardsOpen[1].dataset.card) {
					matchCards(cardClick);
					winGame();

				} else {
					// if player does not get a match hide cards
					setTimeout(hideCards,500,cardClick);
				}
			}
		}
	}
}

function matchCards(card) {
	gameCardsOpen[0].classList.add('match');
	gameCardsOpen[0].classList.add('open');
	gameCardsOpen[0].classList.add('show');

	gameCardsOpen[1].classList.add('match');
	gameCardsOpen[1].classList.add('open');
	gameCardsOpen[1].classList.add('show');

	gameCardsOpen = [];
}

function hideCards(card) {
	for (card of gameCardsOpen)  {
		card.classList.remove('open', 'show');
	};
	gameCardsOpen = [];

}

//increments the move counter and checks if the star thresholds have been met
function increaseMove() {
	moves += 1;
	// declare a global variable to pass to the draw stars function that is set at 3 in startgame
	if (moves === 26) {
		starPoints = 2;
		drawStars(starPoints);

	} else if (moves === 41) {
		starPoints = 1;
		drawStars(starPoints);
	}
	moveCounter.innerHTML = moves;
	timerCounter.innerHTML = gameTime;
}

//this funtion display an information model that is called when the user either wins the game or resets the game
//this function also clearCounters
function displayModal() {
	modal.style.display = "block";
	// When the user clicks on <span> (x), close the modal
	span.onclick = function() {
  		modal.style.display = "none";
	}

	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function(event) {
		if (event.target == modal) {
			modal.style.display = "none";
		}
	}
	clearCounters();
	startGame();
}

//resets all the various counters used to keep track of scoring
function clearCounters() {
	gameTime = 0;
	timerCounter.innerHTML = gameTime;
	moves = 0;
	moveCounter.innerHTML = moves;
	numberPairs = 0;
	clearInterval(gameTimer);
	starPoints = 3;
	gameCardsOpen = [];
}

//signals the end of the game when user matches all cards
function winGame() {
	numberPairs += 1;
	if (numberPairs === 8) {

		const resetModal = document.querySelector('.modal-text');
		const resetMsg = `<p>Congratulations! You have won the game.</p><p>You took ${gameTime} seconds and ${moves} moves to complete the game.`;

		resetModal.innerHTML = resetMsg;

		displayModal();
		clearCounters();
		startGame();
	}
}

//resets the game when the user clicks on the restart button
function resetGame() {

	const resetModal = document.querySelector('.modal-text');
	const resetMsg = `Click anywhere to restart your game.`;

	resetModal.innerHTML = resetMsg;
	displayModal();
	clearCounters();
	startGame();
}

//global variables
let gameCardsOpen = [];
let gameTimer = 0;
let gameTime = 0;
let numberPairs = 0;
let moves = 0;
let starPoints = 0;
let moveCounter = document.querySelector('.moves-counter');
let timerCounter = document.querySelector('.timer-counter');
const gameDeck = document.querySelector('.deck');
const gameCards = document.querySelectorAll('.card');
const modal = document.getElementById('myModal');
const btn = document.getElementById('resetBtn');
const span = document.getElementsByClassName("close")[0];


startGame();
gameDeck.addEventListener('click', showCard);
btn.onclick = resetGame;