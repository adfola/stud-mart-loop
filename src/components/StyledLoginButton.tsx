interface StyledLoginButtonProps {
  onClick: () => void;
}

export default function StyledLoginButton({ onClick }: StyledLoginButtonProps) {
  return (
    <div 
      aria-label="User Login Button" 
      tabIndex={0} 
      role="button" 
      onClick={onClick}
      className="user-profile w-[131px] h-[51px] rounded-[15px] cursor-pointer transition-all duration-300 flex items-center justify-center"
      style={{
        background: 'linear-gradient(to bottom right, #2e8eff 0%, rgba(46, 142, 255, 0) 30%)',
        backgroundColor: 'rgba(46, 142, 255, 0.2)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(46, 142, 255, 0.7)';
        e.currentTarget.style.boxShadow = '0 0 10px rgba(46, 142, 255, 0.5)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(46, 142, 255, 0.2)';
        e.currentTarget.style.boxShadow = 'none';
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
    >
      <div className="w-[127px] h-[47px] rounded-[13px] bg-[#1a1a1a] flex items-center justify-center gap-[15px] text-white font-semibold">
        <svg 
          aria-hidden="true" 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24"
          className="w-[27px] h-[27px] fill-white"
        >
          <g data-name="Layer 2" id="Layer_2">
            <path d="m15.626 11.769a6 6 0 1 0 -7.252 0 9.008 9.008 0 0 0 -5.374 8.231 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 9.008 9.008 0 0 0 -5.374-8.231zm-7.626-4.769a4 4 0 1 1 4 4 4 4 0 0 1 -4-4zm10 14h-12a1 1 0 0 1 -1-1 7 7 0 0 1 14 0 1 1 0 0 1 -1 1z" />
          </g>
        </svg>
        <p>Log In</p>
      </div>
    </div>
  );
}
