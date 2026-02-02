"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Torus } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function Ring() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.getElapsedTime();
      meshRef.current.rotation.x = Math.cos(t / 4) / 2;
      meshRef.current.rotation.y = Math.sin(t / 4) / 2;
      meshRef.current.rotation.z = Math.sin(t / 1.5) / 2;
      meshRef.current.position.y = Math.sin(t / 1.5) / 10;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <Torus ref={meshRef} args={[3, 0.02, 64, 128]} rotation={[Math.PI / 2, 0, 0]}>
        <meshPhysicalMaterial
          color="#d4af37" // Gold/Rose Gold tint
          emissive="#000000"
          roughness={0.1}
          metalness={1}
          reflectivity={1}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </Torus>
       <Torus args={[2.5, 0.01, 64, 128]} rotation={[Math.PI / 3, 0, 0]}>
        <meshPhysicalMaterial
          color="#c0c0c0" // Silver
          roughness={0.1}
          metalness={1}
          clearcoat={1}
        />
      </Torus>
    </Float>
  );
}

export default function ContourRing3D() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-60">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={1} />
        <Ring />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
