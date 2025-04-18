type BorderAnimationProps = {
  className?: string;
  children: any;
  time?: number;
  firstColor?: string;
  secColor?: string;
  width?: number;
};

const BorderAnimation: React.FC<BorderAnimationProps> = ({
  className,
  children,
  time = 3,
  width = 2,
  firstColor = "#BD9CFF",
  secColor = "#2B1055",
  
}) => {
  return (
    <div
      className={`relative flex items-center justify-center border-transparent ${className}`}
      style={
        {
          border: `${width}px solid transparent`,
          "--border-angle": "0turn",
          background: `
          conic-gradient(from var(--border-angle), transparent,transparent 5%, transparent 60%, transparent 95%) padding-box,
          conic-gradient(from var(--border-angle), transparent 90%, ${firstColor}, ${secColor} 99%, transparent) border-box,
          conic-gradient(from var(--border-angle), transparent, transparent 5%, transparent 60%, transparent 95%) border-box
        `,
          animation: `bg-spin ${time}s cubic-bezier(0.8, 0.7, 0.65, .7) infinite`,
        } as React.CSSProperties
      }
    >
      {children}
      <style>{`
          @keyframes bg-spin {
            to {
              --border-angle: 1turn;
            }
          }
        `}</style>
    </div>
  );
};

export default BorderAnimation;
