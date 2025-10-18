import React, { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { textureService } from '../../utils/textureService'

function Terrain({ textureUrls }) {
  const meshRef = useRef()

  // Load textures using useTexture hook
  const textures = useTexture([
    textureUrls.heightMap,
    textureUrls.grass,
    textureUrls.rock,
    textureUrls.sand
  ])

  // Extract individual textures
  const [heightMap, grassTexture, rockTexture, sandTexture] = textures

  // Set texture wrapping and repeat
  useEffect(() => {
    if (grassTexture && rockTexture && sandTexture) {
      ;[grassTexture, rockTexture, sandTexture].forEach((texture) => {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping
        texture.repeat.set(8, 8)
      })
    }
  }, [grassTexture, rockTexture, sandTexture])

  // Generate terrain geometry
  const geometry = useMemo(() => {
    const width = 100
    const height = 100
    const widthSegments = 100
    const heightSegments = 100

    const geo = new THREE.PlaneGeometry(width, height, widthSegments, heightSegments)

    geo.computeVertexNormals()
    return geo
  }, [])

  // Custom shader material for blending textures based on height
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        heightMap: { value: heightMap },
        grassTexture: { value: grassTexture },
        rockTexture: { value: rockTexture },
        sandTexture: { value: sandTexture },
        displacementScale: { value: 15.0 },
        lightDirection: { value: new THREE.Vector3(0.5, 1.0, 0.3).normalize() }
      },
      vertexShader: `
        uniform sampler2D heightMap;
        uniform float displacementScale;
        
        varying vec2 vUv;
        varying float vHeight;
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          vUv = uv;
          
          // Sample heightmap
          float height = texture2D(heightMap, uv).r;
          vHeight = height;
          
          // Displace vertex
          vec3 newPosition = position;
          newPosition.z = height * displacementScale;
          
          vPosition = newPosition;
          vNormal = normal;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D grassTexture;
        uniform sampler2D rockTexture;
        uniform sampler2D sandTexture;
        uniform vec3 lightDirection;
        
        varying vec2 vUv;
        varying float vHeight;
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          // Sample textures
          vec4 grass = texture2D(grassTexture, vUv * 8.0);
          vec4 rock = texture2D(rockTexture, vUv * 8.0);
          vec4 sand = texture2D(sandTexture, vUv * 8.0);
          
          // Blend textures based on height
          vec4 finalColor;
          
          if (vHeight < 0.3) {
            // Low areas: sand
            finalColor = mix(sand, grass, smoothstep(0.2, 0.3, vHeight));
          } else if (vHeight < 0.6) {
            // Mid areas: grass
            finalColor = grass;
          } else {
            // High areas: rock
            finalColor = mix(grass, rock, smoothstep(0.6, 0.75, vHeight));
          }
          
          // Simple lighting
          vec3 normal = normalize(vNormal);
          float diffuse = max(dot(normal, lightDirection), 0.3);
          
          gl_FragColor = vec4(finalColor.rgb * diffuse, 1.0);
        }
      `
    })
  }, [heightMap, grassTexture, rockTexture, sandTexture])

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={material}
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
      castShadow
    />
  )
}

export default function App() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      {/* Loading indicator */}
      {loading && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '20px 40px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '16px',
            zIndex: 1000
          }}
        >
          Loading textures from API...
        </div>
      )}

      {/* Error indicator */}
      {error && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(139, 0, 0, 0.9)',
            color: 'white',
            padding: '20px 40px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '14px',
            zIndex: 1000,
            maxWidth: '500px'
          }}
        >
          <strong>Error loading textures:</strong>
          <br />
          {error}
        </div>
      )}

      {/* Info panel */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          padding: '15px',
          borderRadius: '8px',
          fontFamily: 'monospace',
          fontSize: '14px',
          zIndex: 1
        }}
      >
        <div>
          <strong>Textured Terrain Demo</strong>
        </div>
        <div style={{ marginTop: '8px', fontSize: '12px' }}>Textures loaded from API</div>
        <div style={{ marginTop: '8px', fontSize: '11px', opacity: 0.8 }}>
          • Heightmap (grayscale)
          <br />
          • Grass texture
          <br />
          • Rock texture
          <br />• Sand/Mud texture
        </div>
        <div style={{ marginTop: '8px', fontSize: '11px', opacity: 0.6 }}>
          Height &lt; 0.3: Sand
          <br />
          Height 0.3-0.6: Grass
          <br />
          Height &gt; 0.6: Rock
        </div>
      </div>
      <SceneWithState setLoading={setLoading} setError={setError} />
    </div>
  )
}

// Wrapper to pass state setters to Scene
function SceneWithState({ setLoading, setError }) {
  const [textureUrls, setTextureUrls] = useState(null)
  const [localLoading, setLocalLoading] = useState(true)
  const [localError, setLocalError] = useState(null)

  // Fetch textures from API on component mount
  useEffect(() => {
    const fetchTextures = async () => {
      try {
        setLocalLoading(true)
        setLoading(true)
        setLocalError(null)
        setError(null)

        console.log('[HeightMapTerrain] Fetching textures from API...')
        const result = await textureService.fetchTerrainTextures({
          grass: 'grass',
          rock: 'rock',
          sand: 'mud',
          heightmap: 'heightmap'
        })

        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch textures')
        }

        // Extract URLs from the result
        const urls = {
          heightMap: result.textures.heightmap?.url,
          grass: result.textures.grass?.url,
          rock: result.textures.rock?.url,
          sand: result.textures.sand?.url
        }

        // Validate that all URLs are present
        const missingTextures = Object.entries(urls)
          .filter(([_, url]) => !url)
          .map(([key]) => key)

        if (missingTextures.length > 0) {
          throw new Error(`Missing texture URLs for: ${missingTextures.join(', ')}`)
        }

        console.log('[HeightMapTerrain] Textures fetched successfully:', urls)
        setTextureUrls(urls)
        setLocalLoading(false)
        setLoading(false)
      } catch (err) {
        console.error('[HeightMapTerrain] Error fetching textures:', err)
        const errorMsg = err.message
        setLocalError(errorMsg)
        setError(errorMsg)
        setLocalLoading(false)
        setLoading(false)
      }
    }

    fetchTextures()
  }, [setLoading, setError])

  // Don't render scene until textures are loaded
  if (localLoading || localError || !textureUrls) {
    return null
  }

  return (
    <Canvas camera={{ position: [60, 50, 60], fov: 60 }} shadows>
      <color attach="background" args={['#87ceeb']} />

      <ambientLight intensity={0.4} />
      <directionalLight
        position={[50, 50, 25]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />

      <Terrain textureUrls={textureUrls} />

      <OrbitControls enableDamping dampingFactor={0.05} minDistance={20} maxDistance={200} />

      <gridHelper args={[120, 24, '#666666', '#444444']} position={[0, -0.5, 0]} />
    </Canvas>
  )
}
