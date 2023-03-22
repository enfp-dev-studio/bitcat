import { useEffect, useRef } from 'react'

type Props = {
  scale: number
  spritesheet: string
  fps: number
  widthFrame: number
  heightFrame: number
  steps: number
  // direction: string,
  loop: boolean
}

let position = 0
export const SpriteAnimator = (props: Props) => {
  const animationInterval = useRef<NodeJS.Timer | null>(null)
  const ref = useRef<HTMLDivElement | null>(null)
  // const [backgroundPosition, setBackgroundPosition] = useState('0px 0px')
  const stopAnimation = () => {
    animationInterval.current && clearInterval(animationInterval.current)
  }
  const startAnimation = () => {
    if (animationInterval.current) stopAnimation()
    const diff = props.widthFrame
    animationInterval.current = setInterval(() => {
      if (position >= props.widthFrame * props.steps) {
        position = props.widthFrame
      } else {
        position += diff
      }
      if (ref.current) {
        ref.current.style.backgroundPosition = `-${position}px 0px`
      }
    }, props.fps)
  }
  useEffect(() => {
    startAnimation()
    return () => {
      stopAnimation()
    }
  }, [])
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'hidden',
      width: `${props.widthFrame}px`,
      height: `${props.heightFrame}px`,
      transform: `scale(${props.scale})`,
      transformOrigin: '0 0',
      backgroundColor: 'transparent'
    }}>
      <div
        ref={ref}
        style={{
          overflow: 'hidden',
          // backgroundRepeat: 'no-repeat',
          display: 'table-cell',
          backgroundImage: `url(${props.spritesheet})`,
          width: `${props.widthFrame}px`,
          height: `${props.heightFrame}px`,
          // transformOrigin: '0 50%'
        }}
      ></div>
    </div>
  )
}
