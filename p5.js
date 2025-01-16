let img;
function setup() {
    createCanvas(640, 480);
}

function draw() {
    if (img) {
        image(img, 0, 0);
    }
}
