import { useTexture } from '@react-three/drei'
import { useMemo, useEffect, forwardRef, useState } from 'react'
import { PlaneGeometry, RepeatWrapping, ShaderMaterial, Vector3 } from 'three'
import { useSelectionStore } from '../../stores/selectionStore'
import { textureService } from '../../utils/textureService'

// Import fallback textures from local assets
import fallbackGrassTexture from '../../assets/textures/grass.jpg'
import fallbackRockTexture from '../../assets/textures/rock.jpg'
import fallbackMudTexture from '../../assets/textures/mud.png'
import fallbackHeightmapTexture from '../../assets/textures/heightmap.png'

// Available heightmaps - will be populated from API or use fallback
let HEIGHTMAPS = {
  heightmap1: null,
  heightmap2: null,
  heightmap3: null,
  heightmap4: null,
  heightmap5: null
}

// Available textures - will be populated from API or use fallback
let TEXTURES = {
  grass: {},
  mud: {},
  rock: {}
}

// Fallback textures
const FALLBACK_TEXTURES = {
  grass: fallbackGrassTexture,
  mud: fallbackMudTexture,
  rock: fallbackRockTexture,
  heightmap: fallbackHeightmapTexture
}

// Terrain variants - Only heightmap-based terrains
const TERRAIN_VARIANTS = {
  heightmap1: {
    name: 'Heightmap Terrain 1',
    type: 'heightmap',
    heightmap: 'heightmap1',
    displacementScale: 15.0,
    widthScale: 100,
    heightScale: 100,
    segments: 100,
    textureRepeat: 8,
    description: 'Heightmap-based terrain with multi-texture blending'
  },
  heightmap2: {
    name: 'Heightmap Terrain 2',
    type: 'heightmap',
    heightmap: 'heightmap2',
    displacementScale: 12.0,
    widthScale: 80,
    heightScale: 80,
    segments: 80,
    textureRepeat: 6,
    description: 'Heightmap-based terrain variant 2'
  },
  heightmap3: {
    name: 'Heightmap Terrain 3',
    type: 'heightmap',
    heightmap: 'heightmap3',
    displacementScale: 18.0,
    widthScale: 120,
    heightScale: 120,
    segments: 120,
    textureRepeat: 10,
    description: 'Heightmap-based terrain variant 3'
  },
  heightmap4: {
    name: 'Heightmap Terrain 4',
    type: 'heightmap',
    heightmap: 'heightmap4',
    displacementScale: 10.0,
    widthScale: 90,
    heightScale: 90,
    segments: 90,
    textureRepeat: 7,
    description: 'Heightmap-based terrain variant 4'
  },
  heightmap5: {
    name: 'Heightmap Terrain 5',
    type: 'heightmap',
    heightmap: 'heightmap5',
    displacementScale: 20.0,
    widthScale: 110,
    heightScale: 110,
    segments: 110,
    textureRepeat: 9,
    description: 'Heightmap-based terrain variant 5'
  }
}

