/* eslint-disable react/no-unknown-property */
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, extend, useFrame } from '@react-three/fiber';

import {
  Environment,
  Lightformer,
  RoundedBox,
} from '@react-three/drei';

import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
} from '@react-three/rapier';

import { MeshLineGeometry, MeshLineMaterial } from 'meshline';

import * as THREE from 'three';

import '../../styles/LanyardCard.css';

extend({
  MeshLineGeometry,
  MeshLineMaterial,
});

/* ─────────────────────────────────────────────
   CREATE TEXTURE
───────────────────────────────────────────── */
function createLanyardTexture() {
  const canvas = document.createElement('canvas');

  canvas.width = 512;
  canvas.height = 64;

  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#050505';
  ctx.fillRect(0, 0, 512, 64);

  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 8;

  for (let i = -100; i < 600; i += 40) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + 40, 64);
    ctx.stroke();
  }

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 22px Arial';

  for (let i = 0; i < 512; i += 120) {
    ctx.fillText('AHISH', i, 42);
  }

  const texture = new THREE.CanvasTexture(canvas);
  

  texture.wrapS = texture.wrapT =
    THREE.RepeatWrapping;

  return texture;
}

/* ─────────────────────────────────────────────
   MAIN
───────────────────────────────────────────── */
export default function LanyardCard() {
  const [isMobile, setIsMobile] =
    useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();

    window.addEventListener(
      'resize',
      handleResize
    );

    return () =>
      window.removeEventListener(
        'resize',
        handleResize
      );
  }, []);

  return (
    <div className="lanyard-wrapper">
      <Canvas
        dpr={[1, isMobile ? 1.5 : 2]}
        camera={{
          position: [0, 0, 13],
          fov: 28,
        }}
gl={{
  antialias: true,
  alpha: true,
  powerPreference: 'high-performance',
  preserveDrawingBuffer: false,
}}
      >
        <ambientLight intensity={1.4} />

        <Environment blur={0.8}>
          <Lightformer
            intensity={4}
            position={[0, 5, 5]}
            scale={[10, 10, 1]}
          />

          <Lightformer
            intensity={3}
            position={[-5, 0, 5]}
            scale={[20, 1, 1]}
          />

          <Lightformer
            intensity={3}
            position={[5, 0, 5]}
            scale={[20, 1, 1]}
          />
        </Environment>

        <Physics
          gravity={[0, -35, 0]}
          timeStep={1 / 60}
        >
          <Band isMobile={isMobile} />
        </Physics>
        <directionalLight
  position={[0, 5, 5]}
  intensity={2}
/>
<ambientLight intensity={1.5} />
      </Canvas>
    </div>
  );
}

