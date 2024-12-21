import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';


import gsap from 'gsap'; // Import GSAP for smooth animations


export function createHeroScene(container) {

  const gltfLoader = new GLTFLoader();
  let bee, mixer;
  // Scene, Camera, Renderer
  const scene = new THREE.Scene();
  console.log(container)
  const canvas = document.querySelector('canvas.webgl')

  const camera = new THREE.PerspectiveCamera(90, container.clientWidth / container.clientHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias:true
})

  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);


  // scene.background = new THREE.Color( 0xcccccc);



  const rgbeLoader = new RGBELoader();
  rgbeLoader.load('/models/rogland_clear_night_4k.hdr', (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture; // Apply to scene
    scene.background = new THREE.Color( 0xcccccc);
  });







  



gltfLoader.load('/models/vr/scene.gltf', (gltf) => {
  const Model = gltf.scene;

  // Configure the model
  Model.position.set(0, 0, 0);
  // Model.scale.setScalar(0.5);
  Model.castShadow = true;
  scene.add(Model);

  const productData = [
    { 
      name: 'P2P', 
      position: { x: 3, y:1.2, z: 2 }, 
      description: 'Trade your favourite Assets', 
      image: 'models/3060322.jpg' 
    },
    { 
      name: 'Blockchain Gaming', 
      position: { x: 3, y: 1.2, z: -2 }, 
      description: 'Explore the gaming world on the blockchain', 
      image: 'models/gamepad.jpeg' 
    },
  ];

  const icons = [];
  const productMeshes = [];
  const textureLoader = new THREE.TextureLoader();

  // Create product meshes with textures
  productData.forEach((product) => {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const texture = textureLoader.load(product.image);
    const material = new THREE.MeshStandardMaterial({ map: texture });
    const productMesh = new THREE.Mesh(geometry, material);

    productMesh.position.set(product.position.x, product.position.y, product.position.z);
    productMesh.userData = { name: product.name, description: product.description };
    scene.add(productMesh);
    productMeshes.push(productMesh);



    const iconGeometry = new THREE.PlaneGeometry(0.5, 0.5);
    const iconTexture = textureLoader.load('models/cartoon-question-mark-isolated/10965491.png'); // Replace with your icon
    const iconMaterial = new THREE.MeshStandardMaterial({ map: iconTexture, transparent: true });
    const iconMesh = new THREE.Mesh(iconGeometry, iconMaterial);

    iconMesh.position.set(product.position.x, product.position.y + 1.5, product.position.z);
    scene.add(iconMesh);
    icons.push(iconMesh);
  });


  

  // Raycaster and pointer for interactivity
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();


  const tooltip = document.createElement('div');
  tooltip.style.position = 'absolute';
  tooltip.style.color = '#fff';
  tooltip.style.background = 'rgba(0, 0, 0, 0.7)';
  tooltip.style.padding = '5px';
  tooltip.style.borderRadius = '5px';
  tooltip.style.display = 'none';
  document.body.appendChild(tooltip);

  // Detailed info for click
  const detailPopup = document.createElement('div');
  detailPopup.style.position = 'absolute';
  detailPopup.style.color = '#fff';
  detailPopup.style.background = 'rgba(0, 0, 0, 0.9)';
  detailPopup.style.padding = '15px';
  detailPopup.style.borderRadius = '10px';
  detailPopup.style.width = '300px';
  detailPopup.style.display = 'none';
  document.body.appendChild(detailPopup);

  // Product info display
  const productInfo = document.createElement('div');
  productInfo.style.position = 'absolute';
  productInfo.style.color = '#fff';
  productInfo.style.background = 'rgba(0, 0, 0, 0.7)';
  productInfo.style.padding = '10px';
  productInfo.style.borderRadius = '8px';
  productInfo.style.display = 'none';
  document.body.appendChild(productInfo);

  // Pointer move event
//   renderer.domElement.addEventListener('pointermove', (event) => {
//     const rect = renderer.domElement.getBoundingClientRect();
//     pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
//     pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;




//   raycaster.setFromCamera(pointer, camera);
//   const intersects = raycaster.intersectObjects(productMeshes);

//   if (intersects.length > 0) {
//     const { name, description } = intersects[0].object.userData;
//     tooltip.innerHTML = `<b>${name}</b><br>${description}`;
//     tooltip.style.left = `${event.clientX}px`;
//     tooltip.style.top = `${event.clientY - 40}px`;
//     tooltip.style.display = 'block';
//   } else {
//     tooltip.style.display = 'none';
//   }

// });
  // Click event for interaction
  renderer.domElement.addEventListener('click', (event) => {
    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(productMeshes);

    if (intersects.length > 0) {
      const { name, description } = intersects[0].object.userData;

      productInfo.innerHTML = `<h2>${name}</h2><p>${description}</p>`;
      productInfo.style.left = `${event.clientX}px`;
      productInfo.style.top = `${event.clientY}px`;
      productInfo.style.display = 'block';

      // Animate camera
      gsap.to(camera.position, {
        x: intersects[0].object.position.x + 2,
        y: intersects[0].object.position.y + 2,
        z: intersects[0].object.position.z + 2,
        duration: 2,
        onUpdate: () => camera.lookAt(intersects[0].object.position),
      });
    } else {
      productInfo.style.display = 'none';
    }
  });
});

