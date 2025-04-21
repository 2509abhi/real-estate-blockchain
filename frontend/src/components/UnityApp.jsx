import React, { useEffect, useRef, useState } from 'react';

const UnityApp = ({ unityConfig }) => {
  const containerRef = useRef(null);
  const unityInstanceRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!unityConfig) return; // If no config, do nothing (fallback message)

    const container = containerRef.current;
    if (!container) return;

    const canvas = container.querySelector('#unity-canvas');
    const warningBanner = container.querySelector('#unity-warning');
    const fullscreenButton = container.querySelector('#unity-fullscreen-button');

    const loadingBar = container.querySelector('#unity-loading-bar');
    if (loadingBar) {
      loadingBar.style.display = 'none';
    }

    function unityShowBanner(msg, type) {
      const div = document.createElement('div');
      div.innerHTML = msg;
      warningBanner.appendChild(div);
      if (type === 'error') {
        div.style = 'background: red; padding: 10px;';
      } else if (type === 'warning') {
        div.style = 'background: yellow; padding: 10px;';
        setTimeout(() => {
          warningBanner.removeChild(div);
        }, 5000);
      }
    }

    const loaderUrl = unityConfig.loaderUrl || `${unityConfig.buildUrl}/Apartment1.loader.js`;
    const config = {
      dataUrl: unityConfig.dataUrl || `${unityConfig.buildUrl}/Apartment1.data.gz`,
      frameworkUrl: unityConfig.frameworkUrl || `${unityConfig.buildUrl}/Apartment1.framework.js.gz`,
      codeUrl: unityConfig.codeUrl || `${unityConfig.buildUrl}/Apartment1.wasm.gz`,
      streamingAssetsUrl: unityConfig.streamingAssetsUrl || 'StreamingAssets',
      companyName: unityConfig.companyName || 'Vineet',
      productName: unityConfig.productName || 'Apartment 1',
      productVersion: unityConfig.productVersion || '0.1',
      showBanner: unityShowBanner,
    };

    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, height=device-height, initial-scale=1.0, user-scalable=no, shrink-to-fit=yes';
      document.head.appendChild(meta);
      container.className = 'unity-mobile';
      canvas.className = 'unity-mobile';
    }

    const script = document.createElement('script');
    script.src = loaderUrl;
    script.onload = () => {
      createUnityInstance(canvas, config, (p) => {
        setProgress(Math.round(p * 100));
      })
        .then((instance) => {
          unityInstanceRef.current = instance;
          setIsLoading(false); // Hide our custom loader
          fullscreenButton.onclick = () => {
            instance.SetFullscreen(1);
          };
        })
        .catch((message) => {
          alert(message);
        });
    };

    container.appendChild(script);

    return () => {
      if (unityInstanceRef.current) {
        unityInstanceRef.current.Quit();
      }
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [unityConfig]);

  return (
    <div
      ref={containerRef}
      id="unity-container"
      style={{
        position: 'relative',
        width: '100%',
        height: '60vh', // example height
        overflow: 'hidden',
      }}
    >
      {isLoading && (
        <div style={{
          position: 'absolute',
          zIndex: 9999,
          top: 0, left: 0, right: 0, bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)'
        }}>
          <div style={{ color: '#fff', fontSize: '18px' }}>
          Explore the future in 3D—where design meets reality... {progress}%
          </div>
        </div>
      )}

      <canvas
        id="unity-canvas"
        style={{
          width: '100%',
          height: '100%',
        }}
        tabIndex="-1"
      ></canvas>

      <div id="unity-warning" style={{ position: 'absolute', top: 0, left: 0, right: 0 }}></div>
      <div id="unity-footer" style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
        <div id="unity-webgl-logo"></div>
        <div id="unity-fullscreen-button" style={{ cursor: 'pointer' }}></div>
        <div id="unity-build-title">{unityConfig?.productName || 'Apartment 1'}</div>
      </div>
    </div>
  );
};

export default UnityApp;
