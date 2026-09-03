import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const HeroCanvas3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const container = containerRef.current;
    let width = container.clientWidth;
    let height = container.clientHeight;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 9);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create a group to hold all objects for unified rotation
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Particle nodes for the sphere
    const particlesCount = 280;
    const positions = new Float32Array(particlesCount * 3);
    const originalPositions = new Float32Array(particlesCount * 3);
    const particleSpeeds = new Float32Array(particlesCount);

    const radius = 2.8;

    for (let i = 0; i < particlesCount; i++) {
      // Uniform distribution on a sphere surface
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      originalPositions[i * 3] = x;
      originalPositions[i * 3 + 1] = y;
      originalPositions[i * 3 + 2] = z;

      particleSpeeds[i] = 0.5 + Math.random() * 0.5;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Circular particle texture
    const createParticleTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.25, 'rgba(56, 189, 248, 0.95)');
        gradient.addColorStop(0.65, 'rgba(129, 140, 248, 0.45)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 32, 32);
      }
      return new THREE.CanvasTexture(canvas);
    };

    const material = new THREE.PointsMaterial({
      size: 0.14,
      transparent: true,
      opacity: 0.9,
      map: createParticleTexture(),
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const pointCloud = new THREE.Points(geometry, material);
    globeGroup.add(pointCloud);

    // Dynamic Line Connections (Neural Net)
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x38bdf8, // Electric Sky Cyan Accent
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
    });

    const maxLines = 1000;
    const linePositions = new Float32Array(maxLines * 2 * 3);
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const lineSegments = new THREE.LineSegments(lineGeometry, lineMaterial);
    globeGroup.add(lineSegments);

    let lineFrameCount = 0;
    const updateLines = () => {
      lineFrameCount++;
      if (lineFrameCount % 2 !== 0) return;

      const posArray = geometry.attributes.position.array as Float32Array;
      const linePosAttr = lineGeometry.attributes.position;
      const lineArray = linePosAttr.array as Float32Array;
      let vertexCount = 0;
      
      const thresholdSq = 1.4 * 1.4;

      // Find pairs close to each other
      for (let i = 0; i < particlesCount; i++) {
        const x1 = posArray[i * 3];
        const y1 = posArray[i * 3 + 1];
        const z1 = posArray[i * 3 + 2];

        // Check subset of points
        for (let j = i + 1; j < particlesCount; j++) {
          if (j % 4 !== 0) continue;
          if (vertexCount / 2 >= maxLines) break;

          const x2 = posArray[j * 3];
          const y2 = posArray[j * 3 + 1];
          const z2 = posArray[j * 3 + 2];

          const dx = x1 - x2;
          const dy = y1 - y2;
          const dz = z1 - z2;
          const distSq = dx * dx + dy * dy + dz * dz;

          if (distSq < thresholdSq) {
            const idx = vertexCount * 3;
            lineArray[idx] = x1;
            lineArray[idx + 1] = y1;
            lineArray[idx + 2] = z1;
            lineArray[idx + 3] = x2;
            lineArray[idx + 4] = y2;
            lineArray[idx + 5] = z2;
            vertexCount += 2;
          }
        }
        if (vertexCount / 2 >= maxLines) break;
      }

      lineGeometry.setDrawRange(0, vertexCount);
      linePosAttr.needsUpdate = true;
    };

    // Orbit Rings
    const ringGroup = new THREE.Group();
    globeGroup.add(ringGroup);

    // Inner glowing sphere core
    const coreGeom = new THREE.SphereGeometry(0.5, 16, 16);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
    });
    const core = new THREE.Mesh(coreGeom, coreMat);
    globeGroup.add(core);

    // Orbit 1: Diagonal
    const ringGeom1 = new THREE.RingGeometry(3.1, 3.12, 64);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
    });
    const ring1 = new THREE.Mesh(ringGeom1, ringMat1);
    ring1.rotation.x = Math.PI / 4;
    ring1.rotation.y = Math.PI / 4;
    ringGroup.add(ring1);

    // Orbit 2: Horizontal
    const ringGeom2 = new THREE.RingGeometry(3.3, 3.32, 64);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x818cf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.2,
      blending: THREE.AdditiveBlending,
    });
    const ring2 = new THREE.Mesh(ringGeom2, ringMat2);
    ring2.rotation.x = Math.PI / 2;
    ringGroup.add(ring2);

    // Mouse movement tracking (for auto tilt towards mouse)
    const mouse = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };

    const onMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      mouse.x = (x / width) * 2 - 1;
      mouse.y = -(y / height) * 2 + 1;
    };

    window.addEventListener('mousemove', onMouseMove);

    // Mouse dragging rotation mechanics
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    const dragRotation = { x: 0, y: 0 };

    const onMouseDown = (event: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: event.clientX, y: event.clientY };
    };

    const onMouseMoveDrag = (event: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = event.clientX - previousMousePosition.x;
      const deltaY = event.clientY - previousMousePosition.y;

      dragRotation.y += deltaX * 0.005;
      dragRotation.x += deltaY * 0.005;

      previousMousePosition = { x: event.clientX, y: event.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMoveDrag);
    window.addEventListener('mouseup', onMouseUp);

    // Shockwave click effect
    let shockwaveIntensity = 0;
    const onClick = () => {
      shockwaveIntensity = 1.0;
    };
    container.addEventListener('click', onClick);

    const handleResize = () => {
      if (!containerRef.current) return;
      width = containerRef.current.clientWidth;
      height = containerRef.current.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop with Visibility Caching
    const timer = new THREE.Clock();
    let animationId: number = 0;
    let isHeroVisible = true;

    const animate = () => {
      if (!isHeroVisible) {
        animationId = 0;
        return;
      }

      const elapsedTime = timer.getElapsedTime();

      // Smooth auto tilt towards the cursor
      target.x += (mouse.x * 0.6 - target.x) * 0.05;
      target.y += (mouse.y * 0.6 - target.y) * 0.05;

      // Base automatic rotation
      const baseRotationY = elapsedTime * 0.1;
      const baseRotationX = Math.sin(elapsedTime * 0.25) * 0.08;

      // Combine dragging, auto-tilt, and default auto-rotation
      globeGroup.rotation.y = baseRotationY + dragRotation.y + target.x;
      globeGroup.rotation.x = baseRotationX + dragRotation.x + target.y;

      // Spin rings in opposite directions
      ring1.rotation.z = -elapsedTime * 0.2;
      ring2.rotation.z = elapsedTime * 0.15;

      // Dynamic core scaling / pulse
      const coreScale = 1.0 + Math.sin(elapsedTime * 3) * 0.08;
      core.scale.set(coreScale, coreScale, coreScale);

      // Handle particle offsets (normal orbital sway + shockwave expansions)
      const posArray = geometry.attributes.position.array as Float32Array;

      for (let i = 0; i < particlesCount; i++) {
        const ix = i * 3;
        const iy = i * 3 + 1;
        const iz = i * 3 + 2;

        const origX = originalPositions[ix];
        const origY = originalPositions[iy];
        const origZ = originalPositions[iz];

        // Natural micro-oscillations/sway based on elapsed time
        const offsetSpeed = particleSpeeds[i];
        const offsetRange = 0.05;
        const swayX = Math.sin(elapsedTime * offsetSpeed + origY) * offsetRange;
        const swayY = Math.cos(elapsedTime * offsetSpeed + origX) * offsetRange;
        const swayZ = Math.sin(elapsedTime * offsetSpeed + origZ) * offsetRange;

        // Current target position (swayed)
        let targetX = origX + swayX;
        let targetY = origY + swayY;
        let targetZ = origZ + swayZ;

        // Shockwave displacement: push particles outward from center
        if (shockwaveIntensity > 0.01) {
          const dirX = origX;
          const dirY = origY;
          const dirZ = origZ;
          const dist = Math.sqrt(dirX*dirX + dirY*dirY + dirZ*dirZ);
          
          if (dist > 0.01) {
            const pushFactor = (shockwaveIntensity * 1.2) / dist;
            targetX += dirX * pushFactor;
            targetY += dirY * pushFactor;
            targetZ += dirZ * pushFactor;
          }
        }

        // Lerp position array to target
        posArray[ix] += (targetX - posArray[ix]) * 0.1;
        posArray[iy] += (targetY - posArray[iy]) * 0.1;
        posArray[iz] += (targetZ - posArray[iz]) * 0.1;
      }

      geometry.attributes.position.needsUpdate = true;
      updateLines();

      // Fade out shockwave over time
      if (shockwaveIntensity > 0) {
        shockwaveIntensity *= 0.94;
      }

      // Drag inertia decay: slowly halt dragging rotation if user lets go
      if (!isDragging) {
        dragRotation.x *= 0.98;
        dragRotation.y *= 0.98;
      }

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isHeroVisible = entry.isIntersecting;
        if (isHeroVisible && !animationId) {
          animationId = requestAnimationFrame(animate);
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    animationId = requestAnimationFrame(animate);

    return () => {
      observer.disconnect();
      if (animationId) cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMoveDrag);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('click', onClick);
      window.removeEventListener('resize', handleResize);

      geometry.dispose();
      material.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      ringGeom1.dispose();
      ringMat1.dispose();
      ringGeom2.dispose();
      ringMat2.dispose();
      coreGeom.dispose();
      coreMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full select-none max-w-full max-h-full block"
      />
    </div>
  );
};
