var ball, paddle1, paddle2;
var ballDirX = 1, ballDirY = 1, ballSpeed = 3;
var result1 = 0, result2 = 0;
function speedReduce() {
    if (ballSpeed > 1.9)
        ballSpeed -= 0.2;
    ball.rotation.z -= 10;
    ball.rotation.y -= Math.floor((Math.random() * 10) + 1);
}
function ballPhysics() {
    ball.rotation.z += 3;
    var spd = ballSpeed > 1.9 ? ballSpeed : 1.9;
    if (ball.position.x <= -planeWidth / 2 + 5) {
        if(
            ball.position.y < paddleHeight/2 &&
            ball.position.y > -paddleHeight/2
        ){
            result2++;
            redResult.innerHTML = result2 + " GOALS";
            resetBall(2)
        }
        ballDirX = -ballDirX;
        speedReduce();
    }

    if (ball.position.x >= planeWidth / 2 - 5) {
        if(
            ball.position.y < paddleHeight/2 &&
            ball.position.y > -paddleHeight/2
        ){
            result1++;
            blueResult.innerHTML = result1+ " GOALS" ;
            resetBall(1)
        }
        ballDirX = -ballDirX;
        speedReduce();
    }

    if (ball.position.y <= -planeHeight / 2 + 5) {
        ballDirY = -ballDirY;
        speedReduce();
    }
    if (ball.position.y >= planeHeight / 2 - 5) {
        ballDirY = -ballDirY;
        speedReduce();
    }

    ball.position.x += ballDirX * 2*spd;
    ball.position.y += ballDirY * spd;

    if (ballDirY > ballSpeed * 2) {
        ballDirY = ballSpeed * 2;
    }
    else if (ballDirY < -ballSpeed * 2) {
        ballDirY = -ballSpeed * 2;
    }
    ball.rotation.y += Math.floor((Math.random() * 10) + 1);
}
function playerPhysics() {
    if (ball.position.x <= set1.position.x + paddleWidth
        && ball.position.x >= set1.position.x) {
        if ((ball.position.y <= 30 + set1.position.y + paddleHeight / 2
            && ball.position.y >= 30 + set1.position.y - paddleHeight / 2) ||
            (ball.position.y <= -30 + set1.position.y + paddleHeight / 2
            && ball.position.y >= -30 + set1.position.y - paddleHeight / 2)
        ) {
            if (ballDirX < 0) {
                ballDirX = -ballDirX;
            } else {
                if (!rotation) {
                    ballDirX = -ballDirX;
                }
            }
            if (rotation) {
                ballSpeed += 2;
            }
                ballDirY -= bar1DirY * 0.2;
        }
    }
}
function resetBall(loser)
{
    ball.position.x = 0;
    ball.position.y = 0;

    if (loser == 1)
    {
        ballDirX = -0.8;
    }
    else
    {
        ballDirX = 0.8;
    }

    ballDirY = 1;
    ballSpeed = 3;
}
