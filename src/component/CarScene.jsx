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

  // ponytail: Categorize model components and cache original positions for exploded view
  const { parts, originalPositions } = useMemo(() => {
    const left = [];
    const right = [];
    const top = [];
    const bottom = [];
    const front = [];
    const rear = [];
    const none = [];
    const origPos = new Map();

    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const sceneCenter = box.getCenter(new THREE.Vector3());

    scene.traverse((child) => {
      if (child.isMesh) {
        origPos.set(child.uuid, {
          x: child.position.x,
          y: child.position.y,
          z: child.position.z
        });

        // Use geometry bounding box for accurate center
        const center = new THREE.Vector3();
        if (child.geometry) {
          child.geometry.computeBoundingBox();
          child.geometry.boundingBox.getCenter(center);
        } else {
          center.copy(child.position);
        }
        child.localToWorld(center);
        
        // Relative position from center (-1 to 1 range approx)
        const relX = (center.x - sceneCenter.x) / (size.x / 2);
        const relY = (center.y - sceneCenter.y) / (size.y / 2);
        const relZ = (center.z - sceneCenter.z) / (size.z / 2);

        const name = child.name.toLowerCase();
        
        // 1. Wheels, rims, calipers go left/right
        const isWheelOrRimOrCaliper = 
          name.includes('wheel') || 
          name.includes('rim') || 
          name.includes('calliper') || 
          name.includes('caliper') || 
          name.includes('polysurface1') || 
          name.includes('polysurface145') || 
          name.includes('polysurface289') || 
          name.includes('polysurface433');

        if (isWheelOrRimOrCaliper) {
          right.push(child); // ponytail: force all wheels to shift right
        } 
        // 2. Specific parts by name
        else if (name.includes('windowfront') || name.includes('window_front') || name.includes('windowsurroundfront') || name.includes('grille') || name.includes('lightbucket') || name.includes('clear')) {
          front.push(child); // ponytail: push headlamps/clear glasses to the front
        }
        else if (name.includes('licenseplate') || name.includes('engine') || name.includes('red') || name.includes('rear')) {
          rear.push(child);
        }
        else if (name.includes('mirror') || name.includes('badge') || name.includes('sticker') || name.includes('logo') || name.includes('carpaint')) {
          none.push(child); // ponytail: keep mirrors, stickers and main body attached
        }
        else if (name.includes('chassis') || name.includes('interior')) {
          none.push(child); // ponytail: keep chassis centered
        }
        else if (name.includes('glass') || name.includes('window')) {
          top.push(child);
        }
        // 3. General position-based classification for body panels
        else {
          const absX = Math.abs(relX);
          const absY = Math.abs(relY);
          const absZ = Math.abs(relZ);

          const max = Math.max(absX, absY, absZ);

          if (max === absZ) {
            if (relZ > 0.15) front.push(child);
            else if (relZ < -0.15) rear.push(child);
            else none.push(child); 
          } else if (max === absX) {
            if (relX > 0.25) right.push(child);
            else if (relX < -0.25) left.push(child);
            else none.push(child);
          } else {
            if (relY > 0.25) top.push(child);
            else bottom.push(child);
          }
        }
      }
    });

    return { 
      parts: { left, right, top, bottom, front, rear, none }, 
      originalPositions: origPos 
    };
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
    // Expose model inspection to the browser console
    window.inspectModel = () => {
      const meshes = [];
      scene.traverse((child) => {
        if (child.isMesh) {
          meshes.push({
            name: child.name || 'unnamed',
            type: child.type,
            parent: child.parent?.name || 'root'
          });
        }
      });
      console.log("=== 3D Model Inspection: Run in Console ===");
      console.table(meshes);
      console.log(`Total Meshes found: ${meshes.length}`);
    };
    
    // Automatically log invitation to run the function
    console.log("💡 [3D Model Loader] Ketik `inspectModel()` di konsol browser Anda untuk melihat semua komponen mobil!");

    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        child.castShadow = false;
        child.receiveShadow = false;
        child.material.envMapIntensity = 4.5;
        if (child.material.roughness !== undefined) child.material.roughness = Math.min(child.material.roughness, 0.04);
        if (child.material.metalness !== undefined) child.material.metalness = Math.max(child.material.metalness, 0.45);
        if ('clearcoat' in child.material) { child.material.clearcoat = 1.0; child.material.clearcoatRoughness = 0.02; }
        
        // ponytail: Make car windows darker (tinted)
        const name = child.name.toLowerCase();
        if ((name.includes('glass') || name.includes('window')) && !name.includes('light') && !name.includes('mirror')) {
          child.material.color.setHex(0x050505); // Very dark color
          if (child.material.transmission !== undefined) child.material.transmission = 0.2; // Less transparent if using transmission
          if (child.material.opacity !== undefined && child.material.transparent) child.material.opacity = 0.85; // More opaque
        }

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
      // 1. Initial State (Hero / Home) - Mobil di kanan
      gsap.set(groupRef.current.position, { x: 2.8, y: -0.2, z: 0 });
      gsap.set(groupRef.current.rotation, { x: 0.05, y: Math.PI * -0.35, z: 0 });
      gsap.set(groupRef.current.scale, { x: 7.5, y: 7.5, z: 7.5 });

      // 2. Animasi ke About (Pindah ke kiri)
      gsap.timeline({
        scrollTrigger: { trigger: '#about', start: 'top bottom', end: 'bottom bottom', scrub: true, invalidateOnRefresh: true }
      })
      .fromTo(groupRef.current.position, { x: 2.8, y: -0.2, z: 0 }, { x: -3.2, y: 0, z: 0, ease: 'power1.inOut' }, 0)
      .fromTo(groupRef.current.rotation, { x: 0.05, y: Math.PI * -0.35, z: 0 }, { x: 0.05, y: Math.PI * 0.2, z: 0, ease: 'power1.inOut' }, 0)
      .fromTo(groupRef.current.scale, { x: 7.5, y: 7.5, z: 7.5 }, { x: 7.2, y: 7.2, z: 7.2, ease: 'power1.inOut' }, 0);

      // 3. Animasi ke Skills (Pindah ke kanan)
      gsap.timeline({
        scrollTrigger: { trigger: '#skills', start: 'top bottom', end: 'bottom bottom', scrub: true, invalidateOnRefresh: true }
      })
      .fromTo(groupRef.current.position, { x: -3.2, y: 0, z: 0 }, { x: 3.0, y: 0.2, z: 0, ease: 'power1.inOut' }, 0)
      .fromTo(groupRef.current.rotation, { x: 0.05, y: Math.PI * 0.2, z: 0 }, { x: 0.15, y: Math.PI * 0.80, z: 0, ease: 'power1.inOut' }, 0)
      .fromTo(groupRef.current.scale, { x: 7.2, y: 7.2, z: 7.2 }, { x: 7.5, y: 7.5, z: 7.5, ease: 'power1.inOut' }, 0);

      // 4. Animasi ke Portfolio (Pindah ke tengah & Meledak)
      const portfolioTl = gsap.timeline({
        scrollTrigger: { trigger: '#portfolio', start: 'top bottom', end: 'bottom bottom', scrub: true, invalidateOnRefresh: true }
      })
      .fromTo(groupRef.current.position, { x: 3.0, y: 0.2, z: 0 }, { x: 0, y: 0, z: 0, ease: 'power1.inOut' }, 0)
      .fromTo(groupRef.current.rotation, { x: 0.15, y: Math.PI * 0.80, z: 0 }, { x: 0.45, y: Math.PI * 2.2, z: 0, ease: 'power1.inOut' }, 0)
      .fromTo(groupRef.current.scale, { x: 7.5, y: 7.5, z: 7.5 }, { x: 5.5, y: 5.5, z: 5.5, ease: 'power1.inOut' }, 0);

      // ponytail: Animate components separating dynamically in 6 directions, pushing them further out
      const offset = 0.85; // Reduced offset based on user request
      parts.left.forEach((mesh) => {
        const orig = originalPositions.get(mesh.uuid);
        portfolioTl.to(mesh.position, { x: orig.x - offset, ease: 'power1.inOut' }, 0.45);
      });
      parts.right.forEach((mesh) => {
        const orig = originalPositions.get(mesh.uuid);
        portfolioTl.to(mesh.position, { x: orig.x + offset, ease: 'power1.inOut' }, 0.45);
      });
      parts.top.forEach((mesh) => {
        const orig = originalPositions.get(mesh.uuid);
        portfolioTl.to(mesh.position, { y: orig.y + offset * 0.7, ease: 'power1.inOut' }, 0.45);
      });
      parts.bottom.forEach((mesh) => {
        const orig = originalPositions.get(mesh.uuid);
        portfolioTl.to(mesh.position, { y: orig.y - offset * 0.5, ease: 'power1.inOut' }, 0.45);
      });
      parts.front.forEach((mesh) => {
        const orig = originalPositions.get(mesh.uuid);
        portfolioTl.to(mesh.position, { z: orig.z + offset, ease: 'power1.inOut' }, 0.45);
      });
      parts.rear.forEach((mesh) => {
        const orig = originalPositions.get(mesh.uuid);
        portfolioTl.to(mesh.position, { z: orig.z - offset, ease: 'power1.inOut' }, 0.45);
      });

      // 5. Animasi ke GithubStats (Menyatu kembali & Ganti Angle)
      const githubTl = gsap.timeline({
        scrollTrigger: { trigger: '#github-stats', start: 'top bottom', end: 'bottom bottom', scrub: true, invalidateOnRefresh: true }
      })
      .fromTo(groupRef.current.position, { x: 0, y: 0, z: 0 }, { x: 0, y: 0.2, z: 0, ease: 'power1.inOut' }, 0)
      .fromTo(groupRef.current.rotation, { x: 0.45, y: Math.PI * 2.2, z: 0 }, { x: 0.15, y: Math.PI * 3.75, z: 0, ease: 'power1.inOut' }, 0)
      .fromTo(groupRef.current.scale, { x: 5.5, y: 5.5, z: 5.5 }, { x: 6.5, y: 6.5, z: 6.5, ease: 'power1.inOut' }, 0);

      // ponytail: Re-assemble components
      parts.left.forEach((mesh) => {
        const orig = originalPositions.get(mesh.uuid);
        githubTl.to(mesh.position, { x: orig.x, ease: 'power1.inOut' }, 0);
      });
      parts.right.forEach((mesh) => {
        const orig = originalPositions.get(mesh.uuid);
        githubTl.to(mesh.position, { x: orig.x, ease: 'power1.inOut' }, 0);
      });
      parts.top.forEach((mesh) => {
        const orig = originalPositions.get(mesh.uuid);
        githubTl.to(mesh.position, { y: orig.y, ease: 'power1.inOut' }, 0);
      });
      parts.bottom.forEach((mesh) => {
        const orig = originalPositions.get(mesh.uuid);
        githubTl.to(mesh.position, { y: orig.y, ease: 'power1.inOut' }, 0);
      });
      parts.front.forEach((mesh) => {
        const orig = originalPositions.get(mesh.uuid);
        githubTl.to(mesh.position, { z: orig.z, ease: 'power1.inOut' }, 0);
      });
      parts.rear.forEach((mesh) => {
        const orig = originalPositions.get(mesh.uuid);
        githubTl.to(mesh.position, { z: orig.z, ease: 'power1.inOut' }, 0);
      });

      // 6. Animasi ke Contact (Jatuh bebas menghilang)
      const footerTl = gsap.timeline({
        scrollTrigger: { trigger: '#contact', start: 'top bottom', end: 'bottom bottom', scrub: true, invalidateOnRefresh: true }
      })
      .fromTo(groupRef.current.position, { x: 0, y: 0.2, z: 0 }, { x: 0, y: -4.5, z: 0, ease: 'power2.in' }, 0)
      .fromTo(groupRef.current.rotation, { x: 0.15, y: Math.PI * 3.75, z: 0 }, { x: -0.8, y: Math.PI * 4.2, z: 0, ease: 'power2.in' }, 0)
      .fromTo(groupRef.current.scale, { x: 6.5, y: 6.5, z: 6.5 }, { x: 4.5, y: 4.5, z: 4.5, ease: 'power2.in' }, 0);
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
  }, [parts, originalPositions]);

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
