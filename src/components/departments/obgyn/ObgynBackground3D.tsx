"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Torus, Plane, MeshTransmissionMaterial } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";

// Silk Wave Mesh
function SilkWave() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Create a custom geometry or modify a plane to look like a wave
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(10, 10, 64, 64);
    // Initial wave displacement could be done here, but useFrame is better for animation
    return geo;
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const { clock } = state;
    const t = clock.getElapsedTime() * 0.5;
    
    // Animate vertices for wave effect
    const positionAttribute = meshRef.current.geometry.attributes.position;
    for (let i = 0; i < positionAttribute.count; i++) {
      const x = positionAttribute.getX(i);
      const y = positionAttribute.getY(i);
      // Gentle sine waves
      const z = Math.sin(x * 0.5 + t) * 0.5 + Math.sin(y * 0.5 + t * 0.8) * 0.5;
      positionAttribute.setZ(i, z);
    }
    positionAttribute.needsUpdate = true;
    
    // Gentle rotation
    meshRef.current.rotation.z = Math.sin(t * 0.1) * 0.1;
  });

  return (
    <mesh ref={meshRef} geometry={geometry} position={[0, 0, -2]} rotation={[-Math.PI / 4, 0, 0]}>
      <meshPhysicalMaterial
        color="#e8d8e0" // Pale Pearl/Pinkish
        emissive="#2a1a2a" // Deep Plum emissive
        emissiveIntensity={0.2}
        roughness={0.2}
        metalness={0.6} // Silk sheen
        clearcoat={0.5}
        clearcoatRoughness={0.1}
        sheen={1}
        sheenColor={new THREE.Color("#ffddff")}
      />
    </mesh>
  );
}

// Soft Glass Halo
function GlassHalo() {
  const torusRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (torusRef.current) {
        const t = state.clock.getElapsedTime();
        torusRef.current.rotation.x = t * 0.1;
        torusRef.current.rotation.y = t * 0.05;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <Torus ref={torusRef} args={[3.5, 0.05, 64, 128]} position={[0, 0, 0]}>
         <MeshTransmissionMaterial
            backside
            backsideThickness={5}
            thickness={2}
            chromaticAberration={0.05}
            anisotropy={0.2}
            distortion={0.2}
            temporalDistortion={0.1}
            color="#ffffff"
            background={new THREE.Color("#1a101a")} // Dark Plum
            roughness={0.2}
            metalness={0.1}
            transmission={0.9}
        />
      </Torus>
    </Float>
  );
}

function Scene() {
  return (
    <>
      <color attach="background" args={["#1a101a"]} /> {/* Deep Plum/Charcoal */}
      
      <ambientLight intensity={0.3} color="#dec0de" />
      <spotLight position={[10, 10, 10]} angle={0.5} penumbra={1} intensity={1.5} color="#ffdcf5" />
      <pointLight position={[-10, -5, -5]} intensity={0.5} color="#a080a0" />

      <SilkWave />
      <GlassHalo />

      <Environment preset="city" />
    </>
  );
}

export default function ObgynBackground3D() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      {/* CSS Gradient Overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a101a] via-[#2d1f2d] to-[#1a101a] opacity-80 z-[1]" />
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }} className="z-[0]">
        <Scene />
      </Canvas>
      {/* Soft Film Grain */}
      <div className="absolute inset-0 z-[2] bg-[url('/images/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
    </div>
  );
}
