import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export function createFeaturesSection(container) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  // Add Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 10, 7.5);
  scene.add(ambientLight, directionalLight);

  // Add a rotating 3D object for each feature
  const features = [
    { title: 'Gaming Interactions', color: '#ff6347' },
    { title: 'Airdrop Opportunities', color: '#4caf50' },
    { title: 'Blockchain Support', color: '#3b82f6' },
  ];

  const featureMeshes = [];

  features.forEach((feature, index) => {
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color: feature.color });
    const mesh = new THREE.Mesh(geometry, material);

    // Position the spheres
    mesh.position.set(index * 4 - 4, 0, 0);
    scene.add(mesh);

    featureMeshes.push(mesh);
  });

  // Add Labels
  const featureLabels = features.map((feature, index) => {
    const label = document.createElement('div');
    label.textContent = feature.title;
    label.style.position = 'absolute';
    label.style.color = 'white';
    label.style.fontSize = '16px';
    label.style.padding = '5px 10px';
    label.style.background = 'rgba(0, 0, 0, 0.7)';
    label.style.borderRadius = '5px';
    label.style.transform = 'translate(-50%, -50%)';
    document.body.appendChild(label);
    return { label, mesh: featureMeshes[index] };
  });

  // Add Orbit Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  camera.position.z = 8;

  // Animation Loop
  function animate() {
    requestAnimationFrame(animate);

    // Rotate the spheres for engagement
    featureMeshes.forEach((mesh) => {
      mesh.rotation.y += 0.01;
    });

    // Update Labels
    featureLabels.forEach(({ label, mesh }) => {
      const vector = mesh.position.clone();
      vector.project(camera);

      const x = (vector.x * 0.5 + 0.5) * container.clientWidth;
      const y = (-vector.y * 0.5 + 0.5) * container.clientHeight;

      label.style.left = `${x}px`;
      label.style.top = `${y}px`;
    });

    controls.update();
    renderer.render(scene, camera);
  }

  animate();

  // Handle Resizing
  window.addEventListener('resize', () => {
    renderer.setSize(container.clientWidth, container.clientHeight);
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
  });
}
