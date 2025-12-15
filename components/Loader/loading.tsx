import React from "react";
import Image from "next/image";

const Loading = ({
  size = "medium",
  fullScreen = false,
  text = "",
  image = null,
  imageSize = 80,
}) => {
  const sizeClass = `loading-spinner--${size}`;

  if (fullScreen) {
    return (
      <div className="loading-overlay">
        <div className="loading-container">
          {image ? (
            <div className="loading-image-container">
              <Image
                src={image}
                alt="Loading"
                className="loading-image"
                width={imageSize}
                height={imageSize}
                priority
              />
              <div
                className={`loading-spinner ${sizeClass} spinner-with-image`}
              >
                <div className="spinner-ring"></div>
                <div className="spinner-ring"></div>
                <div className="spinner-ring"></div>
              </div>
            </div>
          ) : (
            <div className={`loading-spinner ${sizeClass}`}>
              <div className="spinner-ring"></div>
              <div className="spinner-ring"></div>
              <div className="spinner-ring"></div>
              <div className="spinner-core"></div>
            </div>
          )}
          {text && <p className="loading-text">{text}</p>}
        </div>
        <style jsx>{styles}</style>
      </div>
    );
  }

  return (
    <div className="loading-inline">
      {image ? (
        <div className="loading-image-container">
          <Image
            src={image}
            alt="Loading"
            className="loading-image"
            width={imageSize}
            height={imageSize}
            priority
          />
          <div className={`loading-spinner ${sizeClass} spinner-with-image`}>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
          </div>
        </div>
      ) : (
        <div className={`loading-spinner ${sizeClass}`}>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-core"></div>
        </div>
      )}
      {text && <p className="loading-text">{text}</p>}
      <style jsx>{styles}</style>
    </div>
  );
};

const styles = `
  .loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    animation: fadeIn 0.3s ease-in-out;
  }

  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }

  .loading-inline {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
  }

  .loading-image-container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .loading-image {
    position: relative;
    z-index: 2;
    border-radius: 50%;
    object-fit: cover;
    animation: pulse 1.5s ease-in-out infinite;
  }

  .loading-spinner {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .spinner-with-image {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 120% !important;
    height: 120% !important;
  }

  .loading-spinner--small {
    width: 40px;
    height: 40px;
  }

  .loading-spinner--medium {
    width: 60px;
    height: 60px;
  }

  .loading-spinner--large {
    width: 80px;
    height: 80px;
  }

  .spinner-ring {
    position: absolute;
    border-radius: 50%;
    border: 3px solid transparent;
  }

  .loading-spinner--small .spinner-ring {
    border-width: 2px;
  }

  .loading-spinner--medium .spinner-ring {
    border-width: 3px;
  }

  .loading-spinner--large .spinner-ring {
    border-width: 4px;
  }

  .spinner-ring:nth-child(1) {
    width: 100%;
    height: 100%;
    border-top-color: #070143;
    border-right-color: #070143;
    animation: spin 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
  }

  .spinner-ring:nth-child(2) {
    width: 75%;
    height: 75%;
    border-bottom-color: #8188a9;
    border-left-color: #8188a9;
    animation: spin 2s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite reverse;
  }

  .spinner-ring:nth-child(3) {
    width: 50%;
    height: 50%;
    border-top-color: #1a1729;
    border-right-color: #1a1729;
    animation: spin 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
  }

  .spinner-core {
    position: absolute;
    width: 25%;
    height: 25%;
    background: linear-gradient(135deg, #070143 0%, #1a1729 100%);
    border-radius: 50%;
    animation: pulse 1.5s ease-in-out infinite;
  }

  .loading-text {
    margin: 0;
    font-size: 15px;
    color: #687693;
    font-weight: 500;
    font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    animation: fadeIn 0.5s ease-in-out;
  }

  .loading-spinner--small + .loading-text {
    font-size: 13px;
  }

  .loading-spinner--large + .loading-text {
    font-size: 17px;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes pulse {
    0%, 100% {
      transform: scale(0.95);
      opacity: 0.8;
    }
    50% {
      transform: scale(1.05);
      opacity: 1;
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    .loading-spinner--small {
      width: 35px;
      height: 35px;
    }

    .loading-spinner--medium {
      width: 50px;
      height: 50px;
    }

    .loading-spinner--large {
      width: 65px;
      height: 65px;
    }

    .loading-text {
      font-size: 13px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .spinner-ring,
    .spinner-core,
    .loading-image {
      animation: none;
    }
  }
`;
export default Loading;
// Demo Component
// const LoadingDemo = () => {
//   const [showFullScreen, setShowFullScreen] = React.useState(false);
//   const [showWithImage, setShowWithImage] = React.useState(false);

