import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const Background3D: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Structured 3D Mesh Grid of Particles
    const cols = 45;
    const rows = 30;
    const particlesCount = cols * rows;

    const positions = new Float32Array(particlesCount * 3);
    const initialPositions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);

    const colorBlue = new THREE.Color('#60A5FA');
    const colorPurple = new THREE.Color('#A78BFA');

    let idx = 0;
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        // Map grid coordinates to 3D space
        const x = (c / cols - 0.5) * 16;
        const y = (r / rows - 0.5) * 11;
        const z = 0;

        positions[idx * 3] = x;
        positions[idx * 3 + 1] = y;
        positions[idx * 3 + 2] = z;

        initialPositions[idx * 3] = x;
        initialPositions[idx * 3 + 1] = y;
        initialPositions[idx * 3 + 2] = z;

        // Apply a gradient color transition across the X and Y coordinates
        const ratio = (x + 8) / 16;
        const mixedColor = colorBlue.clone().lerp(colorPurple, ratio + (Math.random() - 0.5) * 0.15);
        colors[idx * 3] = mixedColor.r;
        colors[idx * 3 + 1] = mixedColor.g;
        colors[idx * 3 + 2] = mixedColor.b;

        idx++;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Circular particle texture generator
    const createCircleTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 16;
      canvas.height = 16;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const gradient = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.7)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 16, 16);
      }
      const texture = new THREE.CanvasTexture(canvas);
      return texture;
    };

    const material = new THREE.PointsMaterial({
      size: 0.075,
      vertexColors: true,
      transparent: true,
      opacity: 0.45,
      map: createCircleTexture(),
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Mouse projections on the 3D plane
    const mouse2D = new THREE.Vector2(-999, -999); // Offscreen initially
    const planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const raycaster = new THREE.Raycaster();

    const handleMouseMove = (event: MouseEvent) => {
      mouse2D.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse2D.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', handleResize);

    const clock = new THREE.Clock();
    let animationFrameId: number;
    const intersectionPoint = new THREE.Vector3();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Project mouse coordinates onto the z=0 Plane
      raycaster.setFromCamera(mouse2D, camera);
      raycaster.ray.intersectPlane(planeZ, intersectionPoint);

      const positionsArray = geometry.attributes.position.array as Float32Array;
      const maxInfluenceDist = 2.2;
      const maxInfluenceDistSq = maxInfluenceDist * maxInfluenceDist;

      // Update particle grid positions with wavy offsets and mouse repulsion forces
      for (let i = 0; i < particlesCount; i++) {
        const initX = initialPositions[i * 3];
        const initY = initialPositions[i * 3 + 1];

        // Wave formula for baseline height oscillation
        const waveZ = Math.sin(elapsedTime * 0.9 + initX * 0.35 + initY * 0.25) * 0.35;

        // Distance squared from cursor projected point
        const dx = initX - intersectionPoint.x;
        const dy = initY - intersectionPoint.y;
        const dz = waveZ - intersectionPoint.z;
        const distSq = dx * dx + dy * dy + dz * dz;

        let targetX = initX;
        let targetY = initY;
        let targetZ = waveZ;

        if (distSq < maxInfluenceDistSq) {
          const dist = Math.sqrt(distSq);
          const force = (maxInfluenceDist - dist) / maxInfluenceDist; // Linear falloff (0 to 1)

          // Displace coordinates horizontally (repulsion push)
          const len = Math.sqrt(dx * dx + dy * dy);
          if (len > 0.0001) {
            const pushFactor = force * 0.7 / len;
            targetX += dx * pushFactor;
            targetY += dy * pushFactor;
          }
          targetZ += force * 1.6; // Lifting coordinate towards the camera (3D bump)
        }

        // Interpolation (lerp) current position to target coordinate for fluid motion
        const currX = positionsArray[i * 3];
        const currY = positionsArray[i * 3 + 1];
        const currZ = positionsArray[i * 3 + 2];

        positionsArray[i * 3] += (targetX - currX) * 0.12;
        positionsArray[i * 3 + 1] += (targetY - currY) * 0.12;
        positionsArray[i * 3 + 2] += (targetZ - currZ) * 0.12;
      }
      geometry.attributes.position.needsUpdate = true;

      // Subtle scene drift
      particles.rotation.z = Math.sin(elapsedTime * 0.05) * 0.05;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10 pointer-events-none bg-darkBg"
    />
  );
};
