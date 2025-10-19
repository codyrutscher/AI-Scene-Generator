import './assets/main.css'
import './assets/app.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import App from './components/3d/HeightMapTerrain'
import App from './App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <App /> */}
    <App/>
  </StrictMode>
)
