const Tooltip = (props) => {
  const { text, children, className = "left-1/2" } = props;
  // tool code in my todo list app
  return (
    <div className="relative flex items-center group">
      {children}
      <div
        className={`absolute bottom-full ${className} transform -translate-x-1/2 mb-3 hidden group-hover:block z-10`}
      >
        {/* tool contain */}
        <div className="bg-gray-800 text-white text-xs rounded py-2 px-3 relative max-w-sm break-words">
          {text}
          {/* aero point */}
          <div
            className={`absolute bottom-[-6px] left-1/2 `}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Tooltip;
