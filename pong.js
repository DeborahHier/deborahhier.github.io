// Deborah Hier - This was my very first JavaScript project that I made a few years ago.
const PADDLE_THICKNESS = 10;
const PADDLE_HEIGHT = 100;
const WINNING_SCORE = 3;
var canvas, canvasContext;
var winScreenOn = false;
var ballX = 50;
var ballY = 50;
var ballSpeed_X = 10;
var ballSpeed_Y = 4;
var paddle1 = 250;
var paddle2 = 250;
var player1_score = 0;
var player2_score = 0;


function calculateMousePosition(evt) {
	var rect = canvas.getBoundingClientRect();
	var doc = document.documentElement;
	var mouseX = evt.clientX - rect.left - doc.scrollLeft;
	var mouseY = evt.clientY - rect.top - doc.scrollTop;

	return {
		x:mouseX,
		y:mouseY
	};
}

// start new game when they click
function mouseClick(evt) {
	if(winScreenOn) {
		player1_score = 0;
		player2_score = 0;
		winScreenOn = false;
	}
}

// make the computer's paddle follow the ball (not too quickly)
function computerMovement() {
  var paddle2YCenter = paddle2 + (PADDLE_HEIGHT / 2);

  if(paddle2 < ballY-35)                {  paddle2 += 6; }
  else if(paddle2YCenter > ballY + 35)  {  paddle2 -= 6; }
}


function drawNet() {
	for(var i = 0; i < canvas.height; i += 40) {
		colorRect(canvas.width / 2 - 1, i, 2, 20, 'white');
	}
}


function colorCircle(centerX, centerY, radius, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
  canvasContext.fill();
}


function colorRect(leftX, topY, width, height, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.fillRect(leftX, topY, width, height);
}


function drawEverything() {
	colorRect(0, 0, canvas.width, canvas.height, 'black');

	if(winScreenOn) {
		canvasContext.fillStyle = 'white';

		if (player1_score >= WINNING_SCORE) {
			canvasContext.fillText('Left player wins!', 200, 300);
		} else if (player2_score >= WINNING_SCORE) {
			canvasContext.fillText('Right player wins!', 200, 300);
		}
		canvasContext.fillText('click to continue', 350, 500);
		return;
	}

  // draw/reload graphics
	drawNet();
	colorRect(0, paddle1, 10, PADDLE_HEIGHT, 'white');    // player's paddle (left player)
  colorRect(canvas.width - PADDLE_THICKNESS, paddle2,
            10, PADDLE_HEIGHT, 'white');                //  computer's paddle (right player)

  colorCircle(ballX, ballY, 10, 'white');
	canvasContext.fillText(player1_score, 100, 100);
	canvasContext.fillText(player2_score, canvas.width - 100, 100);
}


function ballReset() {
  if (player1_score >= WINNING_SCORE || player2_score >= WINNING_SCORE)  { winScreenOn = true; }
  ballSpeed_X = -ballSpeed_X;
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
}


// calculate computer and player's movements
function moveEverything() {
  if(winScreenOn)  {   return;   }

	computerMovement();

	ballX += ballSpeed_X;
	ballY += ballSpeed_Y;

  // if the ball's X coord goes off the board on player 1's side..
	if(ballX < 0) {
    // switch the ball's X direction
		if(ballY > paddle1 && ballY < paddle1 + PADDLE_HEIGHT) {
			ballSpeed_X = -ballSpeed_X;

			var deltaY = ballY - (paddle1 + PADDLE_HEIGHT / 2);
			ballSpeed_Y = deltaY * 0.35;

		} else {
      // increment player's score and reset ball
			player2_score++;
			ballReset();
		}
	}

	if(ballX > canvas.width) {
		if(ballY > paddle2 && ballY < paddle2 + PADDLE_HEIGHT) {
			ballSpeed_X = -ballSpeed_X;
			deltaY = ballY - (paddle2 + PADDLE_HEIGHT / 2);
			ballSpeed_Y = deltaY * 0.35;
		} else {
			player1_score++;
			ballReset();
		}
	}
  // if the ball goes off the top or bottom, reduce its vertical speed
	if (ballY < 0 || ballY > canvas.height) {
		ballSpeed_Y = -ballSpeed_Y;
	}
}


// main game loop
window.onload = function() {
  canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext ('2d');

  // set frames per second (move and redraw everything)
	setInterval(function() {
		moveEverything();
		drawEverything();
	}, 1000 / 30);

	canvas.addEventListener('mousedown', mouseClick);

  // move the player's paddle based on their mouse movements
	canvas.addEventListener('mousemove',
		function(evt) {
			var mousePos = calculateMousePosition(evt);
			paddle1 = mousePos.y - (PADDLE_HEIGHT / 2);
		});
}
