import React from 'react';
import ReactDOM from 'react-dom/client';
import ToolPanel from './ToolPanel';

const PluginApp: React.FC = () => {
  return <ToolPanel />;
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
