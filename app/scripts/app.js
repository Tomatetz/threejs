
var renderer, scene, camera, pointLight, spotLight;

// field variables
var fieldWidth = 400, fieldHeight = 200;

// paddle variables
var paddleWidth, paddleHeight, paddleDepth, paddleQuality;
var paddle1DirY = 0, paddle2DirY = 0, paddleSpeed = 6;

// ball variables
var ball, paddle1, paddle2;
var ballDirX = 1, ballDirY = 1, ballSpeed = 3;

// game-related variables
var score1 = 0, score2 = 0;
// you can change this to any positive whole number
var maxScore = 7;

// set opponent reflexes (0 - easiest, 1 - hardest)
var difficulty = 0.2;

function setup()
{
    createScene();
    draw();
}
function createScene() {
    var WIDTH = 1024,
        HEIGHT = 768;

   /* var WIDTH = window.innerWidth,
        HEIGHT = window.innerHeight;*/

    var VIEW_ANGLE = 50,
        ASPECT = WIDTH / HEIGHT,
        NEAR = 0.1,
        FAR = 10000;

    var radius = 5,
        segments = 6,
        rings = 6;

    var planeWidth = fieldWidth,
        planeHeight = fieldHeight,
        planeQuality = 10;

    var paddle1Material =
        new THREE.MeshLambertMaterial(
            {
                color: 0x1B32C0
            });
    // create the paddle2's material
    var paddle2Material =
        new THREE.MeshLambertMaterial(
            {
                color: 0xFF4045
            });
    // create the plane's material
    var planeMaterial =
        new THREE.MeshLambertMaterial(
            {
                color: 0x89BEDE
            });
    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(WIDTH, HEIGHT);

    spotLight = new THREE.SpotLight(0xF8D898);
    spotLight.position.set(0, 0, 460);
    spotLight.intensity = 1.5;
    spotLight.castShadow = true;
    scene.add(spotLight);

    camera =
        new THREE.PerspectiveCamera(
            50, WIDTH / HEIGHT, 1, 10000);

    camera.position.z = 320;


    //camera.lookAt( scene.position )
    scene.add(camera);

    var sphereMaterial =
        new THREE.MeshLambertMaterial(
            {
                color: 0xffffff
            });

    ball = new THREE.Mesh(
        new THREE.SphereGeometry(radius,
            segments,
            rings),
        sphereMaterial);

    ball.receiveShadow = true;
    ball.castShadow = true;
    ball.position.z = 4;
    scene.add(ball);

    var plane = new THREE.Mesh(
        new THREE.PlaneGeometry(
            planeWidth * 0.95,
            planeHeight,
            planeQuality,
            planeQuality),
        planeMaterial);

    scene.add(plane);

    plane.receiveShadow = true;


    paddleWidth = 10;
    paddleHeight = 30;
    paddleDepth = 10;
    paddleQuality = 1;

// установка дощечки 1
    paddle1 = new THREE.Mesh(
        new THREE.CubeGeometry(
            paddleWidth,
            paddleHeight,
            paddleDepth,
            paddleQuality,
            paddleQuality,
            paddleQuality),
        paddle1Material);

// добавляем её на сцену
    scene.add(paddle1);

//  установка дощечки 2
    paddle2 = new THREE.Mesh(
        new THREE.CubeGeometry(
            paddleWidth,
            paddleHeight,
            paddleDepth,
            paddleQuality,
            paddleQuality,
            paddleQuality),
        paddle2Material);

    paddle1.receiveShadow = true;
    paddle1.castShadow = true;
    paddle2.receiveShadow = true;
    paddle2.castShadow = true;
// добавляем её на сцену
    scene.add(paddle2);

// располагаем их на противоположных сторонах друг от друга
    paddle1.position.x = -fieldWidth/2 + paddleWidth;
    paddle2.position.x = fieldWidth/2 - paddleWidth;

// обеспечиваем движение дощечек вдоль стороны поля, на которой они расположены
    paddle1.position.z = paddleDepth;
    paddle2.position.z = paddleDepth;

    renderer.shadowMapEnabled = true;
    $("#gameCanvas").append( renderer.domElement );
}
function draw()
{

    requestAnimationFrame(draw);
    renderer.render(scene, camera);
    ballPhysics();
    cameraPhysics()
    paddlePhysics()
    playerPaddleMovement();

}
function ballPhysics()
{
    // if ball goes off the 'left' side (Player's side)
    if (ball.position.x <= -fieldWidth/2)
    {
        // CPU scores
        score2++;
        // update scoreboard HTML
        document.getElementById("scores").innerHTML = score1 + "-" + score2;
        // reset ball to center
        //resetBall(2);
        //matchScoreCheck();

        ballDirX = -ballDirX;
    }

    // if ball goes off the 'right' side (CPU's side)
    if (ball.position.x >= fieldWidth/2)
    {
        // Player scores
        /*score1++;
        // update scoreboard HTML
        document.getElementById("scores").innerHTML = score1 + "-" + score2;
        // reset ball to center
        resetBall(1);
        matchScoreCheck();*/
        ballDirX = -ballDirX;
    }

    // if ball goes off the top side (side of table)
    if (ball.position.y <= -fieldHeight/2)
    {
        ballDirY = -ballDirY;
    }
    // if ball goes off the bottom side (side of table)
    if (ball.position.y >= fieldHeight/2)
    {
        ballDirY = -ballDirY;
    }

    // update ball position over time
    ball.position.x += ballDirX * ballSpeed;
    ball.position.y += ballDirY * ballSpeed;

    // limit ball's y-speed to 2x the x-speed
    // this is so the ball doesn't speed from left to right super fast
    // keeps game playable for humans
    if (ballDirY > ballSpeed * 2)
    {
        ballDirY = ballSpeed * 2;
    }
    else if (ballDirY < -ballSpeed * 2)
    {
        ballDirY = -ballSpeed * 2;
    }
}
function playerPaddleMovement()
{
    // move left
    if (Key.isDown(Key.A))
    {
        // if paddle is not touching the side of table
        // we move
        if (paddle1.position.y < fieldHeight * 0.45)
        {
            paddle1DirY = paddleSpeed * 0.5;
        }
        // else we don't move and stretch the paddle
        // to indicate we can't move
        else
        {
            paddle1DirY = 0;
            paddle1.scale.z += (10 - paddle1.scale.z) * 0.2;
        }
    }
    // move right
    else if (Key.isDown(Key.D))
    {
        // if paddle is not touching the side of table
        // we move
        if (paddle1.position.y > -fieldHeight * 0.45)
        {
            paddle1DirY = -paddleSpeed * 0.5;
        }
        // else we don't move and stretch the paddle
        // to indicate we can't move
        else
        {
            paddle1DirY = 0;
            paddle1.scale.z += (10 - paddle1.scale.z) * 0.2;
        }
    }
    // else don't move paddle
    else
    {
        // stop the paddle
        paddle1DirY = 0;
    }

    paddle1.scale.y += (1 - paddle1.scale.y) * 0.2;
    paddle1.scale.z += (1 - paddle1.scale.z) * 0.2;
    paddle1.position.y += paddle1DirY;

    paddle2.scale.y += (1 - paddle2.scale.y) * 0.2;
    paddle2.scale.z += (1 - paddle2.scale.z) * 0.2;
    paddle2.position.y += paddle2DirY;
}
window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);

