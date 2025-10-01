import {
  Grid,
  GizmoHelper,
  GizmoViewport, 
  OrbitControls, 
} from '@react-three/drei' 
const GridArea = () => {
 
  return (
    <>
      <group position={[0, -0.5, 0]}>
        {/* <Shadows /> */}
        <Grid
          position={[0, -0.01, 0]}
          args={[10, 10]} 
          fadeDistance={100}
          infiniteGrid
          cellSize={1}
          cellColor={"#6f6f6f"}
          sectionSize={5}
          cellThickness={1}
          sectionColor={"#585858"}
          sectionThickness={1.5}
          fadeStrength={0.8}
        />
      </group>
      <OrbitControls makeDefault />
      {/* <Environment preset="city" /> */}
      <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
        <GizmoViewport axisColors={['#9d4b4b', '#2f7f4f', '#3b5b9d']} labelColor="white" />
      </GizmoHelper>
    </>
  )
}
// const Shadows = memo(() => (
//   <AccumulativeShadows
//     temporal
//     frames={100}
//     color="#9d4b4b"
//     colorBlend={0.5}
//     alphaTest={0.9}
//     scale={20}
//   >
//     <RandomizedLight amount={8} radius={4} position={[5, 5, -10]} />
//   </AccumulativeShadows>
// ))
export default GridArea
