<script setup lang="ts">
import { useTemplateRef } from 'vue';
import * as THREE from 'three';
import CANNON from 'cannon';
import { useThree } from '@/composables/use-three';
import { useGui } from '@/composables/use-gui';

const canvasRef = useTemplateRef('canvas');

const { gui } = useGui();

useThree({
  canvasRef,
  setupScene: ({ scene, renderer, animate, controls, camera }) => {
    /**
     * Textures
     */
    const cubeTextureLoader = new THREE.CubeTextureLoader();

    const environmentMapTexture = cubeTextureLoader.load([
      '/textures/environmentMap/0/px.png',
      '/textures/environmentMap/0/nx.png',
      '/textures/environmentMap/0/py.png',
      '/textures/environmentMap/0/ny.png',
      '/textures/environmentMap/0/pz.png',
      '/textures/environmentMap/0/nz.png',
    ]);

    /**
     * Physics
     */
    // World
    const world = new CANNON.World();

    world.gravity.set(0, -9.82, 0);
    world.broadphase = new CANNON.SAPBroadphase(world);
    world.allowSleep = true;

    // Materials
    const defaultMaterial = new CANNON.Material('default');
    const defaultContactMaterial = new CANNON.ContactMaterial(
      defaultMaterial,
      defaultMaterial,
      {
        friction: 0.1,
        restitution: 0.7,
      }
    );

    world.addContactMaterial(defaultContactMaterial);
    world.defaultContactMaterial = defaultContactMaterial;

    // Floor
    const floorShape = new CANNON.Plane();
    const floorBody = new CANNON.Body();

    floorBody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(-1, 0, 0),
      Math.PI * 0.5
    );
    floorBody.mass = 0;
    floorBody.addShape(floorShape);

    world.addBody(floorBody);

    /**
     * Sounds
     */
    const hitSound = new Audio('./sounds/hit.mp3');

    const playHitSound = (collision: CANNON.ICollisionEvent) => {
      const impactStrength = collision.contact.getImpactVelocityAlongNormal();

      if (impactStrength > 1.5) {
        hitSound.volume = Math.random();
        hitSound.currentTime = 0;
        hitSound.play();
      }
    };
    /**
     * Floor
     */
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10),
      new THREE.MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
        envMapIntensity: 0.5,
      })
    );

    floor.receiveShadow = true;
    floor.rotation.x = -Math.PI * 0.5;

    scene.add(floor);

    /**
     * Objects
     */
    const objectsToUpdate: { mesh: THREE.Mesh; body: CANNON.Body }[] = [];

    // Spheres
    const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
    const sphereMaterial = new THREE.MeshStandardMaterial({
      metalness: 0.3,
      roughness: 0.4,
      envMap: environmentMapTexture,
      envMapIntensity: 0.5,
    });

    const createSphere = (
      radius: number,
      position: { x: number; y: number; z: number }
    ) => {
      // Three.js mesh
      const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);

      mesh.castShadow = true;
      mesh.scale.set(radius, radius, radius);
      mesh.position.copy(position);

      scene.add(mesh);

      // Cannon.js body
      const shape = new CANNON.Sphere(radius);

      const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(position.x, position.y, position.z),
        shape: shape,
        material: defaultMaterial,
      });

      body.addEventListener('collide', playHitSound);

      world.addBody(body);

      // Save in objects to update
      objectsToUpdate.push({ mesh, body });
    };

    // Boxes
    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    const boxMaterial = new THREE.MeshStandardMaterial({
      metalness: 0.3,
      roughness: 0.4,
      envMap: environmentMapTexture,
      envMapIntensity: 0.5,
    });

    const createBox = (
      width: number,
      height: number,
      depth: number,
      position: { x: number; y: number; z: number }
    ) => {
      // Three.js mesh
      const mesh = new THREE.Mesh(boxGeometry, boxMaterial);

      mesh.scale.set(width, height, depth);
      mesh.castShadow = true;
      mesh.position.copy(position);
      scene.add(mesh);

      // Cannon.js body
      const shape = new CANNON.Box(
        new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5)
      );

      const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(position.x, position.y, position.z),
        shape: shape,
        material: defaultMaterial,
      });

      body.addEventListener('collide', playHitSound);

      world.addBody(body);

      // Save in objects
      objectsToUpdate.push({ mesh, body });
    };

    createBox(1, 1.5, 2, { x: 0, y: 3, z: 0 });

    // Debug
    const debugObject = {
      createSphere: () => {
        createSphere(Math.random() * 0.5, {
          x: (Math.random() - 0.5) * 3,
          y: 3,
          z: (Math.random() - 0.5) * 3,
        });
      },
      createBox: () => {
        createBox(Math.random(), Math.random(), Math.random(), {
          x: (Math.random() - 0.5) * 3,
          y: 3,
          z: (Math.random() - 0.5) * 3,
        });
      },
      reset: () => {
        for (const object of objectsToUpdate) {
          // Remove body
          object.body.removeEventListener('collide', playHitSound);
          world.remove(object.body);

          // Remove mesh
          scene.remove(object.mesh);
        }

        objectsToUpdate.splice(0, objectsToUpdate.length);
      },
    };

    gui.add(debugObject, 'createSphere');
    gui.add(debugObject, 'createBox');
    gui.add(debugObject, 'reset');

    /**
     * Lights
     */
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.1);

    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);

    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.set(1024, 1024);
    directionalLight.shadow.camera.far = 15;
    directionalLight.shadow.camera.left = -7;
    directionalLight.shadow.camera.top = 7;
    directionalLight.shadow.camera.right = 7;
    directionalLight.shadow.camera.bottom = -7;
    directionalLight.position.set(5, 5, 5);

    scene.add(directionalLight);

    /**
     * Camera
     */
    camera.position.set(-3, 3, 3);

    /**
     * Renderer
     */
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    /**
     * Animate
     */
    let oldElapsedTime = 0;

    animate({
      scene,
      renderer,
      camera,
      controls,
      tick: (elapsedTime) => {
        const deltaTime = elapsedTime - oldElapsedTime;

        oldElapsedTime = elapsedTime;

        // Update physics
        world.step(1 / 60, deltaTime, 3);

        for (const object of objectsToUpdate) {
          object.mesh.position.copy(object.body.position);
          object.mesh.quaternion.copy(object.body.quaternion);
        }
      },
    });
  },
});
</script>

<template>
  <canvas ref="canvas"></canvas>
</template>
