/* eslint-disable react/prop-types */
import Scene3D from "./components/Scene3D"

 

function App() {
  console.log('App component rendering - Simple Selection Mode')

  return (
    <div
      style={{
        height: '100vh',
        margin: 0,
        padding: 0,
        position: 'relative'
      }}
    >
      <Scene3D />
    </div>
  )
}

export default App
