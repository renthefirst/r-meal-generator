

const Logo = () => (
  <svg
    width="60"
    height="60"
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="cursor-pointer hover:bg-emerald-100 rounded-full transitions-colors duration-300"
  >
    <path
      d="M60 20C40 20 20 40 20 60C20 80 40 100 60 100C80 100 100 80 100 60C100 40 80 20 60 20ZM60 90C45 90 30 75 30 60C30 45 45 30 60 30C75 30 90 45 90 60C90 75 75 90 60 90Z"
      fill="url(#appleGradient)"
    />
    <path
      d="M60 10C55 10 50 15 50 20C50 25 55 30 60 30C65 30 70 25 70 20C70 15 65 10 60 10Z"
      fill="#34D399"
    />
    <path
      d="M60 15C58 15 56 17 56 19V25C56 27 58 29 60 29C62 29 64 27 64 25V19C64 17 62 15 60 15Z"
      fill="#065F46"
    />
    <defs>
      <linearGradient
        id="appleGradient"
        x1="60"
        y1="20"
        x2="60"
        y2="100"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0%" stopColor="#34D399" />
        <stop offset="100%" stopColor="#065F46" />
      </linearGradient>
    </defs>
  </svg>
);

export default Logo;
