import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  Folder,
  File,
  Home,
  HardDrive,
  Plus,
  Trash2,
  ArrowLeft,
  Star,
  FolderOpen,
  Search,
  Settings,
  X,
  FileImage,
  FileText,
  FileSpreadsheet,
  FileVideo,
  FileCode,
  FileAudio,
  FileArchive,
  FileJson,
  Presentation,
  BookOpen,
  FileX,
} from 'lucide-react';

interface FileItem {
  name: string;
  path: string;
  isDirectory: boolean;
  size?: number;
  modifiedTime?: Date;
}

interface FavoriteItem {
  name: string;
  path: string;
  icon: string;
  isSystem: boolean;
}

interface PathConfig {
  id: string;
  name: string;
  path: string;
  createdAt: Date;
}

interface ContextMenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  divider?: boolean;
}

const TOAST_STORAGE_KEY = 'file-manager-toast';
const WIDTHS_STORAGE_KEY = 'file-manager-widths';

const PRIMARY_COLOR = '#059669';
const TEXT_PRIMARY = '#111827';
const TEXT_SECONDARY = '#6b7280';
const TEXT_TERTIARY = '#9ca3af';
const ERROR_COLOR = '#dc2626';
const BG_TERTIARY = '#f3f4f6';

const ToastContainer: React.FC<{ toasts: { id: number; type: 'success' | 'error' | 'warning'; message: string }[]; removeToast: (id: number) => void }> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`px-4 py-2 rounded-lg shadow-lg text-sm font-medium transition-all duration-300 transform ${
            toast.type === 'success'
              ? 'bg-green-500 text-white'
              : toast.type === 'error'
              ? 'bg-red-500 text-white'
              : 'bg-amber-500 text-white'
          }`}
          style={{ animation: 'slideIn 0.3s ease-out' }}
        >
          {toast.message}
        </div>
      ))}
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(100%); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

const Modal: React.FC<{ title: string; isOpen: boolean; onClose: () => void; onConfirm: () => void; children: React.ReactNode }> = ({ title, isOpen, onClose, onConfirm, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-4">{children}</div>
        <div className="flex justify-end gap-2 px-4 py-3 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            取消
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm hover:opacity-90 rounded-lg transition-colors"
            style={{ backgroundColor: PRIMARY_COLOR, color: '#ffffff' }}
          >
            确认
          </button>
        </div>
      </div>
    </div>
  );
};

const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`animate-spin ${sizeClasses[size]}`}>
      <svg className="w-full h-full text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
  );
};

