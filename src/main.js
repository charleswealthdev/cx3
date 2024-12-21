import * as THREE from 'three';
import { createHeroScene } from './scenes/heroscene';
import { createFeaturesSection } from './scenes/features';

// Select the hero container
const heroContainer = document.getElementById('hero');
console.log(heroContainer)

// const container = document.getElementById('features')
// Initialize the hero Three.js scene
createHeroScene(heroContainer);
// createFeaturesSection(container)
