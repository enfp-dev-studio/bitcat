export const CloseIcon = ({ size }: { size: number | string }) => {
  return (
    <div style={{ width: size, height: size }}>
      <svg style={{ pointerEvents: 'none' }} width="100%" height="100%" viewBox="0 0 512 512">
        <path
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="32"
          d="M368 368L144 144M368 144L144 368"
        />
      </svg>
    </div>
  )
}

export const ArrowDropUpIcon = ({ size }: { size: number | string }) => {
  return (
    <div
      style={{
        width: size,
        height: size,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 15 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M4 9H11L7.5 4.5L4 9Z" fill="currentColor"></path>
      </svg>
    </div>
  )
}

export const ArrowDropDownIcon = ({ size }: { size: number | string }) => {
  return (
    <div
      style={{
        width: size,
        height: size,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 15 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M4 6H11L7.5 10.5L4 6Z" fill="currentColor"></path>
      </svg>
    </div>
  )
}
