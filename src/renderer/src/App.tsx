import { Suspense, useEffect, useRef } from 'react'

import Spritesheet from 'react-responsive-spritesheet'
import { CryptoInfo } from './components/CryptoInfo'
import { UI } from './constants/UI'
// import { BitcatState } from "./jotai/Crypto";
import { useAtom } from 'jotai'
import { AnimationAtom } from './jotai/Animation'
import './App.css'
import { scaleAtom } from './jotai/Preference'
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
    <div className="w-screen h-screen flex justify-center items-center">
      <div
        // draggable="true"
        //   // onDrag={(e) => {
        //   //   console.log(e);
        //   // }}
        //   onDragStart={(e) => {
        //     // e.preventDefault();
        //     console.log(e);
        //     // e.dataTransfer.setDragImage(document.getElementById("myElement", 0, 0));
        //     setDragOffset({ x: e.clientX, y: e.clientY });
        //   }}
        //   onDragOver={(e) => {
        //     e.preventDefault();
        //     // console.log(e);
        //   }}
        //   onDragEnd={(e) => {
        //     e.preventDefault();
        //     console.log(dragOffset, e.screenX, e.screenY);
        //     sendToMain("SET_POSITION", {
        //       x: e.screenX - dragOffset.x,
        //       y: e.screenY - dragOffset.y,
        //     });
        //   }}
        style={{
          display: 'flex',
          // overflow: 'hidden',
          // backgroundColor: 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'center',
          // backgroundColor: 'rgba(255, 255, 255, 0.3)',
          width: UI.frameWidth * scale,
          height: UI.frameHeight * scale,
          cursor: 'grabbing'
          // backdropFilter: "blur(30px)",
          // WebkitBackdropFilter: "blur(30px)",
        }}
      >
        <Spritesheet
          className="movable"
          style={{ width: '100%', height: '100%' }}
          ref={spritesheetRef}
          image={animation.spritesheet}
          widthFrame={UI.frameWidth}
          heightFrame={UI.frameHeight}
          steps={9}
          fps={animation.fps}
          direction={'forward'}
          loop={true}
          /////////////
          // background={`https://raw.githubusercontent.com/danilosetra/react-responsive-spritesheet/master/assets/images/examples/sprite-image-background.png`}
          // backgroundSize={`cover`}
          // backgroundRepeat={`no-repeat`}
          // backgroundPosition={`center center`}
        />
        {/* <Spritesheet.AnimatedSpriteSheet
        filename="image/bitcat_down_sheet.png"
        initialFrame={0}
        frame={{ width: UI.frameWidth, height: UI.frameHeight }}
        bounds={{ x: 0, y: 0, width: 5841, height: UI.frameHeight }}
        isPlaying={isPlaying}
        loop
        speed={900}
      /> */}
        <Suspense>
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
        </Suspense>
        {/* <div style={{ position: "absolute", bottom: 10, right: 10 }}>
        <Paper elevation={3} style={{ borderRadius: 40 }}>
          <IconButton
            onClick={() => {
              // setIsPlaying(!isPlaying);
              setFPS(fps + 12);
              // @ts-ignore
              spritesheetRef.current.setFps(fps + 12);
            }}
          >
            <FastForwardIcon />
          </IconButton>
        </Paper>
        <Paper
          elevation={3}
          style={{ borderRadius: UI.textSize * preference.scale }}
        >
          <IconButton
            style={{ fontSize: UI.textSize * preference.scale }}
            onClick={() => {
              // setIsPlaying(!isPlaying);
              setFPS(fps - 12 > 0 ? fps - 12 : 1);
              // @ts-ignore
              spritesheetRef.current.setFps(fps - 12 > 0 ? fps - 12 : 1);
            }}
          >
            <FastRewindIcon />
          </IconButton>
        </Paper>
      </div> */}
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