const Terrain = forwardRef(
  (
    {
      name,
      position = [0, 0, 0],
      scale = [1, 1, 1],
      rotation = [0, 0, 0],
      isSelected = false,
      onSelect,
      variant = 'heightmap1',
      // Props for texture customization
      heightmapIndex = 1, // Which heightmap to use (1-5)
      grassTexture, // undefined means use first available
      mudTexture, // undefined means use first available
      rockTexture // undefined means use first available
    },
    ref
  ) => {
    const { setLastAction } = useSelectionStore()

    // Use first available texture if not specified
    const resolvedGrassTexture = grassTexture || Object.keys(TEXTURES.grass)[0]
    const resolvedMudTexture = mudTexture || Object.keys(TEXTURES.mud)[0]
    const resolvedRockTexture = rockTexture || Object.keys(TEXTURES.rock)[0]

    // Log when props change
    console.log(`[Terrain ${name}] Props received:`, {
      variant,
      heightmapIndex,
      grassTexture: resolvedGrassTexture,
      mudTexture: resolvedMudTexture,
      rockTexture: resolvedRockTexture
    })

    // Get variant configuration - default to heightmap1
    const variantConfig = TERRAIN_VARIANTS[variant] || TERRAIN_VARIANTS.heightmap1

    // Determine which heightmap to use based on heightmapIndex prop
    const heightmapKey = `heightmap${heightmapIndex}`
    console.log(`[Terrain ${name}] Using heightmapKey: ${heightmapKey}`)

    // Load textures - always load grass, mud, rock, and heightmap
    // Use API textures if available, otherwise fallback to local assets
    const textureUrls = useMemo(() => {
      console.log(`[Terrain ${name}] textureUrls useMemo triggered with:`, {
        grassTexture: resolvedGrassTexture,
        mudTexture: resolvedMudTexture,
        rockTexture: resolvedRockTexture,
        heightmapKey
      })

      // Helper function to get first available texture from a category
      const getFirstTexture = (category) => {
        const keys = Object.keys(category)
        return keys.length > 0 ? category[keys[0]] : null
      }

      const grassUrl =
        TEXTURES.grass[resolvedGrassTexture] ||
        getFirstTexture(TEXTURES.grass) ||
        FALLBACK_TEXTURES.grass
      const mudUrl =
        TEXTURES.mud[resolvedMudTexture] || getFirstTexture(TEXTURES.mud) || FALLBACK_TEXTURES.mud
      const rockUrl =
        TEXTURES.rock[resolvedRockTexture] ||
        getFirstTexture(TEXTURES.rock) ||
        FALLBACK_TEXTURES.rock
      const heightmapUrl =
        HEIGHTMAPS[heightmapKey] || HEIGHTMAPS.heightmap1 || FALLBACK_TEXTURES.heightmap

      console.log(`[Terrain ${name}] Resolved texture URLs:`, {
        grass: grassUrl,
        mud: mudUrl,
        rock: rockUrl,
        heightmap: heightmapUrl
      })

      const urls = [grassUrl, mudUrl, rockUrl, heightmapUrl]
      return urls
    }, [resolvedGrassTexture, resolvedMudTexture, resolvedRockTexture, heightmapKey, name, grassTexture, mudTexture, rockTexture])

    const loadedTextures = useTexture(textureUrls)

    // Configure textures
    useEffect(() => {
      loadedTextures.forEach((texture) => {
        texture.wrapS = texture.wrapT = RepeatWrapping
        texture.repeat.set(variantConfig.textureRepeat, variantConfig.textureRepeat)
        texture.needsUpdate = true
      })
    }, [loadedTextures, variantConfig.textureRepeat])

    const geometry = useMemo(() => {
      console.log(`[Terrain ${name}] Generating geometry for variant: ${variant}`)

      // Create geometry using variant dimensions
      const geo = new PlaneGeometry(
        variantConfig.widthScale,
        variantConfig.heightScale,
        variantConfig.segments,
        variantConfig.segments
      )

      // Heightmap displacement is handled in the shader
      console.log(`[Terrain ${name}] Geometry generated successfully for ${variant}`)
      return geo
    }, [variant, name, variantConfig])

    // Create material - always heightmap-based with multi-texture blending
    const material = useMemo(() => {
      const [grassTex, mudTex, rockTex, heightmapTex] = loadedTextures

      console.log(`[Terrain ${name}] Creating material with heightmapIndex: ${heightmapIndex}`)
      console.log(`[Terrain ${name}] Material recreation triggered by texture change:`, {
        grassTexture: grassTexture,
        mudTexture: mudTexture,
        rockTexture: rockTexture,
        resolvedGrassTexture: resolvedGrassTexture,
        resolvedMudTexture: resolvedMudTexture,
        resolvedRockTexture: resolvedRockTexture
      })

      return new ShaderMaterial({
        uniforms: {
          heightMap: { value: heightmapTex },
          grassTexture: { value: grassTex },
          rockTexture: { value: rockTex },
          sandTexture: { value: mudTex },
          displacementScale: { value: variantConfig.displacementScale },
          lightDirection: { value: new Vector3(0.5, 1.0, 0.3).normalize() }
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
              // Low areas: sand/mud
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
    }, [variantConfig, loadedTextures, heightmapIndex, name, grassTexture, mudTexture, rockTexture])

    // Cleanup geometry on unmount
    useEffect(() => {
      return () => {
        if (geometry) {
          geometry.dispose()
        }
      }
    }, [geometry])

    // Handle click for selection
    const handleClick = (event) => {
      event.stopPropagation()
      if (onSelect && name) {
        onSelect(name)
        setLastAction(`Selected terrain: ${name}`)
      }
    }

    // Selection colors
    const selectedColor = '#00ff00'

    return (
      <group ref={ref} position={position} scale={scale} rotation={rotation} onClick={handleClick}>
        {/* Main terrain mesh */}
        <mesh
          geometry={geometry}
          rotation={[-Math.PI / 2, 0, 0]} // Rotate to be horizontal
          userData={{ isTerrainMesh: true, terrainVariant: variant }} // Mark for export system
        >
          <primitive object={material} />
        </mesh>

        {/* Selection outline */}
        {isSelected && (
          <mesh
            geometry={geometry}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, 0.01, 0]} // Slightly above to prevent z-fighting
          >
            <meshBasicMaterial
              color={selectedColor}
              wireframe={true}
              transparent={true}
              opacity={0.5}
            />
          </mesh>
        )}
      </group>
    )
  }
)

Terrain.displayName = 'Terrain'

// Wrapper component that loads textures from API before rendering Terrain
const TerrainWithAPI = forwardRef((props, ref) => {
  const [texturesLoaded, setTexturesLoaded] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Skip if already loaded
    if (texturesLoaded) {
      return
    }

    const loadTexturesFromAPI = async () => {
      try {
        setLoading(true)
        setError(null)

        console.log('[Terrain] Attempting to fetch textures from API...')

        // Fetch all required textures in parallel - increased limits to get more options
        const [grassResults, mudResults, rockResults, heightmapResults] = await Promise.all([
          textureService.fetchTexturesByCategory('grass', { limit: 12 }),
          textureService.fetchTexturesByCategory('mud', { limit: 12 }),
          textureService.fetchTexturesByCategory('rock', { limit: 12 }),
          textureService.fetchTexturesByCategory('heightmap', { limit: 5 })
        ])

        // Dynamically populate TEXTURES object with all API textures
        if (grassResults.success && grassResults.textures.length > 0) {
          TEXTURES.grass = {} // Clear existing
          grassResults.textures.forEach((texture, index) => {
            // Create a clean key from the texture name
            const key = texture.name
              .toLowerCase()
              .replace(/\s+/g, '_')
              .replace(/[^a-z0-9_]/g, '')
              .replace(/_texture$/i, '')
              .replace(/^grass_/i, '')
            TEXTURES.grass[key || `grass${index + 1}`] = texture.url
          })
          console.log(`[Terrain] Loaded ${grassResults.textures.length} grass textures from API`)
        }

        if (mudResults.success && mudResults.textures.length > 0) {
          TEXTURES.mud = {} // Clear existing
          mudResults.textures.forEach((texture, index) => {
            const key = texture.name
              .toLowerCase()
              .replace(/\s+/g, '_')
              .replace(/[^a-z0-9_]/g, '')
              .replace(/_texture$/i, '')
              .replace(/^mud_/i, '')
            TEXTURES.mud[key || `mud${index + 1}`] = texture.url
          })
          console.log(`[Terrain] Loaded ${mudResults.textures.length} mud textures from API`)
        }

        if (rockResults.success && rockResults.textures.length > 0) {
          TEXTURES.rock = {} // Clear existing
          rockResults.textures.forEach((texture, index) => {
            const key = texture.name
              .toLowerCase()
              .replace(/\s+/g, '_')
              .replace(/[^a-z0-9_]/g, '')
              .replace(/_texture$/i, '')
              .replace(/^rock_/i, '')
            TEXTURES.rock[key || `rock${index + 1}`] = texture.url
          })
          console.log(`[Terrain] Loaded ${rockResults.textures.length} rock textures from API`)
        }

        // Populate HEIGHTMAPS object with API URLs if available
        if (heightmapResults.success && heightmapResults.textures.length > 0) {
          heightmapResults.textures.forEach((texture, index) => {
            const key = `heightmap${index + 1}`
            if (HEIGHTMAPS.hasOwnProperty(key)) {
              HEIGHTMAPS[key] = texture.url
            }
          })
          console.log(
            `[Terrain] Loaded ${heightmapResults.textures.length} heightmap textures from API`
          )
        }

        // Add fallback textures if no API textures were loaded
        if (Object.keys(TEXTURES.grass).length === 0) {
          TEXTURES.grass.fallback_grass = FALLBACK_TEXTURES.grass
          console.log('[Terrain] Using fallback grass texture')
        }
        if (Object.keys(TEXTURES.mud).length === 0) {
          TEXTURES.mud.fallback_mud = FALLBACK_TEXTURES.mud
          console.log('[Terrain] Using fallback mud texture')
        }
        if (Object.keys(TEXTURES.rock).length === 0) {
          TEXTURES.rock.fallback_rock = FALLBACK_TEXTURES.rock
          console.log('[Terrain] Using fallback rock texture')
        }

        console.log(
          '[Terrain] API texture loading complete (fallbacks will be used for missing textures)'
        )
        console.log('[Terrain] TEXTURES object structure:')
        console.log('  - grass keys:', Object.keys(TEXTURES.grass))
        console.log('  - mud keys:', Object.keys(TEXTURES.mud))
        console.log('  - rock keys:', Object.keys(TEXTURES.rock))
        console.log('[Terrain] TEXTURES full object:', TEXTURES)
        console.log('[Terrain] HEIGHTMAPS:', HEIGHTMAPS)

        setTexturesLoaded(true)
        setLoading(false)
      } catch (err) {
        console.warn('[Terrain] API texture loading failed, will use fallback textures:', err)
        // Don't set error - just use fallback textures
        setTexturesLoaded(true)
        setLoading(false)
      }
    }

    loadTexturesFromAPI()
  }, [])

  // Show loading state
  if (loading) {
    return null // Parent component should handle loading UI
  }

  // Show error state
  if (error) {
    console.error('[Terrain] Cannot render terrain due to error:', error)
    return null // Parent component should handle error UI
  }

  // Don't render until textures are loaded
  if (!texturesLoaded) {
    return null
  }

  // Render the actual Terrain component with loaded textures
  return <Terrain ref={ref} {...props} />
})

