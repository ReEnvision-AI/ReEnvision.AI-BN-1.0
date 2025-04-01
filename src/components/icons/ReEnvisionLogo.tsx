import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface LogoProps {
  className?: string;
}

function LowPolySphere() {
  const meshRef = useRef();
  const linesMaterial = new THREE.LineBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.3 });
  const linesRef = useRef();

  // Set initial rotation
  React.useEffect(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.PI / 5.14; // Approximately 35 degrees
    }
    if (linesRef.current) {
      linesRef.current.rotation.y = Math.PI / 5.14;
    }
  }, []);

  // Define color regions based on y-coordinate
  const getColorForPosition = React.useMemo(() => (y: number) => {
    if (y > 1.5) {
      return new THREE.Color('#2563EB'); // Lighter blue for top
    } else if (y > 0.5) {
      return new THREE.Color('#059669'); // Lighter green for upper half
    } else if (y > -0.5) {
      return new THREE.Color('#DC2626'); // Lighter red for middle
    } else if (y > -1.0) {
      return new THREE.Color('#B91C1C'); // Lighter red for lower middle
    } else {
      return new THREE.Color('#D97706'); // Lighter yellow/amber for bottom
    }
  }, []);

  const geometry = React.useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(2.28, 1);
    const positionAttribute = geo.getAttribute('position');
    const edges = new Set(); // Track unique edges
    const colors = [];
    const edgeVertices = [];

    for (let i = 0; i < positionAttribute.count; i += 3) {
      // Get y-coordinates for each vertex of the triangle
      const y1 = positionAttribute.getY(i);
      const y2 = positionAttribute.getY(i + 1);
      const y3 = positionAttribute.getY(i + 2);

      // Get vertices
      const v1 = new THREE.Vector3().fromBufferAttribute(positionAttribute, i);
      const v2 = new THREE.Vector3().fromBufferAttribute(positionAttribute, i + 1);
      const v3 = new THREE.Vector3().fromBufferAttribute(positionAttribute, i + 2);
      
      // Get colors based on y-position
      const color1 = getColorForPosition(y1);
      const color2 = getColorForPosition(y2);
      const color3 = getColorForPosition(y3);

      // Add edges if not already added (using string representation as Set key)
      const addEdge = (a: THREE.Vector3, b: THREE.Vector3) => {
        const key = [a.x, a.y, a.z, b.x, b.y, b.z].join(',');
        const reverseKey = [b.x, b.y, b.z, a.x, a.y, a.z].join(',');
        if (!edges.has(key) && !edges.has(reverseKey)) {
          edges.add(key);
          edgeVertices.push(a.clone(), b.clone());
        }
      };

      // Add all three edges of the triangle
      addEdge(v1, v2);
      addEdge(v2, v3);
      addEdge(v3, v1);

      colors.push(color1.r, color1.g, color1.b);
      colors.push(color2.r, color2.g, color2.b);
      colors.push(color3.r, color3.g, color3.b);
    }

    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geo.userData.edgeVertices = edgeVertices; // Store edge vertices for later use

    return geo;
  }, []);

  // Create highlight lines for all edges
  const highlightLines = React.useMemo(() => {
    if (!geometry.userData.edgeVertices) return [];
    const edgeGeometry = new THREE.BufferGeometry().setFromPoints(geometry.userData.edgeVertices);
    return [edgeGeometry];
  }, []);
  React.useEffect(() => {
    const animate = () => {
      if (meshRef.current) {
        meshRef.current.rotation.y += 0.008;
        meshRef.current.rotation.x += 0.006;
        meshRef.current.rotation.z += 0.004;
        
        // Sync lines rotation with sphere
        if (linesRef.current) {
          linesRef.current.rotation.copy(meshRef.current.rotation);
        }
      }
      requestAnimationFrame(animate);
    };
    animate();
  }, []);

  return (
    <group>
      <mesh ref={meshRef} geometry={geometry}>
        <meshStandardMaterial vertexColors flatShading />
      </mesh>
      <group ref={linesRef}>
        {highlightLines.map((geometry, index) => (
          <line key={index} geometry={geometry}>
            <lineBasicMaterial color="#ffffff" transparent opacity={0.5} />
          </line>
        ))}
      </group>
    </group>
  );
}

const ReEnvisionLogo: React.FC<LogoProps> = ({ className = "w-6 h-6" }) => {
  return (
    <div className={className}>
      <Canvas camera={{ position: [0, 0, 6.84] }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <pointLight position={[-5, -5, -5]} intensity={0.5} color="#ffffff" />
        <pointLight position={[0, 0, 5]} intensity={0.4} color="#ffffff" />
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          enableRotate={true}
          minPolarAngle={Math.PI / 2}
          maxPolarAngle={Math.PI / 2}
          rotation={[0, Math.PI / 5.14, 0]}  // Approximately 35 degrees
        />
        <LowPolySphere />
      </Canvas>
    </div>
  );
};

export { ReEnvisionLogo, LowPolySphere };