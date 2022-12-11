import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer'


let camera, scene, renderer, labelRenderer;//labelRenderer标签渲染器
let moon, earth;
let clock = new THREE.Clock();
//纹理加载器
const textureLoader = new THREE.TextureLoader()

function init() {
    //设置半径
    const earthRadius = 2.5;
    const moonRadius = 0.4;
    //摄像机
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 200);
    camera.position.set(10, 5, 10);
    //场景
    scene = new THREE.Scene();
    //光源
    const dirLight = new THREE.SpotLight(0xffffff);
    dirLight.position.set(0, 0, 10);
    dirLight.intensity = 2;
    dirLight.castShadow = true;
    scene.add(dirLight);

    const ambLight = new THREE.AmbientLight(0xffffff)
    scene.add(ambLight)

    //添加地月
    const moonGeometry = new THREE.SphereGeometry(moonRadius, 15, 15)
    const moonMaterial = new THREE.MeshPhongMaterial({
        //使用加载器添加表面贴图
        map: textureLoader.load('./texture/moon.jpg')
    })
    moon = new THREE.Mesh(moonGeometry, moonMaterial)
    moon.receiveShadow = true;
    moon.castShadow = true;
    scene.add(moon)
    const earthGeometry = new THREE.SphereGeometry(earthRadius, 15, 15)
    const earthMaterial = new THREE.MeshPhongMaterial({
        //使用加载器添加表面贴图
        map: textureLoader.load('./texture/earth.jpg'),
        shininess: 2
    })
    earth = new THREE.Mesh(earthGeometry, earthMaterial)
    earth.receiveShadow = true;
    earth.castShadow = true;
    scene.add(earth)

    //创建文字标签 2d的标签
    const earthDiv = document.createElement('div');
    earthDiv.className = 'label';
    earthDiv.textContent = 'Earth';
    const earthLabel = new CSS2DObject(earthDiv);
    earthLabel.position.set(0, earthRadius + 0.2, 0);
    earth.add(earthLabel)

    const moonDiv = document.createElement('div');
    moonDiv.className = 'label';
    moonDiv.textContent = 'Moon';
    const moonLabel = new CSS2DObject(moonDiv);
    moonLabel.position.set(0, moonRadius + 0.2, 0);
    moon.add(moonLabel)

    //渲染器
    renderer = new THREE.WebGLRenderer({});
    //设置像素比
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    //渲染阴影
    renderer.shadowMap.enabled = true
    document.body.appendChild(renderer.domElement)


    //标签渲染器
    labelRenderer = new CSS2DRenderer()
    labelRenderer.setSize(window.innerWidth, window.innerHeight)
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0px';
    labelRenderer.domElement.style.pointerEvents = 'none';
    document.body.appendChild(labelRenderer.domElement)

    //绑定控制和摄像头 Orbit controls（轨道控制器）可以使得相机围绕目标进行轨道运动。
    const controls = new OrbitControls(camera, renderer.domElement);

}
var oldTime = 0
function animate() {
    //OrbitControls( camera, renderer.domElement );
    const elapsed = clock.getElapsedTime();
    moon.position.set(Math.sin(elapsed) * 5, 0, Math.cos(elapsed) * 5);

    var axis = new THREE.Vector3(0, 1, 0);
    earth.rotateOnAxis(axis, (elapsed - oldTime) * Math.PI / 10);
    renderer.render(scene, camera);
    labelRenderer.render(scene, camera)
    oldTime = elapsed

    //请求动画帧
    requestAnimationFrame(animate)
}
window.addEventListener('resize', () => {
    //更新摄像头
    camera.aspect = window.innerWidth / window.innerHeight
    //更新摄像机投影矩阵
    camera.updateProjectionMatrix()
    //更新渲染器
    renderer.setSize(window.innerWidth, window.innerHeight)
    //设置渲染器像素比
    renderer.setPixelRatio(window.devicePixelRatio)
})

init()
animate()