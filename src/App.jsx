import "./styles/global.css"
import Sky from './components/Sky'
import MusicPlayer from "./components/MusicPlayer"

function App() {
  return (
    <div className="app-container">
      <div className="background-layer" />
      <Sky/>
      <MusicPlayer/>
    </div>
  )
}

export default App