TerrainWithAPI.displayName = 'TerrainWithAPI'

// Helper functions to get texture arrays and counts
export const getTextureKeys = (category) => {
  const keys = Object.keys(TEXTURES[category] || {})
  console.log(`[Terrain Helper] getTextureKeys(${category}):`, keys)
  return keys
}

export const getTextureCount = (category) => {
  const count = Object.keys(TEXTURES[category] || {}).length
  console.log(`[Terrain Helper] getTextureCount(${category}):`, count)
  return count
}

export const getTextureByIndex = (category, index) => {
  const keys = Object.keys(TEXTURES[category] || {})
  if (index < 1 || index > keys.length) {
    console.log(
      `[Terrain Helper] getTextureByIndex(${category}, ${index}): OUT OF RANGE (max: ${keys.length})`
    )
    return null
  }
  const key = keys[index - 1] // Convert 1-based index to 0-based
  console.log(`[Terrain Helper] getTextureByIndex(${category}, ${index}):`, key)
  return key
}

export const getTextureIndexByKey = (category, key) => {
  const keys = Object.keys(TEXTURES[category] || {})
  const index = keys.indexOf(key)
  const result = index >= 0 ? index + 1 : 1
  console.log(
    `[Terrain Helper] getTextureIndexByKey(${category}, ${key}): index=${result}, keys:`,
    keys
  )
  return result
}

// Export both the component and variants for use in other parts of the system
export { TERRAIN_VARIANTS, TEXTURES }
export default TerrainWithAPI