export default function Logo() {
  return (
    <svg
      className="logo-group"
      width="34"
      height="34"
      viewBox="0 0 36 36"
      fill="none"
      style={{ display: 'block', overflow: 'visible' }}
    >
      <polygon
        className="logo-hex"
        points="18,1.5 32.5,9.75 32.5,26.25 18,34.5 3.5,26.25 3.5,9.75"
        stroke="#c8f542"
        strokeWidth="1.4"
        fill="none"
      />
      <polygon
        className="logo-inner"
        points="18,7 28,13 28,23 18,29 8,23 8,13"
        stroke="rgba(200,245,66,0.28)"
        strokeWidth="1"
        fill="none"
        transform="rotate(30,18,18)"
      />
      <line className="logo-cross-h" x1="9" y1="18" x2="27" y2="18" stroke="#c8f542" strokeWidth="1.4" />
      <line className="logo-cross-v" x1="18" y1="11" x2="18" y2="25" stroke="#c8f542" strokeWidth="1.4" />
      <circle className="logo-dot" cx="18" cy="18" r="2.5" fill="#c8f542" />
    </svg>
  )
}