const ContextMenu: React.FC<{ isOpen: boolean; x: number; y: number; items: ContextMenuItem[]; onClose: () => void }> = ({ isOpen, x, y, items, onClose }) => {
  useEffect(() => {
    const handleClick = () => onClose();
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 z-50 min-w-[160px]"
      style={{ left: x, top: y }}
    >
      {items.map((item) =>
        item.divider ? (
          <div key={item.id} className="border-t border-gray-200 dark:border-gray-700 my-1" />
        ) : (
          <button
            key={item.id}
            onClick={() => {
              item.onClick?.();
              onClose();
            }}
            className={`w-full flex items-center gap-2 px-3 py-1.5 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
              item.className || ''
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        )
      )}
    </div>
  );
};

const ConfirmDialog: React.FC<{ isOpen: boolean; onClose: () => void; onConfirm: () => void; title: string; message: string; deleteItemName?: string; confirmText?: string; cancelText?: string }> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  deleteItemName,
  confirmText = '确认',
  cancelText = '取消',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-sm mx-4">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-4">
          <p className="text-gray-600 dark:text-gray-400">{message}</p>
          {deleteItemName && (
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2 font-mono">{deleteItemName}</p>
          )}
        </div>
        <div className="flex justify-end gap-2 px-4 py-3 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 text-sm bg-red-500 text-white hover:bg-red-600 rounded-lg transition-colors"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

const formatSize = (bytes?: number) => {
  if (!bytes) return '-';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
};

const getFileIconType = (filename: string): string => {
  const ext = filename.split('.').pop()?.toLowerCase();

  const textExts = ['txt', 'md', 'markdown', 'log', 'readme', 'rst'];
  const codeExts = ['js', 'jsx', 'ts', 'tsx', 'css', 'scss', 'less', 'html', 'vue', 'svelte', 'react', 'py', 'java', 'cpp', 'c', 'cs', 'go', 'rs', 'php', 'rb', 'swift', 'kt', 'dart'];
  const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'ico', 'tiff', 'heic'];
  const audioExts = ['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a', 'wma'];
  const videoExts = ['mp4', 'mov', 'avi', 'mkv', 'webm', 'flv', 'wmv'];
  const spreadsheetExts = ['xls', 'xlsx', 'csv', 'tsv'];
  const archiveExts = ['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz'];
  const jsonExts = ['json'];
  const pdfExts = ['pdf'];
  const pptExts = ['ppt', 'pptx', 'key', 'odp'];

  if (textExts.includes(ext || '')) return 'text';
  if (codeExts.includes(ext || '')) return 'code';
  if (imageExts.includes(ext || '')) return 'image';
  if (audioExts.includes(ext || '')) return 'audio';
  if (videoExts.includes(ext || '')) return 'video';
  if (spreadsheetExts.includes(ext || '')) return 'spreadsheet';
  if (archiveExts.includes(ext || '')) return 'archive';
  if (jsonExts.includes(ext || '')) return 'json';
  if (pdfExts.includes(ext || '')) return 'pdf';
  if (pptExts.includes(ext || '')) return 'ppt';

  return 'file';
};

const getFileIconColor = (filename: string) => {
  const ext = filename.split('.').pop()?.toLowerCase();

  const blueExts = ['js', 'jsx', 'ts', 'tsx', 'json'];
  const greenExts = ['html', 'css', 'scss', 'less'];
  const orangeExts = ['py', 'java', 'cpp', 'c', 'cs', 'go', 'rs'];
  const redExts = ['pdf'];
  const purpleExts = ['md', 'markdown'];
  const yellowExts = ['xls', 'xlsx', 'csv'];
  const cyanExts = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
  const tealExts = ['mp3', 'wav', 'ogg'];
  const indigoExts = ['mp4', 'mov', 'avi'];
  const grayExts = ['zip', 'rar', '7z', 'tar'];
  const slateExts = ['txt', 'log', 'readme'];

  if (blueExts.includes(ext || '')) return 'text-blue-500 dark:text-blue-400';
  if (greenExts.includes(ext || '')) return 'text-green-500 dark:text-green-400';
  if (orangeExts.includes(ext || '')) return 'text-orange-500 dark:text-orange-400';
  if (redExts.includes(ext || '')) return 'text-red-500 dark:text-red-400';
  if (purpleExts.includes(ext || '')) return 'text-purple-500 dark:text-purple-400';
  if (yellowExts.includes(ext || '')) return 'text-yellow-600 dark:text-yellow-500';
  if (cyanExts.includes(ext || '')) return 'text-cyan-500 dark:text-cyan-400';
  if (tealExts.includes(ext || '')) return 'text-teal-500 dark:text-teal-400';
  if (indigoExts.includes(ext || '')) return 'text-indigo-500 dark:text-indigo-400';
  if (grayExts.includes(ext || '')) return 'text-gray-500 dark:text-gray-400';
  if (slateExts.includes(ext || '')) return 'text-slate-500 dark:text-slate-400';

  return 'text-gray-500 dark:text-gray-400';
};

const FileIconComponent: React.FC<{ type: string; className: string }> = ({ type, className }) => {
  switch (type) {
    case 'text':
      return <FileText className={className} />;
    case 'code':
      return <FileCode className={className} />;
    case 'image':
      return <FileImage className={className} />;
    case 'audio':
      return <FileAudio className={className} />;
    case 'video':
      return <FileVideo className={className} />;
    case 'spreadsheet':
      return <FileSpreadsheet className={className} />;
    case 'archive':
      return <FileArchive className={className} />;
    case 'json':
      return <FileJson className={className} />;
    case 'pdf':
      return <BookOpen className={className} />;
    case 'ppt':
      return <Presentation className={className} />;
    default:
      return <File className={className} />;
  }
};

const FileGridItem: React.FC<{ item: FileItem; isDragging: boolean; onClick: () => void; onDoubleClick: () => void; onContextMenu: (e: React.MouseEvent) => void; onDragStart: (e: React.DragEvent) => void; onDragEnd: () => void }> = ({
  item,
  isDragging,
  onClick,
  onDoubleClick,
  onContextMenu,
  onDragStart,
  onDragEnd,
}) => {
  const iconType = getFileIconType(item.name);
  const iconColor = getFileIconColor(item.name);

  return (
    <div
      className={`p-3 rounded-lg cursor-pointer border border-transparent hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all group ${
        isDragging ? 'opacity-50' : ''
      }`}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onContextMenu={onContextMenu}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      title={item.isDirectory ? '点击打开文件夹，拖拽到目标路径可复制' : '点击打开文件'}
    >
      <div className="flex items-center justify-center mb-2">
        {item.isDirectory ? (
          <div
            className="w-12 h-12 flex items-center justify-center rounded-lg transition-colors"
            style={{ backgroundColor: `${PRIMARY_COLOR}1A` }}
          >
            <Folder className="w-6 h-6" style={{ color: PRIMARY_COLOR }} />
          </div>
        ) : (
          <div className="w-12 h-12 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
            <FileIconComponent type={iconType} className={`w-6 h-6 ${iconColor}`} />
          </div>
        )}
      </div>
      <div className="text-xs text-center truncate mb-1" style={{ color: TEXT_PRIMARY }}>{item.name}</div>
      <div className="text-xs text-center" style={{ color: TEXT_TERTIARY }}>{item.isDirectory ? '文件夹' : formatSize(item.size)}</div>
    </div>
  );
};

const ToolPanel: React.FC = () => {
  const [toasts, setToasts] = useState<{ id: number; type: 'success' | 'error' | 'warning'; message: string }[]>([]);
  const [currentPath, setCurrentPath] = useState<string>('');
  const [fileList, setFileList] = useState<FileItem[]>([]);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [targetPaths, setTargetPaths] = useState<PathConfig[]>([]);
  const [activeTab, setActiveTab] = useState<'system' | 'user'>('system');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('就绪');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddPathModal, setShowAddPathModal] = useState(false);
  const [newPathName, setNewPathName] = useState('');
  const [newPathValue, setNewPathValue] = useState('');
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const [selectedTypes, setSelectedTypes] = useState<Record<string, boolean>>({
    image: true,
    document: true,
    spreadsheet: true,
    video: true,
    folder: true,
  });

  const allSelected = useMemo(() => {
    return Object.values(selectedTypes).every((v) => v);
  }, [selectedTypes]);

  const someSelected = useMemo(() => {
    return Object.values(selectedTypes).some((v) => v);
  }, [selectedTypes]);

  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [contextMenuX, setContextMenuX] = useState(0);
  const [contextMenuY, setContextMenuY] = useState(0);
  const [contextMenuTarget, setContextMenuTarget] = useState<'file' | 'favorite' | 'target' | null>(null);
  const [selectedFileItem, setSelectedFileItem] = useState<FileItem | null>(null);
  const [selectedFavoriteItem, setSelectedFavoriteItem] = useState<FavoriteItem | null>(null);
  const [selectedTargetPath, setSelectedTargetPath] = useState<PathConfig | null>(null);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<FileItem | null>(null);
  const [showDeletePathConfirm, setShowDeletePathConfirm] = useState(false);
  const [deletePathItem, setDeletePathItem] = useState<PathConfig | null>(null);

  const [leftPanelWidth, setLeftPanelWidth] = useState<number>(() => {
    const saved = localStorage.getItem(WIDTHS_STORAGE_KEY);
    return saved ? JSON.parse(saved).left : 256;
  });
  const [rightPanelWidth, setRightPanelWidth] = useState<number>(() => {
    const saved = localStorage.getItem(WIDTHS_STORAGE_KEY);
    return saved ? JSON.parse(saved).right : 320;
  });
  const [isDraggingLeft, setIsDraggingLeft] = useState(false);
  const [isDraggingRight, setIsDraggingRight] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const addToast = useCallback(({ type, message }: { type: 'success' | 'error' | 'warning'; message: string }) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const initializeFileManager = useCallback(async () => {
    try {
      await loadSystemFavorites();
      await loadUserFavorites();
      await loadTargetPaths();

      const desktopPath = await window.electron?.fileManager.getPath('desktop');
      if (desktopPath) {
        setCurrentPath(desktopPath);
        await loadFiles(desktopPath);
      }
    } catch (error) {
      console.error('初始化文件管理器失败:', error);
      addToast({ type: 'error', message: '初始化文件管理器失败' });
    }
  }, [addToast]);

  useEffect(() => {
    localStorage.setItem(WIDTHS_STORAGE_KEY, JSON.stringify({ left: leftPanelWidth, right: rightPanelWidth }));
  }, [leftPanelWidth, rightPanelWidth]);

  useEffect(() => {
    initializeFileManager();
  }, [initializeFileManager]);

  const loadSystemFavorites = useCallback(async () => {
    try {
      const systemPaths = await window.electron?.fileManager.getSystemPaths();
      setFavorites((prev) => {
        const filtered = prev.filter((f: FavoriteItem) => !f.isSystem);
        return [...(systemPaths || []), ...filtered];
      });
    } catch (error) {
      console.error('加载系统路径失败:', error);
    }
  }, []);

  const loadUserFavorites = useCallback(async () => {
    try {
      const savedFavorites = await window.electron?.fileManager.getFavorites();
      setFavorites((prev) => {
        const system = prev.filter((f: FavoriteItem) => f.isSystem);
        return [...system, ...(savedFavorites || [])];
      });
    } catch (error) {
      console.error('加载用户收藏失败:', error);
    }
  }, []);

  const loadTargetPaths = useCallback(async () => {
    try {
      const paths = await window.electron?.fileManager.getTargetPaths();
      setTargetPaths(paths || []);
    } catch (error) {
      console.error('加载目标路径失败:', error);
    }
  }, []);

  const loadFiles = useCallback(async (path: string) => {
    setLoading(true);
    setStatus(`正在加载: ${path}`);
    try {
      const files = await window.electron?.fileManager.listFiles(path);
      setFileList(files || []);
      setStatus(`目录: ${path} - ${files?.length || 0} 个项目`);
    } catch (error) {
      console.error('加载文件列表失败:', error);
      addToast({ type: 'error', message: '加载文件列表失败' });
      setStatus('加载失败');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const containerWidth = containerRect.width;

      if (isDraggingLeft) {
        const newWidth = e.clientX - containerRect.left;
        setLeftPanelWidth(Math.min(Math.max(newWidth, 120), containerWidth - rightPanelWidth - 120));
      } else if (isDraggingRight) {
        const newWidth = containerRect.right - e.clientX;
        setRightPanelWidth(Math.min(Math.max(newWidth, 120), containerWidth - leftPanelWidth - 120));
      }
    },
    [isDraggingLeft, isDraggingRight, rightPanelWidth, leftPanelWidth]
  );

  const handleMouseUp = useCallback(() => {
    setIsDraggingLeft(false);
    setIsDraggingRight(false);
  }, []);

  useEffect(() => {
    if (isDraggingLeft || isDraggingRight) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
      };
    }
  }, [isDraggingLeft, isDraggingRight, handleMouseMove, handleMouseUp]);

  const navigateToPath = useCallback(
    async (path: string) => {
      setCurrentPath(path);
      await loadFiles(path);
    },
    [loadFiles]
  );

  const goBack = useCallback(async () => {
    if (!currentPath) return;
    const parentPath = await window.electron?.fileManager.getParentPath(currentPath);
    if (parentPath) {
      await navigateToPath(parentPath);
    }
  }, [currentPath, navigateToPath]);

  const openItem = useCallback(
    async (item: FileItem) => {
      if (item.isDirectory) {
        await navigateToPath(item.path);
      } else {
        try {
          await window.electron?.fileManager.openFile(item.path);
          setStatus(`已打开: ${item.name}`);
          addToast({ type: 'success', message: `已打开: ${item.name}` });
        } catch (error) {
          console.error('打开文件失败:', error);
          addToast({ type: 'error', message: '打开文件失败' });
        }
      }
    },
    [addToast, navigateToPath]
  );

  const addToFavorites = useCallback(
    async (item: FileItem) => {
      if (!item.isDirectory) {
        addToast({ type: 'warning', message: '仅支持收藏文件夹' });
        return;
      }
      try {
        await window.electron?.fileManager.addFavorite(item.path, item.name);
        await loadUserFavorites();
        addToast({ type: 'success', message: `已添加到常用: ${item.name}` });
        setStatus(`已添加到常用: ${item.name}`);
      } catch (error) {
        console.error('添加收藏失败:', error);
        addToast({ type: 'error', message: '添加收藏失败' });
      }
    },
    [addToast, loadUserFavorites]
  );

  const removeFromFavorites = useCallback(
    async (path: string) => {
      try {
        await window.electron?.fileManager.removeFavorite(path);
        await loadUserFavorites();
        addToast({ type: 'success', message: '已从常用移除' });
        setStatus('已从常用移除');
      } catch (error) {
        console.error('移除收藏失败:', error);
        addToast({ type: 'error', message: '移除收藏失败' });
      }
    },
    [addToast, loadUserFavorites]
  );

  const addToTargetPaths = useCallback(
    async (item: FileItem) => {
      if (!item.isDirectory) {
        addToast({ type: 'warning', message: '仅支持设置文件夹为目标路径' });
        return;
      }
      try {
        await window.electron?.fileManager.addTargetPath(item.path, item.name);
        await loadTargetPaths();
        addToast({ type: 'success', message: `已添加到目标路径: ${item.name}` });
        setStatus(`已添加到目标路径: ${item.name}`);
      } catch (error) {
        console.error('添加目标路径失败:', error);
        addToast({ type: 'error', message: '添加目标路径失败' });
      }
    },
    [addToast, loadTargetPaths]
  );

  const deleteItem = useCallback((item: FileItem) => {
    setDeleteConfirmItem(item);
    setShowDeleteConfirm(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteConfirmItem) return;

    try {
      await window.electron?.fileManager.deleteItem(deleteConfirmItem.path);
      await loadFiles(currentPath);
      addToast({ type: 'success', message: `已删除: ${deleteConfirmItem.name}` });
      setStatus(`已删除: ${deleteConfirmItem.name}`);
    } catch (error) {
      console.error('删除失败:', error);
      addToast({ type: 'error', message: '删除失败' });
    } finally {
      setShowDeleteConfirm(false);
      setDeleteConfirmItem(null);
    }
  }, [deleteConfirmItem, currentPath, addToast, loadFiles]);

  const copyToTarget = useCallback(
    async (filePaths: string[], targetPath: string, targetName: string) => {
      if (filePaths.length === 0) return;

      try {
        setStatus(`正在复制到 ${targetName}...`);
        const successCount = await window.electron?.fileManager.copyFiles(filePaths, targetPath);
        addToast({ type: 'success', message: `复制完成: ${successCount}/${filePaths.length} 个文件` });
        setStatus(`复制完成: ${successCount}/${filePaths.length} 个文件成功复制到 ${targetName}`);
      } catch (error) {
        console.error('复制失败:', error);
        addToast({ type: 'error', message: '复制失败' });
        setStatus('复制失败');
      }
    },
    [addToast]
  );

  const handleAddTargetPath = async () => {
    if (!newPathName || !newPathValue) {
      addToast({ type: 'warning', message: '请填写完整信息' });
      return;
    }

    try {
      await window.electron?.fileManager.addTargetPath(newPathValue, newPathName);
      await loadTargetPaths();
      setShowAddPathModal(false);
      setNewPathName('');
      setNewPathValue('');
      addToast({ type: 'success', message: '已添加目标路径' });
    } catch (error) {
      console.error('添加目标路径失败:', error);
      addToast({ type: 'error', message: '添加目标路径失败' });
    }
  };

  const deleteTargetPath = useCallback(
    (pathId: string) => {
      const pathConfig = targetPaths.find((p) => p.id === pathId);
      if (!pathConfig) return;
      setDeletePathItem(pathConfig);
      setShowDeletePathConfirm(true);
    },
    [targetPaths]
  );

  const handleConfirmDeletePath = useCallback(async () => {
    if (!deletePathItem) return;

    try {
      await window.electron?.fileManager.removeTargetPath(deletePathItem.id);
      await loadTargetPaths();
      addToast({ type: 'success', message: '已删除目标路径' });
      setStatus(`已删除路径: ${deletePathItem.name}`);
    } catch (error) {
      console.error('删除目标路径失败:', error);
      addToast({ type: 'error', message: '删除目标路径失败' });
    } finally {
      setShowDeletePathConfirm(false);
      setDeletePathItem(null);
    }
  }, [deletePathItem, addToast, loadTargetPaths]);

  const openTargetPath = useCallback(
    async (path: string) => {
      try {
        await window.electron?.fileManager.openFile(path);
        const pathConfig = targetPaths.find((p) => p.path === path);
        if (pathConfig) {
          setStatus(`已打开路径: ${pathConfig.name}`);
          addToast({ type: 'success', message: `已打开: ${pathConfig.name}` });
        }
      } catch (error) {
        console.error('打开路径失败:', error);
        addToast({ type: 'error', message: '打开路径失败' });
      }
    },
    [targetPaths, addToast]
  );

  const handleFileContextMenu = useCallback(
    (e: React.MouseEvent, item: FileItem) => {
      e.preventDefault();
      setContextMenuX(e.clientX);
      setContextMenuY(e.clientY);
      setContextMenuTarget('file');
      setSelectedFileItem(item);
      setSelectedFavoriteItem(null);
      setSelectedTargetPath(null);
      setContextMenuOpen(true);
    },
    []
  );

  const handleFavoriteContextMenu = useCallback(
    (e: React.MouseEvent, item: FavoriteItem) => {
      if (item.isSystem) return;
      e.preventDefault();
      setContextMenuX(e.clientX);
      setContextMenuY(e.clientY);
      setContextMenuTarget('favorite');
      setSelectedFavoriteItem(item);
      setSelectedFileItem(null);
      setSelectedTargetPath(null);
      setContextMenuOpen(true);
    },
    []
  );

  const handleTargetContextMenu = useCallback(
    (e: React.MouseEvent, path: PathConfig) => {
      e.preventDefault();
      setContextMenuX(e.clientX);
      setContextMenuY(e.clientY);
      setContextMenuTarget('target');
      setSelectedTargetPath(path);
      setSelectedFileItem(null);
      setSelectedFavoriteItem(null);
      setContextMenuOpen(true);
    },
    []
  );

  const handleDragStart = useCallback((e: React.DragEvent, item: FileItem) => {
    e.dataTransfer.setData('text/plain', item.path);
    e.dataTransfer.setData('text/uri-list', `file://${item.path}`);
    setDraggedItem(item.path);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedItem(null);
  }, []);

  const handleDropOnTarget = useCallback(
    async (e: React.DragEvent, targetPath: string, targetName: string) => {
      e.preventDefault();
      const filePath = e.dataTransfer.getData('text/plain');
      if (filePath) {
        await copyToTarget([filePath], targetPath, targetName);
      }
    },
    [copyToTarget]
  );

  const getFilterType = (item: FileItem): string | null => {
    if (item.isDirectory) return 'folder';

    const ext = item.name.split('.').pop()?.toLowerCase();

    const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'ico', 'tiff', 'heic'];
    const documentExts = ['txt', 'md', 'markdown', 'log', 'readme', 'rst', 'pdf', 'doc', 'docx', 'odt', 'ppt', 'pptx', 'key', 'odp', 'js', 'jsx', 'ts', 'tsx', 'css', 'scss', 'less', 'html', 'vue', 'py', 'java', 'cpp', 'c', 'cs', 'go', 'rs', 'php', 'rb', 'swift', 'kt', 'dart', 'json', 'xml'];
    const spreadsheetExts = ['xls', 'xlsx', 'csv', 'tsv'];
    const videoExts = ['mp4', 'mov', 'avi', 'mkv', 'webm', 'flv', 'wmv'];

    if (imageExts.includes(ext || '')) return 'image';
    if (documentExts.includes(ext || '')) return 'document';
    if (spreadsheetExts.includes(ext || '')) return 'spreadsheet';
    if (videoExts.includes(ext || '')) return 'video';

    return null;
  };

  const filteredFiles = useMemo(() => {
    const selectedKeys = Object.entries(selectedTypes)
      .filter(([, value]) => value)
      .map(([key]) => key);

    if (selectedKeys.length === 0) return [];

    return fileList.filter((file) => {
      if (!file.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      const filterType = getFilterType(file);
      return filterType ? selectedKeys.includes(filterType) : false;
    });
  }, [fileList, searchQuery, selectedTypes]);

  const displayedFavorites = useMemo(() => {
    return activeTab === 'system'
      ? favorites.filter((f) => f.isSystem)
      : favorites.filter((f) => !f.isSystem);
  }, [favorites, activeTab]);

  const getFileContextMenuItems = (): ContextMenuItem[] => {
    if (!selectedFileItem) return [];

    const items: ContextMenuItem[] = [];

    items.push({
      id: 'open',
      label: selectedFileItem.isDirectory ? '打开文件夹' : '打开文件',
      icon: selectedFileItem.isDirectory ? <FolderOpen className="w-4 h-4" /> : <File className="w-4 h-4" />,
      onClick: () => selectedFileItem && openItem(selectedFileItem),
    });

    if (selectedFileItem.isDirectory) {
      items.push({
        id: 'add-favorite',
        label: '添加到常用',
        icon: <Star className="w-4 h-4" />,
        onClick: () => selectedFileItem && addToFavorites(selectedFileItem),
      });
      items.push({
        id: 'add-target',
        label: '设为目标路径',
        icon: <Plus className="w-4 h-4" />,
        onClick: () => selectedFileItem && addToTargetPaths(selectedFileItem),
      });
    }

    items.push({ id: 'divider', divider: true });

    items.push({
      id: 'delete',
      label: '删除',
      icon: <Trash2 className="w-4 h-4" />,
      onClick: () => selectedFileItem && deleteItem(selectedFileItem),
      className: 'text-red-500',
    });

    return items;
  };

  const getFavoriteContextMenuItems = (): ContextMenuItem[] => {
    if (!selectedFavoriteItem) return [];

    return [
      {
        id: 'open',
        label: '打开',
        icon: <FolderOpen className="w-4 h-4" />,
        onClick: () => selectedFavoriteItem && navigateToPath(selectedFavoriteItem.path),
      },
      { id: 'divider', divider: true },
      {
        id: 'remove',
        label: '移除',
        icon: <X className="w-4 h-4" />,
        onClick: () => selectedFavoriteItem && removeFromFavorites(selectedFavoriteItem.path),
        className: 'text-red-500',
      },
    ];
  };

  const getTargetContextMenuItems = (): ContextMenuItem[] => {
    if (!selectedTargetPath) return [];

    return [
      {
        id: 'open',
        label: '打开路径',
        icon: <FolderOpen className="w-4 h-4" />,
        onClick: () => selectedTargetPath && openTargetPath(selectedTargetPath.path),
      },
      { id: 'divider', divider: true },
      {
        id: 'delete',
        label: '删除路径',
        icon: <Trash2 className="w-4 h-4" />,
        onClick: () => selectedTargetPath && deleteTargetPath(selectedTargetPath.id),
        className: 'text-red-500',
      },
    ];
  };

  const getContextMenuItems = (): ContextMenuItem[] => {
    switch (contextMenuTarget) {
      case 'file':
        return getFileContextMenuItems();
      case 'favorite':
        return getFavoriteContextMenuItems();
      case 'target':
        return getTargetContextMenuItems();
      default:
        return [];
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800">
      <ToastContainer toasts={toasts} removeToast={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />

      <div className="flex flex-col h-full">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <button
                onClick={goBack}
                disabled={!currentPath}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="返回上级"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg">
                <FolderOpen className="w-4 h-4" />
                <span className="truncate max-w-md">{currentPath || '选择目录'}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: TEXT_TERTIARY }} />
                <input
                  type="text"
                  placeholder="搜索文件..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none w-64 text-gray-800 dark:text-gray-200"
                  style={{ outline: `2px solid ${PRIMARY_COLOR}` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div ref={containerRef} className="flex flex-1 overflow-hidden">
          <div style={{ width: leftPanelWidth }} className="flex-shrink-0 border-r border-gray-200 dark:border-gray-700 flex flex-col bg-gray-50 dark:bg-gray-900">
            <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex items-center">
              <div className="flex gap-1 w-full">
                <button
                  onClick={() => setActiveTab('system')}
                  className={`flex-1 px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    activeTab === 'system'
                      ? 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-sm'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  系统
                </button>
                <button
                  onClick={() => setActiveTab('user')}
                  className={`flex-1 px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    activeTab === 'user'
                      ? 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-sm'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  常用
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-2">
              {displayedFavorites.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-gray-500 dark:text-gray-400">
                  <Folder className="w-10 h-10 mb-2 opacity-50" />
                  <p className="text-sm">暂无{activeTab === 'system' ? '系统路径' : '常用路径'}</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {displayedFavorites.map((item, index) => (
                    <div key={index}>
                      <button
                        onClick={() => navigateToPath(item.path)}
                        onContextMenu={(e) => handleFavoriteContextMenu(e, item)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors text-left group"
                      >
                        {item.icon === 'desktop' && <Home className="w-5 h-5 flex-shrink-0" style={{ color: PRIMARY_COLOR }} />}
                        {item.icon === 'drive' && <HardDrive className="w-5 h-5 flex-shrink-0" style={{ color: PRIMARY_COLOR }} />}
                        {!item.icon && <Folder className="w-5 h-5 flex-shrink-0" style={{ color: TEXT_SECONDARY }} />}
                        <span className="flex-1 truncate" style={{ color: TEXT_PRIMARY }}>{item.name}</span>
                        {!item.isSystem && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFromFavorites(item.path);
                            }}
                            className="p-1.5 opacity-0 group-hover:opacity-100 rounded transition-all"
                            style={{ backgroundColor: `${ERROR_COLOR}1A` }}
                            title="移除"
                          >
                            <Trash2 className="w-4 h-4" style={{ color: TEXT_TERTIARY }} />
                          </button>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div
            className="w-1 flex-shrink-0 cursor-col-resize hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors flex items-center justify-center"
            onMouseDown={() => setIsDraggingLeft(true)}
            title="拖动调整宽度"
          >
            <div className="w-0.5 h-8 bg-gray-300 dark:bg-gray-600 rounded-full" />
          </div>

          <div className="flex-1 flex flex-col min-w-0">
            <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold uppercase tracking-widest" style={{ color: TEXT_TERTIARY }}>类型筛选</span>
                  <div className="flex items-center gap-4">
                    <label className={`flex items-center gap-1.5 cursor-pointer group ${allSelected ? '' : someSelected ? 'text-gray-500' : 'text-gray-400'}`} style={{ color: allSelected ? TEXT_PRIMARY : TEXT_TERTIARY }}>
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={() => {
                          const newValue = !allSelected;
                          setSelectedTypes({
                            image: newValue,
                            document: newValue,
                            spreadsheet: newValue,
                            video: newValue,
                            folder: newValue,
                          });
                        }}
                        className="w-3.5 h-3.5 rounded border-gray-300 dark:border-gray-600 cursor-pointer"
                        style={{ color: PRIMARY_COLOR }}
                      />
                      <span className="text-xs font-medium">全选</span>
                    </label>
                    <div className="w-px h-4 bg-gray-300 dark:bg-gray-600" />
                    {[
                      { key: 'image', label: '图片', icon: <FileImage className="w-3.5 h-3.5" /> },
                      { key: 'document', label: '文档', icon: <FileText className="w-3.5 h-3.5" /> },
                      { key: 'spreadsheet', label: '表格', icon: <FileSpreadsheet className="w-3.5 h-3.5" /> },
                      { key: 'video', label: '视频', icon: <FileVideo className="w-3.5 h-3.5" /> },
                      { key: 'folder', label: '文件夹', icon: <Folder className="w-3.5 h-3.5" /> },
                    ].map(({ key, label, icon }) => (
                      <label key={key} className={`flex items-center gap-1.5 cursor-pointer group ${selectedTypes[key] ? '' : 'text-gray-400'}`} style={{ color: selectedTypes[key] ? TEXT_PRIMARY : TEXT_TERTIARY }}>
                        <input
                          type="checkbox"
                          checked={selectedTypes[key]}
                          onChange={() => setSelectedTypes((prev) => ({ ...prev, [key]: !prev[key] }))}
                          className="w-3.5 h-3.5 rounded border-gray-300 dark:border-gray-600 cursor-pointer"
                          style={{ color: PRIMARY_COLOR }}
                        />
                        {icon}
                        <span className="text-xs font-medium">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <span className="text-xs" style={{ color: TEXT_TERTIARY }}>({filteredFiles.length} 个项目)</span>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-3">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full" style={{ color: TEXT_TERTIARY }}>
                  <LoadingSpinner size="md" />
                  <p className="mt-3 text-sm">加载中...</p>
                </div>
              ) : filteredFiles.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full" style={{ color: TEXT_TERTIARY }}>
                  <Folder className="w-16 h-16 mb-4 opacity-30" />
                  {searchQuery && <p className="text-sm">未找到匹配 "{searchQuery}" 的文件</p>}
                  {!searchQuery && Object.values(selectedTypes).every((v) => !v) && <p className="text-sm">请至少选择一种文件类型</p>}
                  {!searchQuery && Object.values(selectedTypes).some((v) => v) && <p className="text-base">文件夹为空</p>}
                </div>
              ) : (
                <div className="grid grid-cols-5 gap-3">
                  {filteredFiles.map((item, index) => (
                    <FileGridItem
                      key={index}
                      item={item}
                      isDragging={draggedItem === item.path}
                      onClick={() => openItem(item)}
                      onDoubleClick={() => openItem(item)}
                      onContextMenu={(e) => handleFileContextMenu(e, item)}
                      onDragStart={(e) => handleDragStart(e, item)}
                      onDragEnd={handleDragEnd}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div
            className="w-1 flex-shrink-0 cursor-col-resize hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors flex items-center justify-center"
            onMouseDown={() => setIsDraggingRight(true)}
            title="拖动调整宽度"
          >
            <div className="w-0.5 h-8 bg-gray-300 dark:bg-gray-600 rounded-full" />
          </div>

          <div style={{ width: rightPanelWidth }} className="flex-shrink-0 border-l border-gray-200 dark:border-gray-700 flex flex-col bg-gray-50 dark:bg-gray-900">
            <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex items-center">
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: TEXT_TERTIARY }}>目标路径</span>
                <button onClick={() => setShowAddPathModal(true)} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors" title="添加路径">
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-3">
              {targetPaths.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full" style={{ color: TEXT_TERTIARY }}>
                  <Settings className="w-14 h-14 mb-4 opacity-30" />
                  <p className="text-sm">暂无目标路径</p>
                  <button onClick={() => setShowAddPathModal(true)} className="mt-3 text-sm hover:underline" style={{ color: PRIMARY_COLOR }}>添加第一个路径</button>
                  <p className="text-xs mt-2 opacity-75">拖拽文件到路径卡片即可复制</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {targetPaths.map((path) => (
                    <div
                      key={path.id}
                      className={`p-3 bg-white dark:bg-gray-800 border rounded-lg transition-all cursor-pointer ${draggedItem ? '' : 'border-gray-200 dark:border-gray-700'}`}
                      style={{ borderColor: draggedItem ? `${PRIMARY_COLOR}80` : undefined }}
                      onClick={() => openTargetPath(path.path)}
                      onContextMenu={(e) => handleTargetContextMenu(e, path)}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.currentTarget.style.borderColor = PRIMARY_COLOR;
                      }}
                      onDragLeave={(e) => {
                        e.currentTarget.style.borderColor = draggedItem ? `${PRIMARY_COLOR}80` : '';
                      }}
                      onDrop={(e) => {
                        e.currentTarget.style.borderColor = draggedItem ? `${PRIMARY_COLOR}80` : '';
                        handleDropOnTarget(e, path.path, path.name);
                      }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Folder className="w-5 h-5" style={{ color: PRIMARY_COLOR }} />
                          <span className="font-medium" style={{ color: TEXT_PRIMARY }}>{path.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button onClick={(e) => { e.stopPropagation(); openTargetPath(path.path); }} className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded" title="打开路径">
                            <FolderOpen className="w-4 h-4" style={{ color: TEXT_TERTIARY }} />
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); deleteTargetPath(path.id); }} className="p-1.5 rounded" style={{ backgroundColor: `${ERROR_COLOR}1A` }} title="删除路径">
                            <Trash2 className="w-4 h-4" style={{ color: TEXT_TERTIARY }} />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs truncate" style={{ color: TEXT_TERTIARY }}>{path.path}</p>
                      <p className="text-xs mt-2 opacity-60 px-2 py-1 rounded" style={{ backgroundColor: BG_TERTIARY, color: TEXT_TERTIARY }}>↓ 拖拽文件到此处复制</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-4 py-2 flex items-center justify-between">
          <span className="text-sm" style={{ color: TEXT_TERTIARY }}>{status}</span>
          <span className="text-xs opacity-75" style={{ color: TEXT_TERTIARY }}>提示: 双击打开文件，右键可进行更多操作</span>
        </div>
      </div>

      <ContextMenu
        isOpen={contextMenuOpen}
        x={contextMenuX}
        y={contextMenuY}
        items={getContextMenuItems()}
        onClose={() => {
          setContextMenuOpen(false);
          setSelectedFileItem(null);
          setSelectedFavoriteItem(null);
          setSelectedTargetPath(null);
        }}
      />

      <Modal title="添加目标路径" isOpen={showAddPathModal} onClose={() => setShowAddPathModal(false)} onConfirm={handleAddTargetPath}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: TEXT_PRIMARY }}>路径名称</label>
            <input
              type="text"
              value={newPathName}
              onChange={(e) => setNewPathName(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none text-gray-800 dark:text-gray-200"
              style={{ outline: `2px solid ${PRIMARY_COLOR}` }}
              placeholder="例如：下载文件夹"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: TEXT_PRIMARY }}>路径地址</label>
            <input
              type="text"
              value={newPathValue}
              onChange={(e) => setNewPathValue(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none text-gray-800 dark:text-gray-200 font-mono text-sm"
              style={{ outline: `2px solid ${PRIMARY_COLOR}` }}
              placeholder="C:\Users\...\Downloads"
            />
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded">
            💡 提示: 目标路径用于快速复制文件，拖拽文件到右侧路径卡片即可完成复制
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setDeleteConfirmItem(null);
        }}
        onConfirm={handleConfirmDelete}
        title="确认删除"
        message="确定要删除此项目吗？此操作不可撤销。"
        deleteItemName={deleteConfirmItem?.name}
        confirmText="删除"
        cancelText="取消"
      />

      <ConfirmDialog
        isOpen={showDeletePathConfirm}
        onClose={() => {
          setShowDeletePathConfirm(false);
          setDeletePathItem(null);
        }}
        onConfirm={handleConfirmDeletePath}
        title="确认删除路径"
        message="确定要删除此目标路径吗？"
        deleteItemName={deletePathItem?.name}
        confirmText="删除"
        cancelText="取消"
      />
    </div>
  );
};

export default ToolPanel;
