"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox, Float, Environment, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

// 1. Soft Plastic Block (Rounded)
function SoftBlock({ position, color, scale, rotation, speed }: any) {
    const mesh = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (!mesh.current) return;
        const t = state.clock.getElapsedTime();
        mesh.current.rotation.x = Math.sin(t * speed * 0.5) * 0.1 + rotation[0];
        mesh.current.rotation.y = Math.cos(t * speed * 0.3) * 0.1 + rotation[1];
        mesh.current.position.y = position[1] + Math.sin(t * speed) * 0.2;
    });

    return (
        <Float speed={speed} rotationIntensity={0.5} floatIntensity={0.5}>
            <RoundedBox args={[1, 1, 1]} radius={0.3} smoothness={4} scale={scale} position={position} ref={mesh}>
                <meshStandardMaterial
                    color={color}
                    roughness={0.4}
                    metalness={0.1}
                />
            </RoundedBox>
        </Float>
    );
}

// 2. Rounded Glass Panel (Layered Depth)
function GlassPanel({ position, scale, rotation }: any) {
    return (
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.2}>
            <RoundedBox args={[1, 1, 0.1]} radius={0.1} smoothness={4} scale={scale} position={position} rotation={rotation}>
                <MeshTransmissionMaterial
                    backside
                    samples={16}
                    thickness={0.5}
                    chromaticAberration={0.05}
                    anisotropy={0.1}
                    distortion={0.1}
                    distortionScale={0.1}
                    temporalDistortion={0.1}
                    clearcoat={1}
                    attenuationDistance={0.5}
                    attenuationColor="#ffffff"
                    color="#e0f2fe" // Light Blue tint
                />
            </RoundedBox>
        </Float>
    );
}

function Scene() {
    return (
        <>
            <ambientLight intensity={0.7} color="#ffffff" />
            <spotLight position={[10, 10, 10]} angle={0.5} penumbra={1} intensity={1} color="#ffffff" />
            <pointLight position={[-10, -5, -5]} intensity={0.5} color="#38bdf8" />

            {/* Background Color: Deep Teal / Warm Gray */}
            <color attach="background" args={["#1e293b"]} /> 
            <fog attach="fog" args={["#1e293b", 5, 20]} />

            {/* Objects Group positioned to the right */}
            <group position={[2, 0, 0]} rotation={[0, -0.2, 0]}>
                {/* 1. Main Soft Block (Mint) */}
                <SoftBlock 
                    position={[0, 0.5, 0]} 
                    color="#5eead4" // Soft Mint
                    scale={[1.8, 1.8, 1.8]} 
                    rotation={[0.2, 0.2, 0]} 
                    speed={0.8} 
                />

                {/* 2. Secondary Block (Soft Sky) - Behind */}
                <SoftBlock 
                    position={[-1.5, -1, -2]} 
                    color="#7dd3fc" // Soft Sky
                    scale={[1.2, 1.2, 1.2]} 
                    rotation={[-0.2, 0, 0.2]} 
                    speed={0.6} 
                />

                {/* 3. Glass Panel - Layering */}
                <GlassPanel 
                    position={[1, -0.5, 1]} 
                    scale={[2.5, 1.5, 1]} 
                    rotation={[0, 0, 0.1]} 
                />
                 <GlassPanel 
                    position={[-1, 1, -1]} 
                    scale={[2, 2, 1]} 
                    rotation={[0.1, 0, -0.1]} 
                />
            </group>

            <Environment preset="city" />
        </>
    );
}

export default function PediatricsBlockBackground() {
    return (
        <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
            <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
                <Scene />
            </Canvas>
        </div>
    );
}
