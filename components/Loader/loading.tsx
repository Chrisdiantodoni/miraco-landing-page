import React from "react";
import Image from "next/image";
import "./loading.scss";

const Loading = ({
  size = "medium",
  fullScreen = false,
  text = "",
  image = null,
  imageSize = 60,
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
any) => {
  const sizeClass = `loading-spinner--${size}`;

  if (fullScreen) {
    return (
      <div className="loading-overlay">
        <div className="loading-container">
          {image && (
            <div className="loading-logo">
              <Image
                src={image}
                alt="Loading"
                width={imageSize}
                height={imageSize}
                className="logo-image"
              />
            </div>
          )}
          <div className={`loading-spinner ${sizeClass}`}>
            <div className="spinner-ring"></div>
          </div>
          {text && <p className="loading-text">{text}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="loading-inline">
      {image && (
        <div className="loading-logo">
          <Image
            src={image}
            alt="Loading"
            width={imageSize}
            height={imageSize}
            className="logo-image"
          />
        </div>
      )}
      <div className={`loading-spinner ${sizeClass}`}>
        <div className="spinner-ring"></div>
      </div>
      {text && <p className="loading-text">{text}</p>}
    </div>
  );
};

export default Loading;
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
