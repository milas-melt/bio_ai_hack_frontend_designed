import { useEffect, useRef, useState } from 'react';

// Knowledge Base Creation Animation
const KnowledgeBaseAnimation = () => {
  return (
    <div className="w-72 h-72 mx-auto relative">
      <svg viewBox="0 0 300 300" className="w-full h-full">
        {/* Books stacking animation */}
        {[0, 1, 2, 3, 4].map((i) => (
          <rect
            key={i}
            x={100}
            y={250 - i * 30}
            width={100}
            height={25}
            rx={3}
            fill={`hsl(${210 + i * 10}, 80%, ${60 + i * 5}%)`}
            style={{
              opacity: 0,
              animation: `slideIn 0.5s ease-out ${i * 0.2}s forwards`
            }}
          />
        ))}
        
        {/* DNA helix symbol */}
        <path
          d="M180 50 Q 220 100 180 150 Q 140 200 180 250"
          fill="none"
          stroke="#3B82F6"
          strokeWidth="3"
          style={{
            strokeDasharray: 200,
            strokeDashoffset: 200,
            animation: "drawLine 2s ease-out forwards"
          }}
        />
      </svg>
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes drawLine {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
};


const FDADataAnimation = () => {
    const [dataPoints, setDataPoints] = useState([]);
    
    useEffect(() => {
      // Generate random data points that appear to be "loaded"
      const interval = setInterval(() => {
        setDataPoints(prev => {
          if (prev.length >= 12) return [];
          return [...prev, {
            x: 75 + Math.random() * 150,
            y: 75 + Math.random() * 150,
            size: 4 + Math.random() * 4
          }];
        });
      }, 300);
      
      return () => clearInterval(interval);
    }, []);
  
    return (
      <div className="w-72 h-72 mx-auto">
        <svg viewBox="0 0 300 300" className="w-full h-full">
          {/* FDA logo-inspired background */}
          <circle
            cx="150"
            cy="150"
            r="80"
            fill="none"
            stroke="#3B82F6"
            strokeWidth="2"
            strokeDasharray="8 4"
            className="animate-spin"
            style={{ animationDuration: '8s' }}
          />
          
          {/* Medical cross symbol */}
          <g style={{ animation: "pulseOpacity 2s infinite" }}>
            <rect
              x="140"
              y="120"
              width="20"
              height="60"
              fill="#3B82F6"
              rx="2"
            />
            <rect
              x="120"
              y="140"
              width="60"
              height="20"
              fill="#3B82F6"
              rx="2"
            />
          </g>
  
          {/* Data points loading in */}
          {dataPoints.map((point, i) => (
            <g key={i}>
              {/* Data point */}
              <circle
                cx={point.x}
                cy={point.y}
                r={point.size}
                fill="#60A5FA"
                style={{
                  opacity: 0,
                  animation: "fadeInAndPulse 2s ease-out forwards"
                }}
              />
              
              {/* Connection line to center */}
              <line
                x1="150"
                y1="150"
                x2={point.x}
                y2={point.y}
                stroke="#93C5FD"
                strokeWidth="1"
                style={{
                  opacity: 0,
                  animation: "fadeInLine 1s ease-out forwards"
                }}
              />
            </g>
          ))}
  
          {/* Loading dots at bottom */}
          {[0, 1, 2].map((i) => (
            <circle
              key={i}
              cx={135 + i * 15}
              cy={250}
              r={3}
              fill="#3B82F6"
              style={{
                animation: `loadingDots 1s ease-in-out ${i * 0.2}s infinite`
              }}
            />
          ))}
        </svg>
        
        <style jsx>{`
          @keyframes fadeInAndPulse {
            0% {
              opacity: 0;
              transform: scale(0);
            }
            50% {
              opacity: 1;
              transform: scale(1.2);
            }
            100% {
              opacity: 0.7;
              transform: scale(1);
            }
          }
          
          @keyframes fadeInLine {
            0% {
              opacity: 0;
              stroke-dasharray: 100;
              stroke-dashoffset: 100;
            }
            100% {
              opacity: 0.3;
              stroke-dasharray: 100;
              stroke-dashoffset: 0;
            }
          }
          
          @keyframes loadingDots {
            0%, 100% {
              transform: translateY(0);
              opacity: 0.3;
            }
            50% {
              transform: translateY(-10px);
              opacity: 1;
            }
          }
          
          @keyframes pulseOpacity {
            0%, 100% {
              opacity: 0.7;
            }
            50% {
              opacity: 1;
            }
          }
        `}</style>
      </div>
    );
  };


  const GraphAnimation = () => {
    const svgRef = useRef(null);
    // Add state to force re-render
    const [key, setKey] = useState(0);
    
    useEffect(() => {
      console.log("GraphAnimation mounted"); // Debug log
      
      const numNodes = 8;
      const centerX = 150;
      const centerY = 150;
      const radius = 80;
      
      const nodes = Array.from({ length: numNodes }, (_, i) => {
        const angle = (i * 2 * Math.PI) / numNodes;
        return {
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle),
          delay: (i + 1) * 0.3
        };
      });
  
      const svg = svgRef.current;
      if (svg) {
        console.log("SVG element found"); // Debug log
        svg.innerHTML = '';
        
        // Add central node
        const centralNode = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        centralNode.setAttribute("cx", centerX);
        centralNode.setAttribute("cy", centerY);
        centralNode.setAttribute("r", "8");
        centralNode.setAttribute("fill", "#3B82F6");
        centralNode.style.opacity = "0";
        centralNode.style.animation = "graphFadeIn 0.5s ease-out forwards";
        svg.appendChild(centralNode);
  
        // Add edges and nodes
        nodes.forEach((node, i) => {
          const edge = document.createElementNS("http://www.w3.org/2000/svg", "line");
          edge.setAttribute("x1", centerX.toString());
          edge.setAttribute("y1", centerY.toString());
          edge.setAttribute("x2", node.x.toString());
          edge.setAttribute("y2", node.y.toString());
          edge.setAttribute("stroke", "#93C5FD");
          edge.setAttribute("stroke-width", "2");
          edge.style.opacity = "0";
          edge.style.animation = `graphFadeIn 0.5s ease-out ${node.delay}s forwards`;
          svg.appendChild(edge);
  
          const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
          circle.setAttribute("cx", node.x.toString());
          circle.setAttribute("cy", node.y.toString());
          circle.setAttribute("r", "6");
          circle.setAttribute("fill", "#60A5FA");
          circle.style.opacity = "0";
          circle.style.animation = `graphFadeIn 0.5s ease-out ${node.delay}s forwards`;
          svg.appendChild(circle);
        });
      }
    }, [key]); // Re-run when key changes
  
    // Force re-render after mount
    useEffect(() => {
      setKey(prev => prev + 1);
    }, []);
  
    return (
      <div className="w-72 h-72 mx-auto" style={{ border: '1px solid #eee' }}> {/* Added border for debugging */}
        <svg
          ref={svgRef}
          className="w-full h-full"
          viewBox="0 0 300 300"
          style={{
            animation: "graphPulse 2s infinite"
          }}
        >
          {/* Fallback content */}
          <circle cx="150" cy="150" r="8" fill="#3B82F6" />
        </svg>
        
        {/* Embed required styles */}
        <style jsx>{`
          @keyframes graphFadeIn {
            from {
              opacity: 0;
              transform: scale(0.8);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
  
          @keyframes graphPulse {
            0% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.02);
            }
            100% {
              transform: scale(1);
            }
          }
        `}</style>
      </div>
    );
  };

// Knowledge Base Query Animation
const QueryAnimation = () => {
  const [queries, setQueries] = useState([]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setQueries(prev => {
        if (prev.length >= 5) return [];
        return [...prev, Math.random()];
      });
    }, 800);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-72 h-72 mx-auto">
      <svg viewBox="0 0 300 300" className="w-full h-full">
        {/* Central database icon */}
        <rect
          x={125}
          y={125}
          width={50}
          height={50}
          rx={5}
          fill="#3B82F6"
          className="animate-pulse"
        />
        
        {/* Query lines */}
        {queries.map((q, i) => (
          <line
            key={i}
            x1={150}
            y1={150}
            x2={50 + Math.random() * 200}
            y2={50 + Math.random() * 200}
            stroke="#93C5FD"
            strokeWidth="2"
            style={{
              opacity: 0,
              animation: "queryPing 1.5s ease-out forwards"
            }}
          />
        ))}
      </svg>
      <style jsx>{`
        @keyframes queryPing {
          0% {
            opacity: 1;
            stroke-dasharray: 0;
            stroke-dashoffset: 0;
          }
          100% {
            opacity: 0;
            stroke-dasharray: 200;
            stroke-dashoffset: 200;
          }
        }
      `}</style>
    </div>
  );
};

