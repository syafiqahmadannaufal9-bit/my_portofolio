import React, { useRef, useEffect, Suspense, useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, Environment, Html, useProgress } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

// ─── WebGL Support Check ───────────────────────────────────────────────────────
function checkWebGLSupport() {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl') || canvas.getContext('webgl2'))
    );
  } catch {
    return false;
  }
}

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center p-4 rounded-xl border backdrop-blur-md shadow-lg w-48 bg-white/90 border-black text-black">
        <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin mb-2 border-black" />
        <p className="text-xs font-bold tracking-widest uppercase">Memuat Model 3D</p>
        <p className="text-[10px] opacity-75 mt-1">{progress.toFixed(0)}% Selesai</p>
      </div>
    </Html>
  );
}

function PorscheModel() {
  const { scene } = useGLTF('/models/2019_porsche_911_991.2_gt3_rs.glb');
  const groupRef = useRef();

  // Normalize model size and compute shadow parameters
  const { normalizeScale, normalizedPosition, shadowY, shadowW, shadowD } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    
    const scale = maxDim > 0 ? 1 / maxDim : 1;
    const center = box.getCenter(new THREE.Vector3());
    const position = center.multiplyScalar(-scale).toArray();

    // Position shadow plane exactly at the bottom of the bounding box
    const shadowY = -(size.y * scale) / 2 - 0.005;
    // Tighten the shadow dimensions to closely match the car's physical footprint
    const shadowW = (size.x / maxDim) * 1.25;
    const shadowD = (size.z / maxDim) * 1.25;

    return { normalizeScale: scale, normalizedPosition: position, shadowY, shadowW, shadowD };
  }, [scene]);

  // ponytail: fixed light-mode black blob shadow
  const shadowTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    gradient.addColorStop(0, 'rgba(0,0,0,0.95)');
    gradient.addColorStop(0.3, 'rgba(0,0,0,0.7)');
    gradient.addColorStop(0.7, 'rgba(0,0,0,0.2)');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(canvas);
  }, []);

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        child.castShadow = false;
        child.receiveShadow = false;
        child.material.envMapIntensity = 4.5;
        if (child.material.roughness !== undefined) child.material.roughness = Math.min(child.material.roughness, 0.04);
        if (child.material.metalness !== undefined) child.material.metalness = Math.max(child.material.metalness, 0.45);
        if ('clearcoat' in child.material) { child.material.clearcoat = 1.0; child.material.clearcoatRoughness = 0.02; }
        child.material.needsUpdate = true;
      }
    });
  }, [scene]);

  // ponytail: Minimal direct GSAP integration. Removed overengineered frame syncs.
  // We rely on native GSAP scrub smoothing (scrub: 1.5).
  useEffect(() => {
    if (!groupRef.current) return;
    let mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      gsap.set(groupRef.current.position, { x: 2.8, y: -0.2, z: 0 });
      gsap.set(groupRef.current.rotation, { x: 0.05, y: Math.PI * -0.35, z: 0 });
      gsap.set(groupRef.current.scale, { x: 7.5, y: 7.5, z: 7.5 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '#main-scroll-container',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.5,
          invalidateOnRefresh: true,
        }
      });

      // ponytail: direct transition to center after skills (experience removed)
      tl.to(groupRef.current.position, { x: -3.2, y: 0, ease: 'power1.inOut' }, 0)
        .to(groupRef.current.rotation, { y: Math.PI * 0.2, x: 0.05, ease: 'power1.inOut' }, 0)
        .to(groupRef.current.scale, { x: 6.5, y: 6.5, z: 6.5, ease: 'power1.inOut' }, 0);

      tl.to(groupRef.current.position, { x: 2.8, y: -0.1, ease: 'power1.inOut' }, 1)
        .to(groupRef.current.rotation, { y: Math.PI * 0.80, x: 0.15, ease: 'power1.inOut' }, 1)
        .to(groupRef.current.scale, { x: 7.5, y: 7.5, z: 7.5, ease: 'power1.inOut' }, 1);

      tl.to(groupRef.current.position, { x: 0, y: -0.2, ease: 'power1.inOut' }, 2)
        .to(groupRef.current.rotation, { y: Math.PI * 2.2, x: 0.05, ease: 'power1.inOut' }, 2)
        .to(groupRef.current.scale, { x: 5.5, y: 5.5, z: 5.5, ease: 'power1.inOut' }, 2);

      tl.to(groupRef.current.position, { y: -2.5, ease: 'power1.inOut' }, 3);
    });

    mm.add('(max-width: 767px)', () => {
      gsap.set(groupRef.current.position, { x: 0, y: -0.5, z: 0 });
      gsap.set(groupRef.current.rotation, { x: 0.1, y: Math.PI * -0.2, z: 0 });
      gsap.set(groupRef.current.scale, { x: 7.2, y: 7.2, z: 7.2 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '#main-scroll-container',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        }
      });

      tl.to(groupRef.current.rotation, { y: Math.PI * 4, ease: 'none' }, 0)
        .to(groupRef.current.position, { y: 0.5, ease: 'none' }, 0);
    });

    return () => mm.revert();
  }, []);

  return (
    <group ref={groupRef}>
      <primitive object={scene} scale={normalizeScale} position={normalizedPosition} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, shadowY + 0.005, 0]} renderOrder={-1}>
        <planeGeometry args={[shadowW, shadowD]} />
        <meshBasicMaterial map={shadowTexture} transparent opacity={0.85} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

try {
  useGLTF.preload('/models/2019_porsche_911_991.2_gt3_rs.glb');
} catch (e) {
  console.warn('Preload model failed:', e);
}

export default function CarScene() {
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    if (!checkWebGLSupport()) {
      setHasWebGL(false);
    }
    // Refresh ScrollTrigger to recalculate layout dimensions safely after initial render
    ScrollTrigger.refresh();
  }, []);

  if (!hasWebGL) {
    return (
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-amber-500/90 text-black font-semibold text-xs px-4 py-2 rounded-full shadow-lg backdrop-blur-md pointer-events-auto border border-amber-300">
        ⚠️ WebGL dinonaktifkan / tidak didukung di browser ini. Aktifkan Hardware Acceleration pada pengaturan browser.
      </div>
    );
  }

  return (
    <div className="fixed inset-0 w-full h-full z-0 pointer-events-none will-change-transform transform-gpu">
      <Canvas
        // ponytail: Restored high quality dpr, antialias, and precision.
        dpr={[1, 1.5]}
        camera={{ position: [0, 0.5, 6], fov: 65 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          precision: 'mediump',
          stencil: false,
          failIfMajorPerformanceCaveat: false,
        }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener('webglcontextlost', (event) => {
            event.preventDefault();
            console.warn('WebGL context lost.');
          });
        }}
      >
        <ambientLight intensity={1.4} />
        <directionalLight position={[5, 10, 5]} intensity={3.8} castShadow={false} />
        <directionalLight position={[-6, 6, -4]} intensity={2.2} />
        <spotLight position={[0, 12, 6]} intensity={3.0} angle={0.6} penumbra={0.4} />

        <Environment preset="city" />

        <Suspense fallback={<Loader />}>
          <PorscheModel />
        </Suspense>
      </Canvas>
    </div>
  );
}
