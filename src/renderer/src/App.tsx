// import Spritesheet from 'react-responsive-spritesheet'
import { CryptoInfo } from './components/CryptoInfo'
import { UI } from './constants/UI'
// import { BitcatState } from "./jotai/Crypto";
import { useAtom } from 'jotai'
import { AnimationAtom } from './jotai/Animation'
import './App.css'
import { scaleAtom } from './jotai/Preference'
import { SpriteAnimator } from './components/SpriteAnimator'
import { useEffect } from 'react'
// import Spritesheet from './components/SpriteSheet'
// import { loadingAtom } from './jotai/Loading'

function App() {
  const [animation] = useAtom(AnimationAtom)
  const [scale, setScale] = useAtom(scaleAtom)

  useEffect(() => {
    window.electron.ipcRenderer.on("PARAMS_FROM_ELECTRON", (_e, { scale }) => {
      setScale(scale)
    })

  }, [])
  return (
    <div
      className="movable hover-background"
      style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'grabbing'
        }}
      >
        <SpriteAnimator
          scale={scale}
          spritesheet={animation.spritesheet}
          widthFrame={UI.frameWidth}
          heightFrame={UI.frameHeight}
          steps={9}
          fps={animation.fps}
          loop={true}
        ></SpriteAnimator>
        <div
          style={{
            position: 'absolute',
            top: 40 * scale,
            width: '100%',
            left: 'auto',
            right: 'auto'
          }}
        >
          <CryptoInfo scale={scale}></CryptoInfo>
        </div>
      </div>
    </div>
  )
}

export default App
