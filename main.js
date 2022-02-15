import './style.css'

import { ARButton } from 'three/examples/jsm/webxr/ARButton.js'
import * as THREE from 'three'

const TOTAL = 50
let camera, scene, renderer
let mesh, mesh2

/**
 * Resize
 */
const onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)
}

/**
 * Generate random positions object
 */
const getRandomNumber = (mi, mx) => {
  const min = Math.ceil(mi)
  const max = Math.floor(mx)

  return Math.floor(Math.random() * (max - min + 1)) + min
}

const randomPosition = (object, scene) => {
  const distance = getRandomNumber(0, 5) // in meters
  const angleDeg = getRandomNumber(0, 360) // in degrees

  const angleRad = THREE.MathUtils.degToRad(angleDeg)
  const normalizedDistance = new THREE.Vector3()
  const newPosition = new THREE.Vector3()

  normalizedDistance.copy(new THREE.Vector3(0, 0, distance))
  newPosition.copy(
    normalizedDistance.applyAxisAngle(new THREE.Vector3(0, 1, 0), angleRad)
  )

  // console.log({ newPosition, distance })

  object.position.copy(newPosition)
  object.userData = {
    distance,
    angleDeg,
    angleRad,
  }

  scene.add(object)
}

/**
 * Experience
 */
const rotateObjects = () => {
  // rotate the polyhedron on y
  mesh.rotation.y = mesh.rotation.y - 0.01
  console.log(mesh.rotation)

  // rotate the torus on x
  mesh2.rotation.x = mesh2.rotation.x - 0.01
}

const render = () => {
  rotateObjects()
  renderer.render(scene, camera)
}

const init = () => {
  const container = document.createElement('div')
  document.body.appendChild(container)

  scene = new THREE.Scene()

  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.01,
    40
  )

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  // This next line is important to to enable the renderer for WebXR
  renderer.xr.enabled = true // New!
  container.appendChild(renderer.domElement)

  const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1)
  light.position.set(0.5, 1, 0.25)
  scene.add(light)

  // Look for "geometry" in the three.js documentation to find all the geometry types
  // https://threejs.org/docs/index.html

  // Add a polyhedron shape to the scene
  const geometry = new THREE.IcosahedronGeometry(0.1, 5)
  const material = new THREE.MeshPhongMaterial({
    color: new THREE.Color('rgb(226,35,213)'),
    shininess: 6,
    flatShading: true,
    transparent: 1,
    opacity: 0.8,
    wireframe: true,
  })

  mesh = new THREE.Mesh(geometry, material)
  mesh.position.set(0.2, 0, -0.5)
  scene.add(mesh)

  // Add a second torus shape to the scene
  const geometry2 = new THREE.TorusGeometry(0.15, 0.05, 12, 50)
  const material2 = new THREE.MeshBasicMaterial({
    color: new THREE.Color('orange'),
    wireframe: true,
  })
  mesh2 = new THREE.Mesh(geometry2, material2)
  mesh2.position.set(-0.2, 0, -1)
  // scene.add(mesh2)

  Array.from({ length: TOTAL }).forEach((_, i) => {
    const clone = mesh2.clone()
    randomPosition(clone, scene)
  })

  document.body.appendChild(ARButton.createButton(renderer))

  window.addEventListener('resize', onWindowResize, false)
}

const animate = () => {
  renderer.setAnimationLoop(render)
}

init()
animate()
