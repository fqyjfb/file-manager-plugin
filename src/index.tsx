import React from 'react';
import ReactDOM from 'react-dom/client';
import { Folder } from 'lucide-react';
import ToolPanel from './ToolPanel';

const PluginHeader: React.FC<{ title: string }> = ({ title }) => {
  const handleMinimize = () => {
    (window as any).electron?.plugin?.minimizeWindow();
  };

  const handleMaximize = () => {
    (window as any).electron?.plugin?.maximizeWindow();
  };

  const handleClose = () => {
    (window as any).electron?.plugin?.closeWindow();
  };

  return (
    <div className="plugin-header">
      <div className="plugin-header-title">{title}</div>
      <div className="plugin-header-controls">
        <button onClick={handleMinimize}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14" />
          </svg>
        </button>
        <button onClick={handleMaximize}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          </svg>
        </button>
        <button onClick={handleClose}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const PluginApp: React.FC = () => {
  const pluginData = (window as any).__PLUGIN_DATA__;
  const title = pluginData?.pluginName || '文件管理';

  return (
    <React.Fragment>
      <PluginHeader title={title} />
      <div className="plugin-content">
        <ToolPanel />
      </div>
    </React.Fragment>
  );
};

function renderStandalone() {
  const root = document.getElementById('root');
  if (!root) {
    console.error('Root element not found');
    return;
  }

  ReactDOM.createRoot(root).render(<PluginApp />);
}

function registerPlugin(api: any) {
  const { registerTool, registerSidebarButton, openPluginWindow } = api;

  registerTool({
    id: 'plugin-file-manager',
    name: '文件管理',
    iconName: 'Folder',
    color: '#059669',
    textColor: '#ffffff',
    path: '/tools/plugin-file-manager',
    component: ToolPanel,
  });

  registerSidebarButton({
    id: 'plugin-file-manager-btn',
    icon: 'Folder',
    label: '文件管理',
    onClick: () => {
      openPluginWindow?.('plugin-file-manager');
    },
  });
}

const pluginData = (window as any).__PLUGIN_DATA__;

if (pluginData) {
  renderStandalone();
}
