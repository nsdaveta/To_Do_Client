import React from 'react';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { VscChromeMinimize, VscChromeMaximize, VscChromeRestore, VscChromeClose } from 'react-icons/vsc';
import './titlebar.css';

const appWindow = getCurrentWindow();

const TitleBar = () => {
  const [isMaximized, setIsMaximized] = React.useState(false);

  React.useEffect(() => {
    const updateMaximized = async () => {
      setIsMaximized(await appWindow.isMaximized());
    };
    
    updateMaximized();
    const unlisten = appWindow.onResized(() => {
      updateMaximized();
    });

    return () => {
      unlisten.then(u => u());
    };
  }, []);

  const handleMinimize = () => appWindow.minimize();
  const handleMaximize = async () => {
    await appWindow.toggleMaximize();
    setIsMaximized(await appWindow.isMaximized());
  };
  const handleClose = () => appWindow.close();

  return (
    <div data-tauri-drag-region className="titlebar">
      <div className="titlebar-title">
        <img src="/icons/32x32.png" alt="app-icon" className="titlebar-icon" />
        <span>To-Do App</span>
      </div>
      <div className="titlebar-controls">
        <div className="titlebar-button" onClick={handleMinimize}>
          <VscChromeMinimize />
        </div>
        <div className="titlebar-button" onClick={handleMaximize}>
          {isMaximized ? <VscChromeRestore /> : <VscChromeMaximize />}
        </div>
        <div className="titlebar-button titlebar-button-close" onClick={handleClose}>
          <VscChromeClose />
        </div>
      </div>
    </div>
  );
};

export default TitleBar;
