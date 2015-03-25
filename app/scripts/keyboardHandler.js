function playerPaddleMovement() {
    rotation = false;
    if (Key.isDown(Key.W)) {
        if (set1.position.y < paddleHeight * 2) {
            bar1DirY = paddleSpeed * 0.5;
        }
        else {
            bar1DirY = 0;
        }
    } else if (Key.isDown(Key.S)) {
        if (set1.position.y > -paddleHeight * 2) {
            bar1DirY = -paddleSpeed * 0.5;
        }
        else {
            bar1DirY = 0;
        }
    } else if (Key.isDown(Key.D)) {
        rotation = true;
        set1.rotation.y += 10;
        bar1DirY = 0;
    } else {
        bar1DirY = 0;
    }
    set1.position.y += bar1DirY;
}
