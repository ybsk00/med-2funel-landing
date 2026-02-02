"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, RoundedBox, Cylinder, MeshTransmissionMaterial } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

// Sanctuary Glass Panel
function SanctuaryPanel({ position, scale, rotation, color }: any) {
  return (
    <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
      <RoundedBox args={[1, 1, 0.1]} radius={0.1} smoothness={4} scale={scale} position={position} rotation={rotation}>
        <MeshTransmissionMaterial
            backside
            backsideThickness={2}
            thickness={1}
            chromaticAberration={0.02}
            anisotropy={0.1}
            distortion={0.1}
            temporalDistortion={0.1}
            color={color}
            background={new THREE.Color("#1a1a1a")}
            roughness={0.15}
            metalness={0.1}
            transmission={0.9}
            clearcoat={1}
        />
      </RoundedBox>
    </Float>
  );
}

// Warm Light Pillar
function LightPillar({ position, scale, color }: any) {
    const meshRef = useRef<THREE.Mesh>(null);
    
    useFrame((state) => {
        if (!meshRef.current) return;
        const t = state.clock.getElapsedTime();
        // Subtle breathing effect
        meshRef.current.scale.y = scale[1] + Math.sin(t * 0.5) * 0.2;
    });

    return (
        <group position={position}>
            <Cylinder args={[0.5, 0.5, 10, 32]} ref={meshRef} scale={scale}>
                 <meshBasicMaterial 
                    color={color} 
                    transparent 
                    opacity={0.1} 
                    blending={THREE.AdditiveBlending}
                    side={THREE.DoubleSide}
                    depthWrite={false}
                 />
            </Cylinder>
             {/* Inner core for more intensity */}
             <Cylinder args={[0.2, 0.2, 10, 32]} scale={scale}>
                 <meshBasicMaterial 
                    color={color} 
                    transparent 
                    opacity={0.2} 
                    blending={THREE.AdditiveBlending}
                    side={THREE.DoubleSide}
                    depthWrite={false}
                 />
            </Cylinder>
        </group>
    );
}

function Scene() {
  return (
    <>
      <color attach="background" args={["#1a1a1a"]} /> {/* Dark Charcoal */}
      
      <ambientLight intensity={0.4} color="#ffdcb4" /> {/* Warm Ambient */}
      <spotLight position={[10, 10, 10]} angle={0.5} penumbra={1} intensity={1} color="#ffecd1" />
      <pointLight position={[-10, 5, -10]} intensity={0.5} color="#d4af37" />

      {/* Layered Sanctuary Panels */}
      <group position={[0, 0, 0]}>
          <SanctuaryPanel 
            position={[0, 0, 0]} 
            scale={[4, 5, 1]} 
            rotation={[0, 0, 0]} 
            color="#ffffff" 
          />
          <SanctuaryPanel 
            position={[-2.5, -1, -1]} 
            scale={[3, 4, 1]} 
            rotation={[0, 0.2, -0.1]} 
            color="#fff0e0" // Slight Warmth
          />
           <SanctuaryPanel 
            position={[2.5, 1, -2]} 
            scale={[3.5, 4.5, 1]} 
            rotation={[0, -0.2, 0.1]} 
            color="#fff0e0" 
          />
      </group>

      {/* Soft Light Pillars - Background */}
      <group position={[0, 0, -4]}>
          <LightPillar position={[-4, 0, 0]} scale={[1, 1, 1]} color="#ffaa55" /> {/* Amber */}
          <LightPillar position={[4, 0, 0]} scale={[1.2, 1.2, 1]} color="#ffaa55" />
          <LightPillar position={[0, 0, -2]} scale={[2, 1.5, 1]} color="#d4af37" /> {/* Gold */}
      </group>

      <Environment preset="city" />
    </>
  );
}

export default function OncologyBackground3D() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      {/* Gradient Overlay for Readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a] via-[#262626] to-[#1a1a1a] opacity-80 z-[1]" />
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }} className="z-[0]">
        <Scene />
      </Canvas>
       {/* Soft Grain */}
      <div className="absolute inset-0 z-[2] bg-[url('/images/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
    </div>
  );
}
