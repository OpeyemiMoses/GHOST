import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface VaultCanvasProps {
  scrollProgress: number; // 0 to 1
}

export const VaultThreeCanvas: React.FC<VaultCanvasProps> = ({ scrollProgress }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  // Mesh part references
  const masterGroupRef = useRef<THREE.Group | null>(null);
  const helmMeshRef = useRef<THREE.Group | null>(null);
  const lockRingMeshRef = useRef<THREE.Mesh | null>(null);
  const doorGroupRef = useRef<THREE.Group | null>(null);
  const fheCoreGroupRef = useRef<THREE.Group | null>(null);
  const progressTargetRef = useRef<number>(scrollProgress);
  const currentProgressRef = useRef<number>(scrollProgress);

  // Synchronize target progress
  useEffect(() => {
    progressTargetRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth || window.innerWidth;
    const height = mountRef.current.clientHeight || window.innerHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 0, 11.5);
    cameraRef.current = camera;

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffeedd, 0.9);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff8ee, 4.0);
    keyLight.position.set(6, 8, 9);
    scene.add(keyLight);

    const goldFill = new THREE.PointLight(0xe5a910, 4.0, 25);
    goldFill.position.set(2, -1, 6);
    scene.add(goldFill);

    const emeraldGlow = new THREE.PointLight(0x10b981, 3.5, 15);
    emeraldGlow.position.set(0, 0, 0.5);
    scene.add(emeraldGlow);

    // 5. Build Master Group
    const masterGroup = new THREE.Group();
    masterGroupRef.current = masterGroup;
    scene.add(masterGroup);

    // Texture loader
    const textureLoader = new THREE.TextureLoader();
    const vaultTexture = textureLoader.load('/assets/vault.png');
    vaultTexture.colorSpace = THREE.SRGBColorSpace;

    // Materials
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xe5a910,
      roughness: 0.22,
      metalness: 0.94,
    });
    const titaniumMat = new THREE.MeshStandardMaterial({
      color: 0x181a20,
      roughness: 0.35,
      metalness: 0.88,
    });

    // PART 4: BACK TITANIUM CHASSIS FRAME
    const chassisGeo = new THREE.BoxGeometry(4.2, 4.2, 0.7);
    const chassisMesh = new THREE.Mesh(chassisGeo, titaniumMat);
    masterGroup.add(chassisMesh);

    // 4 Gold Corner Reinforced Brackets
    const corners = [
      [-1.9, 1.9, 0.38],
      [1.9, 1.9, 0.38],
      [-1.9, -1.9, 0.38],
      [1.9, -1.9, 0.38],
    ];
    corners.forEach(([x, y, z]) => {
      const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.68, 0.2), goldMat);
      bracket.position.set(x, y, z);
      masterGroup.add(bracket);
    });

    // PART 5: REVEALED ZAMA FHE ENCRYPTED CORE CHAMBER
    const fheCoreGroup = new THREE.Group();
    fheCoreGroup.position.set(0, 0, 0.1);
    masterGroup.add(fheCoreGroup);
    fheCoreGroupRef.current = fheCoreGroup;

    const coreCylinder = new THREE.Mesh(
      new THREE.CylinderGeometry(1.35, 1.35, 0.3, 48),
      new THREE.MeshStandardMaterial({
        color: 0x052e16,
        emissive: 0x10b981,
        emissiveIntensity: 0.95,
        roughness: 0.25,
        metalness: 0.6,
      })
    );
    coreCylinder.rotation.x = Math.PI / 2;
    fheCoreGroup.add(coreCylinder);

    const crystalTorus = new THREE.Mesh(
      new THREE.TorusGeometry(1.05, 0.07, 16, 64),
      new THREE.MeshBasicMaterial({ color: 0x34d399 })
    );
    fheCoreGroup.add(crystalTorus);

    // PART 3: THE SWINGING CIRCULAR VAULT DOOR
    const doorGroup = new THREE.Group();
    doorGroup.position.set(1.7, 0, 0.48);
    masterGroup.add(doorGroup);
    doorGroupRef.current = doorGroup;

    const doorDisk = new THREE.Mesh(
      new THREE.CylinderGeometry(1.7, 1.7, 0.22, 64),
      [
        titaniumMat,
        new THREE.MeshStandardMaterial({ map: vaultTexture, roughness: 0.28, metalness: 0.85 }),
        titaniumMat,
      ]
    );
    doorDisk.rotation.x = Math.PI / 2;
    doorDisk.position.set(-1.7, 0, 0);
    doorGroup.add(doorDisk);

    const hinge = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.18, 3.0, 24),
      new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.3, metalness: 0.88 })
    );
    hinge.position.set(0, 0, 0);
    doorGroup.add(hinge);

    // PART 2: EXPANDING CONCENTRIC GOLD LOCKING RING
    const lockRingMesh = new THREE.Mesh(
      new THREE.TorusGeometry(1.4, 0.1, 24, 64),
      goldMat
    );
    lockRingMesh.position.set(0, 0, 0.65);
    masterGroup.add(lockRingMesh);
    lockRingMeshRef.current = lockRingMesh;

    // PART 1: 6-SPOKE GOLDEN LOCKING HELM
    const helmGroup = new THREE.Group();
    helmGroup.position.set(0, 0, 0.85);
    masterGroup.add(helmGroup);
    helmMeshRef.current = helmGroup;

    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.24, 32), goldMat);
    hub.rotation.x = Math.PI / 2;
    helmGroup.add(hub);

    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.075, 16, 48), goldMat);
    helmGroup.add(rim);

    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const spoke = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 1.9, 16), goldMat);
      spoke.rotation.z = angle;
      helmGroup.add(spoke);

      const tip = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), goldMat);
      tip.position.set(Math.cos(angle + Math.PI / 2) * 0.95, Math.sin(angle + Math.PI / 2) * 0.95, 0);
      helmGroup.add(tip);
    }

    // INITIAL POSITION: Centered on the right side in 3D
    masterGroup.position.set(1.45, -0.05, 0);
    masterGroup.rotation.set(0.08, -0.28, 0);

    // Real-time animation loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Fast, responsive spring lerp toward target progress
      const target = progressTargetRef.current;
      currentProgressRef.current += (target - currentProgressRef.current) * 0.16;
      const p = currentProgressRef.current;

      // 1. Vault Position & Glide:
      // Hero (p = 0): Right side (x = 1.45, rotY = -0.28)
      // Exploded (p = 1): Glides to Center-Left (x = -0.7, rotY = 0.22)
      masterGroup.position.x = 1.45 * (1 - p) + (-0.7 * p);
      masterGroup.position.y = -0.05 * (1 - p) + (0.12 * p);
      masterGroup.rotation.y = -0.28 * (1 - p) + (0.22 * p);
      masterGroup.rotation.x = 0.08 * (1 - p) + (0.04 * p);

      // 2. Helm Detaches forward along Z-axis by +4.2 units & spins 360°
      if (helmMeshRef.current) {
        helmMeshRef.current.position.z = 0.85 + p * 4.2;
        helmMeshRef.current.rotation.z = p * Math.PI * 2.0;
      }

      // 3. Lock Ring floats forward +2.2 units & scales to 1.35x
      if (lockRingMeshRef.current) {
        lockRingMeshRef.current.position.z = 0.65 + p * 2.2;
        const scale = 1 + p * 0.35;
        lockRingMeshRef.current.scale.set(scale, scale, 1);
      }

      // 4. Door swings open on right hinge: -78°
      if (doorGroupRef.current) {
        doorGroupRef.current.rotation.y = -p * 1.36;
      }

      // 5. Emerald Crystal Ring continuous spin
      if (crystalTorus) {
        crystalTorus.rotation.z = Date.now() * 0.0012;
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current || !mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 pointer-events-none z-10 overflow-hidden w-full h-full"
    />
  );
};