const intersectedObject = null; // Placeholder to store intersected object
    let box; // Declare in outer scope
    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('/models/cx3.jpg', (texture) => {
      const boxGeometry = new THREE.BoxGeometry(1, 1);
      const boxMaterial = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
      box = new THREE.Mesh(boxGeometry, boxMaterial);
      box.scale.setScalar(1.6);
      box.position.set(0, 1.5, 0); // Center box
      box.castShadow = true;
      scene.add(box);

      
    });

    window.addEventListener('click', onMouseClick, false);

    // Raycast to detect click on the box
    function onMouseClick(event) {
      // Convert mouse click position to normalized device coordinates (-1 to +1)
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
      // Update raycaster with mouse position
      raycaster.update();
    
      // Raycasting logic to check for intersections
      const intersects = raycaster.intersectObjects([box]); // Check for intersection with the box
    
      // If there's an intersection, display introduction
      if (intersects.length > 0) {
        displayIntroduction(); // Function to display the introduction
      }
    }
    
    // Function to display CX3 introduction
    function displayIntroduction() {
      const introText = `
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
                    background-color: rgba(0, 0, 0, 0.8); color: white; padding: 20px; border-radius: 10px;">
          <h2>Welcome to CX3</h2>
          <p>We bring blockchain technology to underrepresented communities through gaming, airdrops, and education.</p>
          <h3>What We Do:</h3>
          <p>We empower local communities to access Web3 opportunities, bridging the gap in blockchain adoption.</p>
          <h3>How We Do It:</h3>
          <p>By providing support through blockchain gaming, airdrops, and direct community engagement.</p>
        </div>
      `;
      
      // Display the HTML introduction
      document.body.innerHTML += introText;
    }

    

gltfLoader.load( '/models/batmobile-the_dark_knight_tumbler/scene.gltf', (gtfl)=> {
 bee = gtfl.scene;
bee.position.set(18,1,25)
bee.scale.setScalar(0.1)
scene.add(bee)



if (gtfl.animations.length > 0) {
  mixer = new THREE.AnimationMixer(bee);
  // const walkAction = mixer.clipAction( gltf2.animations.forEach(anim => console.log(anim.name)));
  const walkAction = mixer.clipAction(gtfl.animations[0]); // Example for the first animation

walkAction.setLoop(THREE.LoopRepeat); // Loop the animationf
walkAction.play();

}
})
  

  
   
//    const axesHelper = new THREE.AxesHelper(5);
//  scene.add(axesHelper);

   const groundGeometry = new THREE.PlaneGeometry(100,  100); // Large ground plane
   const groundMaterial = new THREE.MeshStandardMaterial({
     color: 0x888888,
     roughness: 0.5,
     metalness: 0.1
   });
 
   const ground = new THREE.Mesh(groundGeometry, groundMaterial);
   ground.rotation.x = -Math.PI / 2; // Make it horizontal
   ground.receiveShadow = true; // Enable shadows
   scene.add(ground);

   
  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  
;
// const pointLight = new THREE.PointLight(0xffffff, 1,100)
const hemisphereLight = new THREE.HemisphereLight(0xffffff,0x444444, 0.6)