// Statistics Animation
const StatisticsAnimation = () => {
  const bars = [60, 80, 40, 90, 70];
  
  return (
    <div className="w-72 h-72 mx-auto">
      <svg viewBox="0 0 300 300" className="w-full h-full">
        {/* Bar chart */}
        {bars.map((height, i) => (
          <rect
            key={i}
            x={60 + i * 40}
            y={250 - height}
            width={30}
            height={height}
            fill={`hsl(${210 + i * 10}, 80%, 60%)`}
            style={{
              opacity: 0,
              animation: `growBar 1s ease-out ${i * 0.2}s forwards`
            }}
          />
        ))}
        
        {/* X and Y axis */}
        <line x1={50} y1={250} x2={250} y2={250} stroke="#333" strokeWidth="2" />
        <line x1={50} y1={250} x2={50} y2={50} stroke="#333" strokeWidth="2" />
      </svg>
      <style jsx>{`
        @keyframes growBar {
          from {
            opacity: 0;
            transform: scaleY(0);
          }
          to {
            opacity: 1;
            transform: scaleY(1);
          }
        }
      `}</style>
    </div>
  );
};

// Final Report Animation
const ReportAnimation = () => {
  return (
    <div className="w-72 h-72 mx-auto">
      <svg viewBox="0 0 300 300" className="w-full h-full">
        {/* Paper background */}
        <rect
          x={75}
          y={50}
          width={150}
          height={200}
          fill="#fff"
          stroke="#3B82F6"
          strokeWidth="2"
          style={{
            animation: "slideDown 0.5s ease-out forwards"
          }}
        />
        
        {/* Text lines */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect
            key={i}
            x={90}
            y={70 + i * 30}
            width={120}
            height={10}
            fill="#E5E7EB"
            style={{
              opacity: 0,
              animation: `fadeIn 0.3s ease-out ${0.5 + i * 0.1}s forwards`
            }}
          />
        ))}
        
        {/* Checkmark */}
        <path
          d="M120 220 L140 240 L180 180"
          stroke="#22C55E"
          strokeWidth="4"
          fill="none"
          style={{
            strokeDasharray: 100,
            strokeDashoffset: 100,
            animation: "drawCheck 0.5s ease-out 1s forwards"
          }}
        />
      </svg>
      <style jsx>{`
        @keyframes slideDown {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes drawCheck {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
};

const ProgressOverlay = ({ progress, status, details }) => {
  const getAnimation = () => {
    const statusLower = status?.toLowerCase();
    
    if (statusLower?.includes('creating')) {
      return <KnowledgeBaseAnimation />;
    }
    if (statusLower?.includes('fda')) {
        return <FDADataAnimation />;
      }
    if (statusLower?.includes('similarity')) {
      return <GraphAnimation />;
    }
    if (statusLower?.includes('querying')) {
      return <QueryAnimation />;
    }
    if (statusLower?.includes('statistics')) {
      return <StatisticsAnimation />;
    }
    if (statusLower?.includes('final')) {
      return <ReportAnimation />;
    }
    return null;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="space-y-4">
          {/* Progress bar */}
          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {/* Animation */}
          {getAnimation()}
          
          {/* Status */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900">
              {status}
            </h3>
            {details && (
              <p className="text-sm text-gray-500 mt-1">
                {details}
              </p>
            )}
          </div>
          
          {/* Percentage */}
          <div className="text-center font-mono text-sm text-gray-600">
            {Math.round(progress)}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressOverlay;