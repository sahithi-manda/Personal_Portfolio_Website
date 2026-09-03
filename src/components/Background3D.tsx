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

    // Structured 3D Mesh Grid of Particles (Balanced density for maximum smoothness)
    const cols = 36;
    const rows = 24;
    const particlesCount = cols * rows;

    const positions = new Float32Array(particlesCount * 3);
    const initialPositions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);

    const colorBlue = new THREE.Color('#38BDF8');
    const colorPurple = new THREE.Color('#818CF8');

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
        gradient.addColorStop(0.35, 'rgba(56, 189, 248, 0.85)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 16, 16);
      }
      const texture = new THREE.CanvasTexture(canvas);
      return texture;
    };

    const material = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.38,
      map: createCircleTexture(),
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Mouse projections on the 3D plane
    const mouse2D = new THREE.Vector2(-999, -999);
    const planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const raycaster = new THREE.Raycaster();
    let mouseMoved = false;

    const handleMouseMove = (event: MouseEvent) => {
      mouse2D.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse2D.y = -(event.clientY / window.innerHeight) * 2 + 1;
      mouseMoved = true;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    };

    window.addEventListener('resize', handleResize);

    const clock = new THREE.Clock();
    let animationFrameId: number;
    const intersectionPoint = new THREE.Vector3(-999, -999, 0);

    const animate = () => {
      if (document.hidden) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      const elapsedTime = clock.getElapsedTime();

      // Project mouse coordinates onto the z=0 Plane only when moved
      if (mouseMoved) {
        raycaster.setFromCamera(mouse2D, camera);
        raycaster.ray.intersectPlane(planeZ, intersectionPoint);
        mouseMoved = false;
      }

      const positionsArray = geometry.attributes.position.array as Float32Array;
      const maxInfluenceDist = 2.4;
      const maxInfluenceDistSq = maxInfluenceDist * maxInfluenceDist;

      // Update particle grid positions
      for (let i = 0; i < particlesCount; i++) {
        const initX = initialPositions[i * 3];
        const initY = initialPositions[i * 3 + 1];

        // Smooth wave formula
        const waveZ = Math.sin(elapsedTime * 0.8 + initX * 0.3 + initY * 0.2) * 0.32;

        const dx = initX - intersectionPoint.x;
        const dy = initY - intersectionPoint.y;
        const distSq = dx * dx + dy * dy;

        let targetX = initX;
        let targetY = initY;
        let targetZ = waveZ;

        if (distSq < maxInfluenceDistSq) {
          const dist = Math.sqrt(distSq);
          const force = (maxInfluenceDist - dist) / maxInfluenceDist;

          if (dist > 0.001) {
            const pushFactor = force * 0.6 / dist;
            targetX += dx * pushFactor;
            targetY += dy * pushFactor;
          }
          targetZ += force * 1.5;
        }

        const currX = positionsArray[i * 3];
        const currY = positionsArray[i * 3 + 1];
        const currZ = positionsArray[i * 3 + 2];

        positionsArray[i * 3] += (targetX - currX) * 0.12;
        positionsArray[i * 3 + 1] += (targetY - currY) * 0.12;
        positionsArray[i * 3 + 2] += (targetZ - currZ) * 0.12;
      }
      geometry.attributes.position.needsUpdate = true;

      // Subtle scene drift
      particles.rotation.z = Math.sin(elapsedTime * 0.05) * 0.04;

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
