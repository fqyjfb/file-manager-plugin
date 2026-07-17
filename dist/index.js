(function(jsxRuntime, React, ReactDOM, lucideReact) {
  "use strict";
  const WIDTHS_STORAGE_KEY = "file-manager-widths";
  const PRIMARY_COLOR = "#059669";
  const TEXT_PRIMARY = "#111827";
  const TEXT_SECONDARY = "#6b7280";
  const TEXT_TERTIARY = "#9ca3af";
  const ERROR_COLOR = "#dc2626";
  const BG_TERTIARY = "#f3f4f6";
  const ToastContainer = ({ toasts, removeToast }) => {
    return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "fixed top-4 right-4 z-50 space-y-2", children: [
      toasts.map((toast) => /* @__PURE__ */ jsxRuntime.jsx(
        "div",
        {
          className: `px-4 py-2 rounded-lg shadow-lg text-sm font-medium transition-all duration-300 transform ${toast.type === "success" ? "bg-green-500 text-white" : toast.type === "error" ? "bg-red-500 text-white" : "bg-amber-500 text-white"}`,
          style: { animation: "slideIn 0.3s ease-out" },
          children: toast.message
        },
        toast.id
      )),
      /* @__PURE__ */ jsxRuntime.jsx("style", { children: `
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(100%); }
          to { opacity: 1; transform: translateX(0); }
        }
      ` })
    ] });
  };
  const Modal = ({ title, isOpen, onClose, onConfirm, children }) => {
    if (!isOpen) return null;
    return /* @__PURE__ */ jsxRuntime.jsx("div", { className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4", children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700", children: [
        /* @__PURE__ */ jsxRuntime.jsx("h3", { className: "text-lg font-semibold text-gray-800 dark:text-gray-200", children: title }),
        /* @__PURE__ */ jsxRuntime.jsx(
          "button",
          {
            onClick: onClose,
            className: "p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded",
            children: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.X, { className: "w-5 h-5 text-gray-500" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "p-4", children }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex justify-end gap-2 px-4 py-3 border-t border-gray-200 dark:border-gray-700", children: [
        /* @__PURE__ */ jsxRuntime.jsx(
          "button",
          {
            onClick: onClose,
            className: "px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors",
            children: "取消"
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsx(
          "button",
          {
            onClick: onConfirm,
            className: "px-4 py-2 text-sm hover:opacity-90 rounded-lg transition-colors",
            style: { backgroundColor: PRIMARY_COLOR, color: "#ffffff" },
            children: "确认"
          }
        )
      ] })
    ] }) });
  };
  const LoadingSpinner = ({ size = "md" }) => {
    const sizeClasses = {
      sm: "w-4 h-4",
      md: "w-8 h-8",
      lg: "w-12 h-12"
    };
    return /* @__PURE__ */ jsxRuntime.jsx("div", { className: `animate-spin ${sizeClasses[size]}`, children: /* @__PURE__ */ jsxRuntime.jsxs("svg", { className: "w-full h-full text-gray-600 dark:text-gray-400", fill: "none", viewBox: "0 0 24 24", children: [
      /* @__PURE__ */ jsxRuntime.jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
      /* @__PURE__ */ jsxRuntime.jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })
    ] }) });
  };
  const ContextMenu = ({ isOpen, x, y, items, onClose }) => {
    React.useEffect(() => {
      const handleClick = () => onClose();
      document.addEventListener("click", handleClick);
      return () => document.removeEventListener("click", handleClick);
    }, [onClose]);
    if (!isOpen) return null;
    return /* @__PURE__ */ jsxRuntime.jsx(
      "div",
      {
        className: "fixed bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 z-50 min-w-[160px]",
        style: { left: x, top: y },
        children: items.map(
          (item) => item.divider ? /* @__PURE__ */ jsxRuntime.jsx("div", { className: "border-t border-gray-200 dark:border-gray-700 my-1" }, item.id) : /* @__PURE__ */ jsxRuntime.jsxs(
            "button",
            {
              onClick: () => {
                var _a;
                (_a = item.onClick) == null ? void 0 : _a.call(item);
                onClose();
              },
              className: `w-full flex items-center gap-2 px-3 py-1.5 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${item.className || ""}`,
              children: [
                item.icon,
                /* @__PURE__ */ jsxRuntime.jsx("span", { children: item.label })
              ]
            },
            item.id
          )
        )
      }
    );
  };
  const ConfirmDialog = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    deleteItemName,
    confirmText = "确认",
    cancelText = "取消"
  }) => {
    if (!isOpen) return null;
    return /* @__PURE__ */ jsxRuntime.jsx("div", { className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-sm mx-4", children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700", children: [
        /* @__PURE__ */ jsxRuntime.jsx("h3", { className: "text-lg font-semibold text-gray-800 dark:text-gray-200", children: title }),
        /* @__PURE__ */ jsxRuntime.jsx(
          "button",
          {
            onClick: onClose,
            className: "p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded",
            children: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.X, { className: "w-5 h-5 text-gray-500" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "p-4", children: [
        /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-gray-600 dark:text-gray-400", children: message }),
        deleteItemName && /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-sm text-gray-500 dark:text-gray-500 mt-2 font-mono", children: deleteItemName })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex justify-end gap-2 px-4 py-3 border-t border-gray-200 dark:border-gray-700", children: [
        /* @__PURE__ */ jsxRuntime.jsx(
          "button",
          {
            onClick: onClose,
            className: "px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors",
            children: cancelText
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsx(
          "button",
          {
            onClick: () => {
              onConfirm();
              onClose();
            },
            className: "px-4 py-2 text-sm bg-red-500 text-white hover:bg-red-600 rounded-lg transition-colors",
            children: confirmText
          }
        )
      ] })
    ] }) });
  };
  const formatSize = (bytes) => {
    if (!bytes) return "-";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };
  const getFileIconType = (filename) => {
    var _a;
    const ext = (_a = filename.split(".").pop()) == null ? void 0 : _a.toLowerCase();
    const textExts = ["txt", "md", "markdown", "log", "readme", "rst"];
    const codeExts = ["js", "jsx", "ts", "tsx", "css", "scss", "less", "html", "vue", "svelte", "react", "py", "java", "cpp", "c", "cs", "go", "rs", "php", "rb", "swift", "kt", "dart"];
    const imageExts = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg", "ico", "tiff", "heic"];
    const audioExts = ["mp3", "wav", "ogg", "flac", "aac", "m4a", "wma"];
    const videoExts = ["mp4", "mov", "avi", "mkv", "webm", "flv", "wmv"];
    const spreadsheetExts = ["xls", "xlsx", "csv", "tsv"];
    const archiveExts = ["zip", "rar", "7z", "tar", "gz", "bz2", "xz"];
    const jsonExts = ["json"];
    const pdfExts = ["pdf"];
    const pptExts = ["ppt", "pptx", "key", "odp"];
    if (textExts.includes(ext || "")) return "text";
    if (codeExts.includes(ext || "")) return "code";
    if (imageExts.includes(ext || "")) return "image";
    if (audioExts.includes(ext || "")) return "audio";
    if (videoExts.includes(ext || "")) return "video";
    if (spreadsheetExts.includes(ext || "")) return "spreadsheet";
    if (archiveExts.includes(ext || "")) return "archive";
    if (jsonExts.includes(ext || "")) return "json";
    if (pdfExts.includes(ext || "")) return "pdf";
    if (pptExts.includes(ext || "")) return "ppt";
    return "file";
  };
  const getFileIconColor = (filename) => {
    var _a;
    const ext = (_a = filename.split(".").pop()) == null ? void 0 : _a.toLowerCase();
    const blueExts = ["js", "jsx", "ts", "tsx", "json"];
    const greenExts = ["html", "css", "scss", "less"];
    const orangeExts = ["py", "java", "cpp", "c", "cs", "go", "rs"];
    const redExts = ["pdf"];
    const purpleExts = ["md", "markdown"];
    const yellowExts = ["xls", "xlsx", "csv"];
    const cyanExts = ["jpg", "jpeg", "png", "gif", "webp"];
    const tealExts = ["mp3", "wav", "ogg"];
    const indigoExts = ["mp4", "mov", "avi"];
    const grayExts = ["zip", "rar", "7z", "tar"];
    const slateExts = ["txt", "log", "readme"];
    if (blueExts.includes(ext || "")) return "text-blue-500 dark:text-blue-400";
    if (greenExts.includes(ext || "")) return "text-green-500 dark:text-green-400";
    if (orangeExts.includes(ext || "")) return "text-orange-500 dark:text-orange-400";
    if (redExts.includes(ext || "")) return "text-red-500 dark:text-red-400";
    if (purpleExts.includes(ext || "")) return "text-purple-500 dark:text-purple-400";
    if (yellowExts.includes(ext || "")) return "text-yellow-600 dark:text-yellow-500";
    if (cyanExts.includes(ext || "")) return "text-cyan-500 dark:text-cyan-400";
    if (tealExts.includes(ext || "")) return "text-teal-500 dark:text-teal-400";
    if (indigoExts.includes(ext || "")) return "text-indigo-500 dark:text-indigo-400";
    if (grayExts.includes(ext || "")) return "text-gray-500 dark:text-gray-400";
    if (slateExts.includes(ext || "")) return "text-slate-500 dark:text-slate-400";
    return "text-gray-500 dark:text-gray-400";
  };
  const FileIconComponent = ({ type, className }) => {
    switch (type) {
      case "text":
        return /* @__PURE__ */ jsxRuntime.jsx(lucideReact.FileText, { className });
      case "code":
        return /* @__PURE__ */ jsxRuntime.jsx(lucideReact.FileCode, { className });
      case "image":
        return /* @__PURE__ */ jsxRuntime.jsx(lucideReact.FileImage, { className });
      case "audio":
        return /* @__PURE__ */ jsxRuntime.jsx(lucideReact.FileAudio, { className });
      case "video":
        return /* @__PURE__ */ jsxRuntime.jsx(lucideReact.FileVideo, { className });
      case "spreadsheet":
        return /* @__PURE__ */ jsxRuntime.jsx(lucideReact.FileSpreadsheet, { className });
      case "archive":
        return /* @__PURE__ */ jsxRuntime.jsx(lucideReact.FileArchive, { className });
      case "json":
        return /* @__PURE__ */ jsxRuntime.jsx(lucideReact.FileJson, { className });
      case "pdf":
        return /* @__PURE__ */ jsxRuntime.jsx(lucideReact.BookOpen, { className });
      case "ppt":
        return /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Presentation, { className });
      default:
        return /* @__PURE__ */ jsxRuntime.jsx(lucideReact.File, { className });
    }
  };
  const FileGridItem = ({
    item,
    isDragging,
    onClick,
    onDoubleClick,
    onContextMenu,
    onDragStart,
    onDragEnd
  }) => {
    const iconType = getFileIconType(item.name);
    const iconColor = getFileIconColor(item.name);
    return /* @__PURE__ */ jsxRuntime.jsxs(
      "div",
      {
        className: `p-3 rounded-lg cursor-pointer border border-transparent hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all group ${isDragging ? "opacity-50" : ""}`,
        onClick,
        onDoubleClick,
        onContextMenu,
        draggable: true,
        onDragStart,
        onDragEnd,
        title: item.isDirectory ? "点击打开文件夹，拖拽到目标路径可复制" : "点击打开文件",
        children: [
          /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex items-center justify-center mb-2", children: item.isDirectory ? /* @__PURE__ */ jsxRuntime.jsx(
            "div",
            {
              className: "w-12 h-12 flex items-center justify-center rounded-lg transition-colors",
              style: { backgroundColor: `${PRIMARY_COLOR}1A` },
              children: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Folder, { className: "w-6 h-6", style: { color: PRIMARY_COLOR } })
            }
          ) : /* @__PURE__ */ jsxRuntime.jsx("div", { className: "w-12 h-12 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg", children: /* @__PURE__ */ jsxRuntime.jsx(FileIconComponent, { type: iconType, className: `w-6 h-6 ${iconColor}` }) }) }),
          /* @__PURE__ */ jsxRuntime.jsx("div", { className: "text-xs text-center truncate mb-1", style: { color: TEXT_PRIMARY }, children: item.name }),
          /* @__PURE__ */ jsxRuntime.jsx("div", { className: "text-xs text-center", style: { color: TEXT_TERTIARY }, children: item.isDirectory ? "文件夹" : formatSize(item.size) })
        ]
      }
    );
  };
  const ToolPanel = () => {
    const [toasts, setToasts] = React.useState([]);
    const [currentPath, setCurrentPath] = React.useState("");
    const [fileList, setFileList] = React.useState([]);
    const [favorites, setFavorites] = React.useState([]);
    const [targetPaths, setTargetPaths] = React.useState([]);
    const [activeTab, setActiveTab] = React.useState("system");
    const [loading, setLoading] = React.useState(false);
    const [status, setStatus] = React.useState("就绪");
    const [searchQuery, setSearchQuery] = React.useState("");
    const [showAddPathModal, setShowAddPathModal] = React.useState(false);
    const [newPathName, setNewPathName] = React.useState("");
    const [newPathValue, setNewPathValue] = React.useState("");
    const [draggedItem, setDraggedItem] = React.useState(null);
    const [selectedTypes, setSelectedTypes] = React.useState({
      image: true,
      document: true,
      spreadsheet: true,
      video: true,
      folder: true
    });
    const allSelected = React.useMemo(() => {
      return Object.values(selectedTypes).every((v) => v);
    }, [selectedTypes]);
    const someSelected = React.useMemo(() => {
      return Object.values(selectedTypes).some((v) => v);
    }, [selectedTypes]);
    const [contextMenuOpen, setContextMenuOpen] = React.useState(false);
    const [contextMenuX, setContextMenuX] = React.useState(0);
    const [contextMenuY, setContextMenuY] = React.useState(0);
    const [contextMenuTarget, setContextMenuTarget] = React.useState(null);
    const [selectedFileItem, setSelectedFileItem] = React.useState(null);
    const [selectedFavoriteItem, setSelectedFavoriteItem] = React.useState(null);
    const [selectedTargetPath, setSelectedTargetPath] = React.useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
    const [deleteConfirmItem, setDeleteConfirmItem] = React.useState(null);
    const [showDeletePathConfirm, setShowDeletePathConfirm] = React.useState(false);
    const [deletePathItem, setDeletePathItem] = React.useState(null);
    const [leftPanelWidth, setLeftPanelWidth] = React.useState(() => {
      const saved = localStorage.getItem(WIDTHS_STORAGE_KEY);
      return saved ? JSON.parse(saved).left : 256;
    });
    const [rightPanelWidth, setRightPanelWidth] = React.useState(() => {
      const saved = localStorage.getItem(WIDTHS_STORAGE_KEY);
      return saved ? JSON.parse(saved).right : 320;
    });
    const [isDraggingLeft, setIsDraggingLeft] = React.useState(false);
    const [isDraggingRight, setIsDraggingRight] = React.useState(false);
    const containerRef = React.useRef(null);
    const addToast = React.useCallback(({ type, message }) => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, type, message }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3e3);
    }, []);
    const initializeFileManager = React.useCallback(async () => {
      var _a;
      try {
        await loadSystemFavorites();
        await loadUserFavorites();
        await loadTargetPaths();
        const desktopPath = await ((_a = window.electron) == null ? void 0 : _a.fileManager.getPath("desktop"));
        if (desktopPath) {
          setCurrentPath(desktopPath);
          await loadFiles(desktopPath);
        }
      } catch (error) {
        console.error("初始化文件管理器失败:", error);
        addToast({ type: "error", message: "初始化文件管理器失败" });
      }
    }, [addToast]);
    React.useEffect(() => {
      localStorage.setItem(WIDTHS_STORAGE_KEY, JSON.stringify({ left: leftPanelWidth, right: rightPanelWidth }));
    }, [leftPanelWidth, rightPanelWidth]);
    React.useEffect(() => {
      initializeFileManager();
    }, [initializeFileManager]);
    const loadSystemFavorites = React.useCallback(async () => {
      var _a;
      try {
        const systemPaths = await ((_a = window.electron) == null ? void 0 : _a.fileManager.getSystemPaths());
        setFavorites((prev) => {
          const filtered = prev.filter((f) => !f.isSystem);
          return [...systemPaths || [], ...filtered];
        });
      } catch (error) {
        console.error("加载系统路径失败:", error);
      }
    }, []);
    const loadUserFavorites = React.useCallback(async () => {
      var _a;
      try {
        const savedFavorites = await ((_a = window.electron) == null ? void 0 : _a.fileManager.getFavorites());
        setFavorites((prev) => {
          const system = prev.filter((f) => f.isSystem);
          return [...system, ...savedFavorites || []];
        });
      } catch (error) {
        console.error("加载用户收藏失败:", error);
      }
    }, []);
    const loadTargetPaths = React.useCallback(async () => {
      var _a;
      try {
        const paths = await ((_a = window.electron) == null ? void 0 : _a.fileManager.getTargetPaths());
        setTargetPaths(paths || []);
      } catch (error) {
        console.error("加载目标路径失败:", error);
      }
    }, []);
    const loadFiles = React.useCallback(async (path) => {
      var _a;
      setLoading(true);
      setStatus(`正在加载: ${path}`);
      try {
        const files = await ((_a = window.electron) == null ? void 0 : _a.fileManager.listFiles(path));
        setFileList(files || []);
        setStatus(`目录: ${path} - ${(files == null ? void 0 : files.length) || 0} 个项目`);
      } catch (error) {
        console.error("加载文件列表失败:", error);
        addToast({ type: "error", message: "加载文件列表失败" });
        setStatus("加载失败");
      } finally {
        setLoading(false);
      }
    }, [addToast]);
    const handleMouseMove = React.useCallback(
      (e) => {
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
    const handleMouseUp = React.useCallback(() => {
      setIsDraggingLeft(false);
      setIsDraggingRight(false);
    }, []);
    React.useEffect(() => {
      if (isDraggingLeft || isDraggingRight) {
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
        document.body.style.cursor = "col-resize";
        return () => {
          document.removeEventListener("mousemove", handleMouseMove);
          document.removeEventListener("mouseup", handleMouseUp);
          document.body.style.cursor = "";
        };
      }
    }, [isDraggingLeft, isDraggingRight, handleMouseMove, handleMouseUp]);
    const navigateToPath = React.useCallback(
      async (path) => {
        setCurrentPath(path);
        await loadFiles(path);
      },
      [loadFiles]
    );
    const goBack = React.useCallback(async () => {
      var _a;
      if (!currentPath) return;
      const parentPath = await ((_a = window.electron) == null ? void 0 : _a.fileManager.getParentPath(currentPath));
      if (parentPath) {
        await navigateToPath(parentPath);
      }
    }, [currentPath, navigateToPath]);
    const openItem = React.useCallback(
      async (item) => {
        var _a;
        if (item.isDirectory) {
          await navigateToPath(item.path);
        } else {
          try {
            await ((_a = window.electron) == null ? void 0 : _a.fileManager.openFile(item.path));
            setStatus(`已打开: ${item.name}`);
            addToast({ type: "success", message: `已打开: ${item.name}` });
          } catch (error) {
            console.error("打开文件失败:", error);
            addToast({ type: "error", message: "打开文件失败" });
          }
        }
      },
      [addToast, navigateToPath]
    );
    const addToFavorites = React.useCallback(
      async (item) => {
        var _a;
        if (!item.isDirectory) {
          addToast({ type: "warning", message: "仅支持收藏文件夹" });
          return;
        }
        try {
          await ((_a = window.electron) == null ? void 0 : _a.fileManager.addFavorite(item.path, item.name));
          await loadUserFavorites();
          addToast({ type: "success", message: `已添加到常用: ${item.name}` });
          setStatus(`已添加到常用: ${item.name}`);
        } catch (error) {
          console.error("添加收藏失败:", error);
          addToast({ type: "error", message: "添加收藏失败" });
        }
      },
      [addToast, loadUserFavorites]
    );
    const removeFromFavorites = React.useCallback(
      async (path) => {
        var _a;
        try {
          await ((_a = window.electron) == null ? void 0 : _a.fileManager.removeFavorite(path));
          await loadUserFavorites();
          addToast({ type: "success", message: "已从常用移除" });
          setStatus("已从常用移除");
        } catch (error) {
          console.error("移除收藏失败:", error);
          addToast({ type: "error", message: "移除收藏失败" });
        }
      },
      [addToast, loadUserFavorites]
    );
    const addToTargetPaths = React.useCallback(
      async (item) => {
        var _a;
        if (!item.isDirectory) {
          addToast({ type: "warning", message: "仅支持设置文件夹为目标路径" });
          return;
        }
        try {
          await ((_a = window.electron) == null ? void 0 : _a.fileManager.addTargetPath(item.path, item.name));
          await loadTargetPaths();
          addToast({ type: "success", message: `已添加到目标路径: ${item.name}` });
          setStatus(`已添加到目标路径: ${item.name}`);
        } catch (error) {
          console.error("添加目标路径失败:", error);
          addToast({ type: "error", message: "添加目标路径失败" });
        }
      },
      [addToast, loadTargetPaths]
    );
    const deleteItem = React.useCallback((item) => {
      setDeleteConfirmItem(item);
      setShowDeleteConfirm(true);
    }, []);
    const handleConfirmDelete = React.useCallback(async () => {
      var _a;
      if (!deleteConfirmItem) return;
      try {
        await ((_a = window.electron) == null ? void 0 : _a.fileManager.deleteItem(deleteConfirmItem.path));
        await loadFiles(currentPath);
        addToast({ type: "success", message: `已删除: ${deleteConfirmItem.name}` });
        setStatus(`已删除: ${deleteConfirmItem.name}`);
      } catch (error) {
        console.error("删除失败:", error);
        addToast({ type: "error", message: "删除失败" });
      } finally {
        setShowDeleteConfirm(false);
        setDeleteConfirmItem(null);
      }
    }, [deleteConfirmItem, currentPath, addToast, loadFiles]);
    const copyToTarget = React.useCallback(
      async (filePaths, targetPath, targetName) => {
        var _a;
        if (filePaths.length === 0) return;
        try {
          setStatus(`正在复制到 ${targetName}...`);
          const successCount = await ((_a = window.electron) == null ? void 0 : _a.fileManager.copyFiles(filePaths, targetPath));
          addToast({ type: "success", message: `复制完成: ${successCount}/${filePaths.length} 个文件` });
          setStatus(`复制完成: ${successCount}/${filePaths.length} 个文件成功复制到 ${targetName}`);
        } catch (error) {
          console.error("复制失败:", error);
          addToast({ type: "error", message: "复制失败" });
          setStatus("复制失败");
        }
      },
      [addToast]
    );
    const handleAddTargetPath = async () => {
      var _a;
      if (!newPathName || !newPathValue) {
        addToast({ type: "warning", message: "请填写完整信息" });
        return;
      }
      try {
        await ((_a = window.electron) == null ? void 0 : _a.fileManager.addTargetPath(newPathValue, newPathName));
        await loadTargetPaths();
        setShowAddPathModal(false);
        setNewPathName("");
        setNewPathValue("");
        addToast({ type: "success", message: "已添加目标路径" });
      } catch (error) {
        console.error("添加目标路径失败:", error);
        addToast({ type: "error", message: "添加目标路径失败" });
      }
    };
    const deleteTargetPath = React.useCallback(
      (pathId) => {
        const pathConfig = targetPaths.find((p) => p.id === pathId);
        if (!pathConfig) return;
        setDeletePathItem(pathConfig);
        setShowDeletePathConfirm(true);
      },
      [targetPaths]
    );
    const handleConfirmDeletePath = React.useCallback(async () => {
      var _a;
      if (!deletePathItem) return;
      try {
        await ((_a = window.electron) == null ? void 0 : _a.fileManager.removeTargetPath(deletePathItem.id));
        await loadTargetPaths();
        addToast({ type: "success", message: "已删除目标路径" });
        setStatus(`已删除路径: ${deletePathItem.name}`);
      } catch (error) {
        console.error("删除目标路径失败:", error);
        addToast({ type: "error", message: "删除目标路径失败" });
      } finally {
        setShowDeletePathConfirm(false);
        setDeletePathItem(null);
      }
    }, [deletePathItem, addToast, loadTargetPaths]);
    const openTargetPath = React.useCallback(
      async (path) => {
        var _a;
        try {
          await ((_a = window.electron) == null ? void 0 : _a.fileManager.openFile(path));
          const pathConfig = targetPaths.find((p) => p.path === path);
          if (pathConfig) {
            setStatus(`已打开路径: ${pathConfig.name}`);
            addToast({ type: "success", message: `已打开: ${pathConfig.name}` });
          }
        } catch (error) {
          console.error("打开路径失败:", error);
          addToast({ type: "error", message: "打开路径失败" });
        }
      },
      [targetPaths, addToast]
    );
    const handleFileContextMenu = React.useCallback(
      (e, item) => {
        e.preventDefault();
        setContextMenuX(e.clientX);
        setContextMenuY(e.clientY);
        setContextMenuTarget("file");
        setSelectedFileItem(item);
        setSelectedFavoriteItem(null);
        setSelectedTargetPath(null);
        setContextMenuOpen(true);
      },
      []
    );
    const handleFavoriteContextMenu = React.useCallback(
      (e, item) => {
        if (item.isSystem) return;
        e.preventDefault();
        setContextMenuX(e.clientX);
        setContextMenuY(e.clientY);
        setContextMenuTarget("favorite");
        setSelectedFavoriteItem(item);
        setSelectedFileItem(null);
        setSelectedTargetPath(null);
        setContextMenuOpen(true);
      },
      []
    );
    const handleTargetContextMenu = React.useCallback(
      (e, path) => {
        e.preventDefault();
        setContextMenuX(e.clientX);
        setContextMenuY(e.clientY);
        setContextMenuTarget("target");
        setSelectedTargetPath(path);
        setSelectedFileItem(null);
        setSelectedFavoriteItem(null);
        setContextMenuOpen(true);
      },
      []
    );
    const handleDragStart = React.useCallback((e, item) => {
      e.dataTransfer.setData("text/plain", item.path);
      e.dataTransfer.setData("text/uri-list", `file://${item.path}`);
      setDraggedItem(item.path);
    }, []);
    const handleDragEnd = React.useCallback(() => {
      setDraggedItem(null);
    }, []);
    const handleDropOnTarget = React.useCallback(
      async (e, targetPath, targetName) => {
        e.preventDefault();
        const filePath = e.dataTransfer.getData("text/plain");
        if (filePath) {
          await copyToTarget([filePath], targetPath, targetName);
        }
      },
      [copyToTarget]
    );
    const getFilterType = (item) => {
      var _a;
      if (item.isDirectory) return "folder";
      const ext = (_a = item.name.split(".").pop()) == null ? void 0 : _a.toLowerCase();
      const imageExts = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg", "ico", "tiff", "heic"];
      const documentExts = ["txt", "md", "markdown", "log", "readme", "rst", "pdf", "doc", "docx", "odt", "ppt", "pptx", "key", "odp", "js", "jsx", "ts", "tsx", "css", "scss", "less", "html", "vue", "py", "java", "cpp", "c", "cs", "go", "rs", "php", "rb", "swift", "kt", "dart", "json", "xml"];
      const spreadsheetExts = ["xls", "xlsx", "csv", "tsv"];
      const videoExts = ["mp4", "mov", "avi", "mkv", "webm", "flv", "wmv"];
      if (imageExts.includes(ext || "")) return "image";
      if (documentExts.includes(ext || "")) return "document";
      if (spreadsheetExts.includes(ext || "")) return "spreadsheet";
      if (videoExts.includes(ext || "")) return "video";
      return null;
    };
    const filteredFiles = React.useMemo(() => {
      const selectedKeys = Object.entries(selectedTypes).filter(([, value]) => value).map(([key]) => key);
      if (selectedKeys.length === 0) return [];
      return fileList.filter((file) => {
        if (!file.name.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false;
        }
        const filterType = getFilterType(file);
        return filterType ? selectedKeys.includes(filterType) : false;
      });
    }, [fileList, searchQuery, selectedTypes]);
    const displayedFavorites = React.useMemo(() => {
      return activeTab === "system" ? favorites.filter((f) => f.isSystem) : favorites.filter((f) => !f.isSystem);
    }, [favorites, activeTab]);
    const getFileContextMenuItems = () => {
      if (!selectedFileItem) return [];
      const items = [];
      items.push({
        id: "open",
        label: selectedFileItem.isDirectory ? "打开文件夹" : "打开文件",
        icon: selectedFileItem.isDirectory ? /* @__PURE__ */ jsxRuntime.jsx(lucideReact.FolderOpen, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxRuntime.jsx(lucideReact.File, { className: "w-4 h-4" }),
        onClick: () => selectedFileItem && openItem(selectedFileItem)
      });
      if (selectedFileItem.isDirectory) {
        items.push({
          id: "add-favorite",
          label: "添加到常用",
          icon: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Star, { className: "w-4 h-4" }),
          onClick: () => selectedFileItem && addToFavorites(selectedFileItem)
        });
        items.push({
          id: "add-target",
          label: "设为目标路径",
          icon: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Plus, { className: "w-4 h-4" }),
          onClick: () => selectedFileItem && addToTargetPaths(selectedFileItem)
        });
      }
      items.push({ id: "divider", divider: true });
      items.push({
        id: "delete",
        label: "删除",
        icon: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Trash2, { className: "w-4 h-4" }),
        onClick: () => selectedFileItem && deleteItem(selectedFileItem),
        className: "text-red-500"
      });
      return items;
    };
    const getFavoriteContextMenuItems = () => {
      if (!selectedFavoriteItem) return [];
      return [
        {
          id: "open",
          label: "打开",
          icon: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.FolderOpen, { className: "w-4 h-4" }),
          onClick: () => selectedFavoriteItem && navigateToPath(selectedFavoriteItem.path)
        },
        { id: "divider", divider: true },
        {
          id: "remove",
          label: "移除",
          icon: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.X, { className: "w-4 h-4" }),
          onClick: () => selectedFavoriteItem && removeFromFavorites(selectedFavoriteItem.path),
          className: "text-red-500"
        }
      ];
    };
    const getTargetContextMenuItems = () => {
      if (!selectedTargetPath) return [];
      return [
        {
          id: "open",
          label: "打开路径",
          icon: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.FolderOpen, { className: "w-4 h-4" }),
          onClick: () => selectedTargetPath && openTargetPath(selectedTargetPath.path)
        },
        { id: "divider", divider: true },
        {
          id: "delete",
          label: "删除路径",
          icon: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Trash2, { className: "w-4 h-4" }),
          onClick: () => selectedTargetPath && deleteTargetPath(selectedTargetPath.id),
          className: "text-red-500"
        }
      ];
    };
    const getContextMenuItems = () => {
      switch (contextMenuTarget) {
        case "file":
          return getFileContextMenuItems();
        case "favorite":
          return getFavoriteContextMenuItems();
        case "target":
          return getTargetContextMenuItems();
        default:
          return [];
      }
    };
    return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex flex-col h-full bg-white dark:bg-gray-800", children: [
      /* @__PURE__ */ jsxRuntime.jsx(ToastContainer, { toasts, removeToast: (id) => setToasts((prev) => prev.filter((t) => t.id !== id)) }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex flex-col h-full", children: [
        /* @__PURE__ */ jsxRuntime.jsx("div", { className: "border-b border-gray-200 dark:border-gray-700", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center justify-between px-4 py-3", children: [
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntime.jsx(
              "button",
              {
                onClick: goBack,
                disabled: !currentPath,
                className: "p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                title: "返回上级",
                children: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.ArrowLeft, { className: "w-5 h-5" })
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg", children: [
              /* @__PURE__ */ jsxRuntime.jsx(lucideReact.FolderOpen, { className: "w-4 h-4" }),
              /* @__PURE__ */ jsxRuntime.jsx("span", { className: "truncate max-w-md", children: currentPath || "选择目录" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex items-center gap-3", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Search, { className: "w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2", style: { color: TEXT_TERTIARY } }),
            /* @__PURE__ */ jsxRuntime.jsx(
              "input",
              {
                type: "text",
                placeholder: "搜索文件...",
                value: searchQuery,
                onChange: (e) => setSearchQuery(e.target.value),
                className: "pl-9 pr-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none w-64 text-gray-800 dark:text-gray-200",
                style: { outline: `2px solid ${PRIMARY_COLOR}` }
              }
            )
          ] }) })
        ] }) }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { ref: containerRef, className: "flex flex-1 overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { width: leftPanelWidth }, className: "flex-shrink-0 border-r border-gray-200 dark:border-gray-700 flex flex-col bg-gray-50 dark:bg-gray-900", children: [
            /* @__PURE__ */ jsxRuntime.jsx("div", { className: "p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex items-center", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex gap-1 w-full", children: [
              /* @__PURE__ */ jsxRuntime.jsx(
                "button",
                {
                  onClick: () => setActiveTab("system"),
                  className: `flex-1 px-3 py-1 text-xs font-medium rounded-md transition-colors ${activeTab === "system" ? "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-sm" : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"}`,
                  children: "系统"
                }
              ),
              /* @__PURE__ */ jsxRuntime.jsx(
                "button",
                {
                  onClick: () => setActiveTab("user"),
                  className: `flex-1 px-3 py-1 text-xs font-medium rounded-md transition-colors ${activeTab === "user" ? "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-sm" : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"}`,
                  children: "常用"
                }
              )
            ] }) }),
            /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex-1 overflow-auto p-2", children: displayedFavorites.length === 0 ? /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex flex-col items-center justify-center h-32 text-gray-500 dark:text-gray-400", children: [
              /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Folder, { className: "w-10 h-10 mb-2 opacity-50" }),
              /* @__PURE__ */ jsxRuntime.jsxs("p", { className: "text-sm", children: [
                "暂无",
                activeTab === "system" ? "系统路径" : "常用路径"
              ] })
            ] }) : /* @__PURE__ */ jsxRuntime.jsx("div", { className: "space-y-1", children: displayedFavorites.map((item, index) => /* @__PURE__ */ jsxRuntime.jsx("div", { children: /* @__PURE__ */ jsxRuntime.jsxs(
              "button",
              {
                onClick: () => navigateToPath(item.path),
                onContextMenu: (e) => handleFavoriteContextMenu(e, item),
                className: "w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors text-left group",
                children: [
                  item.icon === "desktop" && /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Home, { className: "w-5 h-5 flex-shrink-0", style: { color: PRIMARY_COLOR } }),
                  item.icon === "drive" && /* @__PURE__ */ jsxRuntime.jsx(lucideReact.HardDrive, { className: "w-5 h-5 flex-shrink-0", style: { color: PRIMARY_COLOR } }),
                  !item.icon && /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Folder, { className: "w-5 h-5 flex-shrink-0", style: { color: TEXT_SECONDARY } }),
                  /* @__PURE__ */ jsxRuntime.jsx("span", { className: "flex-1 truncate", style: { color: TEXT_PRIMARY }, children: item.name }),
                  !item.isSystem && /* @__PURE__ */ jsxRuntime.jsx(
                    "button",
                    {
                      onClick: (e) => {
                        e.stopPropagation();
                        removeFromFavorites(item.path);
                      },
                      className: "p-1.5 opacity-0 group-hover:opacity-100 rounded transition-all",
                      style: { backgroundColor: `${ERROR_COLOR}1A` },
                      title: "移除",
                      children: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Trash2, { className: "w-4 h-4", style: { color: TEXT_TERTIARY } })
                    }
                  )
                ]
              }
            ) }, index)) }) })
          ] }),
          /* @__PURE__ */ jsxRuntime.jsx(
            "div",
            {
              className: "w-1 flex-shrink-0 cursor-col-resize hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors flex items-center justify-center",
              onMouseDown: () => setIsDraggingLeft(true),
              title: "拖动调整宽度",
              children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: "w-0.5 h-8 bg-gray-300 dark:bg-gray-600 rounded-full" })
            }
          ),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex-1 flex flex-col min-w-0", children: [
            /* @__PURE__ */ jsxRuntime.jsx("div", { className: "p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-4", children: [
                /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-xs font-bold uppercase tracking-widest", style: { color: TEXT_TERTIARY }, children: "类型筛选" }),
                /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-4", children: [
                  /* @__PURE__ */ jsxRuntime.jsxs("label", { className: `flex items-center gap-1.5 cursor-pointer group ${allSelected ? "" : someSelected ? "text-gray-500" : "text-gray-400"}`, style: { color: allSelected ? TEXT_PRIMARY : TEXT_TERTIARY }, children: [
                    /* @__PURE__ */ jsxRuntime.jsx(
                      "input",
                      {
                        type: "checkbox",
                        checked: allSelected,
                        onChange: () => {
                          const newValue = !allSelected;
                          setSelectedTypes({
                            image: newValue,
                            document: newValue,
                            spreadsheet: newValue,
                            video: newValue,
                            folder: newValue
                          });
                        },
                        className: "w-3.5 h-3.5 rounded border-gray-300 dark:border-gray-600 cursor-pointer",
                        style: { color: PRIMARY_COLOR }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-xs font-medium", children: "全选" })
                  ] }),
                  /* @__PURE__ */ jsxRuntime.jsx("div", { className: "w-px h-4 bg-gray-300 dark:bg-gray-600" }),
                  [
                    { key: "image", label: "图片", icon: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.FileImage, { className: "w-3.5 h-3.5" }) },
                    { key: "document", label: "文档", icon: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.FileText, { className: "w-3.5 h-3.5" }) },
                    { key: "spreadsheet", label: "表格", icon: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.FileSpreadsheet, { className: "w-3.5 h-3.5" }) },
                    { key: "video", label: "视频", icon: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.FileVideo, { className: "w-3.5 h-3.5" }) },
                    { key: "folder", label: "文件夹", icon: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Folder, { className: "w-3.5 h-3.5" }) }
                  ].map(({ key, label, icon }) => /* @__PURE__ */ jsxRuntime.jsxs("label", { className: `flex items-center gap-1.5 cursor-pointer group ${selectedTypes[key] ? "" : "text-gray-400"}`, style: { color: selectedTypes[key] ? TEXT_PRIMARY : TEXT_TERTIARY }, children: [
                    /* @__PURE__ */ jsxRuntime.jsx(
                      "input",
                      {
                        type: "checkbox",
                        checked: selectedTypes[key],
                        onChange: () => setSelectedTypes((prev) => ({ ...prev, [key]: !prev[key] })),
                        className: "w-3.5 h-3.5 rounded border-gray-300 dark:border-gray-600 cursor-pointer",
                        style: { color: PRIMARY_COLOR }
                      }
                    ),
                    icon,
                    /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-xs font-medium", children: label })
                  ] }, key))
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "text-xs", style: { color: TEXT_TERTIARY }, children: [
                "(",
                filteredFiles.length,
                " 个项目)"
              ] })
            ] }) }),
            /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex-1 overflow-auto p-3", children: loading ? /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex flex-col items-center justify-center h-full", style: { color: TEXT_TERTIARY }, children: [
              /* @__PURE__ */ jsxRuntime.jsx(LoadingSpinner, { size: "md" }),
              /* @__PURE__ */ jsxRuntime.jsx("p", { className: "mt-3 text-sm", children: "加载中..." })
            ] }) : filteredFiles.length === 0 ? /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex flex-col items-center justify-center h-full", style: { color: TEXT_TERTIARY }, children: [
              /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Folder, { className: "w-16 h-16 mb-4 opacity-30" }),
              searchQuery && /* @__PURE__ */ jsxRuntime.jsxs("p", { className: "text-sm", children: [
                '未找到匹配 "',
                searchQuery,
                '" 的文件'
              ] }),
              !searchQuery && Object.values(selectedTypes).every((v) => !v) && /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-sm", children: "请至少选择一种文件类型" }),
              !searchQuery && Object.values(selectedTypes).some((v) => v) && /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-base", children: "文件夹为空" })
            ] }) : /* @__PURE__ */ jsxRuntime.jsx("div", { className: "grid grid-cols-5 gap-3", children: filteredFiles.map((item, index) => /* @__PURE__ */ jsxRuntime.jsx(
              FileGridItem,
              {
                item,
                isDragging: draggedItem === item.path,
                onClick: () => openItem(item),
                onDoubleClick: () => openItem(item),
                onContextMenu: (e) => handleFileContextMenu(e, item),
                onDragStart: (e) => handleDragStart(e, item),
                onDragEnd: handleDragEnd
              },
              index
            )) }) })
          ] }),
          /* @__PURE__ */ jsxRuntime.jsx(
            "div",
            {
              className: "w-1 flex-shrink-0 cursor-col-resize hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors flex items-center justify-center",
              onMouseDown: () => setIsDraggingRight(true),
              title: "拖动调整宽度",
              children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: "w-0.5 h-8 bg-gray-300 dark:bg-gray-600 rounded-full" })
            }
          ),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { width: rightPanelWidth }, className: "flex-shrink-0 border-l border-gray-200 dark:border-gray-700 flex flex-col bg-gray-50 dark:bg-gray-900", children: [
            /* @__PURE__ */ jsxRuntime.jsx("div", { className: "p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex items-center", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center justify-between w-full", children: [
              /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-xs font-bold uppercase tracking-widest", style: { color: TEXT_TERTIARY }, children: "目标路径" }),
              /* @__PURE__ */ jsxRuntime.jsx("button", { onClick: () => setShowAddPathModal(true), className: "p-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors", title: "添加路径", children: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Plus, { className: "w-3 h-3" }) })
            ] }) }),
            /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex-1 overflow-auto p-3", children: targetPaths.length === 0 ? /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex flex-col items-center justify-center h-full", style: { color: TEXT_TERTIARY }, children: [
              /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Settings, { className: "w-14 h-14 mb-4 opacity-30" }),
              /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-sm", children: "暂无目标路径" }),
              /* @__PURE__ */ jsxRuntime.jsx("button", { onClick: () => setShowAddPathModal(true), className: "mt-3 text-sm hover:underline", style: { color: PRIMARY_COLOR }, children: "添加第一个路径" }),
              /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-xs mt-2 opacity-75", children: "拖拽文件到路径卡片即可复制" })
            ] }) : /* @__PURE__ */ jsxRuntime.jsx("div", { className: "space-y-3", children: targetPaths.map((path) => /* @__PURE__ */ jsxRuntime.jsxs(
              "div",
              {
                className: `p-3 bg-white dark:bg-gray-800 border rounded-lg transition-all cursor-pointer ${draggedItem ? "" : "border-gray-200 dark:border-gray-700"}`,
                style: { borderColor: draggedItem ? `${PRIMARY_COLOR}80` : void 0 },
                onClick: () => openTargetPath(path.path),
                onContextMenu: (e) => handleTargetContextMenu(e, path),
                onDragOver: (e) => {
                  e.preventDefault();
                  e.currentTarget.style.borderColor = PRIMARY_COLOR;
                },
                onDragLeave: (e) => {
                  e.currentTarget.style.borderColor = draggedItem ? `${PRIMARY_COLOR}80` : "";
                },
                onDrop: (e) => {
                  e.currentTarget.style.borderColor = draggedItem ? `${PRIMARY_COLOR}80` : "";
                  handleDropOnTarget(e, path.path, path.name);
                },
                children: [
                  /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-start justify-between mb-2", children: [
                    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Folder, { className: "w-5 h-5", style: { color: PRIMARY_COLOR } }),
                      /* @__PURE__ */ jsxRuntime.jsx("span", { className: "font-medium", style: { color: TEXT_PRIMARY }, children: path.name })
                    ] }),
                    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-1", children: [
                      /* @__PURE__ */ jsxRuntime.jsx("button", { onClick: (e) => {
                        e.stopPropagation();
                        openTargetPath(path.path);
                      }, className: "p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded", title: "打开路径", children: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.FolderOpen, { className: "w-4 h-4", style: { color: TEXT_TERTIARY } }) }),
                      /* @__PURE__ */ jsxRuntime.jsx("button", { onClick: (e) => {
                        e.stopPropagation();
                        deleteTargetPath(path.id);
                      }, className: "p-1.5 rounded", style: { backgroundColor: `${ERROR_COLOR}1A` }, title: "删除路径", children: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Trash2, { className: "w-4 h-4", style: { color: TEXT_TERTIARY } }) })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-xs truncate", style: { color: TEXT_TERTIARY }, children: path.path }),
                  /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-xs mt-2 opacity-60 px-2 py-1 rounded", style: { backgroundColor: BG_TERTIARY, color: TEXT_TERTIARY }, children: "↓ 拖拽文件到此处复制" })
                ]
              },
              path.id
            )) }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-4 py-2 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-sm", style: { color: TEXT_TERTIARY }, children: status }),
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-xs opacity-75", style: { color: TEXT_TERTIARY }, children: "提示: 双击打开文件，右键可进行更多操作" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsx(
        ContextMenu,
        {
          isOpen: contextMenuOpen,
          x: contextMenuX,
          y: contextMenuY,
          items: getContextMenuItems(),
          onClose: () => {
            setContextMenuOpen(false);
            setSelectedFileItem(null);
            setSelectedFavoriteItem(null);
            setSelectedTargetPath(null);
          }
        }
      ),
      /* @__PURE__ */ jsxRuntime.jsx(Modal, { title: "添加目标路径", isOpen: showAddPathModal, onClose: () => setShowAddPathModal(false), onConfirm: handleAddTargetPath, children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntime.jsx("label", { className: "block text-sm font-medium mb-1.5", style: { color: TEXT_PRIMARY }, children: "路径名称" }),
          /* @__PURE__ */ jsxRuntime.jsx(
            "input",
            {
              type: "text",
              value: newPathName,
              onChange: (e) => setNewPathName(e.target.value),
              className: "w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none text-gray-800 dark:text-gray-200",
              style: { outline: `2px solid ${PRIMARY_COLOR}` },
              placeholder: "例如：下载文件夹"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntime.jsx("label", { className: "block text-sm font-medium mb-1.5", style: { color: TEXT_PRIMARY }, children: "路径地址" }),
          /* @__PURE__ */ jsxRuntime.jsx(
            "input",
            {
              type: "text",
              value: newPathValue,
              onChange: (e) => setNewPathValue(e.target.value),
              className: "w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none text-gray-800 dark:text-gray-200 font-mono text-sm",
              style: { outline: `2px solid ${PRIMARY_COLOR}` },
              placeholder: "C:\\Users\\...\\Downloads"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntime.jsx("div", { className: "text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded", children: "💡 提示: 目标路径用于快速复制文件，拖拽文件到右侧路径卡片即可完成复制" })
      ] }) }),
      /* @__PURE__ */ jsxRuntime.jsx(
        ConfirmDialog,
        {
          isOpen: showDeleteConfirm,
          onClose: () => {
            setShowDeleteConfirm(false);
            setDeleteConfirmItem(null);
          },
          onConfirm: handleConfirmDelete,
          title: "确认删除",
          message: "确定要删除此项目吗？此操作不可撤销。",
          deleteItemName: deleteConfirmItem == null ? void 0 : deleteConfirmItem.name,
          confirmText: "删除",
          cancelText: "取消"
        }
      ),
      /* @__PURE__ */ jsxRuntime.jsx(
        ConfirmDialog,
        {
          isOpen: showDeletePathConfirm,
          onClose: () => {
            setShowDeletePathConfirm(false);
            setDeletePathItem(null);
          },
          onConfirm: handleConfirmDeletePath,
          title: "确认删除路径",
          message: "确定要删除此目标路径吗？",
          deleteItemName: deletePathItem == null ? void 0 : deletePathItem.name,
          confirmText: "删除",
          cancelText: "取消"
        }
      )
    ] });
  };
  const PluginHeader = ({ title }) => {
    const handleMinimize = () => {
      var _a, _b;
      (_b = (_a = window.electron) == null ? void 0 : _a.plugin) == null ? void 0 : _b.minimizeWindow();
    };
    const handleMaximize = () => {
      var _a, _b;
      (_b = (_a = window.electron) == null ? void 0 : _a.plugin) == null ? void 0 : _b.maximizeWindow();
    };
    const handleClose = () => {
      var _a, _b;
      (_b = (_a = window.electron) == null ? void 0 : _a.plugin) == null ? void 0 : _b.closeWindow();
    };
    return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "plugin-header", children: [
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "plugin-header-title", children: title }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "plugin-header-controls", children: [
        /* @__PURE__ */ jsxRuntime.jsx("button", { onClick: handleMinimize, children: /* @__PURE__ */ jsxRuntime.jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M5 12h14" }) }) }),
        /* @__PURE__ */ jsxRuntime.jsx("button", { onClick: handleMaximize, children: /* @__PURE__ */ jsxRuntime.jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ jsxRuntime.jsx("rect", { x: "3", y: "3", width: "18", height: "18", rx: "2", ry: "2" }) }) }),
        /* @__PURE__ */ jsxRuntime.jsx("button", { onClick: handleClose, children: /* @__PURE__ */ jsxRuntime.jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M18 6L6 18M6 6l12 12" }) }) })
      ] })
    ] });
  };
  const PluginApp = () => {
    const pluginData2 = window.__PLUGIN_DATA__;
    const title = (pluginData2 == null ? void 0 : pluginData2.pluginName) || "文件管理";
    return /* @__PURE__ */ jsxRuntime.jsxs(React.Fragment, { children: [
      /* @__PURE__ */ jsxRuntime.jsx(PluginHeader, { title }),
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "plugin-content", children: /* @__PURE__ */ jsxRuntime.jsx(ToolPanel, {}) })
    ] });
  };
  function renderStandalone() {
    const root = document.getElementById("root");
    if (!root) {
      console.error("Root element not found");
      return;
    }
    ReactDOM.createRoot(root).render(/* @__PURE__ */ jsxRuntime.jsx(PluginApp, {}));
  }
  function registerPlugin(api) {
    const { registerTool, registerSidebarButton, openPluginWindow } = api;
    registerTool({
      id: "plugin-file-manager",
      name: "文件管理",
      iconName: "Folder",
      color: "#059669",
      textColor: "#ffffff",
      path: "/tools/plugin-file-manager",
      component: ToolPanel
    });
    registerSidebarButton({
      id: "plugin-file-manager-btn",
      icon: "Folder",
      label: "文件管理",
      onClick: () => {
        openPluginWindow == null ? void 0 : openPluginWindow("plugin-file-manager");
      }
    });
  }
  const pluginData = window.__PLUGIN_DATA__;
  if (pluginData) {
    renderStandalone();
  }
  module.exports = {
    register: registerPlugin
  };
})(window.React, window.React, window.ReactDOM, window.LucideReact);
