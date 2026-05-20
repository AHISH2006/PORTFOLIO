/* eslint-disable react/no-unknown-property */
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, extend, useFrame } from '@react-three/fiber';

import {
  Environment,
  Lightformer,
  RoundedBox,
  useTexture,
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
import meImg from '../../assets/ahish.png';

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
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  // Dark background
  ctx.fillStyle = '#050505';
  ctx.fillRect(0, 0, 512, 128);

  // Green diagonal stripes
  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 16;
  for (let i = -100; i < 600; i += 60) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + 80, 128);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/* ─────────────────────────────────────────────
   MAIN
───────────────────────────────────────────── */
export default function LanyardCard() {

  const [isMobile, setIsMobile] =
    useState(false);

  const [mounted, setMounted] =
    useState(false);

  /* ─────────────────────────────
     MOBILE CHECK
  ───────────────────────────── */
  useEffect(() => {

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();

    window.addEventListener(
      'resize',
      handleResize
    );

    return () => {
      window.removeEventListener(
        'resize',
        handleResize
      );
    };

  }, []);

  /* ─────────────────────────────
     CLIENT MOUNT CHECK
  ───────────────────────────── */
  useEffect(() => {
    setMounted(true);
  }, []);

  /* ─────────────────────────────
     PREVENT SSR / WEBGL ERRORS
  ───────────────────────────── */
  if (!mounted) return null;

  return (
    <div className="lanyard-wrapper">
      <div className="lanyard-bg-text">Drag It!</div>
      <Canvas
        dpr={1}
        shadows={false}
        frameloop="always"
        camera={{
          position: [0, 0, isMobile ? 18 : 13],
          fov: 28,
        }}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: 'high-performance',
          preserveDrawingBuffer: false,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <ambientLight intensity={1.4} />

        <Environment resolution={128}>
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
          timeStep={1 / 45}
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
  const bandLeft = useRef();
  const bandRight = useRef();

  const fixedLeft = useRef();
  const l1 = useRef();
  const l2 = useRef();

  const fixedRight = useRef();
  const r1 = useRef();
  const r2 = useRef();

  const j3 = useRef();
  const card = useRef();

  const [hovered, setHovered] = useState(false);
  const [dragged, setDragged] = useState(false);

  const texture = useMemo(() => createLanyardTexture(), []);
  const cardMap = useTexture(meImg);

  useEffect(() => {
    return () => {
      if (texture) texture.dispose();
    };
  }, [texture]);

  const curveLeft = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
    ]);
  }, []);

  const curveRight = useMemo(() => {
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
  // Left side joints
  useRopeJoint(fixedLeft, l1, [[0, 0, 0], [0, 0, 0], 0.6]);
  useRopeJoint(l1, l2, [[0, 0, 0], [0, 0, 0], 0.6]);
  useRopeJoint(l2, j3, [[0, 0, 0], [0, 0, 0], 0.6]);

  // Right side joints
  useRopeJoint(fixedRight, r1, [[0, 0, 0], [0, 0, 0], 0.6]);
  useRopeJoint(r1, r2, [[0, 0, 0], [0, 0, 0], 0.6]);
  useRopeJoint(r2, j3, [[0, 0, 0], [0, 0, 0], 0.6]);

  // Spherical joint to connect meeting point j3 to the card clip
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
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));

      card.current.setNextKinematicTranslation({
        x: vec.x,
        y: vec.y,
        z: vec.z,
      });
    }

    if (
      fixedLeft.current &&
      l1.current &&
      l2.current &&
      fixedRight.current &&
      r1.current &&
      r2.current &&
      j3.current
    ) {
      const pMeeting = j3.current.translation();
      
      // Prevent WebGL context loss from physics NaN explosion
      if (isNaN(pMeeting.x)) return;

      // Update Left Curve
      curveLeft.points[0].copy(pMeeting);
      curveLeft.points[1].copy(l2.current.translation());
      curveLeft.points[2].copy(l1.current.translation());
      curveLeft.points[3].copy(fixedLeft.current.translation());
      bandLeft.current.geometry.setPoints(curveLeft.getPoints(isMobile ? 18 : 32));

      // Update Right Curve
      curveRight.points[0].copy(pMeeting);
      curveRight.points[1].copy(r2.current.translation());
      curveRight.points[2].copy(r1.current.translation());
      curveRight.points[3].copy(fixedRight.current.translation());
      bandRight.current.geometry.setPoints(curveRight.getPoints(isMobile ? 18 : 32));
    }
  });

  return (
    <>
      <group position={[0, 2.2, 0]}>
        {/* Left Rope Rigid Bodies */}
        <RigidBody ref={fixedLeft} type="fixed" position={[-1.0, 0, 0]} />
        <RigidBody ref={l1} position={[-0.66, -0.4, 0]} colliders={false}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody ref={l2} position={[-0.33, -0.8, 0]} colliders={false}>
          <BallCollider args={[0.1]} />
        </RigidBody>

        {/* Right Rope Rigid Bodies */}
        <RigidBody ref={fixedRight} type="fixed" position={[1.0, 0, 0]} />
        <RigidBody ref={r1} position={[0.66, -0.4, 0]} colliders={false}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody ref={r2} position={[0.33, -0.8, 0]} colliders={false}>
          <BallCollider args={[0.1]} />
        </RigidBody>

        {/* Joint Meeting Node */}
        <RigidBody ref={j3} position={[0, -1.2, 0]} colliders={false}>
          <BallCollider args={[0.1]} />
        </RigidBody>

        {/* Card Body */}
        <RigidBody
          ref={card}
          position={[0, -2.65, 0]}
          type={dragged ? 'kinematicPosition' : 'dynamic'}
          colliders={false}
          angularDamping={4}
          linearDamping={3}
        >
          <CuboidCollider args={[0.8, 1.1, 0.02]} />

          <group
            scale={1.7}
            position={[0, -1.2, 0]}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            onPointerDown={(e) => {
              e.stopPropagation();
              setDragged(true);
            }}
            onPointerUp={(e) => {
              e.stopPropagation();
              setDragged(false);
            }}
          >
            {/* ID CARD IMAGE */}
            <mesh position={[0, 0, 0]}>
              <planeGeometry args={[1.5, 2.2]} />
              <meshBasicMaterial 
                map={cardMap}
                transparent={true}
                side={THREE.DoubleSide}
              />
            </mesh>

            {/* CLIP */}
            <mesh position={[0, 1.2, 0]}>
              <torusGeometry args={[0.08, 0.02, 16, 32]} />
              <meshStandardMaterial color="#111111" metalness={1} roughness={0.2} />
            </mesh>
          </group>
        </RigidBody>
      </group>

      {/* LEFT ROPE */}
      <mesh ref={bandLeft}>
        <meshLineGeometry />
        <meshLineMaterial
          useMap
          map={texture}
          transparent
          depthTest={false}
          lineWidth={1.5}
          resolution={new THREE.Vector2(window.innerWidth, window.innerHeight)}
          repeat={[-3, 1]}
        />
      </mesh>

      {/* RIGHT ROPE */}
      <mesh ref={bandRight}>
        <meshLineGeometry />
        <meshLineMaterial
          useMap
          map={texture}
          transparent
          depthTest={false}
          lineWidth={1.5}
          resolution={new THREE.Vector2(window.innerWidth, window.innerHeight)}
          repeat={[-3, 1]}
        />
      </mesh>
    </>
  );
}