import { useEffect, useRef } from 'react'

import Spritesheet from 'react-responsive-spritesheet'
import { CryptoInfo } from './components/CryptoInfo'
import { UI } from './constants/UI'
// import { BitcatState } from "./jotai/Crypto";
import { useAtom } from 'jotai'
import { AnimationAtom } from './jotai/Animation'
import './App.css'
import { scaleAtom } from './jotai/Preference'
import { SpriteAnimator } from './components/SpriteAnimator'
import { useTranslation } from 'react-i18next'
// import { loadingAtom } from './jotai/Loading'

function App() {
  const [animation] = useAtom(AnimationAtom)
  const spritesheetRef = useRef<Spritesheet | null>(null)
  const [scale] = useAtom(scaleAtom)

  useEffect(() => {
    if (animation.fps !== spritesheetRef?.current?.getInfo('fps')) {
      spritesheetRef?.current?.setFps(animation.fps)
    }
  }, [animation])
  return (
    <div
      className="movable"
      style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
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
