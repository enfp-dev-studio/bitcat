import React, { useEffect, useRef } from 'react';

// https://github.com/danilosetra/react-responsive-spritesheet/blob/master/src/js/Spritesheet.js

export type SpritesheetProp = {
    image: string,
    widthFrame: number,
    heightFrame: number,
    steps: number,
    fps: number,
    className?: string
    style?: object
    isResponsive?: boolean,
    direction?: string,
    timeout?: number,
    autoplay?: boolean,
    loop?: boolean,
    startAt?: number,
    endAt?: number | false,
}

type State = {
    id,
    spriteEl,
    spriteElContainer,
    spriteElMove,
    imageSprite,
    cols,
    rows,
    intervalSprite,
    startAt,
    endAt,
    completeLoopCicles,
    isPlaying,
    spriteScale,
    frame,
    fps,
    direction,
    steps

}

const defaultProp = {
    className: '',
    style: {},
    isResponsive: true,
    direction: 'forward',
    timeout: 0,
    autoplay: true,
    loop: false,
    startAt: 0,
    endAt: false,
}

const Spritesheet = (props: SpritesheetProp) => {

    const state = useRef<State & any>({})
    useEffect(() => {
        state.current.id = `react-responsive-spritesheet`;
        state.current.spriteEl = state.current.spriteElContainer = state.current.spriteElMove = state.current.imageSprite = state.current.cols = state.current.rows = null;
        state.current.intervalSprite = false;
        state.current.startAt = setStartAt(props.startAt ? props.startAt : defaultProp.startAt);
        state.current.endAt = setEndAt(props.endAt ? props.endAt : defaultProp.endAt);
        state.current.direction = setDirection(props.direction ? props.direction : defaultProp.direction);
        state.current.completeLoopCicles = 0;
        state.current.isPlaying = false;
        state.current.spriteScale = 1;
        state.current.frame = props.startAt ? props.startAt : props.direction === 'rewind' ? props.steps - 1 : 0

        state.current.fps = setFps(props.fps)
        state.current.steps = props.steps

        init();
        return () =>
            window.removeEventListener('resize', () => {
                resize()
            });
    }, [])


    const renderElements = () => {
        const {
            image,
            className,
            style,
            widthFrame,
            heightFrame,
            // background,
            // backgroundSize,
            // backgroundRepeat,
            // backgroundPosition,
            // onClick,
            // onDoubleClick,
            // onMouseMove,
            // onMouseEnter,
            // onMouseLeave,
            // onMouseOver,
            // onMouseOut,
            // onMouseDown,
            // onMouseUp
        } = props;

        let containerStyles = {
            position: 'relative',
            overflow: 'hidden',
            width: `${widthFrame}px`,
            height: `${heightFrame}px`,
            transform: `scale(${state.current.spriteScale})`,
            transformOrigin: '0 0',
            // backgroundImage: `url(${background})`,
            // backgroundSize,
            // backgroundRepeat,
            // backgroundPosition
        };

        let moveStyles = {
            overflow: 'hidden',
            backgroundRepeat: 'no-repeat',
            display: 'table-cell',
            backgroundImage: `url(${image})`,
            width: `${widthFrame}px`,
            height: `${heightFrame}px`,
            transformOrigin: '0 50%'
        };

        let elMove = React.createElement('div', {
            className: 'react-responsive-spritesheet-container__move',
            style: moveStyles
        });

        let elContainer = React.createElement(
            'div',
            { className: 'react-responsive-spritesheet-container', style: containerStyles },
            elMove
        );

        let elSprite = React.createElement(
            'div',
            {
                className: `react-responsive-spritesheet ${className}`,
                style,
                // onClick: () => onClick(setInstance()),
                // onDoubleClick: () => onDoubleClick(setInstance()),
                // onMouseMove: () => onMouseMove(setInstance()),
                // onMouseEnter: () => onMouseEnter(setInstance()),
                // onMouseLeave: () => onMouseLeave(setInstance()),
                // onMouseOver: () => onMouseOver(setInstance()),
                // onMouseOut: () => onMouseOut(setInstance()),
                // onMouseDown: () => onMouseDown(setInstance()),
                // onMouseUp: () => onMouseUp(setInstance())
            },
            elContainer
        );

        return elSprite;
    };

    const init = () => {
        // const { image, widthFrame, heightFrame, autoplay, getInstance, onInit } = props;
        const { image, widthFrame, heightFrame, autoplay } = props;

        let imgLoadSprite = new Image();
        imgLoadSprite.src = image;
        imgLoadSprite.onload = () => {
            if (document && document.querySelector(`.${state.current.id}`)) {
                state.current.imageSprite = imgLoadSprite;
                state.current.cols = state.current.imageSprite.width === widthFrame ? 1 : state.current.imageSprite.width / widthFrame;
                state.current.rows = state.current.imageSprite.height === heightFrame ? 1 : state.current.imageSprite.height / heightFrame;

                state.current.spriteEl = document.querySelector(`.${state.current.id}`);
                state.current.spriteElContainer = state.current.spriteEl.querySelector('.react-responsive-spritesheet-container');
                state.current.spriteElMove = state.current.spriteElContainer.querySelector('.react-responsive-spritesheet-container__move');

                resize(false);
                window.addEventListener('resize', () => {
                    resize()
                });
                moveImage(false);
                setTimeout(() => {
                    resize(false);
                }, 10);

                if (autoplay !== false) play(true);

                // const instance = setInstance();

                // getInstance(instance);
                // onInit(instance);
            }
        };

        imgLoadSprite.onerror = () => {
            throw new Error(`Failed to load image ${imgLoadSprite.src}`);
        };
    };

    const resize = (callback = true) => {
        // const { widthFrame, onResize } = props;
        const { widthFrame } = props;

        if (state.current.isResponsive) {
            state.current.spriteScale = state.current.spriteEl.offsetWidth / widthFrame;
            state.current.spriteElContainer.style.transform = `scale(${state.current.spriteScale})`;
            state.current.spriteEl.style.height = `${getInfo('height')}px`;
            // if (callback && onResize) onResize(setInstance());
        }
    };

    const play = (withTimeout = false) => {
        // const { onPlay, timeout } = props;
        const { timeout } = props;

        if (!state.current.isPlaying) {
            setTimeout(() => {
                // onPlay(this.setInstance());
                setIntervalPlayFunctions();
                state.current.isPlaying = true;
            }, withTimeout ? timeout : 0);
        }
    };

    const setIntervalPlayFunctions = () => {
        if (state.current.intervalSprite) clearInterval(state.current.intervalSprite);
        state.current.intervalSprite = setInterval(() => {
            if (state.current.isPlaying) moveImage();
        }, 1000 / state.current.fps);
    };

    const moveImage = (play = true) => {
        // const { onEnterFrame, onEachFrame, loop, onLoopComplete } = props;
        const { loop } = props;

        let currentRow = Math.floor(state.current.frame / state.current.cols);
        let currentCol = state.current.frame - state.current.cols * currentRow;
        state.current.spriteElMove.style.backgroundPosition = `-${props.widthFrame * currentCol}px -${props.heightFrame *
            currentRow}px`;

        // if (onEnterFrame) {
        //     onEnterFrame.map((frameAction, i) => {
        //         if (frameAction.frame === state.current.frame && frameAction.callback) {
        //             frameAction.callback();
        //         }
        //     });
        // }

        // if (play) {
        //     if (this.direction === 'rewind') {
        //         this.frame -= 1;
        //     } else {
        //         this.frame += 1;
        //     }
        //     if (onEachFrame) onEachFrame(this.setInstance());
        // }

        if (state.current.isPlaying) {
            if (
                (state.current.direction === 'forward' && (state.current.frame === state.current.steps || state.current.frame === state.current.endAt)) ||
                (state.current.direction === 'rewind' && (state.current.frame === -1 || state.current.frame === state.current.endAt))
            ) {
                if (loop) {
                    // if (onLoopComplete) onLoopComplete(state.current.setInstance());
                    state.current.completeLoopCicles += 1;
                    state.current.frame = state.current.startAt ? state.current.startAt : state.current.direction === 'rewind' ? state.current.steps - 1 : 0;
                } else {
                    pause();
                }
            }
        }
    };

    const pause = () => {
        // const { onPause } = props;

        state.current.isPlaying = false;
        clearInterval(state.current.intervalSprite);
        // onPause(this.setInstance());
    };

    // const goToAndPlay = frame => {
    //     this.frame = frame ? frame : this.frame;
    //     this.play();
    // };

    // const goToAndPause = frame => {
    //     this.pause();
    //     this.frame = frame ? frame : this.frame;
    //     this.moveImage();
    // };

    const setStartAt = frame => {
        state.current.startAt = frame ? frame - 1 : 0;
        return state.current.startAt;
    };

    const setEndAt = frame => {
        state.current.endAt = frame;
        return state.current.endAt;
    };

    const setFps = (fps) => {
        state.current.fps = fps;
        setIntervalPlayFunctions();
    }

    const setDirection = direction => {
        state.current.direction = direction === 'rewind' ? 'rewind' : 'forward';
        return state.current.direction;
    };

    const getInfo = param => {
        switch (param) {
            case 'direction':
                return state.current.direction;
            case 'frame':
                return state.current.frame;
            case 'fps':
                return state.current.fps;
            case 'steps':
                return state.current.steps;
            case 'width':
                return state.current.spriteElContainer.getBoundingClientRect().width;
            case 'height':
                return state.current.spriteElContainer.getBoundingClientRect().height;
            case 'scale':
                return state.current.spriteScale;
            case 'isPlaying':
                return state.current.isPlaying;
            case 'isPaused':
                return !state.current.isPlaying;
            case 'completeLoopCicles':
                return state.current.completeLoopCicles;
            default:
                throw new Error(
                    `Invalid param \`${param}\` requested by Spritesheet.getinfo(). See the documentation on https://github.com/danilosetra/react-responsive-spritesheet`
                );
        }
    };

    // const setInstance = () => {
    //     return {
    //         play,
    //         pause,
    //         // goToAndPlay,
    //         // goToAndPause,
    //         setStartAt,
    //         setEndAt,
    //         setFps,
    //         setDirection,
    //         getInfo
    //     };
    // }

    return renderElements();
}

export default Spritesheet;