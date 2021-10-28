
// import three.js module to display 3D squares
import * as THREE from 'https://cdn.skypack.dev/three';

//create square object
class Square {
    constructor(xx, yy, zz, l) {
        this.x = xx;
        this.y = yy;
        this.z = zz;
        this.length = l;
        this.geometry = new THREE.BoxGeometry();
        this.color = get_random_color();
        this.material = new THREE.MeshBasicMaterial({ color: hslToHex(this.color[0], this.color[1], this.color[2]), wireframe: false, transparent: true, opacity: 0.9 });
        this.cube = new THREE.Mesh(this.geometry, this.material);
    }

    drawCube() {
        this.cube.position.x = this.x;
        this.cube.position.y = this.y;
        this.cube.position.z = this.z;
        this.cube.scale.x = this.length;
        this.cube.scale.y = this.length;
        this.cube.scale.z = this.length;
        group.add(this.cube);
    }
}

//set up three.js scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
camera.position.z = 5;

//add lightining
var light = new THREE.HemisphereLight(0xf6e86d, 0x404040, 0.5);
scene.add(light);

//keep track of cubes
let sq = [];

//create group to hold cubes
var group = new THREE.Object3D();
scene.add(group);

//generate fibonacci spiral
drawfibonacci(30);

//display squares
for (let i = 0; i < sq.length; i++) {
    sq[i].drawCube();
}

//render scene
camera.position.y = 1;
camera.position.z = 15;

window.requestAnimationFrame(animate);
let mouseX = 0;
let mouseY = 0;

document.addEventListener("mousemove", () => {
    mouseX = event.clientX; // Gets Mouse X
    mouseY = event.clientY; // Gets Mouse Y
});

function animate() {
    group.rotation.y += 0.01;
    renderer.render(scene, camera);
    window.requestAnimationFrame(animate);
}

//keep track of fibonacci cube directions
function drawfibonacci(n) {
    let fibonacciNums = fibonacci(n);
    let direction = 1;

    //scale fibonacci spiral down
    let minsize = Math.floor(n*0.25);
    sq.push(new Square(0, -2, -5, minsize, fibonacciNums[fibonacciNums.length - 1]));

    for (let i = fibonacciNums.length - 2; i >= 0; i--) {
        //add new length variable
        let newLength = (fibonacciNums[i] / fibonacciNums[fibonacciNums.length - 1]) * minsize;

        //manage the really low numbers
        if (i < 3) {
            newLength = sq[sq.length - 1].length * 0.8;
        }

        console.log(newLength, (fibonacciNums[i] / fibonacciNums[fibonacciNums.length - 1]));

        //add new square
        if (direction == 1) {
            sq.push(
                new Square(
                    sq[sq.length - 1].x + sq[sq.length - 1].length / 2 + newLength / 2,
                    sq[sq.length - 1].y + sq[sq.length - 1].length / 2 + newLength / 2,
                    sq[sq.length - 1].z - newLength / 2,
                    newLength
                ));
        } else if (direction == 2) {
            sq.push(
                new Square(
                    sq[sq.length - 1].x - sq[sq.length - 1].length / 2 + newLength / 2,
                    sq[sq.length - 1].y + sq[sq.length - 1].length / 2 + newLength / 2,
                    sq[sq.length - 1].z + sq[sq.length - 1].length / 2 + newLength / 2,
                    newLength
                )
            );
        } else if (direction == 3) {
            sq.push(
                new Square(
                    sq[sq.length - 1].x - sq[sq.length - 1].length / 2 - newLength / 2,
                    sq[sq.length - 1].y + sq[sq.length - 1].length / 2 + newLength / 2,
                    sq[sq.length - 1].z - newLength / 2,
                    newLength
                )
            );
        } else {
            sq.push(
                new Square(
                    sq[sq.length - 1].x - sq[sq.length - 1].length / 2 + newLength / 2,
                    sq[sq.length - 1].y + sq[sq.length - 1].length / 2 + newLength / 2,
                    sq[sq.length - 1].z - sq[sq.length - 1].length / 2 - newLength / 2,
                    newLength
                )
            );
        }

        //add direction
        if (direction == 4) {
            direction = 1;
        } else {
            direction += 1;
        }
    }
}
function fibonacci(n) {
    let nums = [];
    nums.push(0);
    nums.push(1);

    for (let i = 1; i < n; i++) {
        nums.push(nums[i] + nums[i - 1]);
    }

    return nums;
}

function rand(min, max) {
    return min + Math.random() * (max - min);
}

function get_random_color() {
    var h = rand(1, 360);
    var s = rand(50, 100);
    var l = rand(50, 100);
    return [h, s, l]
}

function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}