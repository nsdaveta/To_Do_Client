import React from 'react';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { VscChromeMinimize, VscChromeMaximize, VscChromeRestore, VscChromeClose } from 'react-icons/vsc';
import './titlebar.css';

const TitleBar = () => {
  return (
    <div data-tauri-drag-region className="titlebar">
      <div className="titlebar-title">
        <img src="/icons/32x32.png" alt="app-icon" className="titlebar-icon" />
        <span>To-Do App</span>
      </div>
    </div>
  );
};

export default TitleBar;