const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
directionalLight.castShadow = true; // Enable shadows
directionalLight.shadow.mapSize.width = 512; // Higher resolution shadows
directionalLight.shadow.mapSize.height = 512;
scene.add(directionalLight);
  scene.add(ambientLight, hemisphereLight);

  // Camera Position
  camera.position.z = 6;
  camera.position.x= 30;
 
  camera.up.set(0, 1, 0); // Set the camera's "up" vector to always point upwards in world space
  const planeHeight = 0; // y position of the ground plane
  camera.position.y = Math.max(camera.position.y, planeHeight + 1); // Keep camera above the ground
  
  // camecamera.lookAt(0,0,0)ra.lookAt(cube.position)
  scene.add(camera)


  
const controls = new OrbitControls(camera, canvas)
const pointerLockControls = new PointerLockControls(camera, canvas); // FPS controls
let isFPSMode = false;
controls.enableDamping=true;
controls.enableZoom = true; // Enable pinch zoom
controls.enableRotate = true; // Enable drag-to-rotate on mobile
controls.enablePan = true; // Enable drag-to-pan
// controls.autoRotate= true;
// controls.enableZoom=true;
controls.maxPolarAngle = Math.PI / 2; // Limit the vertical rotation to 90 degrees (looking straight up)
controls.minPolarAngle = Math.PI / 4; // Optional: Limit the minimum rotation to avoid going below the ground
controls.maxAzimuthAngle = Math.PI / 2; // Limit horizontal rotation to 90 degrees (left-right)
controls.minAzimuthAngle = -Math.PI / 2; // Limit horizontal rotation to -90 degrees (left-right)
controls.maxDistance = 30;  // Limit zoom distance
controls.minDistance = 3;   // Avoid zooming too close
controls.dampingFactor = 1;


const exploreButton = document.getElementById('explore-btn');
 
  // exploreButton.style.position = 'absolute';

  // exploreButton.style.transform = 'translateX(-50%)';
  exploreButton.style.padding = '15px 30px';
  exploreButton.style.background = 'rgba(255, 255, 255, 0.2)'; // Semi-transparent white
  exploreButton.style.color = '#fff';
  exploreButton.style.border = '1px solid rgba(255, 255, 255, 0.3)'; // Subtle border
  exploreButton.style.borderRadius = '10px';
  exploreButton.style.backdropFilter = 'blur(10px)'; // Blur effect
  exploreButton.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.1)'; // Soft shadow
  exploreButton.style.cursor = 'pointer';
  exploreButton.style.fontSize = '18px';
  exploreButton.style.transition = 'all 0.3s ease'; // Smooth transitions for hover effect
  
  // Add hover effect
  exploreButton.addEventListener('mouseover', () => {
    exploreButton.style.background = 'rgba(255, 255, 255, 0.3)'; // Slightly brighter
    exploreButton.style.boxShadow = '0 6px 50px rgba(0, 0, 0, 0.2)'; // More pronounced shadow
  });

    document.body.appendChild(exploreButton);
  
  exploreButton.addEventListener('mouseout', () => {
    exploreButton.style.background = 'rgba(255, 255, 255, 0.2)'; // Revert to original
    exploreButton.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.1)'; // Revert shadow
  });
  // GSAP Animation: From FAR to NEAR
  if (!exploreButton) {
    console.error("Explore button not found!");
    return;
  }

  // exploreButton.addEventListener('click', () => {
  //   if (!box) {
  //     console.error("Box has not been loaded yet!");
  //     return;
  //   }
  //   // Start the pointer lock mode when the user clicks the "Explore" button
  //   if (!isFPSMode) {
  //     pointerLockControls.lock();  // Activate FPS controls (pointer lock mode)
  //     isFPSMode = true;
  //     gsap.fromTo(camera.position, { x: 30, y: 10, z: 10 }, {
  //       x: 10, y: 2, z: 2, duration: 3, ease: 'power2.inOut',
  //       onUpdate: () => camera.lookAt(box.position)
  //     });
  //   } else {
  //     pointerLockControls.unlock(); // Switch back to regular orbit controls
  //     isFPSMode = false;
  //   }
  // });
  
  exploreButton.addEventListener('click', () => {
    if (!isFPSMode) {
      activateFirstPersonMode();
    } else {
      deactivateFirstPersonMode();
    }
  });
  
  // First-person mode activation
  function activateFirstPersonMode() {
    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);
    
    gsap.to(camera.position, {
      x: 10, y: 2, z: 10, duration: 2, ease: 'power2.inOut',
      onUpdate: () => camera.lookAt(new THREE.Vector3(0, 2, 0))
    });
  }
  

  function deactivateFirstPersonMode() {
    document.removeEventListener('keydown', onKeyDown, false);
    document.removeEventListener('keyup', onKeyUp, false);

    pointerLockControls.unlock();  // Switch back to regular orbit controls
    isFPSMode = false;
}

  let velocity = new THREE.Vector3();
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;

