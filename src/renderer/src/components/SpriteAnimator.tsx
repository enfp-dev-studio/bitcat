import { useEffect, useRef, useState } from 'react'

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
  const [backgroundPosition, setBackgroundPosition] = useState('0px 0px')
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
      setBackgroundPosition(`-${position}px 0px`)
    }, props.fps)
  }
  useEffect(() => {
    startAnimation()
    return () => {
      stopAnimation()
    }
  }, [props.spritesheet, props.fps, props.widthFrame, props.heightFrame, props.steps])
  return (
    <div
      ref={ref}
      style={{
        transform: `scale(${props.scale})`,
        width: props.widthFrame,
        height: props.heightFrame,
        backgroundImage: `url(${props.spritesheet})`,
        backgroundPosition: backgroundPosition
      }}
    ></div>
  )
}
