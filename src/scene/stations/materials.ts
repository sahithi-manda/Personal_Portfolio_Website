import { useMemo } from 'react';
import * as THREE from 'three';
import { ACCENT } from '../palette';

/* Shared materials ------------------------------------------------------- */

export function useMaterials() {
  return useMemo(
    () => ({
      chrome: new THREE.MeshPhysicalMaterial({ color: '#c3c9cf', metalness: 1, roughness: 0.16, clearcoat: 1 }),
      graphite: new THREE.MeshPhysicalMaterial({ color: '#16191d', metalness: 0.9, roughness: 0.3, clearcoat: 0.6 }),
      glass: new THREE.MeshPhysicalMaterial({
        color: '#d9e3ec',
        roughness: 0.05,
        transmission: 1,
        thickness: 0.25,
        ior: 1.5,
        clearcoat: 1,
        envMapIntensity: 1.6,
      }),
      paper: new THREE.MeshPhysicalMaterial({ color: '#d7dbdf', roughness: 0.7, metalness: 0, clearcoat: 0.2 }),
      glow: new THREE.MeshBasicMaterial({ color: new THREE.Color(ACCENT).multiplyScalar(2.2), toneMapped: false }),
      glowSoft: new THREE.MeshBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.18, toneMapped: false, depthWrite: false }),
      ink: new THREE.MeshBasicMaterial({ color: '#2a2f35' }),
    }),
    [],
  );
}
export type Mats = ReturnType<typeof useMaterials>;