//   // Demo logo URL (you can replace with your own)
//   const demoLogo =
//     "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=200&h=200&fit=crop";

//   return (
//     <div
//       style={{
//         padding: "2rem",
//         fontFamily:
//           "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
//       }}
//     >
//       <h1
//         style={{
//           marginBottom: "2rem",
//           color: "#070143",
//           fontFamily: "'Poppins', sans-serif",
//         }}
//       >
//         Elegant Loading Component
//       </h1>

//       <div style={{ marginBottom: "3rem" }}>
//         <h2 style={{ marginBottom: "1rem", color: "#070143" }}>
//           Different Sizes
//         </h2>
//         <div
//           style={{
//             display: "flex",
//             gap: "2rem",
//             flexWrap: "wrap",
//             alignItems: "center",
//           }}
//         >
//           <div>
//             <p
//               style={{
//                 marginBottom: "0.5rem",
//                 fontSize: "13px",
//                 color: "#687693",
//               }}
//             >
//               Small
//             </p>
//             <Loading size="small" />
//           </div>
//           <div>
//             <p
//               style={{
//                 marginBottom: "0.5rem",
//                 fontSize: "13px",
//                 color: "#687693",
//               }}
//             >
//               Medium
//             </p>
//             <Loading size="medium" />
//           </div>
//           <div>
//             <p
//               style={{
//                 marginBottom: "0.5rem",
//                 fontSize: "13px",
//                 color: "#687693",
//               }}
//             >
//               Large
//             </p>
//             <Loading size="large" />
//           </div>
//         </div>
//       </div>

//       <div style={{ marginBottom: "3rem" }}>
//         <h2 style={{ marginBottom: "1rem", color: "#070143" }}>With Text</h2>
//         <Loading size="medium" text="Loading data..." />
//       </div>

//       <div style={{ marginBottom: "3rem" }}>
//         <h2 style={{ marginBottom: "1rem", color: "#070143" }}>
//           With Custom Image/Logo
//         </h2>
//         <div
//           style={{
//             display: "flex",
//             gap: "2rem",
//             flexWrap: "wrap",
//             alignItems: "center",
//           }}
//         >
//           <div>
//             <p
//               style={{
//                 marginBottom: "0.5rem",
//                 fontSize: "13px",
//                 color: "#687693",
//               }}
//             >
//               With Image
//             </p>
//             <Loading
//               size="medium"
//               image={demoLogo}
//               imageSize={60}
//               text="Loading..."
//             />
//           </div>
//           <div>
//             <p
//               style={{
//                 marginBottom: "0.5rem",
//                 fontSize: "13px",
//                 color: "#687693",
//               }}
//             >
//               Large with Image
//             </p>
//             <Loading size="large" image={demoLogo} imageSize={80} />
//           </div>
//         </div>
//       </div>

//       <div style={{ marginBottom: "2rem" }}>
//         <h2 style={{ marginBottom: "1rem", color: "#070143" }}>
//           Full Screen Options
//         </h2>
//         <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
//           <button
//             onClick={() => setShowFullScreen(true)}
//             style={{
//               padding: "0.75rem 1.5rem",
//               backgroundColor: "#070143",
//               color: "#fff",
//               border: "none",
//               borderRadius: "8px",
//               cursor: "pointer",
//               fontSize: "15px",
//               fontWeight: "500",
//               fontFamily: "'Poppins', sans-serif",
//               transition: "all 0.3s ease",
//             }}
//             onMouseEnter={(e) => (e.target.style.backgroundColor = "#1a1729")}
//             onMouseLeave={(e) => (e.target.style.backgroundColor = "#070143")}
//           >
//             Full Screen Loading
//           </button>

//           <button
//             onClick={() => setShowWithImage(true)}
//             style={{
//               padding: "0.75rem 1.5rem",
//               backgroundColor: "#8188a9",
//               color: "#fff",
//               border: "none",
//               borderRadius: "8px",
//               cursor: "pointer",
//               fontSize: "15px",
//               fontWeight: "500",
//               fontFamily: "'Poppins', sans-serif",
//               transition: "all 0.3s ease",
//             }}
//             onMouseEnter={(e) => (e.target.style.backgroundColor = "#687693")}
//             onMouseLeave={(e) => (e.target.style.backgroundColor = "#8188a9")}
//           >
//             Full Screen with Logo
//           </button>
//         </div>
//       </div>

//       {showFullScreen && (
//         <div onClick={() => setShowFullScreen(false)}>
//           <Loading fullScreen text="Loading, please wait..." />
//         </div>
//       )}

//       {showWithImage && (
//         <div onClick={() => setShowWithImage(false)}>
//           <Loading
//             fullScreen
//             image={demoLogo}
//             imageSize={100}
//             text="Loading your content..."
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default LoadingDemo;
