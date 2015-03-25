function setup()
{
    createScene();
    draw();
}
var renderer, scene, camera, plane, spotLight, ball, paddle1, paddle1hole, paddle2, paddle2hole, rotation, blueResult;
var WIDTH = 1024,
    HEIGHT = 768;

var planeWidth = 400,
    planeHeight = 200,
    planeQuality = 10;

var paddleWidth = 10,
    paddleHeight = 30,
    paddleDepth = 10,
    paddleQuality = 1;

var bar1DirY = 0, bar2DirY = 0, paddleSpeed = 6;

function createScene() {
    var netTexture = new THREE.ImageUtils.loadTexture("images/mesh.jpg");
    var ballTexture = new THREE.ImageUtils.loadTexture("images/ball.jpg");

    var planeMaterial =
        new THREE.MeshLambertMaterial(
            {
                color: 0x89BEDE
            });

    var paddleMaterial =
        new THREE.MeshBasicMaterial(
            {
                map:netTexture,
                color: 0xFFFFFF
            });

    var paddleHoleMaterial =
        new THREE.MeshLambertMaterial(
            {
                color: 0x000000
            });

    var sphereMaterial =
        new THREE.MeshLambertMaterial(
            {
                map:ballTexture,
                color: 0xffffff
            });

    scene = new THREE.Scene();

    var results = document.createElement('div');
    results.style.position = 'absolute';
    results.style.width = 200;
    results.style.height = 100;
    results.style.top = 100 + 'px';
    results.style.left = WIDTH/2-30 + 'px';
    blueResult = document.createElement('div');
    redResult = document.createElement('div');
    blueResult.style.backgroundColor= '#247cbd';
    redResult.style.backgroundColor= '#d90b17';
    document.body.appendChild(results);
    redResult.innerHTML = "0 GOALS";
    blueResult.innerHTML = "0 GOALS";
    results.appendChild(redResult);
    results.appendChild(blueResult);


    plane = new THREE.Mesh(
        new THREE.PlaneGeometry(
            planeWidth,
            planeHeight,
            planeQuality,
            planeQuality),
        planeMaterial);
    plane.receiveShadow = true;

    ball = new THREE.Mesh(
        new THREE.SphereGeometry(5, 6, 6),
        sphereMaterial);
    ball.receiveShadow = true;
    ball.castShadow = true;
    ball.position.z = 4;

    spotLight = new THREE.SpotLight(0xFFFFFF);
    spotLight.position.set(0, 0, 460);
    spotLight.intensity = 1.5;
    spotLight.castShadow = true;
    scene.add(spotLight);


    renderer = new THREE.WebGLRenderer();
    renderer.setSize(WIDTH, HEIGHT);


    camera =
        new THREE.PerspectiveCamera(
            50, WIDTH / HEIGHT, 1, 10000);

    camera.position.z = 420;

    paddle1 = new THREE.Mesh(
        new THREE.BoxGeometry(
            paddleWidth,
            paddleHeight,
            paddleDepth,
            paddleQuality),
        paddleMaterial);
    paddle1hole = new THREE.Mesh(
        new THREE.BoxGeometry(
            paddleWidth-1,
            paddleHeight-1,
            paddleDepth),
        paddleHoleMaterial);

    paddle2 = new THREE.Mesh(
        new THREE.CubeGeometry(
            paddleWidth,
            paddleHeight,
            paddleDepth,
            paddleQuality,
            paddleQuality,
            paddleQuality),
        paddleMaterial);
    paddle2hole = new THREE.Mesh(
        new THREE.BoxGeometry(
            paddleWidth-1,
            paddleHeight-1,
            paddleDepth),
        paddleHoleMaterial);

    paddle1.receiveShadow = true;
    paddle1.castShadow = true;
    paddle2.receiveShadow = true;
    paddle2.castShadow = true;

    paddle1.position.x = -planeWidth/2;
    paddle1hole.position.x = -planeWidth/2+1;
    paddle1hole.position.z = 9;
    paddle2.position.x = planeWidth/2;
    paddle2hole.position.x = planeWidth/2-1;
    paddle2hole.position.z = 9;
    paddle1.position.z = paddleDepth;
    paddle2.position.z = paddleDepth;


    bar1 = new THREE.Mesh(new THREE.CylinderGeometry( 2, 2, 330, 32 ), new THREE.MeshPhongMaterial( { color: 0xe7e7e7 } ));
    playerBlue = new THREE.Mesh(new THREE.BoxGeometry( 4, paddleWidth, 16 ), new THREE.MeshLambertMaterial( {color: 0x247cbd} ));
    playerBlueHead = new THREE.Mesh(new THREE.SphereGeometry( 4, 14 ), new THREE.MeshLambertMaterial( {color: 0x247cbd} ));
    playerRed = new THREE.Mesh(new THREE.BoxGeometry( 4, paddleWidth, 16 ), new THREE.MeshLambertMaterial( {color: 0xd90b17} ));
    playerRedHead = new THREE.Mesh(new THREE.SphereGeometry( 4, 14 ), new THREE.MeshLambertMaterial( {color: 0xd90b17} ));
    playerBlueHead.position.z = 8;
    playerRedHead.position.z = 8;

    bar2 = bar1.clone();
    renderer.sortObjects = false;
    set1 = new THREE.Object3D();

    player1Blue = new THREE.Object3D();
    player1Blue.add(playerBlue);
    player1Blue.add(playerBlueHead);
    player2Blue = player1Blue.clone();

    player1Red = new THREE.Object3D();
    player1Red.add(playerRed);
    player1Red.add(playerRedHead);
    player2Red = player1Red.clone();

    player1Blue.position.y = -30;
    player2Blue.position.y = 30;
    player1Red.position.y = -30;
    player2Red.position.y = 30;

    set1.add(bar1);
    set2 = set1.clone();

    set1.add(player1Blue);
    set1.add(player2Blue);
    set2.add(player1Red);
    set2.add(player2Red);
   // set2.add(bar2);


    set1.position.x = -planeWidth/2+100;
    set1.position.z = 10;
    set2.position.x = planeWidth/2-100;
    set2.position.z = 10;

    scene.add(camera);
    scene.add(plane);
    scene.add(ball);
    scene.add(paddle1);
    scene.add(paddle1hole);
    scene.add(paddle2);
    scene.add(paddle2hole);
    scene.add( set1 );
    scene.add( set2 );

    renderer.shadowMapEnabled = true;
    $("#gameCanvas").append( renderer.domElement )
}

function draw()
{

    requestAnimationFrame(draw);
    renderer.render(scene, camera);
    //cameraPhysics()
    playerPhysics();
    playerPaddleMovement()
    ballPhysics()

}
function cameraPhysics()
{
    spotLight.position.x = ball.position.x * 2;
    spotLight.position.y = ball.position.y * 2;

    camera.position.x = paddle1.position.x - 100;
    camera.position.y += (paddle1.position.y - camera.position.y) * 0.05;
    camera.position.z = paddle1.position.z + 100 + 0.04 * (-ball.position.x + paddle1.position.x);

    camera.rotation.x = -0.01 * (ball.position.y) * Math.PI/180;
    camera.rotation.y = -60 * Math.PI/180;
    camera.rotation.z = -90 * Math.PI/180;
}
