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
// import { loadingAtom } from './jotai/Loading'

function App() {
  const [animation] = useAtom(AnimationAtom)
  const spritesheetRef = useRef<Spritesheet | null>(null)
  const [scale] = useAtom(scaleAtom)
  // const [isGrabbing, setIsGrabbing] = useState(false);
  // const [windowInfo, setWindowInfo] = useState<WindowInfo>({
  //   x: 0,
  //   y: 0,
  //   maxX: UI.frameWidth * preference.scale,
  //   maxY: UI.frameHeight * preference.scale,
  // });

  // const [winSize, setWinSize] = useState({
  //   width: 1,
  //   height: 1,
  // });
  useEffect(() => {
    // const init = async () => {
    //   const result = await sendToMainAsync('GET_SCALE', {})
    //   setScale(result)
    // }
    // init()
  })

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
          // overflow: 'hidden',
          // backgroundColor: 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
          // alignSelf: 'center',
          // backgroundColor: 'rgba(255, 255, 255, 0.3)',
          cursor: 'grabbing'
          // backdropFilter: "blur(30px)",
          // WebkitBackdropFilter: "blur(30px)",
        }}
      >
        <SpriteAnimator
          // className="movable"
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
            // bottom: 0,
            left: 'auto',
            right: 'auto'
          }}
        >
          <CryptoInfo scale={scale}></CryptoInfo>
        </div>
      </div>
      {/* <Modal
        open={loading}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <div
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <CircularProgress></CircularProgress>
        </div>
      </Modal> */}
    </div>
  )
}

export default App
