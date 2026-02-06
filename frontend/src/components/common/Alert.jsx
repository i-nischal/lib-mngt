const Card = ({ 
  children, 
  className = '',
  padding = 'p-6',
  hover = false 
}) => {
  return (
    <div 
      className={`bg-white rounded-xl border border-gray-200 shadow-sm ${padding} ${
        hover ? 'hover:shadow-md transition-shadow duration-200' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;