// Update the movement controls
function onKeyDown(event) {
    switch (event.code) {
        case 'KeyW': // Move forward
            moveForward = true;
            break;
        case 'KeyS': // Move backward
            moveBackward = true;
            break;
        case 'KeyA': // Move left
            moveLeft = true;
            break;
        case 'KeyD': // Move right
            moveRight = true;
            break;
    }
}

function onKeyUp(event) {
    switch (event.code) {
        case 'KeyW': // Stop moving forward
            moveForward = false;
            break;
        case 'KeyS': // Stop moving backward
            moveBackward = false;
            break;
        case 'KeyA': // Stop moving left
            moveLeft = false;
            break;
        case 'KeyD': // Stop moving right
            moveRight = false;
            break;
    }
}

function movePlayer(delta) {
    const speed = 5; // Movement speed (can be adjusted)
    
    // Calculate velocity for movement
    if (moveForward) velocity.z = -speed;
    if (moveBackward) velocity.z = speed;
    if (moveLeft) velocity.x = -speed;
    if (moveRight) velocity.x = speed;

    // Apply velocity to the camera position
    camera.position.addScaledVector(velocity, delta);

    // Reset velocity to prevent continuous movement after key release
    velocity.set(0, 0, 0);
}

  

  const joinButton = document.createElement('button');
    joinButton.innerHTML = 'Join Community';
    // joinButton.style.position = 'absolute';
    // joinButton.style.bottom = '20px';
    // joinButton.style.left = '50%';
    // joinButton.style.transform = 'translateX(-50%)';
    joinButton.style.padding = '15px 30px';
  joinButton.style.background = 'rgba(255, 255, 255, 0.2)'; // Semi-transparent white
  joinButton.style.color = '#fff';
  joinButton.style.border = '1px solid rgba(255, 255, 255, 0.3)'; // Subtle border
  joinButton.style.borderRadius = '10px';
  joinButton.style.backdropFilter = 'blur(10px)'; // Blur effect
  joinButton.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.1)'; 
    document.body.appendChild(joinButton);
    joinButton.addEventListener('click', () => {
      window.open('https://chat.whatsapp.com/L64NIIlm9gKGehkky4wZp0', '_blank');
    });


    // Create the FPS Mode button
const fpsButton = document.createElement('button');
fpsButton.innerHTML = 'FPS Mode';
fpsButton.style.padding = '15px 30px';
fpsButton.style.background = 'rgba(255, 255, 255, 0.2)';
fpsButton.style.color = '#fff';
fpsButton.style.border = '1px solid rgba(255, 255, 255, 0.3)';
fpsButton.style.borderRadius = '10px';
fpsButton.style.backdropFilter = 'blur(10px)';
fpsButton.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.1)';
fpsButton.style.fontSize = '18px';
fpsButton.style.transition = 'all 0.3s ease';

// Hover effect for FPS Mode button
fpsButton.addEventListener('mouseover', () => {
  fpsButton.style.background = 'rgba(255, 255, 255, 0.3)';
  fpsButton.style.boxShadow = '0 6px 50px rgba(0, 0, 0, 0.2)';
});

fpsButton.addEventListener('mouseout', () => {
  fpsButton.style.background = 'rgba(255, 255, 255, 0.2)';
  fpsButton.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.1)';
});

// Add FPS Mode button to the body
document.body.appendChild(fpsButton);

// Create container for the buttons
const buttonContainer = document.createElement('div');
 buttonContainer.style.position = 'absolute';
buttonContainer.style.bottom = '20px';
buttonContainer.style.left = '50%';
buttonContainer.style.transform = 'translateX(-50%)';
buttonContainer.style.display = 'flex';
buttonContainer.style.gap = '120px'; // space between buttons