/* ─────────────────────────────────────────────
   BAND
───────────────────────────────────────────── */
function Band({ isMobile }) {
  const band = useRef();

  const fixed = useRef();
  const j1 = useRef();
  const j2 = useRef();
  const j3 = useRef();

  const card = useRef();

  const [hovered, setHovered] =
    useState(false);

  const [dragged, setDragged] =
    useState(false);

  const texture = useMemo(
    () => createLanyardTexture(),
    []
  );

  useEffect(() => {
    return () => {
      if (texture) texture.dispose();
    };
  }, [texture]);

  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
    ]);
  }, []);

  const vec = new THREE.Vector3();
  const dir = new THREE.Vector3();

  /* JOINTS */
  useRopeJoint(
    fixed,
    j1,
    [[0, 0, 0], [0, 0, 0], 1]
  );

  useRopeJoint(
    j1,
    j2,
    [[0, 0, 0], [0, 0, 0], 1]
  );

  useRopeJoint(
    j2,
    j3,
    [[0, 0, 0], [0, 0, 0], 1]
  );

  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 1.45, 0],
  ]);

  /* CURSOR */
  useEffect(() => {
    document.body.style.cursor = hovered
      ? dragged
        ? 'grabbing'
        : 'grab'
      : 'auto';

    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [hovered, dragged]);

  /* FRAME */
  useFrame((state) => {
    if (dragged && card.current) {
      vec.set(
        state.pointer.x,
        state.pointer.y,
        0.5
      ).unproject(state.camera);

      dir
        .copy(vec)
        .sub(state.camera.position)
        .normalize();

      vec.add(
        dir.multiplyScalar(
          state.camera.position.length()
        )
      );

      card.current.setNextKinematicTranslation({
        x: vec.x,
        y: vec.y,
        z: vec.z,
      });
    }

    if (
      fixed.current &&
      j1.current &&
      j2.current &&
      j3.current
    ) {
      const p3 = j3.current.translation();
      
      // Prevent WebGL context loss from physics NaN explosion
      if (isNaN(p3.x)) return;

      curve.points[0].copy(p3);

      curve.points[1].copy(
        j2.current.translation()
      );

      curve.points[2].copy(
        j1.current.translation()
      );

      curve.points[3].copy(
        fixed.current.translation()
      );

      band.current.geometry.setPoints(
        curve.getPoints(isMobile ? 18 : 32)
      );
    }
  });

  return (
    <>
      <group position={[0, 2.2, 0]}>
        <RigidBody
          ref={fixed}
          type="fixed"
        />

        <RigidBody
          ref={j1}
          position={[0.5, 0, 0]}
          colliders={false}
        >
          <BallCollider args={[0.1]} />
        </RigidBody>

        <RigidBody
          ref={j2}
          position={[1, 0, 0]}
          colliders={false}
        >
          <BallCollider args={[0.1]} />
        </RigidBody>

        <RigidBody
          ref={j3}
          position={[1.5, 0, 0]}
          colliders={false}
        >
          <BallCollider args={[0.1]} />
        </RigidBody>

        <RigidBody
          ref={card}
          position={[1.5, -1.45, 0]}
          type={
            dragged
              ? 'kinematicPosition'
              : 'dynamic'
          }
          colliders={false}
          angularDamping={4}
          linearDamping={3}
        >
          <CuboidCollider
            args={[0.8, 1.1, 0.02]}
          />

          <group
            scale={1.7}
            position={[0, -1.2, 0]}
            onPointerOver={() =>
              setHovered(true)
            }
            onPointerOut={() =>
              setHovered(false)
            }
            onPointerDown={(e) => {
              e.stopPropagation();
              setDragged(true);
            }}
            onPointerUp={(e) => {
              e.stopPropagation();
              setDragged(false);
            }}
          >
            {/* CARD */}
            <RoundedBox
              args={[1.5, 2.2, 0.03]}
              radius={0.08}
              smoothness={6}
            >
              <meshPhysicalMaterial
                color="#050505"
                roughness={0.4}
                metalness={0.7}
                clearcoat={1}
              />
            </RoundedBox>

            {/* INNER */}
            <mesh position={[0, 0, 0.018]}>
              <planeGeometry
                args={[1.35, 2]}
              />

              <meshBasicMaterial
                color="#0f172a"
              />
            </mesh>

            {/* TOP BAR */}
            <mesh position={[0, 0.78, 0.02]}>
              <planeGeometry
                args={[1.35, 0.25]}
              />

              <meshBasicMaterial
                color="#22c55e"
              />
            </mesh>

            {/* PHOTO */}
            <mesh position={[0, 0.05, 0.02]}>
              <planeGeometry
                args={[1.1, 1.1]}
              />

              <meshBasicMaterial
                color="#1e293b"
              />
            </mesh>

            {/* TAGS */}
            {[-0.38, 0, 0.38].map(
              (x, index) => (
                <mesh
                  key={index}
                  position={[x, -0.75, 0.02]}
                >
                  <planeGeometry
                    args={[0.35, 0.12]}
                  />

                  <meshBasicMaterial
                    color="#22c55e"
                  />
                </mesh>
              )
            )}

            {/* CLIP */}
            <mesh position={[0, 1.15, 0]}>
              <torusGeometry
                args={[0.08, 0.015, 16, 32]}
              />

              <meshStandardMaterial
                color="#9ca3af"
                metalness={1}
                roughness={0.2}
              />
            </mesh>
          </group>
        </RigidBody>
      </group>

      {/* ROPE */}
      <mesh ref={band}>
        <meshLineGeometry />

        <meshLineMaterial
          useMap
          map={texture}
          transparent
          depthTest={false}
          lineWidth={0.45}
          resolution={[window.innerWidth, window.innerHeight]}
          repeat={[-3, 1]}
        />
      </mesh>
    </>
  );
}