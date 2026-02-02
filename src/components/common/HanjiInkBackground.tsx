"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Cloud, Environment, Float, Stars } from "@react-three/drei";
import * as THREE from "three";

// 1. Hanji Paper Layer Component
function PaperLayer({ z, color, speed, scale, opacity }: { z: number; color: string; speed: number; scale: number; opacity: number }) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!mesh.current) return;
    // Gentle floating movement
    const t = state.clock.getElapsedTime();
    mesh.current.position.y = Math.sin(t * speed) * 0.2;
    mesh.current.rotation.z = Math.cos(t * speed * 0.5) * 0.02;
  });

  return (
    <mesh ref={mesh} position={[0, 0, z]} scale={scale}>
      <planeGeometry args={[20, 15, 64, 64]} />
      <meshPhysicalMaterial
        color={color}
        roughness={0.8}
        metalness={0.1}
        transmission={0.4} // Glass-like/Paper-like transparency
        thickness={0.5}
        clearcoat={0.1}
        side={THREE.DoubleSide}
        transparent
        opacity={opacity}
      />
    </mesh>
  );
}

// 2. Ink Curve (Abstract)
function InkCurve({ color, speed, z }: { color: string; speed: number; z: number }) {
    const mesh = useRef<THREE.Mesh>(null);
    
    useFrame((state) => {
        if (!mesh.current) return;
        const t = state.clock.getElapsedTime();
        mesh.current.position.x = Math.sin(t * speed) * 0.5;
        mesh.current.scale.y = 1 + Math.sin(t * speed * 1.5) * 0.2;
    });

    return (
        <mesh ref={mesh} position={[0, -2, z]} rotation={[0, 0, -Math.PI / 6]}>
            <planeGeometry args={[25, 2, 32, 32]} />
            <meshBasicMaterial color={color} transparent opacity={0.6} side={THREE.DoubleSide}>
                 {/* Simple gradient shader logic could go here, but basic material works for abstract vibe */}
            </meshBasicMaterial>
        </mesh>
    )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} color="#fffcf0" />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} color="#fff7e0" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#e6d5b8" />

      {/* Deep Background */}
      <color attach="background" args={["#2c241b"]} /> {/* Deep Brown/Charcoal */}
      
      {/* Fog for depth */}
      <fog attach="fog" args={["#2c241b", 5, 20]} />

      {/* Layer 1: Deep Ink-like Wave (Back) */}
      <InkCurve z={-3} color="#1a1410" speed={0.2} />

      {/* Layer 2: Back Paper (Darker) */}
      <PaperLayer z={-2} color="#5c4d3c" speed={0.3} scale={1.2} opacity={0.9} />

      {/* Layer 3: Mid Paper (Warm Beige) */}
      <PaperLayer z={-1} color="#8c7b64" speed={0.4} scale={1.1} opacity={0.8} />

      {/* Layer 4: Front Paper (Light Hanji) */}
      <PaperLayer z={0} color="#e8dfd1" speed={0.5} scale={1} opacity={0.6} />
      
       {/* Layer 5: Subtle Ink Flow (Front) */}
       <InkCurve z={0.1} color="#3e3025" speed={0.1} />

       {/* Particles/Dust for atmosphere */}
      <Stars radius={100} depth={50} count={200} factor={4} saturation={0} fade speed={1} />
    </>
  );
}

export default function HanjiInkBackground() {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <Scene />
      </Canvas>
    </div>
  );
}