var Key = {
    _pressed: {},

    A: 65,
    W: 87,
    D: 68,
    S: 83,
    SPACE: 32,

    isDown: function(keyCode) {
        return this._pressed[keyCode];
    },

    onKeydown: function(event) {
        this._pressed[event.keyCode] = true;
    },

    onKeyup: function(event) {
        delete this._pressed[event.keyCode];
    }
};

function paddlePhysics()
{
    // ЛОГИКА ДОЩЕЧКИ ИГРОКА

    // если мяч имеет одинаковые координаты с дощечкой1 на плоскости Х
    // запоминаем позицию ЦЕНТРА объекта
    // мы делаем проверку только между передней и средней частями дощеч        ки (столкновение одностороннее)
    if (ball.position.x <= paddle1.position.x + paddleWidth
        &&  ball.position.x >= paddle1.position.x)
    {
        // и если мяч имеет одинаковые координаты с дощечкой1 на плоскости Y
        if (ball.position.y <= paddle1.position.y + paddleHeight/2
            &&  ball.position.y >= paddle1.position.y - paddleHeight/2)
        {
            // и если мяч направляется к игроку(отрицательное направление)
            if (ballDirX < 0)
            {
                // растягиваем дощечку, чтобы зафиксировать удар
                paddle1.scale.y = 15;
                // меняем направление движения мяча, чтобы создать эффект отскакивания
                ballDirX = -ballDirX;
                // мы меняем угол мяча при ударе
                // это не реалистичная физика, просто чтобы было интереснее
                // позволяет вам 'скользить' по мячу, чтобы победить соперника
                ballDirY -= paddle1DirY * 0.7;
            }
        }
    }

    // ЛОГИКА ДОЩЕЧКИ СОПЕРНИКА

    // если мяч имеет одинаковые координаты с дощечкой2 на плоскости Х
    // запоминаем позицию ЦЕНТРА объекта
    // мы делаем проверку только между передней и средней частями дощеч        ки (столкновение одностороннее)
    if (ball.position.x <= paddle2.position.x + paddleWidth
        &&  ball.position.x >= paddle2.position.x)
    {
        // и если мяч имеет одинаковые координаты с дощечкой1 на плоскости Y
        if (ball.position.y <= paddle2.position.y + paddleHeight/2
            &&  ball.position.y >= paddle2.position.y - paddleHeight/2)
        {
            // и если мяч направляется к сопернику (положительное направление)
            if (ballDirX > 0)
            {
                // растягиваем дощечку, чтобы зафиксировать удар
                paddle2.scale.y = 15;
                // меняем направление движения мяча, чтобы создать эффект отскакивания
                ballDirX = -ballDirX;
                // мы меняем угол мяча при ударе
                // это не реалистичная физика, просто чтобы было интереснее
                // позволяет вам 'скользить' по мячу, чтобы победить соперника
                ballDirY -= paddle2DirY * 0.7;
            }
        }
    }
}
function cameraPhysics()
{
    // we can easily notice shadows if we dynamically move lights during the game
    spotLight.position.x = ball.position.x * 2;
    spotLight.position.y = ball.position.y * 2;

    // move to behind the player's paddle
    camera.position.x = paddle1.position.x - 100;
    camera.position.y += (paddle1.position.y - camera.position.y) * 0.05;
    camera.position.z = paddle1.position.z + 100 + 0.04 * (-ball.position.x + paddle1.position.x);

    // rotate to face towards the opponent
    camera.rotation.x = -0.01 * (ball.position.y) * Math.PI/180;
    camera.rotation.y = -60 * Math.PI/180;
    camera.rotation.z = -90 * Math.PI/180;
}
