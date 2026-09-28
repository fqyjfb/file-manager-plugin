/// <reference types="vite/client" />

interface Window {
  // 由主程序 preload 脚本注入的有限 Electron API，完整方法清单见插件开发指南
  electron?: any;
}