// Add the existing explore and join buttons to the container
buttonContainer.appendChild(exploreButton);
buttonContainer.appendChild(joinButton);
buttonContainer.appendChild(fpsButton);

// Append the button container to the body
document.body.appendChild(buttonContainer);

// GSAP Animation for FPS Mode button (if needed)
fpsButton.addEventListener('click', () => {
  if (isFPSMode) {
    document.exitPointerLock(); // Exit FPS mode
    scene.remove(pointerLockControls.object); // Remove FPS controls from the scene
    controls.enabled = true; // Enable OrbitControls again
  } else {
    canvas.requestPointerLock(); // Enter FPS mode
    scene.add(pointerLockControls.object); // Add FPS controls to the scene
    controls.enabled = false; // Disable OrbitControls
  }
  isFPSMode = !isFPSMode;
});

document.addEventListener('pointerlockchange', () => {
  if (document.pointerLockElement === canvas) {
    // Handle when pointer is locked (FPS mode)
    pointerLockControls.enabled = true;
  } else {
    // Handle when pointer is unlocked (exit FPS mode)
    pointerLockControls.enabled = false;
  }
});

  
// const keysPressed = {}
// window.addEventListener('keydown', (event)=>{
//     console.log(event)
// keysPressed[event.key] = true;
// })

// window.addEventListener('keyup', (event)=>{
//     console.log(event)
// keysPressed[event.key] = false;
// })




window.addEventListener('resize', () => {
  renderer.setSize(container.clientWidth, container.clientHeight);
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
});



// const moveSpeed = 3; // Adjust movement speed
// const rotationSpeed = 0.01; // Adjust rotation speed

// function moveCharacter(delta) {
//   const speed = 5; // Adjust speed as needed

//   // Movement logic
//   if (keysPressed['w'] || keysPressed['W']) {
//     bee.position.z -= speed * delta; // Move forward
//   }
//   if (keysPressed['s'] || keysPressed['S']) {
//     bee.position.z += speed * delta; // Move backward
//   }
//   if (keysPressed['a'] || keysPressed['A']) {
//     bee.position.x -= speed * delta; // Move left
//   }
//   if (keysPressed['d'] || keysPressed['D']) {
//     bee.position.x += speed * delta; // Move right
//   }

  // Rotation logic
//   if (keysPressed['ArrowUp']) {
//     bee.rotation.y = Math.PI; // Face forward
//   }
//   if (keysPressed['ArrowDown']) {
//     bee.rotation.y = 0; // Face backward
//   }
//   if (keysPressed['ArrowLeft']) {
//     bee.rotation.y = Math.PI / 2; // Face left
//   }
//   if (keysPressed['ArrowRight']) {
//     bee.rotation.y = -Math.PI / 2; // Face right
//   }
// }



function updateCamera() {
  const offset = new THREE.Vector3(0, 5, 10); // Offset above and behind the bee
  const targetPosition = bee.position.clone().add(offset); // Target camera position

  camera.position.lerp(targetPosition, 0.1); // Smooth movement
  camera.lookAt(bee.position); // Ensure the camera looks at the bee
}



const clock = new THREE.Clock()


  // Animation Loop
  function animate() {
    
    const delta = clock.getDelta(); // Time since last frame

    // if (mixer) {
    //     mixer.update(delta); 
    // }

    // if(bee){
    //   moveCharacter(delta)
    //   updateCamera()
    // }
  // Update camera movement based on velocity
  // if (isFPSMode) {
  //   updateCameraMovement(delta);
  //   pointerLockControls.update();
  // }


  if (isFPSMode) {
    movePlayer(delta);
}

// Update controls and render the scene
controls.update();
    // if (isFPSMode) {
    //   pointerLockControls.update();
    // }

    
  //   if (bee) {
  //     const speed = 0.05; // Walking speed
  
  //     // Calculate the direction the character is facing
  //     const direction = new THREE.Vector3();
  //     bee.getWorldDirection(direction);
  
  //     // Move the character in the direction they're facing
  //     bee.position.addScaledVector(direction, speed);
  // }
  // moveFPSCamera(delta);
    requestAnimationFrame(animate);
    // globe.rotation.y += 0.01; // Rotate the globe
    renderer.render(scene, camera);
  }

  animate();

  // Handle Resizing
  
}
