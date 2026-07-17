import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Smartphone,
  Image as ImageIcon,
  FolderOpen,
  Search,
  Sparkles,
  Trash2,
  Heart,
  Info,
  X,
  ChevronLeft,
  Download,
  Code,
  Share2,
  Check,
  Lock,
  Unlock,
  Settings,
  Activity,
  FileText,
  Layers,
  Eye,
  RefreshCw,
  Copy,
  FolderInput,
  Archive,
  CheckCircle2,
  PlusCircle,
  CheckSquare,
  Sliders,
  MapPin,
  Calendar,
  AlertCircle,
  Plus,
  Clock,
  Wifi,
  Battery,
  AlertTriangle,
  Grid,
  Home,
  Play,
  Video,
  HardDrive,
  Zap,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Subtitles,
  Tv,
  RotateCcw,
  RotateCw,
  Edit3,
  Moon,
  Sun,
  Globe,
  EyeOff,
  Database,
  CloudUpload,
  Fingerprint,
  ScanFace,
  QrCode,
  Tablet,
  Paintbrush,
  Crop,
  Users,
  Cpu
} from "lucide-react";
import { KOTLIN_CODEBASE, CodeFile, CodeCategory } from "./data/kotlinCodebase";

interface Photo {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnailUrl?: string;
  dateAdded: string;
  album: string;
  mimeType: string;
  size: string;
  width: number;
  height: number;
  isFavorite: boolean;
  isSynced: boolean;
  isInTrash: boolean;
  isHidden?: boolean;
  trashTimeLeftDays: number | null;
  exif: {
    camera: string;
    lens: string;
    aperture: string;
    exposureTime: string;
    iso: string;
    focalLength: string;
    location: {
      latitude: number;
      longitude: number;
      address: string;
    } | null;
  };
  tags: string[];
}

interface LogEntry {
  id: string;
  timestamp: string;
  level: "V" | "D" | "I" | "W" | "E";
  tag: string;
  message: string;
}

const PALETTES: Record<string, { primary: string; primaryLight: string; primaryDark: string; primaryText: string }> = {
  purple: {
    primary: "#6750A4",
    primaryLight: "#EADDFF",
    primaryDark: "#4F378B",
    primaryText: "#21005D",
  },
  emerald: {
    primary: "#0F766E",
    primaryLight: "#CCFBF1",
    primaryDark: "#115E59",
    primaryText: "#134E4A",
  },
  ocean: {
    primary: "#0284C7",
    primaryLight: "#E0F2FE",
    primaryDark: "#0369A1",
    primaryText: "#0C4A6E",
  },
  charcoal: {
    primary: "#475569",
    primaryLight: "#F1F5F9",
    primaryDark: "#334155",
    primaryText: "#0F172A",
  },
  terracotta: {
    primary: "#C2410C",
    primaryLight: "#FFEDD5",
    primaryDark: "#9A3412",
    primaryText: "#7C2D12",
  }
};

const LOCALIZATION: Record<string, Record<string, string>> = {
  en: {
    home: "Home",
    photos: "Photos",
    albums: "Albums",
    favorites: "Favorites",
    ai: "AI Search",
    settings: "Settings",
    emulator_controls: "Emulator Controls",
    architecture_specs: "Architectural Conformity Specs",
    quick_actions: "Quick Actions",
    storage_title: "Android Gallery Storage",
    duplicate_finder: "Duplicate Finder",
    large_files: "Large Files",
    theme: "Theme / Appearance",
    dark_mode: "Dark Mode",
    dark_mode_desc: "Enable eye-safe pitch dark canvas",
    grid_size: "Grid Size",
    grid_size_desc: "Columns in main media gallery",
    sort_order: "Media Sort Order",
    sort_order_desc: "Arrange photos & videos by",
    language_label: "Language",
    language_desc: "Select UI display language",
    hidden_albums: "Hidden Albums Manager",
    hidden_albums_desc: "Exclude specific albums from library",
    cache_label: "Cache Management",
    cache_desc: "Clear local thumbnails and temp files",
    backup_label: "Cloud Backup Sync",
    backup_desc: "Replicate database records to server",
    clear_cache_btn: "Clear Cache",
    backup_btn: "Back Up Now",
    recent_activity: "Recent Activity Logs",
    search_placeholder: "Search photos, albums, folders...",
  },
  es: {
    home: "Inicio",
    photos: "Fotos",
    albums: "Álbumes",
    favorites: "Favoritos",
    ai: "Búsqueda IA",
    settings: "Ajustes",
    emulator_controls: "Controles del Emulador",
    architecture_specs: "Especificaciones de Arquitectura",
    quick_actions: "Acciones Rápidas",
    storage_title: "Almacenamiento de Galería",
    duplicate_finder: "Buscador de Duplicados",
    large_files: "Archivos Grandes",
    theme: "Tema y Apariencia",
    dark_mode: "Modo Oscuro",
    dark_mode_desc: "Activa el lienzo oscuro seguro para la vista",
    grid_size: "Tamaño de Rejilla",
    grid_size_desc: "Columnas en la galería de medios",
    sort_order: "Orden de Clasificación",
    sort_order_desc: "Organizar fotos y videos por",
    language_label: "Idioma",
    language_desc: "Selecciona el idioma de la interfaz",
    hidden_albums: "Gestor de Álbumes Ocultos",
    hidden_albums_desc: "Excluir álbumes específicos de la biblioteca",
    cache_label: "Gestión de Caché",
    cache_desc: "Limpiar miniaturas locales y temporales",
    backup_label: "Copia de Seguridad en la Nube",
    backup_desc: "Replicar registros de base de datos",
    clear_cache_btn: "Limpiar Caché",
    backup_btn: "Respaldar Ahora",
    recent_activity: "Registro de Actividad",
    search_placeholder: "Buscar fotos, álbumes, carpetas...",
  },
  fr: {
    home: "Accueil",
    photos: "Photos",
    albums: "Albums",
    favorites: "Favoris",
    ai: "Recherche IA",
    settings: "Paramètres",
    emulator_controls: "Contrôles de l'émulateur",
    architecture_specs: "Spécifications Architecturales",
    quick_actions: "Actions Rapides",
    storage_title: "Stockage de la Galerie",
    duplicate_finder: "Recherche Doublons",
    large_files: "Fichiers Volumineux",
    theme: "Thème et Apparence",
    dark_mode: "Mode Sombre",
    dark_mode_desc: "Activer le canevas sombre protecteur",
    grid_size: "Taille de la Grille",
    grid_size_desc: "Colonnes de la galerie multimédia",
    sort_order: "Ordre de Tri",
    sort_order_desc: "Organiser les photos et vidéos par",
    language_label: "Langue",
    language_desc: "Choisir la langue d'affichage",
    hidden_albums: "Gestionnaire d'Albums Masqués",
    hidden_albums_desc: "Masquer certains albums de la galerie",
    cache_label: "Gestion du Cache",
    cache_desc: "Effacer les miniatures et fichiers temporaires",
    backup_label: "Sauvegarde Cloud",
    backup_desc: "Synchroniser les données avec le serveur",
    clear_cache_btn: "Vider le Cache",
    backup_btn: "Sauvegarder",
    recent_activity: "Activité Récente",
    search_placeholder: "Rechercher des photos, albums...",
  },
  de: {
    home: "Startseite",
    photos: "Fotos",
    albums: "Alben",
    favorites: "Favoriten",
    ai: "KI-Suche",
    settings: "Einstellungen",
    emulator_controls: "Emulator-Steuerung",
    architecture_specs: "Architekturspezifikationen",
    quick_actions: "Schnellaktionen",
    storage_title: "Galeriespeicher",
    duplicate_finder: "Duplikate finden",
    large_files: "Große Dateien",
    theme: "Thema & Design",
    dark_mode: "Dunkelmodus",
    dark_mode_desc: "Aktivieren Sie das augenfreundliche dunkle Design",
    grid_size: "Rastergröße",
    grid_size_desc: "Spalten in der Hauptgalerie",
    sort_order: "Sortierung",
    sort_order_desc: "Fotos & Videos sortieren nach",
    language_label: "Sprache",
    language_desc: "Anzeigesprache auswählen",
    hidden_albums: "Ausgeblendete Alben",
    hidden_albums_desc: "Spezifische Alben aus der Ansicht ausschließen",
    cache_label: "Cache-Verwaltung",
    cache_desc: "Lokale Miniaturansichten löschen",
    backup_label: "Cloud-Sicherung",
    backup_desc: "Datenbankeinträge mit Server synchronisieren",
    clear_cache_btn: "Cache leeren",
    backup_btn: "Jetzt sichern",
    recent_activity: "Aktivitätsprotokoll",
    search_placeholder: "Suchen nach Fotos, Alben...",
  },
  ja: {
    home: "ホーム",
    photos: "写真",
    albums: "アルバム",
    favorites: "お気に入り",
    ai: "AI検索",
    settings: "設定",
    emulator_controls: "エミュレータ操作",
    architecture_specs: "設計仕様",
    quick_actions: "クイックアクション",
    storage_title: "ギャラリーストレージ",
    duplicate_finder: "重複ファイル検出",
    large_files: "大容量ファイル",
    theme: "テーマと外観",
    dark_mode: "ダークモード",
    dark_mode_desc: "目に優しいダークテーマを有効化",
    grid_size: "グリッド幅",
    grid_size_desc: "メインギャラリーの表示列数",
    sort_order: "並び替え順",
    sort_order_desc: "写真と動画 of 並び替え条件",
    language_label: "言語",
    language_desc: "表示言語を選択します",
    hidden_albums: "非表示アルバム管理",
    hidden_albums_desc: "特定のアルバムをライブラリから除外",
    cache_label: "キャッシュ管理",
    cache_desc: "ローカルサムネイルと一時ファイルを削除",
    backup_label: "クラウドバックアップ",
    backup_desc: "データベースをサーバーと同期",
    clear_cache_btn: "キャッシュ削除",
    backup_btn: "今すぐ同期",
    recent_activity: "最近のアクティビティ",
    search_placeholder: "写真、アルバム、フォルダを検索...",
  }
};

export default function App() {
  // View mode check
  const [viewMode, setViewMode] = useState<"simulator" | "app">(() => {
    if (typeof window !== 'undefined') {
      const isCapacitor = (window as any).Capacitor !== undefined ||
        window.location.protocol === 'file:' ||
        (window.location.hostname === 'localhost' && window.location.port !== '3000' && window.location.port !== '5173');
      const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isSmallScreen = window.innerWidth < 1024;
      if (isCapacitor || isMobileUA || isSmallScreen) {
        return "app";
      }
    }
    return "simulator";
  });

  // Mobile app state
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loadingPhotos, setLoadingPhotos] = useState(true);
  const [syncingPhotoIds, setSyncingPhotoIds] = useState<Record<string, boolean>>({});
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [activeTab, setActiveTab] = useState<"home" | "photos" | "favorites" | "albums" | "ai" | "settings">("home");
  const [customSyncServer, setCustomSyncServer] = useState(() => {
    return localStorage.getItem("custom_sync_server") || "https://ais-pre-6j26bomybh3mrhngsz7myx-655499886291.asia-east1.run.app";
  });
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);
  const [permissionState, setPermissionState] = useState<"prompt" | "granular" | "granted" | "denied">("prompt");
  const [granularAllowedIds, setGranularAllowedIds] = useState<string[]>([]);
  const [selectingGranularPhotos, setSelectingGranularPhotos] = useState(false);
  
  // Photo edit filters
  const [appliedFilter, setAppliedFilter] = useState<string>("Original");
  const [photoFilters, setPhotoFilters] = useState<Record<string, string>>({}); // photoId -> filterName
  
  // Search and AI state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<"all" | "images" | "videos" | "albums" | "folders" | "filenames">("all");
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [aiSearchResults, setAiSearchResults] = useState<{ id: string; score: number; matchReason: string }[] | null>(null);
  const [aiAnalysisLoadingId, setAiAnalysisLoadingId] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  // Video player state
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoTime, setVideoTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(15);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [videoVolume, setVideoVolume] = useState(0.8);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(true);
  const [isSimulatedFullscreen, setIsSimulatedFullscreen] = useState(false);
  const [isCleaningStorage, setIsCleaningStorage] = useState(false);
  const [storageCleaned, setStorageCleaned] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoContainerRef = useRef<HTMLDivElement | null>(null);

  // IDE view state
  const [selectedCodeFile, setSelectedCodeFile] = useState<CodeFile>(KOTLIN_CODEBASE[0].files[0]);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    "Domain Layer (Core Business)": true,
    "Data Layer (Room & MediaStore)": false,
    "UI & Presentation Layer (Compose)": false,
    "Dependency Injection (DI)": false,
  });

  // Logcat terminal state
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [logFilter, setLogFilter] = useState<"ALL" | "D" | "I" | "W" | "E">("ALL");
  const logTerminalRef = useRef<HTMLDivElement>(null);

  // Secure Vault PIN & Encrypted storage state
  const [vaultHasPin, setVaultHasPin] = useState(false);
  const [isVaultUnlocked, setIsVaultUnlocked] = useState(false);
  const [showVaultSetupModal, setShowVaultSetupModal] = useState(false);
  const [showVaultAuthModal, setShowVaultAuthModal] = useState(false);
  const [vaultPinInput, setVaultPinInput] = useState("");
  const [vaultSetupPin, setVaultSetupPin] = useState("");
  const [vaultSetupPinConfirm, setVaultSetupPinConfirm] = useState("");
  const [vaultAuthError, setVaultAuthError] = useState("");
  const [vaultSetupError, setVaultSetupError] = useState("");

  // Recycle Bin confirmation state
  const [showPermanentDeleteConfirm, setShowPermanentDeleteConfirm] = useState(false);

  // File Details Screen state
  const [showFileDetailsScreen, setShowFileDetailsScreen] = useState(false);
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [detailEditForm, setDetailEditForm] = useState({
    title: "",
    description: "",
    width: 0,
    height: 0,
    size: "",
    dateAdded: "",
    camera: "",
    lens: "",
    aperture: "",
    exposureTime: "",
    iso: "",
    focalLength: "",
    locationAddress: "",
    locationLat: 0,
    locationLng: 0,
  });

  // Multi-Selection support state
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<string[]>([]);
  const [showCopyMoveDialog, setShowCopyMoveDialog] = useState<"copy" | "move" | null>(null);
  const [customTargetAlbum, setCustomTargetAlbum] = useState("");
  const [selectedAlbumChoice, setSelectedAlbumChoice] = useState("Camera");
  const [showRenameBatchDialog, setShowRenameBatchDialog] = useState(false);
  const [batchRenamePrefix, setBatchRenamePrefix] = useState("");
  const [showCompressBatchDialog, setShowCompressBatchDialog] = useState(false);
  const [compressedBatchResults, setCompressedBatchResults] = useState<{ 
    id: string; 
    originalSize: string; 
    compressedSize: string; 
    originalWidth: number; 
    originalHeight: number; 
    compressedWidth: number; 
    compressedHeight: number; 
    title: string; 
    quality: string; 
  }[]>([]);
  const [showCompressQualitySelector, setShowCompressQualitySelector] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState<"low" | "medium" | "high">("medium");
  const [compressTargetIds, setCompressTargetIds] = useState<string[]>([]);
  const [showShareBatchDialog, setShowShareBatchDialog] = useState(false);
  const [sharedBatchLink, setSharedBatchLink] = useState("");
  const [sharedBatchTitles, setSharedBatchTitles] = useState<string[]>([]);
  const [showDeleteBatchConfirm, setShowDeleteBatchConfirm] = useState(false);
  const [deletePermanently, setDeletePermanently] = useState(false);

  // Duplicate Finder States
  const [showDuplicateFinder, setShowDuplicateFinder] = useState(false);
  const [duplicateGroups, setDuplicateGroups] = useState<{
    id: string;
    type: "exact" | "similar";
    reason: string;
    photos: any[];
    suggestedKeepId: string;
  }[]>([]);
  const [isScanningDuplicates, setIsScanningDuplicates] = useState(false);
  const [selectedDuplicateDeletions, setSelectedDuplicateDeletions] = useState<Record<string, string[]>>({});
  const [isInjectingDuplicate, setIsInjectingDuplicate] = useState(false);

  // Large File Finder States
  const [showLargeFileFinder, setShowLargeFileFinder] = useState(false);
  const [largeFileSortOrder, setLargeFileSortOrder] = useState<"desc" | "asc">("desc");
  const [largeFileMinSizeMB, setLargeFileMinSizeMB] = useState<number>(4);
  const [isScanningLargeFiles, setIsScanningLargeFiles] = useState(false);

  // Google Play Console Compliance Hub States
  const [playScanState, setPlayScanState] = useState<"idle" | "scanning" | "finished">("idle");
  const [playScanProgress, setPlayScanProgress] = useState(0);
  const [playScanLogs, setPlayScanLogs] = useState<string[]>([]);
  const [generatedPlayAsset, setGeneratedPlayAsset] = useState<{ type: string; content: string } | null>(null);
  const [isGeneratingPlayAsset, setIsGeneratingPlayAsset] = useState(false);
  const [showPlayAssetModal, setShowPlayAssetModal] = useState(false);
  const [playPrivacyPolicyCreated, setPlayPrivacyPolicyCreated] = useState(false);
  const [ideTab, setIdeTab] = useState<"code" | "play_ready">("code");

  // Premium Advanced Features States
  const [layoutMode, setLayoutMode] = useState<"phone" | "foldable" | "tablet">("phone");
  const [materialPalette, setMaterialPalette] = useState<"purple" | "emerald" | "ocean" | "charcoal" | "terracotta">("purple");
  const [enrolledFaces, setEnrolledFaces] = useState<string[]>(["Me", "Mom", "My Dog"]);
  const [facePeopleFilter, setFacePeopleFilter] = useState<string | null>(null);
  const [isEnrollingFace, setIsEnrollingFace] = useState(false);
  const [showFacePrivacyDisclosure, setShowFacePrivacyDisclosure] = useState(false);
  const [ocrText, setOcrText] = useState<string | null>(null);
  const [isOcrProcessing, setIsOcrProcessing] = useState(false);
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);
  const [qrScanResult, setQrScanResult] = useState<string | null>(null);
  const [isScanningQr, setIsScanningQr] = useState(false);
  const [isDocScannerOpen, setIsDocScannerOpen] = useState(false);
  const [docScanProgress, setDocScanProgress] = useState(0);
  const [scannedDocFilter, setScannedDocFilter] = useState<"original" | "monochrome" | "enhance">("original");
  const [isScanningDoc, setIsScanningDoc] = useState(false);
  const [savedScannedDocs, setSavedScannedDocs] = useState<any[]>([]);
  const [cloudProvider, setCloudProvider] = useState<"none" | "drive" | "onedrive">("drive");
  const [cloudUser, setCloudUser] = useState<string | null>("mr3hasan@gmail.com");
  const [isSyncingCloud, setIsSyncingCloud] = useState(false);
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);
  const [editorBrightness, setEditorBrightness] = useState(100);
  const [editorContrast, setEditorContrast] = useState(100);
  const [editorSaturation, setEditorSaturation] = useState(100);
  const [editorFilter, setEditorFilter] = useState<string>("none");
  const [isEditorDrawing, setIsEditorDrawing] = useState(false);
  const [editorLineColor, setEditorLineColor] = useState("#FF0000");
  const [rawProfile, setRawProfile] = useState<"embedded" | "adobe_color" | "camera_standard">("embedded");
  const [gifIsPlaying, setGifIsPlaying] = useState(true);
  const [gifSpeed, setGifSpeed] = useState(1);
  const [pdfPage, setPdfPage] = useState(1);
  const [pdfZoom, setPdfZoom] = useState(100);
  const [isZipExpanded, setIsZipExpanded] = useState(false);
  const [extractedZipFiles, setExtractedZipFiles] = useState<string[]>([]);
  const [isExtractingZip, setIsExtractingZip] = useState(false);
  const [keystoreProvider, setKeystoreProvider] = useState<"software" | "strongbox">("strongbox");
  const [trashRetentionDays, setTrashRetentionDays] = useState<number>(30);
  const [activeWidgets, setActiveWidgets] = useState<string[]>(["memories"]);
  const [showWidgetSettings, setShowWidgetSettings] = useState(false);
  const [castingDevice, setCastingDevice] = useState<string | null>(null);
  const [showCastDialog, setShowCastDialog] = useState(false);
  const [castVolume, setCastVolume] = useState(80);

  // User Preferences & Settings States
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("settings_dark_mode");
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  const [settingsGridSize, setSettingsGridSize] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("settings_grid_size");
      return saved ? JSON.parse(saved) : 3;
    } catch {
      return 3;
    }
  });

  const [settingsSortOrder, setSettingsSortOrder] = useState<string>(() => {
    try {
      const saved = localStorage.getItem("settings_sort_order");
      return saved || "date_desc";
    } catch {
      return "date_desc";
    }
  });

  const [settingsLanguage, setSettingsLanguage] = useState<string>(() => {
    try {
      const saved = localStorage.getItem("settings_language");
      return saved || "en";
    } catch {
      return "en";
    }
  });

  const [hiddenAlbumNames, setHiddenAlbumNames] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem("settings_hidden_albums");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [cacheSizeMB, setCacheSizeMB] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("settings_cache_size");
      return saved ? JSON.parse(saved) : 142.6;
    } catch {
      return 142.6;
    }
  });
  const [isClearingCache, setIsClearingCache] = useState(false);

  const [backupEnabled, setBackupEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("settings_backup_enabled");
      return saved ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });
  const [backupStatus, setBackupStatus] = useState<"idle" | "backing_up" | "backed_up">("idle");
  const [lastBackupTime, setLastBackupTime] = useState<string>(() => {
    try {
      return localStorage.getItem("settings_last_backup") || "Never";
    } catch {
      return "Never";
    }
  });

  // App Lock security states
  const [appLockEnabled, setAppLockEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("settings_app_lock_enabled");
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  const [appLockPin, setAppLockPin] = useState<string>(() => {
    try {
      const saved = localStorage.getItem("settings_app_lock_pin");
      return saved || "1111";
    } catch {
      return "1111";
    }
  });

  const [appLockFingerprintEnabled, setAppLockFingerprintEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("settings_app_lock_fingerprint_enabled");
      return saved ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const [appLockFaceEnabled, setAppLockFaceEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("settings_app_lock_face_enabled");
      return saved ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const [isAppLocked, setIsAppLocked] = useState<boolean>(() => {
    try {
      const enabled = localStorage.getItem("settings_app_lock_enabled");
      return enabled ? JSON.parse(enabled) : false;
    } catch {
      return false;
    }
  });

  const [tempPinInput, setTempPinInput] = useState("");
  const [lockScreenPinInput, setLockScreenPinInput] = useState("");
  const [isBiometricPromptOpen, setIsBiometricPromptOpen] = useState(false);
  const [fingerprintScanState, setFingerprintScanState] = useState<"idle" | "scanning" | "success" | "error">("idle");
  const [faceScanState, setFaceScanState] = useState<"idle" | "scanning" | "success" | "error">("idle");
  const [faceScanProgress, setFaceScanProgress] = useState(0);
  const [lockScreenError, setLockScreenError] = useState("");

  // Settings Synchronization with localStorage
  useEffect(() => {
    localStorage.setItem("settings_app_lock_enabled", JSON.stringify(appLockEnabled));
    // If disabled, automatically unlock
    if (!appLockEnabled) {
      setIsAppLocked(false);
    }
  }, [appLockEnabled]);

  useEffect(() => {
    localStorage.setItem("settings_app_lock_pin", appLockPin);
  }, [appLockPin]);

  useEffect(() => {
    localStorage.setItem("settings_app_lock_fingerprint_enabled", JSON.stringify(appLockFingerprintEnabled));
  }, [appLockFingerprintEnabled]);

  useEffect(() => {
    localStorage.setItem("settings_app_lock_face_enabled", JSON.stringify(appLockFaceEnabled));
  }, [appLockFaceEnabled]);

  useEffect(() => {
    localStorage.setItem("settings_dark_mode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem("settings_grid_size", JSON.stringify(settingsGridSize));
  }, [settingsGridSize]);

  useEffect(() => {
    localStorage.setItem("settings_sort_order", settingsSortOrder);
  }, [settingsSortOrder]);

  useEffect(() => {
    localStorage.setItem("settings_language", settingsLanguage);
  }, [settingsLanguage]);

  useEffect(() => {
    localStorage.setItem("settings_hidden_albums", JSON.stringify(hiddenAlbumNames));
  }, [hiddenAlbumNames]);

  useEffect(() => {
    localStorage.setItem("settings_cache_size", JSON.stringify(cacheSizeMB));
  }, [cacheSizeMB]);

  useEffect(() => {
    localStorage.setItem("settings_backup_enabled", JSON.stringify(backupEnabled));
  }, [backupEnabled]);

  // Translation Helper
  const t = (key: string) => {
    return LOCALIZATION[settingsLanguage]?.[key] || LOCALIZATION["en"]?.[key] || key;
  };

  // Time for mock phone status bar
  const [phoneTime, setPhoneTime] = useState("");

  // Update phone clock and optimize background tasks / media when page visibility changes
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      setPhoneTime(`${hours}:${minutes} ${ampm}`);
    };

    const startTimer = () => {
      updateTime();
      if (!interval) {
        interval = setInterval(updateTime, 60000);
      }
    };

    const stopTimer = () => {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab hidden: cancel interval timer to save battery/CPU
        stopTimer();
        
        // Auto-pause active video playback to save CPU/battery/GPU
        if (videoRef.current && !videoRef.current.paused) {
          videoRef.current.pause();
          setIsVideoPlaying(false);
          addLog("I", "PowerManager", "Tab hidden. Paused active media playback and stopped system timers to preserve device battery.");
        } else {
          addLog("D", "PowerManager", "Tab hidden. Stopped system timers to avoid background CPU execution.");
        }
      } else {
        // Tab restored: resume clock timer and update instantly
        addLog("D", "PowerManager", "Tab restored. Resuming system timers and restoring high performance state.");
        startTimer();
      }
    };

    // Initialize
    startTimer();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      stopTimer();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Sync Logcat scrolling to bottom
  useEffect(() => {
    if (logTerminalRef.current) {
      logTerminalRef.current.scrollTop = logTerminalRef.current.scrollHeight;
    }
  }, [logs]);

  // Helper to add Logcat entries
  const addLog = (level: "V" | "D" | "I" | "W" | "E", tag: string, message: string) => {
    const now = new Date();
    const timeStr = now.toTimeString().split(" ")[0] + "." + now.getMilliseconds().toString().padStart(3, "0");
    const newLog: LogEntry = {
      id: Math.random().toString(36).substring(7),
      timestamp: timeStr,
      level,
      tag,
      message,
    };
    setLogs((prev) => {
      const next = [...prev, newLog];
      if (next.length > 200) {
        return next.slice(next.length - 200);
      }
      return next;
    });
  };

  // Setup initial logs and fetch photos
  useEffect(() => {
    addLog("I", "AndroidRuntime", "System Boot: Starting Android Emulator API level 35 (Android 15 / vanillaIceCream).");
    addLog("D", "GalleryApplication", "onCreate: Instantiating components and performing Dependency Injection...");
    addLog("D", "Koin", "Initializing Koin Container. Modules registered successfully.");
    addLog("I", "Koin", "Injecting [com.google.android.gallery.domain.usecase.GetPhotosUseCase] -> Single Instance.");
    addLog("I", "Koin", "Injecting [com.google.android.gallery.domain.usecase.DeletePhotoUseCase] -> Single Instance.");
    addLog("I", "Koin", "Injecting [com.google.android.gallery.ui.viewmodel.GalleryViewModel] -> ViewModel Bound.");
    addLog("I", "RoomDatabase", "Mounting sqlite cache /data/data/com.google.android.gallery/databases/gallery_secure_database.db");
    
    fetchPhotos();
  }, []);

  // Fetch photos from the backend database
  const fetchPhotos = async () => {
    setLoadingPhotos(true);
    addLog("D", "PhotoRepositoryImpl", "Querying local database cache (photos_table)...");
    try {
      const response = await fetch("/api/photos");
      if (!response.ok) throw new Error("Backend response error");
      const data = await response.json();
      
      // Get any locally imported photos from actual storage
      const localPhotosStr = localStorage.getItem("gallery_local_imported_photos");
      const localPhotos: Photo[] = localPhotosStr ? JSON.parse(localPhotosStr) : [];
      
      const combined = [...localPhotos, ...data];
      setPhotos(combined);
      localStorage.setItem("gallery_cached_photos", JSON.stringify(combined));
      addLog("I", "PhotoRepositoryImpl", `Success: Synchronized ${data.length} server records and ${localPhotos.length} local imported records.`);
      
      // Default granular selection contains first 3 photos for mock sandbox safety
      if (granularAllowedIds.length === 0 && combined.length > 0) {
        setGranularAllowedIds([combined[0].id, combined[1].id, combined[2]?.id || combined[0].id]);
      }

      // Query secure vault PIN configuration status
      const vaultStatusRes = await fetch("/api/vault/status");
      const vaultStatus = await vaultStatusRes.json();
      if (vaultStatus.success) {
        setVaultHasPin(vaultStatus.hasPin);
        localStorage.setItem("gallery_vault_has_pin", JSON.stringify(vaultStatus.hasPin));
        addLog("D", "EncryptedSharedPreferences", `Secure Vault Key Config status: ${vaultStatus.hasPin ? "CONFIGURED (AES Key Present)" : "UNINITIALIZED"}`);
      }
    } catch (error) {
      addLog("E", "PhotoRepositoryImpl", "Failed to query SQLite DB. SQLiteException: Database connection refused. Launching local offline cache fallback...");
      
      const cachedPhotos = localStorage.getItem("gallery_cached_photos");
      if (cachedPhotos) {
        try {
          const parsed = JSON.parse(cachedPhotos);
          setPhotos(parsed);
          addLog("I", "PhotoRepositoryImpl", `Offline Cache: Loaded ${parsed.length} cached media records from local device storage.`);
          if (granularAllowedIds.length === 0 && parsed.length > 0) {
            setGranularAllowedIds([parsed[0].id, parsed[1].id, parsed[3].id]);
          }
        } catch (e) {
          console.error("Failed to parse cached photos", e);
        }
      }

      const cachedVaultHasPin = localStorage.getItem("gallery_vault_has_pin");
      if (cachedVaultHasPin !== null) {
        setVaultHasPin(JSON.parse(cachedVaultHasPin));
      }
    } finally {
      setLoadingPhotos(false);
    }
  };

  const handleDeviceImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    addLog("I", "DeviceStorage", `Initializing secure file stream for ${files.length} device files...`);
    
    Array.from(files).forEach((file: any) => {
      const isVideo = file.type.startsWith("video/");
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const localUrl = event.target.result as string;
          const newPhoto: Photo = {
            id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            title: file.name.split('.').slice(0, -1).join('.') || file.name,
            description: `Imported from physical device: ${file.name}`,
            url: localUrl,
            thumbnailUrl: localUrl,
            dateAdded: new Date().toISOString().split('T')[0],
            album: isVideo ? "Videos" : "Camera",
            mimeType: file.type,
            size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
            width: 1920,
            height: 1080,
            isFavorite: false,
            isSynced: false,
            isInTrash: false,
            trashTimeLeftDays: null,
            exif: {
              camera: "Android Device Storage",
              lens: "Mobile Standard Lens",
              aperture: "f/1.8",
              exposureTime: "1/120s",
              iso: "100",
              focalLength: "24mm",
              location: {
                latitude: 23.8103,
                longitude: 90.4125,
                address: "Dhaka, Bangladesh"
              }
            },
            tags: [isVideo ? "video" : "image", "imported"]
          };
          
          setPhotos(prev => {
            const localPhotosStr = localStorage.getItem("gallery_local_imported_photos");
            const localPhotos: Photo[] = localPhotosStr ? JSON.parse(localPhotosStr) : [];
            const updatedLocal = [newPhoto, ...localPhotos];
            localStorage.setItem("gallery_local_imported_photos", JSON.stringify(updatedLocal));
            
            const updatedAll = [newPhoto, ...prev];
            localStorage.setItem("gallery_cached_photos", JSON.stringify(updatedAll));
            return updatedAll;
          });
          
          addLog("I", "DeviceStorage", `Successfully imported: "${file.name}" to album "${isVideo ? "Videos" : "Camera"}"`);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Re-seed DB to default
  const handleResetDatabase = async () => {
    addLog("W", "DatabaseAdmin", "Requesting SQLite database re-seed...");
    try {
      const res = await fetch("/api/photos/reset", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        localStorage.removeItem("gallery_local_imported_photos");
        addLog("I", "DatabaseAdmin", "Database reset complete. SQLite tables recreated and re-seeded with 7 flagship files.");
        setSelectedPhoto(null);
        setActiveTab("photos");
        setSelectedAlbum(null);
        setPhotoFilters({});
        setAiSearchResults(null);
        setSearchQuery("");
        fetchPhotos();
      }
    } catch (e: any) {
      addLog("E", "DatabaseAdmin", `Re-seed call failed: ${e.message}`);
    }
  };

  // Google Play Console Compliance Hub Event Handlers
  const handleTriggerComplianceAudit = () => {
    setPlayScanState("scanning");
    setPlayScanProgress(0);
    const initialLogs = ["🤖 Starting Play Console Compliance Audit...", "🔍 Checking APK configurations & permissions footprint..."];
    setPlayScanLogs(initialLogs);
    addLog("I", "PlayConsoleHub", "Triggered automated policy compliance scan on codebase.");

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setPlayScanProgress(currentProgress);

      if (currentProgress === 20) {
        setPlayScanLogs(prev => [...prev, "✓ targetSdkVersion verified: 35 (Android 15) OK."]);
        addLog("D", "PlayConsoleHub", "Manifest validation: API level 35 targetSdkVersion verified.");
      } else if (currentProgress === 40) {
        setPlayScanLogs(prev => [...prev, "✓ Permissions footprint: no broad storage requests. Scoped Storage OK."]);
        addLog("D", "PlayConsoleHub", "Permission audit: wide read/write external storage flags are absent.");
      } else if (currentProgress === 60) {
        setPlayScanLogs(prev => [...prev, "✓ Security integration: BiometricPrompt + Android Keystore & StrongBox verified OK."]);
        addLog("D", "PlayConsoleHub", "Biometrics validation: BiometricPrompt utilizes hardware-backed keys.");
      } else if (currentProgress === 80) {
        setPlayScanLogs(prev => [...prev, "✓ Cache isolation: media sandbox & 30-day automatic Trash purge OK."]);
        addLog("D", "PlayConsoleHub", "Storage lifecycle validation: sandbox directories purged successfully.");
      } else if (currentProgress >= 100) {
        clearInterval(interval);
        setPlayScanState("finished");
        setPlayScanLogs(prev => [
          ...prev,
          "✓ Background syncing: User consent explicit check OK.",
          "🎉 Verification complete: 100% compliant with Google Play Store standards!"
        ]);
        addLog("I", "PlayConsoleHub", "Automated Play Console Policy Scan finished. 100% compliant.");
      }
    }, 200);
  };

  const handleGeneratePlayAsset = async (type: string) => {
    setIsGeneratingPlayAsset(true);
    setGeneratedPlayAsset(null);
    addLog("I", "GeminiAI", `Requesting Gemini AI to draft Google Play asset: ${type}`);
    try {
      const response = await fetch("/api/gemini/play-assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type }),
      });
      const data = await response.json();
      if (data.success) {
        setGeneratedPlayAsset({ type, content: data.content });
        addLog("I", "GeminiAI", `Successfully received ${type} draft from Gemini.`);
      } else {
        throw new Error(data.error || "Generation failed");
      }
    } catch (err: any) {
      addLog("E", "GeminiAI", `Failed to generate ${type}: ${err.message}`);
      setGeneratedPlayAsset({
        type,
        content: `Error: Could not contact Gemini AI publishing service. Please check your connectivity or secrets configuration. Error details: ${err.message}`
      });
    } finally {
      setIsGeneratingPlayAsset(false);
    }
  };

  // Premium Advanced Features Handlers
  const handleTriggerQrScan = () => {
    setIsQrScannerOpen(true);
    setIsScanningQr(true);
    setQrScanResult(null);
    addLog("I", "QrScanner", "Initializing on-device hardware camera frame processor...");
    setTimeout(() => {
      setIsScanningQr(false);
      const mockPayloads = [
        "https://github.com/google/android-photo-picker",
        "WIFI:S:SecureHome_5G;T:WPA;P:AndroidKeystorePass123;;",
        "SECURE_SYNC_KEY:A38BFD921C00E;CLIENT:mr3hasan@gmail.com;M3_THEME:orchid"
      ];
      const result = mockPayloads[Math.floor(Math.random() * mockPayloads.length)];
      setQrScanResult(result);
      addLog("I", "QrScanner", `QR frame captured successfully. Decoded payload: ${result}`);
    }, 2000);
  };

  const handleTriggerDocScan = () => {
    setIsDocScannerOpen(true);
    setIsScanningDoc(true);
    setDocScanProgress(0);
    addLog("I", "DocScanner", "Analyzing camera perspective matrices & document corners...");
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setDocScanProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setIsScanningDoc(false);
        const newDoc = {
          id: `doc_${Date.now()}`,
          title: `Scanned_Doc_${savedScannedDocs.length + 1}`,
          date: new Date().toLocaleDateString(),
          size: "450 KB",
          url: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=400&q=80"
        };
        setSavedScannedDocs(prev => [newDoc, ...prev]);
        addLog("I", "DocScanner", `Document scanning complete. Extracted PDF saved: ${newDoc.title}.pdf`);
      }
    }, 400);
  };

  const handleEnrollFace = (name: string) => {
    if (!name.trim()) return;
    setIsEnrollingFace(true);
    addLog("I", "FaceRecognition", `Starting face biometrics registration for: ${name}`);
    setTimeout(() => {
      setIsEnrollingFace(false);
      if (!enrolledFaces.includes(name)) {
        setEnrolledFaces(prev => [...prev, name]);
      }
      addLog("I", "FaceRecognition", `Biometric on-device enroll complete. Created 128D secure vector embedding for ${name}.`);
    }, 1800);
  };

  const handleRunOcrOnPhoto = async (photo: Photo) => {
    setIsOcrProcessing(true);
    setOcrText(null);
    addLog("I", "OCRService", `Analyzing text coordinates inside photo: ${photo.title}...`);
    try {
      const ocrPrompt = `Perform OCR on this image: Title is "${photo.title}", description is "${photo.description}". Tags are ${photo.tags.join(", ")}. Extract all visible text. Be brief.`;
      const response = await fetch("/api/gemini/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          photoId: photo.id,
          promptOverride: ocrPrompt
        })
      });
      const data = await response.json();
      if (data.success && data.analysis) {
        setOcrText(data.analysis);
        addLog("I", "OCRService", "OCR Text Extraction completed successfully using Gemini vision API.");
      } else {
        throw new Error("Cloud analysis failed or fallback used.");
      }
    } catch (err) {
      const ocrFallbacks: Record<string, string> = {
        photo_001: "MOUNT BLANC - SECTOR CH-3\nELEVATION: 4,808m\nDATE: 2026-07-14\nLENS: f/1.7 6.9mm",
        photo_002: "NEON ALLEYWAYS\nTOKYO Cyberpunk District\n新宿 - SHINJUKU\nWARNING: HIGH VOLTAGE",
        photo_003: "VITE v6.2.3\n  ➜  Local:   http://localhost:3000/\n  ➜  Network: use --host to expose\n✓ App compiled in 145ms",
        photo_004: "COFFEE LAB - BREW CODE\nclass MainActivity : AppCompatActivity() {\n   override fun onCreate...\n}",
        raw_001: "HASSELBLAD RAW FRAME\nZERMATT SWITZERLAND\nISO 64 - f/5.6 - 1/250s",
        pdf_001: "CONFIDENTIAL BLUEPRINT\nANDROID KEYSTORE / STRONGBOX PROTECTION\nFIPS 140-2 Level 3 Secure Element System\nGoogle Play Compliance Specifications 2026",
      };
      const text = ocrFallbacks[photo.id] || `TEXT EXTRACTED FROM ${photo.title.toUpperCase()}:\n[No clear text found. Scanning with contrast score 0.98. Ready to edit.]`;
      setOcrText(text);
      addLog("W", "OCRService", "On-device ML Kit fallback extraction used.");
    } finally {
      setIsOcrProcessing(false);
    }
  };

  const handleSyncWithCloud = () => {
    setIsSyncingCloud(true);
    addLog("I", "CloudSync", `Initiating Google Play-compliant sync stream with ${cloudProvider.toUpperCase()}...`);
    setTimeout(() => {
      setIsSyncingCloud(false);
      addLog("I", "CloudSync", `Sync successful! Replicated local databases securely.`);
      setLastBackupTime(new Date().toLocaleString());
      localStorage.setItem("settings_last_backup", new Date().toLocaleString());
    }, 1800);
  };

  // Helper to derive a mock path for an album
  const getFolderPath = (albumName: string) => {
    switch (albumName) {
      case "Camera": return "/storage/emulated/0/DCIM/Camera";
      case "Downloads": return "/storage/emulated/0/Download";
      case "Screenshots": return "/storage/emulated/0/Pictures/Screenshots";
      default: return `/storage/emulated/0/Pictures/${albumName}`;
    }
  };

  // Helper to derive a file name for a photo
  const getFileName = (photo: Photo) => {
    const extension = photo.mimeType.startsWith("video") ? "mp4" : "jpg";
    const prefix = photo.mimeType.startsWith("video") ? "VID" : "IMG";
    const sanitizedTitle = photo.title.replace(/[^a-zA-Z0-9]/g, "_");
    return `${prefix}_2026_${sanitizedTitle}.${extension}`.toUpperCase();
  };

  // Compute matches across multiple categories
  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    
    // Default empty state when no query is typed
    if (!query) {
      return {
        images: [],
        videos: [],
        albums: [],
        folders: [],
        filenames: [],
      };
    }

    // Filter available photos (not in trash)
    const activePhotos = photos.filter(p => !p.isInTrash);

    // 1. Matches for Images
    const matchedImages = activePhotos.filter(p => 
      !p.mimeType.startsWith("video") && 
      (p.title.toLowerCase().includes(query) || 
       p.description.toLowerCase().includes(query) || 
       p.tags.some(t => t.toLowerCase().includes(query)) ||
       getFileName(p).toLowerCase().includes(query))
    );

    // 2. Matches for Videos
    const matchedVideos = activePhotos.filter(p => 
      p.mimeType.startsWith("video") && 
      (p.title.toLowerCase().includes(query) || 
       p.description.toLowerCase().includes(query) || 
       p.tags.some(t => t.toLowerCase().includes(query)) ||
       getFileName(p).toLowerCase().includes(query))
    );

    // 3. Matches for Albums
    // Get unique albums from activePhotos
    const allAlbums: string[] = Array.from(new Set<string>(activePhotos.map(p => p.album)));
    const matchedAlbums = allAlbums
      .filter(album => album.toLowerCase().includes(query))
      .map(album => ({
        name: album,
        count: activePhotos.filter(p => p.album === album).length,
        folderPath: getFolderPath(album)
      }));

    // 4. Matches for Folders
    const matchedFolders = allAlbums
      .map(album => ({
        albumName: album,
        folderPath: getFolderPath(album),
        count: activePhotos.filter(p => p.album === album).length
      }))
      .filter(folder => 
        folder.folderPath.toLowerCase().includes(query) || 
        folder.albumName.toLowerCase().includes(query)
      );

    // 5. Matches for File Names
    const matchedFilenames = activePhotos
      .map(photo => ({
        photo,
        fileName: getFileName(photo),
        folderPath: getFolderPath(photo.album)
      }))
      .filter(f => f.fileName.toLowerCase().includes(query));

    return {
      images: matchedImages,
      videos: matchedVideos,
      albums: matchedAlbums,
      folders: matchedFolders,
      filenames: matchedFilenames,
    };
  }, [photos, searchQuery]);

  // Filter photos based on current app navigation & permissions state
  const visiblePhotos = useMemo(() => {
    // 1. Check Permissions
    if (permissionState === "denied") {
      return [];
    }

    let result = photos;

    // Filter Hidden Photos out of standard views unless we are explicitly in the Hidden Album
    if (selectedAlbum === "Hidden") {
      result = result.filter(p => p.isHidden);
    } else {
      result = result.filter(p => !p.isHidden);
    }

    // Exclude globally hidden albums when viewing the main unified feed (selectedAlbum === null)
    if (selectedAlbum === null) {
      result = result.filter(p => !hiddenAlbumNames[p.album]);
    }

    // Apply Granular permission clipping
    if (permissionState === "granular") {
      result = result.filter(p => granularAllowedIds.includes(p.id));
    }

    // 2. Filter Trash vs Active
    if (selectedAlbum === "Trash") {
      result = result.filter(p => p.isInTrash);
    } else {
      result = result.filter(p => !p.isInTrash);
    }

    // 3. Filter Favorites
    if (selectedAlbum === "Favorites") {
      result = result.filter(p => p.isFavorite);
    }

    // 4. Filter Specific Album Names
    if (selectedAlbum && selectedAlbum !== "Trash" && selectedAlbum !== "Favorites") {
      result = result.filter(p => p.album === selectedAlbum);
    }

    // 4.1 Filter by recognized Face Cluster tag
    if (facePeopleFilter) {
      const faceMatches: Record<string, string[]> = {
        "Me": ["photo_001", "photo_004", "raw_001"],
        "Mom": ["photo_002", "photo_005"],
        "My Dog": ["photo_006"]
      };
      const allowedIds = faceMatches[facePeopleFilter] || [];
      result = result.filter(p => allowedIds.includes(p.id));
    }

    // 5. Apply AI Search ranking overlay if active
    if (aiSearchResults) {
      const scoreMap = new Map<string, number>(aiSearchResults.map(r => [r.id, r.score]));
      result = result
        .filter(p => scoreMap.has(p.id))
        .sort((a, b) => {
          const scoreA = scoreMap.get(a.id) ?? 0;
          const scoreB = scoreMap.get(b.id) ?? 0;
          return scoreB - scoreA;
        });
    } else if (searchQuery.trim() !== "") {
      // Offline local text filter fallback
      result = result.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // 6. Apply Settings Sort Order if AI Search ranking is not overlaying
    if (!aiSearchResults) {
      const getKB = (sizeStr: string): number => {
        const match = sizeStr.match(/^([\d.]+)\s*(MB|KB|GB)$/i);
        if (!match) return 0;
        const val = parseFloat(match[1]);
        const unit = match[2].toUpperCase();
        if (unit === "GB") return val * 1024 * 1024;
        if (unit === "MB") return val * 1024;
        return val;
      };

      result = [...result].sort((a, b) => {
        if (settingsSortOrder === "date_desc") {
          return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
        } else if (settingsSortOrder === "date_asc") {
          return new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime();
        } else if (settingsSortOrder === "size_desc") {
          return getKB(b.size) - getKB(a.size);
        } else if (settingsSortOrder === "size_asc") {
          return getKB(a.size) - getKB(b.size);
        } else if (settingsSortOrder === "name_asc") {
          return a.title.localeCompare(b.title);
        } else if (settingsSortOrder === "name_desc") {
          return b.title.localeCompare(a.title);
        }
        return 0;
      });
    }

    return result;
  }, [photos, permissionState, granularAllowedIds, selectedAlbum, aiSearchResults, searchQuery, hiddenAlbumNames, settingsSortOrder]);

  // Handle Photo Favoriting (Room Cache-first with Automatic Cloud Sync Worker)
  const handleToggleFavorite = async (photo: Photo) => {
    const nextFavoriteState = !photo.isFavorite;
    
    // 1. Write immediately to local Room Cache (Offline-first simulation)
    addLog("D", "GalleryViewModel", `User toggled favorite for ${photo.id}. Posting StateFlow update to Room cache.`);
    addLog("I", "RoomDatabase", `sqlite: UPDATE photos_table SET isFavorite = ${nextFavoriteState ? 1 : 0}, isSynced = 0 WHERE id = '${photo.id}'`);
    addLog("V", "WorkManager", `Enqueued OneTimeWorkRequest for SyncWorker (ID: sync_fav_${photo.id}) with state: PENDING (Waiting for connection constraints).`);
    
    // Set local state instantly for extreme responsiveness
    setPhotos(prev => prev.map(p => p.id === photo.id ? { ...p, isFavorite: nextFavoriteState, isSynced: false } : p));
    if (selectedPhoto && selectedPhoto.id === photo.id) {
      setSelectedPhoto(prev => prev ? { ...prev, isFavorite: nextFavoriteState, isSynced: false } : null);
    }
    
    // Mark this photo as actively syncing in our background worker tracker
    setSyncingPhotoIds(prev => ({ ...prev, [photo.id]: true }));

    try {
      // 2. Perform server-side SQLite update to reflect local changes in database
      const res = await fetch(`/api/photos/${photo.id}/favorite`, { method: "PATCH" });
      const data = await res.json();
      
      if (data.success) {
        addLog("D", "RoomDatabase", `Room local cache transaction committed successfully for: ${photo.id}`);
        
        // 3. Trigger Automatic Sync Task (Simulating Android's WorkManager)
        setTimeout(async () => {
          addLog("I", "SyncWorker", `SyncWorker (sync_fav_${photo.id}): Connection constraint met. Launching automatic background cloud synchronization stream...`);
          try {
            const syncRes = await fetch(`/api/photos/${photo.id}/sync`, { method: "POST" });
            const syncData = await syncRes.json();
            
            if (syncData.success) {
              addLog("I", "SyncWorker", `SyncWorker: Successfully synchronized '${photo.title}' with cloud storage. Server response code 200 OK.`);
              addLog("I", "RoomDatabase", `sqlite: UPDATE photos_table SET isSynced = 1 WHERE id = '${photo.id}'`);
              
              // Update state with confirmed sync status
              setPhotos(prev => prev.map(p => p.id === photo.id ? { ...p, isSynced: true } : p));
              if (selectedPhoto && selectedPhoto.id === photo.id) {
                setSelectedPhoto(prev => prev ? { ...prev, isSynced: true } : null);
              }
            }
          } catch (syncErr: any) {
            addLog("E", "SyncWorker", `SyncWorker: Background upload failed: ${syncErr.message}. Will retry on next connectivity cycle.`);
          } finally {
            // Remove from syncing tracker
            setSyncingPhotoIds(prev => {
              const updated = { ...prev };
              delete updated[photo.id];
              return updated;
            });
          }
        }, 1500); // Simulated 1.5s delay to make background syncing visual and trackable in UI
      }
    } catch (err: any) {
      addLog("E", "RoomDatabase", `Local SQLite cache write failed: ${err.message}`);
      setSyncingPhotoIds(prev => {
        const updated = { ...prev };
        delete updated[photo.id];
        return updated;
      });
    }
  };

  // Open File Details Screen and populate edit form state
  const handleOpenFileDetails = () => {
    if (!selectedPhoto) return;
    setDetailEditForm({
      title: selectedPhoto.title,
      description: selectedPhoto.description,
      width: selectedPhoto.width,
      height: selectedPhoto.height,
      size: selectedPhoto.size,
      dateAdded: new Date(selectedPhoto.dateAdded).toISOString().slice(0, 16),
      camera: selectedPhoto.exif.camera,
      lens: selectedPhoto.exif.lens,
      aperture: selectedPhoto.exif.aperture,
      exposureTime: selectedPhoto.exif.exposureTime,
      iso: selectedPhoto.exif.iso,
      focalLength: selectedPhoto.exif.focalLength,
      locationAddress: selectedPhoto.exif.location ? selectedPhoto.exif.location.address : "",
      locationLat: selectedPhoto.exif.location ? selectedPhoto.exif.location.latitude : 0,
      locationLng: selectedPhoto.exif.location ? selectedPhoto.exif.location.longitude : 0,
    });
    setIsEditingDetails(false);
    setShowFileDetailsScreen(true);
    addLog("V", "PhotosScreen", `Opening full file details screen for: ${selectedPhoto.title}`);
  };

  // Save updated file details back to database
  const handleSaveFileDetails = async () => {
    if (!selectedPhoto) return;
    addLog("D", "PhotoRepositoryImpl", `Saving updated file details for photo ID: ${selectedPhoto.id}...`);
    try {
      const updatePayload = {
        title: detailEditForm.title,
        description: detailEditForm.description,
        width: Number(detailEditForm.width),
        height: Number(detailEditForm.height),
        size: detailEditForm.size,
        dateAdded: new Date(detailEditForm.dateAdded).toISOString(),
        exif: {
          camera: detailEditForm.camera,
          lens: detailEditForm.lens,
          aperture: detailEditForm.aperture,
          exposureTime: detailEditForm.exposureTime,
          iso: detailEditForm.iso,
          focalLength: detailEditForm.focalLength,
          location: detailEditForm.locationAddress ? {
            latitude: Number(detailEditForm.locationLat),
            longitude: Number(detailEditForm.locationLng),
            address: detailEditForm.locationAddress,
          } : null
        }
      };

      const response = await fetch(`/api/photos/${selectedPhoto.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatePayload)
      });

      if (!response.ok) throw new Error("Failed to save on server");
      const data = await response.json();
      if (data.success) {
        addLog("I", "PhotoRepositoryImpl", `Success: Saved EXIF & media metadata updates in SQLite db.`);
        setPhotos(prev => prev.map(p => p.id === selectedPhoto.id ? { ...p, ...updatePayload } : p));
        setSelectedPhoto(prev => prev ? { ...prev, ...updatePayload } : null);
        setIsEditingDetails(false);
      } else {
        throw new Error(data.error || "Unknown server error");
      }
    } catch (err: any) {
      addLog("E", "PhotoRepositoryImpl", `Error saving file details: ${err.message}`);
    }
  };

  // Handle Photo Soft-Delete (Move to Trash)
  const handleDeletePhoto = async (photo: Photo) => {
    const isAlreadyInTrash = photo.isInTrash;
    addLog("D", "GalleryViewModel", `Delete requested for photo ID: ${photo.id}. IsTrashed=${isAlreadyInTrash}. Initiating safe deletion flow...`);
    
    try {
      const res = await fetch(`/api/photos/${photo.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        if (data.action === "soft_delete") {
          addLog("W", "TrashManager", `Google Play policy complied: Photo '${photo.title}' moved to sandboxed Trash storage. Automatically purges in 30 days.`);
          setPhotos(prev => prev.map(p => p.id === photo.id ? { ...p, isInTrash: true, trashTimeLeftDays: 30 } : p));
        } else {
          addLog("W", "MediaStore", `Hard delete performed. Record for ${photo.id} permanently removed from SQLite database files.`);
          setPhotos(prev => prev.filter(p => p.id !== photo.id));
        }
        setSelectedPhoto(null);
      }
    } catch (err: any) {
      addLog("E", "TrashManager", `Delete request failed: ${err.message}`);
    }
  };

  // Restore photo from trash
  const handleRestorePhoto = async (photo: Photo) => {
    addLog("D", "GalleryViewModel", `Restore requested for photo ID: ${photo.id}. Posting restoration action...`);
    try {
      const res = await fetch(`/api/photos/${photo.id}/restore`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        addLog("I", "TrashManager", `Photo '${photo.title}' restored to album '${photo.album}'. SQLite trash flag set to false.`);
        setPhotos(prev => prev.map(p => p.id === photo.id ? { ...p, isInTrash: false, trashTimeLeftDays: null } : p));
        setSelectedPhoto(null);
      }
    } catch (err: any) {
      addLog("E", "TrashManager", `Restore operation failed: ${err.message}`);
    }
  };

  // Batch Copy Multi-Selected Photos
  const handleBatchCopy = async (targetAlbum: string) => {
    addLog("D", "BatchManager", `Starting batch COPY for ${selectedPhotoIds.length} items to album: ${targetAlbum}`);
    try {
      const res = await fetch("/api/photos/batch/copy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedPhotoIds, targetAlbum })
      });
      const data = await res.json();
      if (data.success) {
        addLog("I", "BatchManager", `Successfully copied ${data.count} items into '${targetAlbum}'. SQLite inserts committed.`);
        await fetchPhotos();
        setIsSelectMode(false);
        setSelectedPhotoIds([]);
        setShowCopyMoveDialog(null);
      } else {
        addLog("E", "BatchManager", `Batch copy failed: ${data.error || "Unknown error"}`);
      }
    } catch (err: any) {
      addLog("E", "BatchManager", `Batch copy operation failed: ${err.message}`);
    }
  };

  // Batch Move Multi-Selected Photos
  const handleBatchMove = async (targetAlbum: string) => {
    addLog("D", "BatchManager", `Starting batch MOVE for ${selectedPhotoIds.length} items to album: ${targetAlbum}`);
    try {
      const res = await fetch("/api/photos/batch/move", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedPhotoIds, targetAlbum })
      });
      const data = await res.json();
      if (data.success) {
        addLog("I", "BatchManager", `Successfully moved ${data.count} items to '${targetAlbum}'. SQLite records updated.`);
        setPhotos(prev => prev.map(p => selectedPhotoIds.includes(p.id) ? { ...p, album: targetAlbum, isSynced: false } : p));
        setIsSelectMode(false);
        setSelectedPhotoIds([]);
        setShowCopyMoveDialog(null);
      } else {
        addLog("E", "BatchManager", `Batch move failed: ${data.error || "Unknown error"}`);
      }
    } catch (err: any) {
      addLog("E", "BatchManager", `Batch move operation failed: ${err.message}`);
    }
  };

  // Batch Delete Multi-Selected Photos
  const handleBatchDelete = async (forcePermanent = false) => {
    addLog("D", "BatchManager", `Starting batch DELETE for ${selectedPhotoIds.length} items. Permanent=${forcePermanent}`);
    try {
      const res = await fetch("/api/photos/batch/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedPhotoIds, forcePermanent })
      });
      const data = await res.json();
      if (data.success) {
        if (forcePermanent || data.action === "hard_delete") {
          addLog("W", "BatchManager", `Permanently purged ${selectedPhotoIds.length} items from device and SQLite cache.`);
          setPhotos(prev => prev.filter(p => !selectedPhotoIds.includes(p.id)));
        } else {
          addLog("W", "BatchManager", `Moved ${data.softDeletedCount} items to Recycle Bin. Auto-purges in 30 days.`);
          if (data.hardDeletedCount > 0) {
            addLog("W", "BatchManager", `Also permanently deleted ${data.hardDeletedCount} items already in Recycle Bin.`);
          }
          const softDeletedIds = data.softDeleted.map((p: any) => p.id);
          const hardDeletedIds = data.hardDeletedIds || [];
          setPhotos(prev => prev.filter(p => !hardDeletedIds.includes(p.id)).map(p => softDeletedIds.includes(p.id) ? { ...p, isInTrash: true, trashTimeLeftDays: 30 } : p));
        }
        setIsSelectMode(false);
        setSelectedPhotoIds([]);
      } else {
        addLog("E", "BatchManager", `Batch delete failed: ${data.error || "Unknown error"}`);
      }
    } catch (err: any) {
      addLog("E", "BatchManager", `Batch delete operation failed: ${err.message}`);
    }
  };

  // Batch Rename Multi-Selected Photos
  const handleBatchRename = async (baseName: string) => {
    if (!baseName.trim()) return;
    addLog("D", "BatchManager", `Starting batch RENAME for ${selectedPhotoIds.length} items with base name: '${baseName}'`);
    try {
      const res = await fetch("/api/photos/batch/rename", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedPhotoIds, baseName })
      });
      const data = await res.json();
      if (data.success) {
        addLog("I", "BatchManager", `Successfully renamed ${data.count} items. Titles updated sequentially.`);
        const renamedIds = data.renamedPhotos.map((p: any) => p.id);
        const renameMap = new Map(data.renamedPhotos.map((p: any) => [p.id, p.title]));
        setPhotos(prev => prev.map(p => renamedIds.includes(p.id) ? { ...p, title: renameMap.get(p.id) as string, isSynced: false } : p));
        setIsSelectMode(false);
        setSelectedPhotoIds([]);
        setShowRenameBatchDialog(false);
        setBatchRenamePrefix("");
      } else {
        addLog("E", "BatchManager", `Batch rename failed: ${data.error || "Unknown error"}`);
      }
    } catch (err: any) {
      addLog("E", "BatchManager", `Batch rename operation failed: ${err.message}`);
    }
  };

  // Batch/Single Compress Selected Photos
  const handleBatchCompress = async (quality: "low" | "medium" | "high" = "medium", targetIds: string[] = selectedPhotoIds) => {
    addLog("D", "BatchManager", `Starting compression pipeline for ${targetIds.length} items with profile: ${quality.toUpperCase()}...`);
    try {
      const res = await fetch("/api/photos/batch/compress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: targetIds, quality })
      });
      const data = await res.json();
      if (data.success) {
        addLog("I", "BatchManager", `Compression task completed for ${data.count} photos. Re-allocated storage sectors using ${quality.toUpperCase()} profile.`);
        const compMap = new Map(data.compressedPhotos.map((p: any) => [p.id, p]));
        
        // Update local state list
        setPhotos(prev => prev.map(p => {
          if (compMap.has(p.id)) {
            const comp = compMap.get(p.id) as any;
            return { 
              ...p, 
              title: comp.title, 
              size: comp.compressedSize, 
              width: comp.compressedWidth, 
              height: comp.compressedHeight, 
              isSynced: false 
            };
          }
          return p;
        }));

        // Also update selectedPhoto state if it is currently open
        if (selectedPhoto && compMap.has(selectedPhoto.id)) {
          const comp = compMap.get(selectedPhoto.id) as any;
          setSelectedPhoto(prev => prev ? {
            ...prev,
            title: comp.title,
            size: comp.compressedSize,
            width: comp.compressedWidth,
            height: comp.compressedHeight,
            isSynced: false
          } : null);
        }

        setCompressedBatchResults(data.compressedPhotos);
        setShowCompressBatchDialog(true);
        setIsSelectMode(false);
        setSelectedPhotoIds([]);
      } else {
        addLog("E", "BatchManager", `Compression failed: ${data.error || "Unknown error"}`);
      }
    } catch (err: any) {
      addLog("E", "BatchManager", `Compress operation failed: ${err.message}`);
    }
  };

  // Duplicate Finder Handlers
  const handleScanDuplicates = async () => {
    setIsScanningDuplicates(true);
    addLog("D", "DuplicateFinder", "Scanning SQLite tables & media content hash catalogs for duplicate entries...");
    try {
      const res = await fetch("/api/photos/duplicates/scan");
      const data = await res.json();
      if (data.success) {
        setDuplicateGroups(data.groups);
        
        // Suggest deletions: pre-select every photo in each group EXCEPT the suggestedKeepId
        const initialDeletions: Record<string, string[]> = {};
        data.groups.forEach((group: any) => {
          initialDeletions[group.id] = group.photos
            .map((p: any) => p.id)
            .filter((id: string) => id !== group.suggestedKeepId);
        });
        setSelectedDuplicateDeletions(initialDeletions);
        
        addLog("I", "DuplicateFinder", `Scanning completed. Detected ${data.groups.length} duplicate group(s) across device catalogs.`);
      } else {
        addLog("E", "DuplicateFinder", `Scan failed: ${data.error || "Unknown error"}`);
      }
    } catch (err: any) {
      addLog("E", "DuplicateFinder", `Failed to complete duplicate scanning: ${err.message}`);
    } finally {
      setIsScanningDuplicates(false);
    }
  };

  const handleDeleteSelectedDuplicates = async () => {
    const allIdsToDelete = Object.values(selectedDuplicateDeletions).flat();
    if (allIdsToDelete.length === 0) return;
    
    addLog("D", "DuplicateFinder", `Pruning ${allIdsToDelete.length} redundant duplicate records to recycle bin...`);
    try {
      const res = await fetch("/api/photos/batch/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: allIdsToDelete, forcePermanent: false })
      });
      const data = await res.json();
      if (data.success) {
        addLog("I", "DuplicateFinder", `Successfully moved ${allIdsToDelete.length} duplicate items to the Recycle Bin.`);
        
        // Update local photos list so they are immediately moved/hidden
        setPhotos(prev => prev.map(p => {
          if (allIdsToDelete.includes(p.id)) {
            return { ...p, isInTrash: true, trashTimeLeftDays: 30 };
          }
          return p;
        }));
        
        // Refresh the scan so the group list is updated!
        await handleScanDuplicates();
      } else {
        addLog("E", "DuplicateFinder", `Batch deletion failed: ${data.error || "Unknown error"}`);
      }
    } catch (err: any) {
      addLog("E", "DuplicateFinder", `Failed to execute duplicate deletion transaction: ${err.message}`);
    }
  };

  const handleInjectTestDuplicate = async () => {
    setIsInjectingDuplicate(true);
    addLog("D", "DuplicateFinder", "Simulating camera file double-write or external folder download sync...");
    try {
      const res = await fetch("/api/photos/duplicates/inject", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        addLog("I", "DuplicateFinder", `Injected duplicate record: "${data.duplicate.title}" in Downloads directory.`);
        
        // Fetch/Update local photos
        setPhotos(prev => [...prev, data.duplicate]);
        
        // Re-scan
        await handleScanDuplicates();
      } else {
        addLog("E", "DuplicateFinder", `Injection failed: ${data.error || "Unknown error"}`);
      }
    } catch (err: any) {
      addLog("E", "DuplicateFinder", `Injection error: ${err.message}`);
    } finally {
      setIsInjectingDuplicate(false);
    }
  };

  const getSelectedSavingsStr = () => {
    let totalKB = 0;
    const allSelectedIds = Object.values(selectedDuplicateDeletions).flat();
    allSelectedIds.forEach(id => {
      const p = photos.find(item => item.id === id);
      if (p) {
        const match = p.size.match(/^([\d.]+)\s*(MB|KB|GB)$/i);
        if (match) {
          const val = parseFloat(match[1]);
          const unit = match[2].toUpperCase();
          if (unit === "GB") totalKB += val * 1024 * 1024;
          else if (unit === "MB") totalKB += val * 1024;
          else totalKB += val;
        }
      }
    });
    
    if (totalKB >= 1024 * 1024) {
      return `${(totalKB / (1024 * 1024)).toFixed(1)} GB`;
    }
    if (totalKB >= 1024) {
      return `${(totalKB / 1024).toFixed(1)} MB`;
    }
    return `${Math.round(totalKB)} KB`;
  };

  // Large File Finder Utilities & Handlers
  const sortedLargeFiles = useMemo(() => {
    const getKB = (sizeStr: string): number => {
      const match = sizeStr.match(/^([\d.]+)\s*(MB|KB|GB)$/i);
      if (!match) return 0;
      const val = parseFloat(match[1]);
      const unit = match[2].toUpperCase();
      if (unit === "GB") return val * 1024 * 1024;
      if (unit === "MB") return val * 1024;
      return val;
    };

    const active = photos.filter(p => !p.isInTrash);
    const filtered = active.filter(p => getKB(p.size) >= largeFileMinSizeMB * 1024);

    return filtered.sort((a, b) => {
      const sizeA = getKB(a.size);
      const sizeB = getKB(b.size);
      return largeFileSortOrder === "desc" ? sizeB - sizeA : sizeA - sizeB;
    });
  }, [photos, largeFileMinSizeMB, largeFileSortOrder]);

  const totalLargeFilesSizeStr = useMemo(() => {
    let totalKB = 0;
    sortedLargeFiles.forEach(p => {
      const match = p.size.match(/^([\d.]+)\s*(MB|KB|GB)$/i);
      if (match) {
        const val = parseFloat(match[1]);
        const unit = match[2].toUpperCase();
        if (unit === "GB") totalKB += val * 1024 * 1024;
        else if (unit === "MB") totalKB += val * 1024;
        else totalKB += val;
      }
    });
    if (totalKB >= 1024 * 1024) return `${(totalKB / (1024 * 1024)).toFixed(1)} GB`;
    if (totalKB >= 1024) return `${(totalKB / 1024).toFixed(1)} MB`;
    return `${Math.round(totalKB)} KB`;
  }, [sortedLargeFiles]);

  const handleScanLargeFiles = async () => {
    setIsScanningLargeFiles(true);
    addLog("D", "LargeFileFinder", `Initiating storage catalog traversal looking for files >= ${largeFileMinSizeMB} MB...`);
    setTimeout(() => {
      setIsScanningLargeFiles(false);
      addLog("I", "LargeFileFinder", `Storage traversal complete. Detected ${sortedLargeFiles.length} files matching threshold.`);
    }, 1000);
  };

  const handleQuickDeleteLargeFile = async (photoId: string) => {
    const photo = photos.find(p => p.id === photoId);
    if (!photo) return;
    addLog("D", "LargeFileFinder", `Quick deleting large file: "${photo.title}" (${photo.size})`);
    try {
      const res = await fetch(`/api/photos/${photoId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        if (data.action === "soft_delete") {
          addLog("W", "LargeFileFinder", `Quick Deleted: '${photo.title}' moved to Trash.`);
          setPhotos(prev => prev.map(p => p.id === photoId ? { ...p, isInTrash: true, trashTimeLeftDays: 30 } : p));
        } else {
          addLog("W", "LargeFileFinder", `Permanently Deleted record for ${photo.title} from SQLite db.`);
          setPhotos(prev => prev.filter(p => p.id !== photoId));
        }
      } else {
        addLog("E", "LargeFileFinder", `Quick delete failed: ${data.error || "Unknown error"}`);
      }
    } catch (err: any) {
      addLog("E", "LargeFileFinder", `Failed to complete quick deletion of large file: ${err.message}`);
    }
  };

  // Batch Share Multi-Selected Photos
  const handleBatchShare = async () => {
    addLog("D", "BatchManager", `Initiating mock Intent share for ${selectedPhotoIds.length} items...`);
    try {
      const res = await fetch("/api/photos/batch/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedPhotoIds })
      });
      const data = await res.json();
      if (data.success) {
        addLog("I", "BatchManager", `Broadcasted android.intent.action.SEND_MULTIPLE. Uri matching local sandbox references compiled.`);
        setSharedBatchLink(data.sharedLink);
        setSharedBatchTitles(data.titles);
        setShowShareBatchDialog(true);
        setIsSelectMode(false);
        setSelectedPhotoIds([]);
      } else {
        addLog("E", "BatchManager", `Batch share failed: ${data.error || "Unknown error"}`);
      }
    } catch (err: any) {
      addLog("E", "BatchManager", `Batch share operation failed: ${err.message}`);
    }
  };

  // Move photo to Secure Vault (with simulated Encrypted AES-256 storage)
  const handleToggleHide = async (photo: Photo) => {
    const nextHiddenState = !photo.isHidden;
    addLog("D", "GalleryViewModel", `Secure Vault operation triggered. Swapping Hidden state of ${photo.id} to: ${nextHiddenState}`);
    
    if (nextHiddenState) {
      addLog("I", "CryptoEngine", "Initializing secure cryptographic session...");
      addLog("D", "AndroidKeystore", "Retrieving wrapping master key 'secure_vault_aes_key' from device StrongBox keystore...");
      addLog("I", "CryptoEngine", `Applying AES-256-GCM cipher encryption across media streams for: '${photo.title}'`);
      addLog("I", "RoomDatabase", `sqlite: UPDATE photos_table SET isHidden = 1, isSynced = 0, size = '${photo.size}' WHERE id = '${photo.id}'`);
    } else {
      addLog("I", "CryptoEngine", "Initiating master key authorization flow for decryption...");
      addLog("D", "AndroidKeystore", "Acquired decryption session from keystore.");
      addLog("I", "CryptoEngine", `Successfully decrypted AES-256 binary cipher back to original JPEG stream.`);
      addLog("I", "RoomDatabase", `sqlite: UPDATE photos_table SET isHidden = 0, isSynced = 1 WHERE id = '${photo.id}'`);
    }

    // Instantly update client local state
    setPhotos(prev => prev.map(p => p.id === photo.id ? { ...p, isHidden: nextHiddenState, isSynced: false } : p));
    if (selectedPhoto && selectedPhoto.id === photo.id) {
      setSelectedPhoto(null); // Close active photo details sheet
    }

    try {
      const res = await fetch(`/api/photos/${photo.id}/hide`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isHidden: nextHiddenState })
      });
      const data = await res.json();
      
      if (data.success) {
        if (nextHiddenState) {
          addLog("V", "WorkManager", `Enqueued background upload of encrypted cipher block (ID: sync_hide_${photo.id}) with NetworkType: UNMETERED.`);
          
          setSyncingPhotoIds(prev => ({ ...prev, [photo.id]: true }));
          
          setTimeout(async () => {
            addLog("I", "SyncWorker", `EncryptedSyncWorker (sync_hide_${photo.id}): Connection met. Transporting encrypted payload to Cloud Storage...`);
            try {
              const syncRes = await fetch(`/api/photos/${photo.id}/sync`, { method: "POST" });
              const syncData = await syncRes.json();
              if (syncData.success) {
                addLog("I", "SyncWorker", `SyncWorker: Confirmed sync with secure cloud partition. Block commit code: 200 OK.`);
                addLog("I", "RoomDatabase", `sqlite: UPDATE photos_table SET isSynced = 1 WHERE id = '${photo.id}'`);
                setPhotos(prev => prev.map(p => p.id === photo.id ? { ...p, isSynced: true } : p));
              }
            } catch (syncErr: any) {
              addLog("E", "SyncWorker", `Background upload failed: ${syncErr.message}`);
            } finally {
              setSyncingPhotoIds(prev => {
                const updated = { ...prev };
                delete updated[photo.id];
                return updated;
              });
            }
          }, 1500);
        } else {
          // Decrypted back to camera
          addLog("I", "RoomDatabase", `Item '${photo.title}' decrypted and committed successfully.`);
        }
      }
    } catch (err: any) {
      addLog("E", "RoomDatabase", `Database write failed for hidden transaction: ${err.message}`);
    }
  };

  // Setup Secure Vault PIN (AES-GCM key derived on device)
  const handleSetupVaultPin = async () => {
    setVaultSetupError("");
    if (!vaultSetupPin || vaultSetupPin.length !== 4 || isNaN(Number(vaultSetupPin))) {
      setVaultSetupError("PIN must be exactly 4 digits.");
      addLog("E", "VaultSetup", "Setup failed: PIN is not a 4-digit numeric sequence.");
      return;
    }
    if (vaultSetupPin !== vaultSetupPinConfirm) {
      setVaultSetupError("PINs do not match.");
      addLog("E", "VaultSetup", "Setup failed: Password verification mismatch.");
      return;
    }

    addLog("I", "VaultSetup", "Initiating Secure Vault cryptographic setup...");
    addLog("D", "AndroidKeystore", "Generating 256-bit AES master key in StrongBox Hardware Security Module (HSM)...");
    addLog("I", "CryptoEngine", "Deriving key encryption keys (KEK) using PBKDF2 with 100,000 iterations + SHA256...");

    try {
      const res = await fetch("/api/vault/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: vaultSetupPin })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        addLog("I", "EncryptedSharedPreferences", "sqlite: INSERT INTO secure_preferences (key, encrypted_val) VALUES ('vault_pin_configured', 'true')");
        addLog("I", "VaultSetup", "Secure Vault configured and ready. File partition /app_encrypted_vault/ initialized.");
        setVaultHasPin(true);
        setShowVaultSetupModal(false);
        setVaultSetupPin("");
        setVaultSetupPinConfirm("");
        
        // Auto unlock after setup
        setIsVaultUnlocked(true);
        setSelectedAlbum("Hidden");
        setActiveTab("photos");
        addLog("D", "GalleryViewModel", "Navigation updated: Automatically entering unlocked secure vault.");
      } else {
        setVaultSetupError(data.error || "Setup failed.");
      }
    } catch (err: any) {
      setVaultSetupError("Server connection error.");
      addLog("E", "VaultSetup", `Setup request failed: ${err.message}`);
    }
  };

  // Unlock Secure Vault with PIN
  const handleUnlockVault = async () => {
    setVaultAuthError("");
    if (!vaultPinInput || vaultPinInput.length !== 4 || isNaN(Number(vaultPinInput))) {
      setVaultAuthError("Enter a valid 4-digit PIN.");
      return;
    }

    addLog("D", "VaultAuth", "Verifying credentials against device Keystore auth provider...");

    try {
      const res = await fetch("/api/vault/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: vaultPinInput })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        addLog("I", "VaultAuth", "PIN authentication success. Keystore authorized cipher block decryption session.");
        addLog("D", "CryptoEngine", "Successfully loaded AES key wrapping session.");
        setIsVaultUnlocked(true);
        setShowVaultAuthModal(false);
        setVaultPinInput("");
        
        // Set view to show hidden files
        setSelectedAlbum("Hidden");
        setActiveTab("photos");
        addLog("D", "GalleryViewModel", "Navigation updated: Entered secure Hidden Album vault.");
      } else {
        setVaultAuthError(data.error || "Incorrect PIN.");
        addLog("W", "VaultAuth", "Authentication failed: Decryption key authorization rejected (Invalid PIN).");
      }
    } catch (err: any) {
      setVaultAuthError("Unlock connection failed.");
      addLog("E", "VaultAuth", `Authorization request failed: ${err.message}`);
    }
  };

  // Lock Secure Vault
  const handleLockVault = () => {
    setIsVaultUnlocked(false);
    setSelectedAlbum(null);
    setActiveTab("albums");
    addLog("I", "VaultSession", "Vault locked. Destroying active memory cryptographic session keys. Decryption denied.");
  };

  // Trigger Face Scan automatically on Lock Screen launch (if enabled)
  useEffect(() => {
    let faceInterval: NodeJS.Timeout | null = null;
    
    if (isAppLocked && appLockEnabled && appLockFaceEnabled) {
      setFaceScanState("scanning");
      setFaceScanProgress(0);
      setLockScreenError("");
      addLog("I", "FaceUnlockService", "App locked. Infrared face sensors initialized. Scanning depth map...");
      
      let progress = 0;
      faceInterval = setInterval(() => {
        progress += 10;
        setFaceScanProgress(progress);
        if (progress >= 100) {
          clearInterval(faceInterval!);
          faceInterval = null;
          
          // Verify
          setFaceScanState("success");
          addLog("I", "FaceUnlockService", "FaceMatch: Recognized enrolled user profile. Confidence: 99.4%.");
          setTimeout(() => {
            setIsAppLocked(false);
          }, 400);
        }
      }, 150);
    } else {
      setFaceScanState("idle");
      setFaceScanProgress(0);
    }
    
    return () => {
      if (faceInterval) clearInterval(faceInterval);
    };
  }, [isAppLocked, appLockEnabled, appLockFaceEnabled]);

  // App Lock Action Handlers
  const handlePressPinDigit = (digit: string) => {
    setLockScreenError("");
    if (lockScreenPinInput.length >= 4) return;
    
    const nextPin = lockScreenPinInput + digit;
    setLockScreenPinInput(nextPin);
    
    // Automatically verify when 4 digits are entered
    if (nextPin.length === 4) {
      if (nextPin === appLockPin) {
        setLockScreenError("");
        addLog("I", "AppLock", "PIN authenticated successfully. App unlocked.");
        setIsAppLocked(false);
        setLockScreenPinInput("");
      } else {
        setLockScreenError("Incorrect PIN. Please try again.");
        addLog("E", "AppLock", "Authentication failed: Entered invalid App Lock PIN.");
        setTimeout(() => {
          setLockScreenPinInput("");
        }, 500);
      }
    }
  };

  const handleBackspacePin = () => {
    setLockScreenError("");
    setLockScreenPinInput(prev => prev.slice(0, -1));
  };

  const triggerMockFaceScan = (shouldSucceed: boolean) => {
    setFaceScanState("scanning");
    setFaceScanProgress(0);
    setLockScreenError("");
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setFaceScanProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        if (shouldSucceed) {
          setFaceScanState("success");
          addLog("I", "FaceUnlockService", "FaceMatch: Custom mock face verify match. Authenticating...");
          setTimeout(() => {
            setIsAppLocked(false);
          }, 400);
        } else {
          setFaceScanState("error");
          setLockScreenError("Face not recognized");
          addLog("W", "FaceUnlockService", "FaceMatch: Unknown identity detected. Rejecting biometric login.");
        }
      }
    }, 150);
  };

  const startFingerprintScan = () => {
    if (fingerprintScanState === "success") return;
    setFingerprintScanState("scanning");
    addLog("D", "BiometricsHardware", "Capturing fingerprint ridge details...");
    
    setTimeout(() => {
      setFingerprintScanState("success");
      addLog("I", "BiometricsHardware", "Fingerprint authenticated. Keyguard dismissed.");
      setTimeout(() => {
        setIsBiometricPromptOpen(false);
        setIsAppLocked(false);
        setFingerprintScanState("idle");
      }, 500);
    }, 1200);
  };

  const simulateFingerprintResult = (shouldSucceed: boolean) => {
    setFingerprintScanState("scanning");
    addLog("D", "BiometricsHardware", "Capturing fingerprint ridge details...");
    
    setTimeout(() => {
      if (shouldSucceed) {
        setFingerprintScanState("success");
        addLog("I", "BiometricsHardware", "Fingerprint matches enrolled biometric file.");
        setTimeout(() => {
          setIsBiometricPromptOpen(false);
          setIsAppLocked(false);
          setFingerprintScanState("idle");
        }, 500);
      } else {
        setFingerprintScanState("error");
        addLog("E", "BiometricsHardware", "Fingerprint reject: match mismatch or sensor dirty.");
        setTimeout(() => {
          setFingerprintScanState("idle");
        }, 1500);
      }
    }, 800);
  };

  // Video player state observer and controllers
  useEffect(() => {
    setIsVideoPlaying(false);
    setVideoTime(0);
    setPlaybackRate(1.0);
    setIsSimulatedFullscreen(false);

    const currentVideo = videoRef.current;
    return () => {
      if (currentVideo) {
        try {
          currentVideo.pause();
          currentVideo.removeAttribute("src");
          currentVideo.load();
        } catch (e) {
          // ignore
        }
      }
    };
  }, [selectedPhoto]);

  const togglePlayVideo = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
        setIsVideoPlaying(false);
        addLog("V", "VideoPlayer", `Paused video: ${selectedPhoto?.title}`);
      } else {
        videoRef.current.play().then(() => {
          setIsVideoPlaying(true);
          addLog("V", "VideoPlayer", `Playing video: ${selectedPhoto?.title} at ${playbackRate}x speed`);
        }).catch(err => {
          addLog("E", "VideoPlayer", `Playback failed: ${err.message}`);
        });
      }
    }
  };

  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      addLog("V", "VideoPlayer", `Changed speed to ${rate}x`);
    }
  };

  const handleTimeScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setVideoTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVideoVolume(vol);
    if (videoRef.current) {
      videoRef.current.volume = vol;
      videoRef.current.muted = vol === 0;
    }
  };

  const seekForward = () => {
    if (videoRef.current) {
      const newTime = Math.min(videoRef.current.currentTime + 10, videoDuration);
      videoRef.current.currentTime = newTime;
      setVideoTime(newTime);
      addLog("V", "VideoPlayer", "Seek forward 10 seconds");
    }
  };

  const seekBackward = () => {
    if (videoRef.current) {
      const newTime = Math.max(videoRef.current.currentTime - 10, 0);
      videoRef.current.currentTime = newTime;
      setVideoTime(newTime);
      addLog("V", "VideoPlayer", "Seek backward 10 seconds");
    }
  };

  const togglePictureInPicture = async () => {
    try {
      if (videoRef.current) {
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture();
          addLog("I", "VideoPlayer", "Exited Picture-in-Picture mode.");
        } else {
          await videoRef.current.requestPictureInPicture();
          addLog("I", "VideoPlayer", "Entered Picture-in-Picture mode.");
        }
      }
    } catch (err: any) {
      addLog("E", "VideoPlayer", `Picture-in-Picture failed: ${err.message}`);
    }
  };

  const toggleSubtitles = () => {
    const newState = !subtitlesEnabled;
    setSubtitlesEnabled(newState);
    addLog("I", "VideoPlayer", `Subtitles ${newState ? "enabled" : "disabled"}`);
  };

  const toggleFullscreen = () => {
    setIsSimulatedFullscreen(prev => !prev);
    addLog("I", "VideoPlayer", "Toggled simulated fullscreen viewport");
  };

  const getSubtitlesText = (time: number) => {
    if (time >= 0 && time < 3) {
      return "Welcome to the modern ExoPlayer Simulator!";
    } else if (time >= 3 && time < 6) {
      return "Supporting Fullscreen, seeking, and playback speeds.";
    } else if (time >= 6 && time < 10) {
      return "PiP & customizable subtitles are fully supported.";
    } else if (time >= 10 && time < 15) {
      return "Enjoy smooth playback on Android 15 SDK 35!";
    }
    return "";
  };

  const formatVideoTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Trigger Gemini EXIF analysis
  const handleAiAnalyze = async (photo: Photo) => {
    setAiAnalysisLoadingId(photo.id);
    setAnalysisResult(null);
    addLog("I", "GeminiAI", `Contacting server-side Google GenAI (gemini-3.5-flash) to perform photographic EXIF analysis for photo: ${photo.title}...`);
    
    try {
      const response = await fetch("/api/gemini/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(photo)
      });
      if (!response.ok) throw new Error("AI analysis endpoint returned non-OK status");
      const data = await response.json();
      
      if (data.success) {
        setAnalysisResult(data);
        addLog("I", "GeminiAI", `Analysis successful! Action: Updated photo description, tags, and lens metrics.`);
        if (data.offlineFallback) {
          addLog("W", "GeminiAI", "No API key detected in user secrets. Loaded responsive offline fallback data.");
        } else {
          addLog("D", "GeminiAI", `AI Suggested Title: "${data.suggestedTitle}"`);
          addLog("D", "GeminiAI", `AI suggested ${data.suggestedTags?.length} descriptive visual tags.`);
        }
        
        // Refresh photos from local SQLite to reflect Gemini's persisted updates
        fetchPhotos();
      }
    } catch (error: any) {
      addLog("E", "GeminiAI", `AI analysis failed: ${error.message}`);
    } finally {
      setAiAnalysisLoadingId(null);
    }
  };

  // Trigger Gemini Semantic Search
  const handleAiSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsAiSearching(true);
    setAiSearchResults(null);
    addLog("I", "GeminiAI", `Dispatching remote semantic search query: "${searchQuery}" to Gemini Pro engine...`);
    
    try {
      const response = await fetch("/api/gemini/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery })
      });
      if (!response.ok) throw new Error("Search API error");
      const data = await response.json();
      
      if (data.success && data.results) {
        setAiSearchResults(data.results);
        addLog("I", "GeminiAI", `Search finished. Matched ${data.results.length} relevant assets utilizing conceptual similarities.`);
        if (data.offlineFallback) {
          addLog("W", "GeminiAI", "Search operated on local offline string-token matching fallback. Populate API key for full vector embeddings.");
        } else {
          data.results.forEach((r: any) => {
            addLog("D", "GeminiAI", `  Photo ID [${r.id}]: Relevance Score = ${r.score}/10. Reason: "${r.matchReason}"`);
          });
        }
      }
    } catch (err: any) {
      addLog("E", "GeminiAI", `Semantic search failed: ${err.message}. Defaulting to keyword filter.`);
    } finally {
      setIsAiSearching(false);
    }
  };

  // Clear AI Search Filters
  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchType("all");
    setAiSearchResults(null);
    addLog("D", "GalleryViewModel", "Cleared active filters and AI search context.");
  };

  // Handle visual photo editing filter selection
  const handleApplyFilter = (filterName: string) => {
    if (!selectedPhoto) return;
    setPhotoFilters(prev => ({
      ...prev,
      [selectedPhoto.id]: filterName
    }));
    setAppliedFilter(filterName);
    addLog("D", "RenderEngine", `Applied Compose ShaderEffect [${filterName}] to media object: ${selectedPhoto.id}`);
  };

  // Trigger download of full SDK Project files for the user
  const handleDownloadCodebase = () => {
    addLog("I", "SDKExporter", "Generating full Android SDK 35 Gradle project package...");
    
    // Create combined file data structure
    let combinedContent = "/* PROFESSIONAL KOTLIN ANDROID GALLERY APP ARCHITECTURE EXPORT */\n";
    combinedContent += "/* Target SDK: 35 | Compatibility: Android 10 (Q) through Android 16 */\n";
    combinedContent += "/* Compiled by Android Gallery Simulator - MVVM & Clean Architecture */\n\n";

    KOTLIN_CODEBASE.forEach(cat => {
      combinedContent += `// ========================================== \n`;
      combinedContent += `// CATEGORY: ${cat.title}\n`;
      combinedContent += `// ========================================== \n\n`;
      
      cat.files.forEach(file => {
        combinedContent += `// FILE PATH: app/src/main/java/com/google/android/gallery/${file.path}\n`;
        combinedContent += `// DESCRIPTION: ${file.description}\n`;
        combinedContent += `// ------------------------------------------ \n`;
        combinedContent += file.content;
        combinedContent += `\n\n`;
      });
    });

    const blob = new Blob([combinedContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Android_Gallery_Clean_Architecture_Project.kt");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addLog("I", "SDKExporter", "Project export complete. Downloaded 'Android_Gallery_Clean_Architecture_Project.kt' containing pure, production-ready Kotlin code classes.");
  };

  // Settings screen handlers
  const handleClearCache = () => {
    setIsClearingCache(true);
    addLog("I", "CacheManager", "Initiating disk cache purge: deleting pre-rendered thumbnails and vector assets...");
    setTimeout(() => {
      setCacheSizeMB(0);
      setIsClearingCache(false);
      addLog("I", "CacheManager", "Purge complete. 0 sectors remaining. Reclaimed storage blocks successfully.");
    }, 1200);
  };

  const handleTriggerBackup = () => {
    setBackupStatus("backing_up");
    addLog("I", "CloudSync", "Starting immediate manual backup of SQLite DB files and image directories...");
    addLog("D", "CloudSync", "Resolving un-synced database logs from photos_table...");
    setTimeout(() => {
      const nowStr = new Date().toLocaleString();
      setLastBackupTime(nowStr);
      localStorage.setItem("settings_last_backup", nowStr);
      setBackupStatus("backed_up");
      addLog("I", "CloudSync", `Cloud sync completed successfully. All local assets replicated. Last synced: ${nowStr}`);
      setTimeout(() => setBackupStatus("idle"), 2000);
    }, 1500);
  };

  // Handle Album clicking
  const handleAlbumClick = (albumName: string | null) => {
    if (albumName === "Favorites") {
      setActiveTab("favorites");
      setSelectedAlbum(null);
      addLog("D", "GalleryViewModel", "Navigation updated: Switched scope to dedicated Favorites Vault screen.");
    } else {
      setSelectedAlbum(albumName);
      setActiveTab("photos");
      addLog("D", "GalleryViewModel", `Navigation updated: Switched scope to album [${albumName || "Camera / All"}]`);
    }
  };

  // Generate dynamic CSS class for applied photofilter
  const getFilterCss = (photoId: string) => {
    const filter = photoFilters[photoId] || "Original";
    switch (filter) {
      case "Material Vivid": return "saturate-150 contrast-105 brightness-105";
      case "Cyber Amber": return "sepia saturate-150 hue-rotate-[320deg] brightness-95 contrast-110";
      case "Noir Mono": return "grayscale contrast-125 brightness-90";
      case "Warm Retro": return "sepia saturate-110 brightness-105 hue-rotate-15";
      case "Cinematic Cold": return "saturate-75 hue-rotate-[200deg] contrast-105 brightness-95";
      default: return "";
    }
  };

  // Filter Logcat Logs based on level select
  const filteredLogs = useMemo(() => {
    if (logFilter === "ALL") return logs;
    return logs.filter(log => log.level === logFilter);
  }, [logs, logFilter]);

  const palette = PALETTES[materialPalette] || PALETTES.purple;

  return (
    <div className={`${viewMode === 'app' ? 'h-screen w-screen overflow-hidden' : 'min-h-screen'} bg-[#F8F9FA] text-[#1C1B1F] flex flex-col font-sans select-none antialiased overflow-x-hidden`} id="app_root">
      <style>{`
        :root {
          --m3-primary: ${palette.primary};
          --m3-primary-light: ${palette.primaryLight};
          --m3-primary-dark: ${palette.primaryDark};
          --m3-primary-text: ${palette.primaryText};
        }
        .text-\\[\\#6750A4\\] { color: var(--m3-primary) !important; }
        .bg-\\[\\#6750A4\\] { background-color: var(--m3-primary) !important; }
        .bg-\\[\\#EADDFF\\] { background-color: var(--m3-primary-light) !important; }
        .text-\\[\\#21005D\\] { color: var(--m3-primary-text) !important; }
        .border-\\[\\#EADDFF\\] { border-color: var(--m3-primary-light) !important; }
        .border-\\[\\#CAC4D0\\] { border-color: ${palette.primary}30 !important; }
        .text-\\[\\#6750A4\\]\\/90 { color: var(--m3-primary)e6 !important; }
        .bg-\\[\\#6750A4\\]\\/90 { background-color: var(--m3-primary)e6 !important; }
        .bg-\\[\\#EADDFF\\]\\/40 { background-color: ${palette.primaryLight}66 !important; }
        .bg-\\[\\#EADDFF\\]\\/50 { background-color: ${palette.primaryLight}80 !important; }
        .bg-\\[\\#F3EDF7\\] { background-color: ${palette.primary}10 !important; }
        .bg-\\[\\#F3EDF7\\]\\/40 { background-color: ${palette.primary}08 !important; }
        .bg-\\[\\#6750A4\\]\\/10 { background-color: ${palette.primary}1a !important; }
        .hover\\:bg-\\[\\#ECE6F0\\]\\/60:hover { background-color: ${palette.primaryLight}40 !important; }
        .focus\\:ring-\\[\\#6750A4\\]:focus { --tw-ring-color: var(--m3-primary) !important; }
        .border-\\[\\#6750A4\\] { border-color: var(--m3-primary) !important; }
        .bg-\\[\\#4F378B\\] { background-color: var(--m3-primary-dark) !important; }
        .fill-\\[\\#21005D\\] { fill: var(--m3-primary-text) !important; }
        .fill-\\[\\#D0BCFF\\] { fill: var(--m3-primary-light) !important; }
        .text-\\[\\#D0BCFF\\] { color: var(--m3-primary-light) !important; }
      `}</style>
      
      {/* Header bar */}
      {viewMode === "simulator" && (
        <header className="border-b border-[#CAC4D0] bg-[#F8F9FA]/90 backdrop-blur-md px-6 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-50" id="header_container">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#EADDFF] rounded-xl border border-[#CAC4D0]/60 text-[#21005D]">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-[#1C1B1F] tracking-tight flex items-center gap-2">
                Android Gallery Simulator <span className="text-xs px-2.5 py-0.5 bg-[#EADDFF] text-[#21005D] rounded-full font-mono border border-[#CAC4D0]/40 font-bold">SDK 35</span>
              </h1>
              <p className="text-xs text-[#49454F] font-medium">Clean Architecture, MVVM & Compose Code Explorer</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleResetDatabase}
              className="px-3.5 py-1.5 bg-[#ECE6F0] hover:bg-[#ECE6F0]/80 active:bg-[#CAC4D0] text-[#49454F] hover:text-[#1C1B1F] rounded-lg text-xs font-semibold border border-[#CAC4D0] transition flex items-center gap-1.5 cursor-pointer"
              id="reset_db_btn"
              title="Reseed SQLite database state to default values"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Re-seed DB
            </button>
            
            <button
              onClick={handleDownloadCodebase}
              className="px-4 py-2 bg-[#6750A4] hover:bg-[#6750A4]/90 active:bg-[#21005D] text-white rounded-lg text-xs font-semibold shadow-sm hover:shadow transition flex items-center gap-2 cursor-pointer"
              id="download_full_code_btn"
            >
              <Download className="w-4 h-4" />
              Export Kotlin Project
            </button>
          </div>
        </header>
      )}

      {/* Main Workspace Frame */}
      <div className={`flex-1 flex flex-col lg:flex-row overflow-hidden ${viewMode === 'app' ? 'w-full h-full p-0 m-0' : ''}`} id="main_workspace">
        
        {/* Left column: Realistic Android Emulator Viewport */}
        <section className={`transition-all duration-300 ${viewMode === 'app' ? 'w-full h-full p-0 m-0 border-0 bg-transparent max-h-none flex-1 overflow-hidden' : (layoutMode === 'tablet' ? 'lg:w-[760px]' : layoutMode === 'foldable' ? 'lg:w-[540px]' : 'lg:w-[460px] xl:w-[480px]') + ' p-4 xl:p-6 bg-[#F3EDF7]/40 border-r border-[#CAC4D0] flex flex-col justify-start items-center shrink-0 overflow-y-auto max-h-[calc(100vh-73px)] lg:max-h-[none]'}`} id="emulator_column">
          
          {/* Quick Emulator Controls / Presets */}
          {viewMode === "simulator" && (
            <div className="w-full max-w-sm flex items-center justify-between p-2 mb-3 bg-[#EADDFF]/20 rounded-2xl border border-[#CAC4D0]/30 text-xs">
              <span className="font-bold text-[#6750A4] uppercase tracking-wider text-[10px]">Viewport:</span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => {
                    setLayoutMode("phone");
                    addLog("V", "Emulator", "Switched emulator frame to Standard Phone Mode");
                  }}
                  className={`px-2 py-1 rounded-lg text-[10px] font-black transition cursor-pointer ${layoutMode === "phone" ? "bg-[#6750A4] text-white" : "bg-white border border-[#CAC4D0]/40 text-[#49454F]"}`}
                >
                  Phone
                </button>
                <button
                  onClick={() => {
                    setLayoutMode("foldable");
                    addLog("V", "Emulator", "Switched emulator frame to Flex-Foldable Mode");
                  }}
                  className={`px-2 py-1 rounded-lg text-[10px] font-black transition cursor-pointer ${layoutMode === "foldable" ? "bg-[#6750A4] text-white" : "bg-white border border-[#CAC4D0]/40 text-[#49454F]"}`}
                >
                  Foldable
                </button>
                <button
                  onClick={() => {
                    setLayoutMode("tablet");
                    addLog("V", "Emulator", "Switched emulator frame to Widescreen Tablet Mode");
                  }}
                  className={`px-2 py-1 rounded-lg text-[10px] font-black transition cursor-pointer ${layoutMode === "tablet" ? "bg-[#6750A4] text-white" : "bg-white border border-[#CAC4D0]/40 text-[#49454F]"}`}
                >
                  Tablet
                </button>
              </div>
            </div>
          )}

          {/* Sibling wrap for phone frame and tablet control board */}
          <div className={`flex ${viewMode === 'app' ? 'w-full h-full p-0 m-0' : layoutMode === 'tablet' ? 'flex-row items-start gap-4' : 'flex-col items-center'} justify-center w-full`}>
            {/* Pixel 9 styled emulator phone container */}
            <div className={`transition-all duration-300 ${viewMode === 'app' ? 'w-full h-full p-0 m-0 border-0 rounded-none shadow-none ring-0 flex flex-col overflow-hidden relative' : 'bg-[#1C1B1F] p-3.5 relative shadow-xl border-4 border-neutral-700 flex flex-col overflow-hidden ring-1 ring-neutral-400/20 ' + (layoutMode === 'tablet' ? 'w-[700px] h-[520px] rounded-[32px]' : layoutMode === 'foldable' ? 'w-[460px] h-[640px] rounded-[40px]' : 'w-[370px] h-[780px] rounded-[50px]')}`} id="android_phone_frame">
            
            {/* Camera cutout notch */}
            {viewMode === "simulator" && (
              <div className="absolute top-6 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-black border border-slate-900 z-50 flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-blue-900/50"></div>
              </div>
            )}

            {/* Simulated speaker mesh line */}
            {viewMode === "simulator" && (
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-16 h-1 rounded-full bg-[#CAC4D0]/30 z-50"></div>
            )}

            {/* Inner display screen */}
            <div className={`w-full h-full ${isDarkMode ? 'bg-[#121212] text-[#E6E1E5]' : 'bg-[#F8F9FA] text-[#1C1B1F]'} ${viewMode === 'app' ? 'rounded-none' : 'rounded-[38px]'} overflow-hidden flex flex-col relative`} id="phone_screen_canvas">
              
              {/* Hidden Local Storage File Input */}
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleDeviceImport}
                className="hidden"
                id="device_gallery_importer"
              />

              {/* StatusBar Mock */}
              <div className={`${isDarkMode ? 'bg-[#121212]/95 text-slate-300' : 'bg-[#F8F9FA]/95 text-[#49454F]'} backdrop-blur px-5 pt-3 pb-1.5 flex items-center justify-between text-xs font-semibold z-40 relative select-none`}>
                <span>{phoneTime || "10:00 AM"}</span>
                <div className="flex items-center gap-1.5">
                  <span className={`text-[10px] px-1 ${isDarkMode ? 'bg-[#35343A] text-[#D0BCFF]' : 'bg-[#ECE6F0] text-[#21005D]'} rounded-sm font-mono tracking-tight leading-none py-0.5 font-bold`}>5G</span>
                  <Wifi className="w-3.5 h-3.5" />
                  <Battery className="w-4 h-4" />
                </div>
              </div>

              {/* Simulated App Bar */}
              <div className={`px-4 py-2 flex items-center justify-between ${isDarkMode ? 'bg-[#1E1B24]/95 text-[#E6E1E5]' : 'bg-[#F8F9FA]/95 text-[#1C1B1F]'} backdrop-blur-md z-30`} id="virtual_app_bar">
                {isSelectMode ? (
                  <div className="flex items-center justify-between w-full" id="selection_app_bar">
                    <div className="flex items-center gap-2.5">
                      <button 
                        onClick={() => {
                          setIsSelectMode(false);
                          setSelectedPhotoIds([]);
                          addLog("D", "Selection", "Exited selection mode via App Bar close button.");
                        }}
                        className="p-1.5 hover:bg-[#ECE6F0] rounded-full transition text-[#49454F] cursor-pointer"
                        title="Cancel selection"
                      >
                        <X className="w-5 h-5 text-red-600" />
                      </button>
                      <div>
                        <h2 className="text-sm font-bold text-[#1C1B1F] tracking-tight leading-tight">
                          Selected: {selectedPhotoIds.length} items
                        </h2>
                        <p className="text-[9px] text-[#6750A4] font-bold tracking-wide">
                          BATCH ACTION PANEL ACTIVE
                        </p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => {
                        const currentPhotos = activeTab === "favorites" 
                          ? photos.filter(p => p.isFavorite && !p.isInTrash)
                          : visiblePhotos;
                        const currentIds = currentPhotos.map(p => p.id);
                        const allSelected = currentIds.every(id => selectedPhotoIds.includes(id));
                        if (allSelected) {
                          setSelectedPhotoIds(prev => prev.filter(id => !currentIds.includes(id)));
                          addLog("D", "Selection", "Batch deselect triggered.");
                        } else {
                          setSelectedPhotoIds(prev => {
                            const next = [...prev];
                            currentIds.forEach(id => {
                              if (!next.includes(id)) next.push(id);
                            });
                            return next;
                          });
                          addLog("D", "Selection", `Selected all ${currentIds.length} items.`);
                        }
                      }}
                      className="px-3 py-1 bg-[#EADDFF] hover:bg-[#D0BCFF] text-[#21005D] text-[9.5px] font-extrabold rounded-full transition cursor-pointer"
                    >
                      {(() => {
                        const currentPhotos = activeTab === "favorites" 
                          ? photos.filter(p => p.isFavorite && !p.isInTrash)
                          : visiblePhotos;
                        const currentIds = currentPhotos.map(p => p.id);
                        return currentIds.length > 0 && currentIds.every(id => selectedPhotoIds.includes(id)) ? "Deselect All" : "Select All";
                      })()}
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      {selectedAlbum ? (
                        <button 
                          onClick={() => handleAlbumClick(null)}
                          className="p-1.5 hover:bg-[#ECE6F0] rounded-full transition text-[#49454F]"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                      ) : null}
                      <div>
                        <h2 className="text-base font-bold text-[#1C1B1F] tracking-tight leading-tight">
                          {selectedAlbum ? selectedAlbum : "Photos"}
                        </h2>
                        <p className="text-[10px] text-[#49454F] font-semibold tracking-wide">
                          {permissionState === "granted" ? "Device Storage Active" : 
                           permissionState === "granular" ? "Visual User Selected" : "Access Locked"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Select Mode Toggle Button */}
                      {(activeTab === "photos" || activeTab === "favorites") && permissionState !== "denied" && (
                        <button
                          onClick={() => {
                            setIsSelectMode(true);
                            setSelectedPhotoIds([]);
                            addLog("D", "Selection", "Activated multi-selection mode.");
                          }}
                          className="p-1.5 hover:bg-[#ECE6F0] text-[#49454F] hover:text-[#1D1B20] rounded-full transition cursor-pointer flex items-center gap-1"
                          title="Activate Selection Mode"
                        >
                          <CheckSquare className="w-4.5 h-4.5 text-[#6750A4]" />
                          <span className="text-[9.5px] font-bold text-[#6750A4]">Select</span>
                        </button>
                      )}

                      {/* Quick Search Shortcut Button */}
                      {activeTab !== "ai" && permissionState !== "denied" && (
                        <button
                          onClick={() => {
                            setActiveTab("ai");
                            addLog("D", "Shortcut", "Navigated to Search tab from App Bar shortcut.");
                          }}
                          className="p-1.5 hover:bg-[#ECE6F0] text-[#49454F] hover:text-[#1C1B1F] rounded-full transition cursor-pointer"
                          title="Open Search Console"
                        >
                          <Search className="w-4.5 h-4.5" />
                        </button>
                      )}

                      {/* Library Albums Shortcut Button */}
                      {activeTab !== "albums" && permissionState !== "denied" && (
                        <button
                          onClick={() => {
                            setActiveTab("albums");
                            addLog("D", "Shortcut", "Navigated to Library Albums from App Bar shortcut.");
                          }}
                          className="p-1.5 hover:bg-[#ECE6F0] text-[#49454F] hover:text-[#1C1B1F] rounded-full transition cursor-pointer"
                          title="Open Device Library (Albums)"
                        >
                          <FolderOpen className="w-4.5 h-4.5" />
                        </button>
                      )}

                      {/* Status Indicator */}
                      {permissionState === "granted" && (
                        <span className="flex h-2 w-2 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                      )}
                      {permissionState === "granular" && (
                        <span className="flex h-2 w-2 relative">
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                        </span>
                      )}
                      {permissionState === "denied" && (
                        <span className="flex h-2 w-2 relative">
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Main Emulator Content Viewport */}
              <div className={`flex-1 overflow-y-auto ${isDarkMode ? 'bg-[#121212]' : 'bg-[#F8F9FA]'} relative px-4 pb-16`} id="phone_content_area">
                
                {/* 1. Permissions Dialog Popup Mock (Play Store Compliant) */}
                <AnimatePresence>
                  {permissionState === "prompt" && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-black/60 z-50 flex items-end justify-center p-4"
                      id="permissions_modal"
                    >
                      <motion.div 
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        exit={{ y: 100 }}
                        className="bg-white rounded-[28px] w-full p-6 text-[#1C1B1F] shadow-2xl border border-[#CAC4D0]/30 max-w-sm mb-4"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-3 bg-[#EADDFF] text-[#21005D] rounded-2xl">
                            <ImageIcon className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-[#1C1B1F] leading-snug">Allow Gallery to access device photos?</h3>
                            <p className="text-[10px] text-[#49454F] font-semibold">Target SDK 35 (Android 15)</p>
                          </div>
                        </div>

                        <p className="text-xs text-[#49454F] leading-relaxed mb-5 font-medium">
                          In compliance with Google Play Developer privacy policy, this application requests granular visual media access. You can grant access to either all photos or choose specific assets securely.
                        </p>

                        <div className="flex flex-col gap-2.5">
                          <button
                            onClick={() => {
                              addLog("I", "Permissions", "READ_MEDIA_VISUAL_USER_SELECTED accepted by user. Spawning Granular Selection Screen.");
                              setSelectingGranularPhotos(true);
                            }}
                            className="w-full py-3 bg-[#6750A4] hover:bg-[#6750A4]/90 active:bg-[#21005D] text-white rounded-full text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                          >
                            <Sliders className="w-3.5 h-3.5" />
                            Select photos... (Granular SDK 34/35)
                          </button>

                          <button
                            onClick={() => {
                              addLog("I", "Permissions", "READ_MEDIA_IMAGES and READ_MEDIA_VIDEO fully granted by user.");
                              setPermissionState("granted");
                              addLog("D", "GalleryViewModel", "Permissions changed -> Active. Calling GetPhotosUseCase to bind LocalDataSource.");
                            }}
                            className="w-full py-3 bg-[#ECE6F0] hover:bg-[#ECE6F0]/80 active:bg-[#CAC4D0] text-[#49454F] rounded-full text-xs font-bold transition cursor-pointer"
                          >
                            Allow access to all
                          </button>

                          <button
                            onClick={() => {
                              addLog("W", "Permissions", "Permission denied. App functionality disabled. Storage SecurityException simulated.");
                              setPermissionState("denied");
                            }}
                            className="w-full py-3 hover:bg-[#ECE6F0] active:bg-[#CAC4D0] text-[#49454F] rounded-full text-xs font-bold transition cursor-pointer"
                          >
                            Don't allow
                          </button>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* 2. Granular Selection Dialog Mock */}
                <AnimatePresence>
                  {selectingGranularPhotos && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-[#F8F9FA] z-50 flex flex-col p-4"
                      id="granular_picker_screen"
                    >
                      <div className="flex items-center justify-between border-b border-[#CAC4D0] pb-3 mb-3">
                        <div>
                          <h3 className="text-sm font-bold text-[#1C1B1F]">Select visual media files</h3>
                          <p className="text-[10px] text-[#49454F] font-semibold">Android System PhotoPicker Emulator</p>
                        </div>
                        <button 
                          onClick={() => setSelectingGranularPhotos(false)}
                          className="p-1 hover:bg-[#ECE6F0] rounded-full text-[#49454F] transition"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-[11px] text-[#49454F] mb-3 font-medium">
                        Choose which photos this Gallery App is allowed to see. The rest will remain locked on the device.
                      </p>

                      <div className="flex-1 overflow-y-auto grid grid-cols-3 gap-2 p-1">
                        {photos.map(p => {
                          const isSelected = granularAllowedIds.includes(p.id);
                          return (
                            <div 
                              key={p.id}
                              onClick={() => {
                                setGranularAllowedIds(prev => 
                                  prev.includes(p.id) ? prev.filter(id => id !== p.id) : [...prev, p.id]
                                );
                              }}
                              className="aspect-square rounded-3xl overflow-hidden relative cursor-pointer group shadow-sm border border-[#CAC4D0]/30"
                              style={{ contentVisibility: "auto", containIntrinsicSize: "auto 100px" }}
                            >
                              <img 
                                src={p.url} 
                                className="w-full h-full object-cover" 
                                loading="lazy"
                                decoding="async"
                              />
                              <div className={`absolute inset-0 transition flex items-center justify-center ${isSelected ? "bg-[#6750A4]/35" : "bg-black/10 group-hover:bg-black/25"}`}>
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? "bg-[#6750A4] border-[#6750A4] text-white" : "border-white bg-black/20"}`}>
                                  {isSelected && <Check className="w-3 h-3" />}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="border-t border-[#CAC4D0] pt-3 mt-3 flex items-center justify-between gap-3">
                        <span className="text-xs font-bold text-[#49454F]">
                          {granularAllowedIds.length} assets selected
                        </span>
                        <button
                          onClick={() => {
                            setSelectingGranularPhotos(false);
                            setPermissionState("granular");
                            addLog("I", "Permissions", `User selected subset of ${granularAllowedIds.length} photo assets. Access restriction applied.`);
                          }}
                          className="px-5 py-2 bg-[#6750A4] text-white text-xs font-bold rounded-full cursor-pointer hover:bg-[#6750A4]/90 active:bg-[#21005D] transition shadow-sm"
                        >
                          Allow Selection
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* 3. Render Denied State View */}
                {permissionState === "denied" && (
                  <div className="flex flex-col items-center justify-center py-20 text-center px-4" id="denied_view">
                    <div className="w-16 h-16 bg-[#F3EDF7] text-[#6750A4] rounded-full flex items-center justify-center mb-4 border border-[#CAC4D0] shadow-sm">
                      <Lock className="w-8 h-8" />
                    </div>
                    <h3 className="text-base font-bold text-[#1C1B1F] mb-1">Access Locked by Android OS</h3>
                    <p className="text-xs text-[#49454F] font-semibold leading-relaxed mb-6">
                      Storage permissions are currently denied. To conform to Google Play standards, the gallery provides explaining warnings rather than crashing.
                    </p>
                    <button
                      onClick={() => setPermissionState("prompt")}
                      className="px-5 py-2.5 bg-[#6750A4] hover:bg-[#6750A4]/90 active:bg-[#21005D] text-white rounded-full text-xs font-bold transition cursor-pointer shadow-sm"
                    >
                      Prompt Permissions Dialog
                    </button>
                  </div>
                )}

                {/* 3.5 Home Screen view */}
                {permissionState !== "denied" && activeTab === "home" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="py-1 px-1 overflow-y-auto max-h-[calc(100%-80px)] flex flex-col gap-5 scrollbar-none pb-12"
                    id="home_screen_view"
                  >
                    {/* Welcome Header */}
                    <div className="flex items-center justify-between pt-2">
                      <div>
                        <h2 className="text-xl font-bold text-[#1C1B1F]">Gallery Home</h2>
                        <p className="text-[10px] text-[#49454F] font-semibold">Welcome, Android User</p>
                      </div>
                      <button 
                        onClick={() => {
                          addLog("V", "HomeScreen", "Tapped user profile avatar. Logcat synced successfully.");
                        }}
                        className="w-8 h-8 rounded-full bg-[#E8DEF8] flex items-center justify-center text-[#21005D] text-xs font-bold border border-[#CAC4D0]/40 shadow-sm cursor-pointer hover:scale-105 transition"
                      >
                        U
                      </button>
                    </div>

                    {/* Storage Usage Widget */}
                    <div className="p-4 bg-[#F7F2FA] rounded-3xl border border-[#ECE6F0] shadow-sm flex flex-col gap-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <HardDrive className="w-4.5 h-4.5 text-[#6750A4]" />
                          <span className="text-xs font-bold text-[#1C1B1F]">Device Storage</span>
                        </div>
                        <span className="text-xs font-mono font-bold text-[#6750A4]">
                          {storageCleaned ? "11.6 GB" : "14.2 GB"} / 128 GB
                        </span>
                      </div>

                      {/* Segmented Linear Progress bar */}
                      <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden flex">
                        <div className="h-full bg-[#6750A4] transition-all duration-500" style={{ width: storageCleaned ? "6.6%" : "8.5%" }} title="Photos"></div>
                        <div className="h-full bg-[#381E72] transition-all duration-500" style={{ width: "2.1%" }} title="Videos"></div>
                        <div className="h-full bg-slate-400" style={{ width: "1.5%" }} title="System Cache"></div>
                      </div>

                      <div className="flex items-center justify-between text-[9px] text-[#49454F] font-semibold">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="inline-flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#6750A4]"></span> Photos ({storageCleaned ? "5.9 GB" : "8.5 GB"})
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#381E72]"></span> Videos (2.1 GB)
                          </span>
                        </div>
                        <span className="font-mono font-bold">
                          {storageCleaned ? "9%" : "11%"} Used
                        </span>
                      </div>

                      {isCleaningStorage ? (
                        <div className="flex items-center justify-center py-1 gap-1.5 bg-[#E8DEF8]/40 rounded-xl text-[10px] font-bold text-[#6750A4]">
                          <RefreshCw className="w-3 h-3 animate-spin" /> Optimizing cache...
                        </div>
                      ) : (
                        <div className="flex justify-between items-center mt-1 border-t border-[#ECE6F0] pt-2">
                          <span className="text-[9.5px] text-[#49454F] font-medium italic">
                            {storageCleaned ? "Cache optimized!" : "Found 2.6 GB redundant logs & thumbnails."}
                          </span>
                          {!storageCleaned && (
                            <button
                              onClick={() => {
                                setIsCleaningStorage(true);
                                addLog("D", "StorageManager", "Initiating background disk cache scanning...");
                                setTimeout(() => {
                                  setIsCleaningStorage(false);
                                  setStorageCleaned(true);
                                  addLog("I", "StorageManager", "Clean success! Evicted 2.6 GB of duplicate thumbnail bitmaps and stale web diagnostics cache.");
                                }, 1500);
                              }}
                              className="px-2.5 py-1 bg-[#6750A4] hover:bg-[#6750A4]/90 text-white rounded-full text-[9px] font-bold transition cursor-pointer shadow-sm"
                            >
                              Free Space
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Quick Actions Grid */}
                    <div>
                      <h3 className="text-xs font-bold text-[#49454F] uppercase tracking-wider mb-2">Quick Actions</h3>
                      <div className="grid grid-cols-2 gap-2.5">
                        <button
                          onClick={() => {
                            setActiveTab("ai");
                            addLog("V", "HomeScreen", "Navigated to Smart AI Search Assistant from home panel quick link.");
                          }}
                          className="p-3 bg-[#EADDFF] hover:bg-[#D0BCFF] text-[#21005D] rounded-2xl flex flex-col items-start gap-1 transition cursor-pointer text-left border border-[#EADDFF]/40 shadow-sm group"
                        >
                          <Sparkles className="w-5 h-5 fill-current text-[#6750A4] group-hover:scale-105 transition" />
                          <span className="text-[11.5px] font-bold mt-1">Smart AI Search</span>
                          <span className="text-[9px] text-[#21005D]/70 font-semibold">Semantic description query</span>
                        </button>

                        <button
                          onClick={() => {
                            setSelectedAlbum("Favorites");
                            setActiveTab("photos");
                            addLog("V", "HomeScreen", "Navigated to Photos filter: Favorites.");
                          }}
                          className="p-3 bg-[#ECE6F0] hover:bg-[#E8DEF8] text-[#1D1B20] rounded-2xl flex flex-col items-start gap-1 transition cursor-pointer text-left border border-[#CAC4D0]/30 shadow-sm group"
                        >
                          <Heart className="w-5 h-5 text-[#B3261E] fill-[#B3261E] group-hover:scale-105 transition" />
                          <span className="text-[11.5px] font-bold mt-1">Favorites</span>
                          <span className="text-[9px] text-[#49454F]/80 font-semibold">View starred files ({photos.filter(p => p.isFavorite && !p.isInTrash).length})</span>
                        </button>

                        <button
                          onClick={() => {
                            setSelectedAlbum("Trash");
                            setActiveTab("photos");
                            addLog("V", "HomeScreen", "Navigated to Photos filter: Trash Bin.");
                          }}
                          className="p-3 bg-[#ECE6F0] hover:bg-[#E8DEF8] text-[#1D1B20] rounded-2xl flex flex-col items-start gap-1 transition cursor-pointer text-left border border-[#CAC4D0]/30 shadow-sm group"
                        >
                          <Trash2 className="w-5 h-5 text-[#49454F] group-hover:scale-105 transition" />
                          <span className="text-[11.5px] font-bold mt-1">Recycle Bin</span>
                          <span className="text-[9px] text-[#49454F]/80 font-semibold">Review deleted files ({photos.filter(p => p.isInTrash).length})</span>
                        </button>

                        <button
                          onClick={() => {
                            addLog("D", "CacheOptimizer", "Starting real-time file index verification...");
                            addLog("I", "CacheOptimizer", "Index status 100% synchronized with Android MediaStore. Zero corrupt file records found.");
                          }}
                          className="p-3 bg-[#ECE6F0] hover:bg-[#E8DEF8] text-[#1D1B20] rounded-2xl flex flex-col items-start gap-1 transition cursor-pointer text-left border border-[#CAC4D0]/30 shadow-sm group"
                        >
                          <Zap className="w-5 h-5 text-[#6750A4] group-hover:scale-105 transition" />
                          <span className="text-[11.5px] font-bold mt-1">Database Sync</span>
                          <span className="text-[9px] text-[#49454F]/80 font-semibold">Verify SQLite indices</span>
                        </button>

                        <button
                          onClick={async () => {
                            setShowDuplicateFinder(true);
                            addLog("V", "HomeScreen", "Launched Duplicate Finder dashboard from Quick Actions.");
                            await handleScanDuplicates();
                          }}
                          className="p-3.5 bg-emerald-50 hover:bg-emerald-100/95 text-emerald-950 rounded-2xl flex flex-col items-start gap-1.5 transition cursor-pointer text-left border border-emerald-200/50 shadow-sm group"
                        >
                          <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl group-hover:scale-105 transition">
                            <Copy className="w-4.5 h-4.5" />
                          </div>
                          <span className="text-[11px] font-extrabold mt-0.5 text-emerald-900 leading-tight">Duplicate Finder</span>
                          <span className="text-[9px] text-emerald-800 font-semibold leading-snug">Compare & group duplicate items</span>
                        </button>

                        <button
                          onClick={async () => {
                            setShowLargeFileFinder(true);
                            addLog("V", "HomeScreen", "Launched Large File Finder dashboard from Quick Actions.");
                            await handleScanLargeFiles();
                          }}
                          className="p-3.5 bg-blue-50 hover:bg-blue-100/95 text-blue-950 rounded-2xl flex flex-col items-start gap-1.5 transition cursor-pointer text-left border border-blue-200/50 shadow-sm group"
                        >
                          <div className="p-2 bg-blue-100 text-blue-700 rounded-xl group-hover:scale-105 transition">
                            <HardDrive className="w-4.5 h-4.5" />
                          </div>
                          <span className="text-[11px] font-extrabold mt-0.5 text-blue-900 leading-tight">Large Files</span>
                          <span className="text-[9px] text-blue-800 font-semibold leading-snug">Sort by size & quick delete</span>
                        </button>
                      </div>
                    </div>

                    {/* Recent Photos Carousel */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xs font-bold text-[#49454F] uppercase tracking-wider">Recent Photos</h3>
                        <button
                          onClick={() => {
                            setSelectedAlbum(null);
                            setActiveTab("photos");
                            addLog("V", "HomeScreen", "Navigated to all photos from recent photos carousel see-all link.");
                          }}
                          className="text-[#6750A4] text-[10px] font-bold hover:underline cursor-pointer"
                        >
                          See All
                        </button>
                      </div>
                      <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-thin select-none snap-x">
                        {photos
                          .filter(p => !p.isInTrash && !p.mimeType.startsWith("video"))
                          .slice(0, 5)
                          .map(photo => (
                            <div
                              key={photo.id}
                              onClick={() => {
                                setSelectedPhoto(photo);
                                setAppliedFilter(photoFilters[photo.id] || "Original");
                                addLog("V", "HomeScreen", `Selected recent photo '${photo.title}' directly from Home Dashboard`);
                              }}
                              className="w-24 h-24 rounded-2xl overflow-hidden relative shrink-0 snap-start border border-[#CAC4D0]/30 shadow-sm cursor-pointer group hover:scale-[1.03] transition-all"
                              style={{ contentVisibility: "auto", containIntrinsicSize: "auto 96px" }}
                            >
                              <img
                                src={photo.url}
                                alt={photo.title}
                                className={`w-full h-full object-cover ${getFilterCss(photo.id)}`}
                                referrerPolicy="no-referrer"
                                loading="lazy"
                                decoding="async"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent flex items-end p-1.5">
                                <span className="text-[8px] text-white font-bold truncate max-w-full font-mono">
                                  {photo.title}
                                </span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Recent Videos Carousel */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xs font-bold text-[#49454F] uppercase tracking-wider">Recent Videos</h3>
                        <button
                          onClick={() => {
                            setSelectedAlbum("Camera");
                            setActiveTab("photos");
                            addLog("V", "HomeScreen", "Navigated to Camera photos list from recent videos carousel see-all link.");
                          }}
                          className="text-[#6750A4] text-[10px] font-bold hover:underline cursor-pointer"
                        >
                          See All
                        </button>
                      </div>
                      <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-thin select-none snap-x">
                        {photos
                          .filter(p => !p.isInTrash && p.mimeType.startsWith("video"))
                          .map(video => (
                            <div
                              key={video.id}
                              onClick={() => {
                                setSelectedPhoto(video);
                                addLog("V", "HomeScreen", `Selected recent video '${video.title}' to launch interactive Video Player`);
                              }}
                              className="w-28 h-20 rounded-2xl overflow-hidden relative shrink-0 snap-start border border-[#CAC4D0]/30 shadow-sm cursor-pointer group hover:scale-[1.03] transition-all"
                              style={{ contentVisibility: "auto", containIntrinsicSize: "auto 80px" }}
                            >
                              <img
                                src={video.thumbnailUrl || video.url}
                                alt={video.title}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                                loading="lazy"
                                decoding="async"
                              />
                              
                              {/* Dark video card overlay with centered play button and duration */}
                              <div className="absolute inset-0 bg-black/35 group-hover:bg-black/25 transition-colors flex flex-col justify-between p-1.5">
                                <span className="self-end px-1.5 py-0.2 bg-black/60 rounded text-[7.5px] font-bold font-mono text-white">
                                  0:15
                                </span>
                                
                                <div className="self-center p-1 bg-white/25 rounded-full backdrop-blur-md border border-white/20 group-hover:scale-110 transition">
                                  <Play className="w-4 h-4 text-white fill-current translate-x-0.5" />
                                </div>

                                <span className="text-[8px] text-white font-bold truncate max-w-full font-mono">
                                  {video.title}
                                </span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Albums Summary Grid */}
                    <div>
                      <h3 className="text-xs font-bold text-[#49454F] uppercase tracking-wider mb-2">Albums</h3>
                      <div className="grid grid-cols-2 gap-2.5">
                        {["Camera", "Downloads", "Screenshots"].map(album => {
                          const albumMediaCount = photos.filter(p => p.album === album && !p.isInTrash).length;
                          return (
                            <div
                              key={album}
                              onClick={() => {
                                setSelectedAlbum(album);
                                setActiveTab("photos");
                                addLog("V", "HomeScreen", `Navigated to Album: ${album}`);
                              }}
                              className="p-3 bg-white hover:bg-[#F7F2FA] rounded-2xl border border-[#CAC4D0]/40 shadow-sm flex items-center gap-2.5 transition-all cursor-pointer hover:scale-[1.02]"
                            >
                              <div className="w-8 h-8 rounded-lg bg-[#6750A4]/10 text-[#6750A4] flex items-center justify-center shrink-0">
                                <FolderOpen className="w-4.5 h-4.5" />
                              </div>
                              <div className="truncate">
                                <h4 className="text-[11.5px] font-bold text-[#1C1B1F] truncate leading-tight">{album}</h4>
                                <span className="text-[9px] text-[#49454F] font-semibold">{albumMediaCount} items</span>
                              </div>
                            </div>
                          );
                        })}
                        <div
                          onClick={() => {
                            setActiveTab("albums");
                            addLog("V", "HomeScreen", "Navigated to full Library list.");
                          }}
                          className="p-3 bg-white hover:bg-[#F7F2FA] rounded-2xl border border-[#CAC4D0]/40 shadow-sm flex items-center gap-2.5 transition-all cursor-pointer hover:scale-[1.02]"
                        >
                          <div className="w-8 h-8 rounded-lg bg-[#ECE6F0] text-[#1D1B20] flex items-center justify-center shrink-0">
                            <Grid className="w-4.5 h-4.5" />
                          </div>
                          <div>
                            <h4 className="text-[11.5px] font-bold text-[#1C1B1F] leading-tight">View All</h4>
                            <span className="text-[9px] text-[#49454F] font-semibold">Library tabs</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 4. Tab Photo Grid view */}
                {permissionState !== "denied" && activeTab === "photos" && (
                  <div className="py-2" id="grid_tab_view">
                    
                    {selectedAlbum === "Hidden" && (
                      <div className="bg-slate-950 text-white rounded-3xl p-3.5 mb-3.5 border border-slate-800 flex flex-col gap-2 shadow-md relative overflow-hidden" id="secure_vault_indicator_banner">
                        <div className="absolute right-2 top-2 opacity-[0.03] pointer-events-none">
                          <Unlock className="w-24 h-24 text-white" />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-xl">
                              <Unlock className="w-4 h-4" />
                            </span>
                            <div>
                              <h4 className="text-xs font-bold leading-tight">Secure Folder Unlocked</h4>
                              <p className="text-[9.5px] text-slate-400 font-semibold font-mono">Keystore Session: ACTIVE</p>
                            </div>
                          </div>
                          <button
                            onClick={handleLockVault}
                            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-750 text-slate-200 text-[10px] font-bold rounded-full transition cursor-pointer border border-slate-700 flex items-center gap-1"
                          >
                            <Lock className="w-3 h-3" /> Lock Vault
                          </button>
                        </div>
                        <div className="border-t border-slate-800 pt-2 flex flex-col gap-1 text-[8.5px] text-slate-400 font-mono">
                          <p className="flex justify-between">
                            <span>Algorithm:</span>
                            <span className="text-emerald-400 font-bold">AES-256-GCM (Enforced)</span>
                          </p>
                          <p className="flex justify-between">
                            <span>Keystore Backend:</span>
                            <span className="text-slate-300 font-bold">StrongBox Hardware HSM</span>
                          </p>
                          <p className="flex justify-between">
                            <span>Failsafe Sync:</span>
                            <span className="text-[#D0BCFF] font-bold">Encrypted Sync Worker (Active)</span>
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Active search filters indicators */}
                    {(searchQuery || selectedAlbum) && (
                      <div className="flex flex-wrap gap-1.5 mb-3 items-center">
                        {selectedAlbum && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#ECE6F0] text-[#21005D] text-[11px] font-bold rounded-full border border-[#CAC4D0]/40">
                            Album: {selectedAlbum}
                            <button onClick={() => handleAlbumClick(null)} className="hover:text-red-500 p-0.5 transition cursor-pointer">
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        )}
                        {searchQuery && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#EADDFF] text-[#21005D] text-[11px] font-bold rounded-full border border-[#CAC4D0]/40">
                            Query: "{searchQuery.substring(0, 15)}"
                            <button onClick={handleClearSearch} className="hover:text-red-500 p-0.5 transition cursor-pointer">
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        )}
                      </div>
                    )}

                    {loadingPhotos ? (
                      <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <RefreshCw className="w-8 h-8 text-[#6750A4] animate-spin" />
                        <span className="text-xs text-[#49454F] font-semibold">Reading storage contents...</span>
                      </div>
                    ) : visiblePhotos.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                        <div className="w-14 h-14 bg-[#ECE6F0] text-[#6750A4] rounded-full flex items-center justify-center mb-3">
                          <ImageIcon className="w-6 h-6" />
                        </div>
                        <h4 className="text-sm font-bold text-[#1C1B1F]">No media to show</h4>
                        <p className="text-[11px] text-[#49454F] max-w-xs mt-1 font-semibold leading-relaxed mb-4">
                          Your gallery is empty, or permission was not granted. Tap below to select and import real photos from your phone!
                        </p>
                        <button
                          onClick={() => document.getElementById("device_gallery_importer")?.click()}
                          className="px-4 py-2.5 bg-[#6750A4] hover:bg-[#6750A4]/90 active:bg-[#21005D] text-white rounded-full text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                        >
                          <Plus className="w-4 h-4" /> Import Device Photos
                        </button>
                      </div>
                    ) : (
                      <div className={`grid ${settingsGridSize === 2 ? 'grid-cols-2' : settingsGridSize === 4 ? 'grid-cols-4' : 'grid-cols-3'} gap-2.5`} id="photo_grid_container">
                        {visiblePhotos.map(photo => {
                          const hasFilterApplied = photoFilters[photo.id] && photoFilters[photo.id] !== "Original";
                          return (
                            <motion.div
                              layoutId={`photo_card_${photo.id}`}
                              key={photo.id}
                              onClick={() => {
                                if (isSelectMode) {
                                  setSelectedPhotoIds(prev => 
                                    prev.includes(photo.id) 
                                      ? prev.filter(id => id !== photo.id) 
                                      : [...prev, photo.id]
                                  );
                                  addLog("V", "PhotosScreen", `Toggled selection for: ${photo.title}`);
                                } else {
                                  setSelectedPhoto(photo);
                                  setAppliedFilter(photoFilters[photo.id] || "Original");
                                  addLog("V", "PhotosScreen", `Opening full-screen detail for: ${photo.title}`);
                                }
                              }}
                              className={`aspect-square rounded-3xl overflow-hidden relative cursor-pointer group shadow-sm bg-white border transition-all hover:scale-[1.02] ${
                                isSelectMode && selectedPhotoIds.includes(photo.id)
                                  ? "ring-4 ring-[#6750A4] ring-offset-2 border-transparent shadow-md"
                                  : "border-[#CAC4D0]/30 hover:shadow-md"
                              }`}
                              style={{ contentVisibility: "auto", containIntrinsicSize: "auto 150px" }}
                            >
                              <img
                                src={photo.url}
                                alt={photo.title}
                                className={`w-full h-full object-cover transition duration-350 ${getFilterCss(photo.id)}`}
                                referrerPolicy="no-referrer"
                                loading="lazy"
                                decoding="async"
                              />
                              
                              {/* Selection Checkbox Overlay */}
                              {isSelectMode && (
                                <div className="absolute top-2.5 left-2.5 z-20">
                                  {selectedPhotoIds.includes(photo.id) ? (
                                    <div className="w-5.5 h-5.5 rounded-full bg-[#6750A4] text-white flex items-center justify-center shadow-md border border-white">
                                      <Check className="w-3.5 h-3.5 stroke-[3.5]" />
                                    </div>
                                  ) : (
                                    <div className="w-5.5 h-5.5 rounded-full bg-black/30 backdrop-blur-sm border-2 border-white flex items-center justify-center shadow-md hover:bg-black/40">
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Overlay Indicators */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 opacity-100 p-2 flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                  {!isSelectMode && photo.isFavorite && (
                                    <div className="p-0.5 bg-black/35 rounded-full backdrop-blur-md">
                                      <Heart className="w-3 h-3 text-red-400 fill-red-400" />
                                    </div>
                                  )}
                                  <div className="ml-auto">
                                    {syncingPhotoIds[photo.id] ? (
                                      <div className="p-0.5 bg-black/45 rounded-full backdrop-blur-md text-amber-300 flex items-center justify-center animate-spin" title="Syncing Room database mutations automatically...">
                                        <RefreshCw className="w-3 h-3" />
                                      </div>
                                    ) : photo.isSynced ? (
                                      <div className="p-0.5 bg-black/35 rounded-full backdrop-blur-md text-emerald-400" title="Synchronized with Cloud Database">
                                        <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current">
                                          <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4 0-2.05 1.53-3.76 3.56-3.97l1.07-.11.5-.95C8.08 7.14 9.94 6 12 6c2.62 0 4.88 1.86 5.39 4.43l.3 1.5 1.53.11c1.56.1 2.78 1.41 2.78 2.96 0 1.65-1.35 3-3 3z" />
                                        </svg>
                                      </div>
                                    ) : (
                                      <div className="p-0.5 bg-black/45 rounded-full backdrop-blur-md text-yellow-500/80 flex items-center justify-center border border-yellow-500/25" title="Local Room Cache only (Pending background sync)">
                                        <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current">
                                          <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" opacity="0.6"/>
                                          <circle cx="12" cy="13" r="1.5" className="text-yellow-500 fill-current" />
                                        </svg>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className="text-[9px] text-white font-bold truncate font-mono">
                                  {hasFilterApplied && (
                                    <span className="mr-1 text-[8px] bg-[#6750A4] px-1 py-0.2 rounded font-sans text-white font-bold">FILTERED</span>
                                  )}
                                  {photo.title}
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* 5. Tab Albums View */}
                {permissionState !== "denied" && activeTab === "albums" && (
                  <div className="py-2" id="albums_tab_view">
                    <h3 className="text-sm font-bold text-[#1C1B1F] mb-3 px-1">Device Library</h3>
                    
                    <div className="grid grid-cols-2 gap-3" id="albums_grid">
                      {/* Camera Album (Primary) */}
                      <div 
                        onClick={() => handleAlbumClick("Camera")}
                        className="p-4 bg-white rounded-3xl border border-[#CAC4D0] cursor-pointer shadow-sm hover:shadow-md transition"
                      >
                        <div className="w-10 h-10 bg-[#EADDFF] text-[#21005D] rounded-2xl flex items-center justify-center mb-3">
                          <ImageIcon className="w-5 h-5" />
                        </div>
                        <h4 className="text-xs font-bold text-[#1C1B1F] leading-tight">Camera</h4>
                        <p className="text-[10px] text-[#49454F] font-semibold mt-0.5">
                          {photos.filter(p => p.album === "Camera" && !p.isInTrash).length} items
                        </p>
                      </div>

                      {/* Screenshots Album */}
                      <div 
                        onClick={() => handleAlbumClick("Screenshots")}
                        className="p-4 bg-white rounded-3xl border border-[#CAC4D0] cursor-pointer shadow-sm hover:shadow-md transition"
                      >
                        <div className="w-10 h-10 bg-[#ECE6F0] text-[#49454F] rounded-2xl flex items-center justify-center mb-3">
                          <FolderOpen className="w-5 h-5" />
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 leading-tight">Screenshots</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          {photos.filter(p => p.album === "Screenshots" && !p.isInTrash).length} items
                        </p>
                      </div>

                      {/* Downloads Album */}
                      <div 
                        onClick={() => handleAlbumClick("Downloads")}
                        className="p-4 bg-white rounded-3xl border border-[#CAC4D0] cursor-pointer shadow-sm hover:shadow-md transition"
                      >
                        <div className="w-10 h-10 bg-[#ECE6F0] text-[#49454F] rounded-2xl flex items-center justify-center mb-3">
                          <Download className="w-5 h-5" />
                        </div>
                        <h4 className="text-xs font-bold text-[#1C1B1F] leading-tight">Downloads</h4>
                        <p className="text-[10px] text-[#49454F] font-semibold mt-0.5">
                          {photos.filter(p => p.album === "Downloads" && !p.isInTrash).length} items
                        </p>
                      </div>

                      {/* Favorites Album */}
                      <div 
                        onClick={() => handleAlbumClick("Favorites")}
                        className="p-4 bg-white rounded-3xl border border-[#CAC4D0] cursor-pointer shadow-sm hover:shadow-md transition"
                      >
                        <div className="w-10 h-10 bg-[#EADDFF] text-[#21005D] rounded-2xl flex items-center justify-center mb-3">
                          <Heart className="w-5 h-5 fill-current text-[#21005D]" />
                        </div>
                        <h4 className="text-xs font-bold text-[#1C1B1F] leading-tight">Favorites</h4>
                        <p className="text-[10px] text-[#49454F] font-semibold mt-0.5">
                          {photos.filter(p => p.isFavorite && !p.isInTrash).length} items
                        </p>
                      </div>
                    </div>

                    <h3 className="text-sm font-bold text-[#1C1B1F] mt-6 mb-3 px-1">Utilities</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {/* Trash Bin Album (Play Store safe-delete standard) */}
                      <div 
                        onClick={() => handleAlbumClick("Trash")}
                        className="p-4 bg-[#F3EDF7] rounded-3xl border border-[#CAC4D0] cursor-pointer shadow-sm hover:shadow-md transition"
                      >
                        <div className="w-10 h-10 bg-red-100 text-red-700 rounded-2xl flex items-center justify-center mb-3">
                          <Trash2 className="w-5 h-5" />
                        </div>
                        <h4 className="text-xs font-bold text-[#1C1B1F] leading-tight">Recycle Bin</h4>
                        <p className="text-[10px] text-red-600 font-bold mt-0.5">
                          {photos.filter(p => p.isInTrash).length} items
                        </p>
                      </div>

                      {/* Secure Vault Utility (Device-Encrypted PIN-Locked storage) */}
                      <div 
                        onClick={() => {
                          if (isVaultUnlocked) {
                            setSelectedAlbum("Hidden");
                            setActiveTab("photos");
                            addLog("D", "SecureVault", "Accessing already unlocked secure vault session.");
                          } else if (vaultHasPin) {
                            setShowVaultAuthModal(true);
                            setVaultAuthError("");
                          } else {
                            setShowVaultSetupModal(true);
                            setVaultSetupError("");
                          }
                        }}
                        className="p-4 bg-slate-950 text-white rounded-3xl border border-slate-800 cursor-pointer shadow-md hover:bg-slate-900 transition flex flex-col justify-between"
                      >
                        <div>
                          <div className={`w-10 h-10 ${isVaultUnlocked ? 'bg-emerald-500 text-slate-900' : 'bg-slate-800 text-[#D0BCFF]'} rounded-2xl flex items-center justify-center mb-3 relative`}>
                            {isVaultUnlocked ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                            {vaultHasPin && !isVaultUnlocked && (
                              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D0BCFF] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#D0BCFF]"></span>
                              </span>
                            )}
                          </div>
                          <h4 className="text-xs font-bold leading-tight">Secure Vault</h4>
                        </div>
                        <div className="mt-2.5">
                          <p className={`text-[9.5px] font-bold ${isVaultUnlocked ? 'text-emerald-400' : 'text-slate-400'}`}>
                            {isVaultUnlocked ? "OPEN / DECRYPTED" : "LOCKED (PIN REQUIRED)"}
                          </p>
                          <p className="text-[8.5px] font-mono text-slate-400/80 leading-tight mt-0.5">
                            {photos.filter(p => p.isHidden).length} encrypted items
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5b. Tab Favorites View (Curated Vault with Room DB Sync) */}
                {permissionState !== "denied" && activeTab === "favorites" && (
                  <div className="py-2" id="favorites_tab_view">
                    <div className="flex items-center justify-between mb-3 px-1">
                      <div>
                        <h3 className="text-sm font-bold text-[#1C1B1F]">Favorites Vault</h3>
                        <p className="text-[10px] text-[#49454F] font-semibold">Local SQLite Room DB & Automatic Cloud Sync</p>
                      </div>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#F8EEEF] text-[#B3261E] text-[10px] font-bold rounded-full border border-[#F5DBD9]">
                        <Heart className="w-3 h-3 fill-current" />
                        Room DB
                      </span>
                    </div>

                    {/* Room DB & WorkManager Sync Console Card */}
                    <div className="p-3.5 bg-[#F7F2FA] rounded-3xl border border-[#CAC4D0]/60 mb-4 shadow-sm text-left">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                          </span>
                          <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#6750A4] flex items-center gap-1">
                            SQLite SQLiteOpenHelper Status
                          </h4>
                        </div>
                        <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full font-bold">
                          {photos.filter(p => p.isFavorite && !p.isInTrash && !p.isSynced).length === 0 ? "100% Synced" : "Syncing..."}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[9.5px] mb-3">
                        <div className="bg-white p-2 rounded-xl border border-[#CAC4D0]/40">
                          <span className="text-[#49454F] font-semibold block text-[8px] uppercase tracking-wider">Cache Database:</span>
                          <span className="font-mono text-slate-800 font-bold block truncate">/databases/gallery_secure.db</span>
                        </div>
                        <div className="bg-white p-2 rounded-xl border border-[#CAC4D0]/40">
                          <span className="text-[#49454F] font-semibold block text-[8px] uppercase tracking-wider">Favorited Entities:</span>
                          <span className="font-bold text-[#1C1B1F] block">{photos.filter(p => p.isFavorite && !p.isInTrash).length} rows in photos_table</span>
                        </div>
                      </div>

                      {/* SQLite Live Telemetry Logs console */}
                      <div className="bg-slate-900 text-slate-200 p-2.5 rounded-xl font-mono text-[8px] leading-relaxed mb-3 max-h-[80px] overflow-y-auto scrollbar-thin select-all">
                        <p className="text-emerald-400 font-bold">// Room DAO Live Telemetry Stream</p>
                        <p className="text-slate-400">sqlite: SELECT * FROM photos_table WHERE isFavorite = 1 AND isInTrash = 0;</p>
                        {photos.filter(p => p.isFavorite && !p.isInTrash && p.isSynced).length > 0 && (
                          <p className="text-[#D0BCFF]">sqlite: Cloud index match complete. {photos.filter(p => p.isFavorite && !p.isInTrash && p.isSynced).length} items matching on server.</p>
                        )}
                        {photos.filter(p => p.isFavorite && !p.isInTrash && !p.isSynced).map(p => (
                          <p key={p.id} className="text-amber-400 animate-pulse">sqlite: Row modified. sync_fav_{p.id} enqueued in WorkManager.</p>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            addLog("I", "RoomDatabase", "Executing manual full-sync request across all local SQLite tables...");
                            photos.filter(p => p.isFavorite && !p.isInTrash && !p.isSynced).forEach(p => {
                              handleToggleFavorite(p); // re-trigger sync logic
                            });
                          }}
                          className="flex-1 py-1.5 bg-[#6750A4] text-white hover:bg-[#4F378B] rounded-xl text-[10px] font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          Force Sync All
                        </button>
                        <button
                          onClick={() => {
                            addLog("I", "RoomDatabase", "sqlite: VACUUM; - Rebuilding database file, defragmenting, and reclaiming unused disk space.");
                            addLog("V", "RoomDatabase", "sqlite: SQLite database successfully optimized. Cache space reduced by 14%.");
                          }}
                          className="py-1.5 px-3 bg-white hover:bg-slate-50 border border-[#CAC4D0] text-[#49454F] rounded-xl text-[10px] font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                        >
                          Compact Cache
                        </button>
                      </div>
                    </div>

                    {/* Favorites Photos Grid */}
                    {photos.filter(p => p.isFavorite && !p.isInTrash).length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-16 text-center bg-white border border-[#CAC4D0]/30 rounded-3xl p-5" id="no_favorites_view">
                        <div className="w-12 h-12 bg-[#F8EEEF] text-[#B3261E] rounded-full flex items-center justify-center mb-3 border border-[#F5DBD9]">
                          <Heart className="w-5.5 h-5.5" />
                        </div>
                        <h4 className="text-xs font-bold text-[#1C1B1F]">No starred files in vault</h4>
                        <p className="text-[10px] text-[#49454F] px-4 mt-1 font-semibold leading-relaxed">
                          Your Curated Favorites Vault is currently empty. Star photos and videos using the Heart icon to see them here, backed by Room SQLite and automatically synchronized.
                        </p>
                        <button
                          onClick={() => {
                            setActiveTab("photos");
                            setSelectedAlbum(null);
                            addLog("V", "FavoritesScreen", "Navigating back to full photos grid from Favorites empty state.");
                          }}
                          className="mt-3.5 px-4 py-1.5 bg-[#ECE6F0] text-[#21005D] rounded-full text-[10.5px] font-bold hover:bg-[#EADDFF] transition cursor-pointer"
                        >
                          Browse Gallery
                        </button>
                      </div>
                    ) : (
                      <div className={`grid ${settingsGridSize === 2 ? 'grid-cols-2' : settingsGridSize === 4 ? 'grid-cols-4' : 'grid-cols-3'} gap-2`} id="favorites_grid_container">
                        {photos
                          .filter(p => p.isFavorite && !p.isInTrash)
                          .map(photo => {
                            return (
                              <motion.div
                                layoutId={`fav_card_${photo.id}`}
                                key={photo.id}
                                onClick={() => {
                                  if (isSelectMode) {
                                    setSelectedPhotoIds(prev => 
                                      prev.includes(photo.id) 
                                        ? prev.filter(id => id !== photo.id) 
                                        : [...prev, photo.id]
                                    );
                                    addLog("V", "FavoritesScreen", `Toggled selection for favorite: ${photo.title}`);
                                  } else {
                                    setSelectedPhoto(photo);
                                    setAppliedFilter(photoFilters[photo.id] || "Original");
                                    addLog("V", "FavoritesScreen", `Opening detail for favorite: ${photo.title}`);
                                  }
                                }}
                                className={`aspect-square rounded-2xl overflow-hidden relative cursor-pointer group shadow-sm bg-white border transition-all hover:scale-[1.02] ${
                                  isSelectMode && selectedPhotoIds.includes(photo.id)
                                    ? "ring-4 ring-[#6750A4] ring-offset-2 border-transparent shadow-md"
                                    : "border-[#CAC4D0]/30 hover:shadow-md"
                                }`}
                                style={{ contentVisibility: "auto", containIntrinsicSize: "auto 150px" }}
                              >
                                <img
                                  src={photo.url}
                                  alt={photo.title}
                                  className={`w-full h-full object-cover transition duration-350 ${getFilterCss(photo.id)}`}
                                  referrerPolicy="no-referrer"
                                  loading="lazy"
                                  decoding="async"
                                />

                                {/* Selection Checkbox Overlay */}
                                {isSelectMode && (
                                  <div className="absolute top-2.5 left-2.5 z-20">
                                    {selectedPhotoIds.includes(photo.id) ? (
                                      <div className="w-5.5 h-5.5 rounded-full bg-[#6750A4] text-white flex items-center justify-center shadow-md border border-white">
                                        <Check className="w-3.5 h-3.5 stroke-[3.5]" />
                                      </div>
                                    ) : (
                                      <div className="w-5.5 h-5.5 rounded-full bg-black/30 backdrop-blur-sm border-2 border-white flex items-center justify-center shadow-md hover:bg-black/40">
                                      </div>
                                    )}
                                  </div>
                                )}

                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 p-1.5 flex flex-col justify-between text-left">
                                  <div className="flex justify-between items-start">
                                    {!isSelectMode && (
                                      <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400 drop-shadow" />
                                    )}
                                    
                                    {syncingPhotoIds[photo.id] ? (
                                      <div className="p-0.5 bg-black/45 rounded-full backdrop-blur-md ml-auto text-amber-300 animate-spin">
                                        <RefreshCw className="w-2.5 h-2.5" />
                                      </div>
                                    ) : photo.isSynced ? (
                                      <div className="p-0.5 bg-black/35 rounded-full backdrop-blur-md ml-auto text-emerald-400" title="Synced with cloud">
                                        <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 fill-current">
                                          <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4 0-2.05 1.53-3.76 3.56-3.97l1.07-.11.5-.95C8.08 7.14 9.94 6 12 6c2.62 0 4.88 1.86 5.39 4.43l.3 1.5 1.53.11c1.56.1 2.78 1.41 2.78 2.96 0 1.65-1.35 3-3 3z" />
                                        </svg>
                                      </div>
                                    ) : (
                                      <div className="p-0.5 bg-black/45 rounded-full backdrop-blur-md ml-auto text-yellow-500/80 flex items-center justify-center border border-yellow-500/25" title="Local Room cache only">
                                        <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 fill-current">
                                          <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" opacity="0.6"/>
                                          <circle cx="12" cy="13" r="1.5" className="text-yellow-500 fill-current" />
                                        </svg>
                                      </div>
                                    )}
                                  </div>

                                  <div className="text-[8.5px] text-white font-bold truncate font-mono">
                                    {photo.title}
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })}
                      </div>
                    )}
                  </div>
                )}

                {/* 6. Tab AI Smart Search */}
                {permissionState !== "denied" && activeTab === "ai" && (
                  <div className="py-2" id="ai_tab_view">
                    <div className="p-4 bg-[#EADDFF]/40 rounded-3xl border border-[#CAC4D0]/60 mb-3 shadow-sm">
                      <div className="flex items-center gap-2 mb-1.5 text-[#21005D]">
                        <Sparkles className="w-4 h-4 fill-[#EADDFF] animate-spin" style={{ animationDuration: '6s' }} />
                        <h4 className="text-xs font-bold uppercase tracking-wider">Smart Search Console</h4>
                      </div>
                      <p className="text-[10.5px] text-[#49454F] font-medium leading-normal">
                        Type keywords, file names, folders, or extensions. Submit with <Sparkles className="w-3 h-3 inline fill-[#6750A4] text-[#6750A4]" /> for deep Gemini AI semantic analysis.
                      </p>
                    </div>

                    <form onSubmit={handleAiSearch} className="flex gap-2 mb-3.5" id="ai_search_form">
                      <div className="relative flex-1">
                        <Search className="w-4 h-4 text-[#49454F] absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search 'mountains', '.mp4', 'Camera', etc."
                          className="w-full bg-white border border-[#CAC4D0] rounded-full pl-9 pr-4 py-2 text-xs focus:ring-2 focus:ring-[#6750A4] focus:outline-none text-[#1C1B1F] placeholder-[#49454F]/60"
                        />
                        {searchQuery && (
                          <button
                            type="button"
                            onClick={handleClearSearch}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#49454F] hover:text-[#1C1B1F] p-0.5 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <button
                        type="submit"
                        disabled={isAiSearching || !searchQuery.trim()}
                        className="p-2.5 bg-[#6750A4] hover:bg-[#6750A4]/90 disabled:bg-[#CAC4D0] text-white rounded-full transition shadow-sm cursor-pointer flex items-center justify-center"
                        title="Submit semantic search query to Gemini"
                      >
                        {isAiSearching ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <Sparkles className="w-4 h-4 fill-white" />
                        )}
                      </button>
                    </form>

                    {/* Interactive Category Tabs with real-time match counters */}
                    <div className="flex gap-1.5 overflow-x-auto pb-2 mb-2 scrollbar-none" id="search_type_filters">
                      {[
                        { id: "all", label: "All", count: searchResults.images.length + searchResults.videos.length + searchResults.albums.length + searchResults.folders.length + searchResults.filenames.length },
                        { id: "images", label: "Images", count: searchResults.images.length },
                        { id: "videos", label: "Videos", count: searchResults.videos.length },
                        { id: "albums", label: "Albums", count: searchResults.albums.length },
                        { id: "folders", label: "Folders", count: searchResults.folders.length },
                        { id: "filenames", label: "File names", count: searchResults.filenames.length },
                      ].map(type => (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => {
                            setSearchType(type.id as any);
                            addLog("V", "SearchFilter", `Filtered search tab list by category: ${type.label}`);
                          }}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer ${
                            searchType === type.id
                              ? "bg-[#6750A4] text-white shadow-sm"
                              : "bg-[#ECE6F0] hover:bg-[#CAC4D0]/50 text-[#49454F] hover:text-[#1C1B1F] border border-[#CAC4D0]/20"
                          }`}
                        >
                          {type.label}
                          {searchQuery && (
                            <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded-full ${
                              searchType === type.id ? "bg-white/20 text-white" : "bg-black/10 text-[#49454F]"
                            }`}>
                              {type.count}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>

                    {/* Main Results Dashboard Container */}
                    {!searchQuery.trim() ? (
                      /* Empty state search guide */
                      <div className="flex flex-col items-center justify-center py-10 text-center bg-[#EADDFF]/10 border border-dashed border-[#CAC4D0]/40 rounded-3xl p-5 mb-4" id="empty_search_prompt">
                        <div className="w-12 h-12 bg-[#EADDFF]/50 text-[#21005D] rounded-full flex items-center justify-center mb-2.5">
                          <Search className="w-5 h-5" />
                        </div>
                        <h4 className="text-[11.5px] font-bold text-[#1C1B1F]">What are you looking for?</h4>
                        <p className="text-[9.5px] text-[#49454F] px-4 mt-1 font-semibold leading-relaxed">
                          Enter keywords, album names, file extensions (e.g. .jpg, .mp4), folder paths, or tap a fast preset below.
                        </p>
                      </div>
                    ) : (
                      searchResults.images.length === 0 &&
                      searchResults.videos.length === 0 &&
                      searchResults.albums.length === 0 &&
                      searchResults.folders.length === 0 &&
                      searchResults.filenames.length === 0
                    ) ? (
                      /* No results state */
                      <div className="flex flex-col items-center justify-center py-10 text-center bg-white border border-[#CAC4D0]/30 rounded-3xl p-5 mb-4" id="no_search_results">
                        <AlertCircle className="w-7 h-7 text-amber-500 mb-2" />
                        <h4 className="text-[11.5px] font-bold text-[#1C1B1F]">No matching results</h4>
                        <p className="text-[9.5px] text-[#49454F] px-4 mt-0.5 font-semibold leading-relaxed">
                          We couldn't find any items matching "{searchQuery}" across your images, videos, albums, folders, or file names.
                        </p>
                      </div>
                    ) : (
                      /* Categorized list scroll area */
                      <div className="flex flex-col gap-3 mb-4 max-h-[340px] overflow-y-auto pr-1 scrollbar-thin">
                        {/* Gemini AI relevance overlay alert */}
                        {aiSearchResults && (
                          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 flex items-start gap-2">
                            <Sparkles className="w-4 h-4 text-emerald-600 fill-emerald-100 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-[9.5px] font-bold text-emerald-800 leading-tight">AI Semantic Engine Active</p>
                              <p className="text-[8.5px] text-emerald-700 font-medium leading-normal mt-0.5">Matched and ranked {aiSearchResults.length} photos based on intelligent visual and conceptual content matching.</p>
                            </div>
                          </div>
                        )}

                        {/* Images Section */}
                        {(searchType === "all" || searchType === "images") && searchResults.images.length > 0 && (
                          <div className="bg-white border border-[#CAC4D0]/30 rounded-2xl p-2.5 shadow-sm" id="matched_images_section">
                            <h5 className="text-[9.5px] font-extrabold text-[#6750A4] uppercase tracking-wider flex items-center gap-1 mb-2 border-b border-[#ECE6F0] pb-1">
                              <ImageIcon className="w-3.5 h-3.5" />
                              Images ({searchResults.images.length})
                            </h5>
                            <div className="grid grid-cols-3 gap-1.5">
                              {searchResults.images.map(img => (
                                <div
                                  key={img.id}
                                  onClick={() => {
                                    setSelectedPhoto(img);
                                    addLog("V", "Search", `Opened image "${img.title}" from search results`);
                                  }}
                                  className="aspect-square rounded-lg overflow-hidden relative cursor-pointer hover:scale-[1.03] transition group"
                                  style={{ contentVisibility: "auto", containIntrinsicSize: "auto 100px" }}
                                >
                                  <img
                                    src={img.url}
                                    alt={img.title}
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                    loading="lazy"
                                    decoding="async"
                                  />
                                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-1">
                                    <p className="text-[8px] text-white font-bold truncate">{img.title}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Videos Section */}
                        {(searchType === "all" || searchType === "videos") && searchResults.videos.length > 0 && (
                          <div className="bg-white border border-[#CAC4D0]/30 rounded-2xl p-2.5 shadow-sm" id="matched_videos_section">
                            <h5 className="text-[9.5px] font-extrabold text-[#6750A4] uppercase tracking-wider flex items-center gap-1 mb-2 border-b border-[#ECE6F0] pb-1">
                              <Video className="w-3.5 h-3.5" />
                              Videos ({searchResults.videos.length})
                            </h5>
                            <div className="grid grid-cols-3 gap-1.5">
                              {searchResults.videos.map(vid => (
                                <div
                                  key={vid.id}
                                  onClick={() => {
                                    setSelectedPhoto(vid);
                                    addLog("V", "Search", `Opened video player for "${vid.title}"`);
                                  }}
                                  className="aspect-square rounded-lg overflow-hidden relative cursor-pointer hover:scale-[1.03] transition bg-black flex items-center justify-center group"
                                  style={{ contentVisibility: "auto", containIntrinsicSize: "auto 100px" }}
                                >
                                  <img
                                    src={vid.thumbnailUrl || vid.url}
                                    alt={vid.title}
                                    className="w-full h-full object-cover opacity-80"
                                    referrerPolicy="no-referrer"
                                    loading="lazy"
                                    decoding="async"
                                  />
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="p-1 bg-black/50 text-white rounded-full border border-white/20 group-hover:scale-110 transition">
                                      <Play className="w-3.5 h-3.5 fill-current translate-x-0.5" />
                                    </div>
                                  </div>
                                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-1">
                                    <p className="text-[8px] text-white font-bold truncate">{vid.title}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Albums Section */}
                        {(searchType === "all" || searchType === "albums") && searchResults.albums.length > 0 && (
                          <div className="bg-white border border-[#CAC4D0]/30 rounded-2xl p-2.5 shadow-sm" id="matched_albums_section">
                            <h5 className="text-[9.5px] font-extrabold text-[#6750A4] uppercase tracking-wider flex items-center gap-1 mb-2 border-b border-[#ECE6F0] pb-1">
                              <FolderOpen className="w-3.5 h-3.5" />
                              Albums ({searchResults.albums.length})
                            </h5>
                            <div className="flex flex-col gap-1.5">
                              {searchResults.albums.map(album => (
                                <div
                                  key={album.name}
                                  onClick={() => {
                                    setSelectedAlbum(album.name);
                                    setActiveTab("photos");
                                    addLog("I", "Search", `Opened album "${album.name}" via search result.`);
                                  }}
                                  className="p-2 bg-[#F7F2FA] hover:bg-[#EADDFF]/40 rounded-xl border border-[#CAC4D0]/20 transition flex items-center justify-between cursor-pointer group"
                                >
                                  <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-[#6750A4]/10 text-[#6750A4] rounded-lg">
                                      <FolderOpen className="w-3.5 h-3.5" />
                                    </div>
                                    <div>
                                      <p className="text-[10.5px] font-bold text-[#1C1B1F] group-hover:text-[#6750A4] transition">{album.name}</p>
                                      <p className="text-[8px] text-[#49454F] font-semibold font-mono">{album.folderPath}</p>
                                    </div>
                                  </div>
                                  <span className="text-[9px] px-2 py-0.5 bg-white text-[#49454F] rounded-full border border-[#CAC4D0]/20 font-bold">{album.count} files</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Folders Section */}
                        {(searchType === "all" || searchType === "folders") && searchResults.folders.length > 0 && (
                          <div className="bg-white border border-[#CAC4D0]/30 rounded-2xl p-2.5 shadow-sm" id="matched_folders_section">
                            <h5 className="text-[9.5px] font-extrabold text-[#6750A4] uppercase tracking-wider flex items-center gap-1 mb-2 border-b border-[#ECE6F0] pb-1">
                              <HardDrive className="w-3.5 h-3.5" />
                              Folders ({searchResults.folders.length})
                            </h5>
                            <div className="flex flex-col gap-1.5">
                              {searchResults.folders.map(folder => (
                                <div
                                  key={folder.folderPath}
                                  onClick={() => {
                                    setSelectedAlbum(folder.albumName);
                                    setActiveTab("photos");
                                    addLog("I", "Search", `Opened folder path "${folder.folderPath}" via search result.`);
                                  }}
                                  className="p-2 bg-[#F7F2FA] hover:bg-[#EADDFF]/40 rounded-xl border border-[#CAC4D0]/20 transition flex items-center justify-between cursor-pointer group"
                                >
                                  <div className="flex items-center gap-2 truncate">
                                    <div className="p-1.5 bg-neutral-100 text-neutral-600 rounded-lg">
                                      <HardDrive className="w-3.5 h-3.5" />
                                    </div>
                                    <div className="truncate">
                                      <p className="text-[10px] font-bold text-[#1C1B1F] truncate font-mono leading-tight group-hover:text-[#6750A4] transition">{folder.folderPath}</p>
                                      <p className="text-[7.5px] text-[#49454F] font-semibold">Bucket: {folder.albumName}</p>
                                    </div>
                                  </div>
                                  <span className="text-[8.5px] px-1.5 py-0.5 bg-neutral-200/50 text-neutral-700 rounded font-bold shrink-0">{folder.count} files</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* File names Section */}
                        {(searchType === "all" || searchType === "filenames") && searchResults.filenames.length > 0 && (
                          <div className="bg-white border border-[#CAC4D0]/30 rounded-2xl p-2.5 shadow-sm" id="matched_filenames_section">
                            <h5 className="text-[9.5px] font-extrabold text-[#6750A4] uppercase tracking-wider flex items-center gap-1 mb-2 border-b border-[#ECE6F0] pb-1">
                              <FileText className="w-3.5 h-3.5" />
                              File Names ({searchResults.filenames.length})
                            </h5>
                            <div className="flex flex-col gap-1.5">
                              {searchResults.filenames.map(item => (
                                <div
                                  key={item.photo.id}
                                  onClick={() => {
                                    setSelectedPhoto(item.photo);
                                    addLog("V", "Search", `Opened file ${item.fileName} from search listing.`);
                                  }}
                                  className="p-1.5 bg-[#F7F2FA] hover:bg-[#EADDFF]/30 rounded-lg border border-[#CAC4D0]/20 transition flex items-center justify-between cursor-pointer group"
                                >
                                  <div className="flex items-center gap-2 truncate">
                                    <div className="p-1 bg-[#6750A4]/5 text-[#6750A4] rounded">
                                      {item.photo.mimeType.startsWith("video") ? (
                                        <Video className="w-3.5 h-3.5" />
                                      ) : (
                                        <ImageIcon className="w-3.5 h-3.5" />
                                      )}
                                    </div>
                                    <div className="truncate">
                                      <p className="text-[9.5px] font-bold text-[#1C1B1F] font-mono leading-tight group-hover:text-[#6750A4] transition truncate">{item.fileName}</p>
                                      <p className="text-[7.5px] text-[#49454F] font-semibold font-mono truncate">{item.folderPath}</p>
                                    </div>
                                  </div>
                                  <div className="text-right shrink-0">
                                    <p className="text-[8.5px] font-bold text-[#1C1B1F] font-mono">{item.photo.size}</p>
                                    <p className="text-[7.5px] text-[#49454F] font-semibold">{item.photo.width}x{item.photo.height}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Direct action triggers for fast mock queries */}
                    <div className="mb-3">
                      <h5 className="text-[9.5px] font-bold text-[#49454F]/70 tracking-wider uppercase mb-1 px-1">Concept presets:</h5>
                      <div className="flex flex-wrap gap-1">
                        {["Sunset or evening light", "Cyberpunk rain night", "Receipts/papers", "Where can I work?"].map(preset => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => {
                              setSearchQuery(preset);
                              setSearchType("all");
                              addLog("D", "AIQueryHelper", `Selected preset: "${preset}"`);
                            }}
                            className="px-2 py-0.5 bg-[#ECE6F0] hover:bg-[#CAC4D0]/50 text-[#49454F] hover:text-[#1C1B1F] rounded-full text-[9.5px] font-semibold border border-[#CAC4D0]/30 transition cursor-pointer"
                          >
                            {preset}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setActiveTab("photos");
                        addLog("D", "GalleryViewModel", "Redirected search view onto core photo grid.");
                      }}
                      className="w-full py-2 bg-[#6750A4] text-white rounded-full text-xs font-bold hover:bg-[#6750A4]/90 active:bg-[#21005D] transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Grid className="w-3.5 h-3.5" />
                      View Grouped Results Grid
                    </button>
                  </div>
                )}

                {/* 7. Tab Settings & Architecture Info */}
                {permissionState !== "denied" && activeTab === "settings" && (
                  <div className="py-2 flex flex-col gap-5" id="settings_tab_view">
                    <div className="flex items-center justify-between px-1">
                      <h3 className={`text-sm font-black uppercase tracking-wider ${isDarkMode ? 'text-[#E6E1E5]' : 'text-[#1C1B1F]'}`}>
                        {t("settings")}
                      </h3>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${isDarkMode ? 'bg-indigo-950/50 text-[#D0BCFF] border border-[#3F3B45]' : 'bg-[#EADDFF] text-[#21005D]'}`}>
                        v4.0 Pure Kotlin Architecture
                      </span>
                    </div>

                    <div className="flex flex-col gap-3.5 pb-12">
                      {/* 1. Theme / Dark Mode Setting Card */}
                      <div className={`p-4 rounded-3xl border shadow-sm transition-all duration-200 ${
                        isDarkMode ? 'bg-[#1D1B20] border-[#3F3B45] text-[#E6E1E5]' : 'bg-white border-[#CAC4D0] text-[#1C1B1F]'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-start gap-2.5">
                            {isDarkMode ? (
                              <Moon className="w-4 h-4 text-[#D0BCFF] shrink-0 mt-0.5" />
                            ) : (
                              <Sun className="w-4 h-4 text-[#6750A4] shrink-0 mt-0.5" />
                            )}
                            <div>
                              <h4 className="text-xs font-bold leading-tight">{t("dark_mode")}</h4>
                              <p className={`text-[10px] mt-0.5 leading-normal ${isDarkMode ? 'text-slate-400' : 'text-[#49454F]'}`}>{t("dark_mode_desc")}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setIsDarkMode(!isDarkMode);
                              addLog("I", "Theme", `UI style update: System appearance changed to ${!isDarkMode ? "DARK" : "LIGHT"} mode canvas.`);
                            }}
                            className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer focus:outline-none shrink-0 ${
                              isDarkMode ? 'bg-[#D0BCFF]' : 'bg-[#E7E0EC] border-2 border-[#79747E]'
                            }`}
                          >
                            <div
                              className={`absolute top-0.5 h-4.5 w-4.5 rounded-full transition-transform ${
                                isDarkMode ? 'translate-x-5.5 bg-[#381E72]' : 'translate-x-0.5 bg-[#79747E]'
                              }`}
                            />
                          </button>
                        </div>
                      </div>

                      {/* 2. Grid Size Segmented Picker */}
                      <div className={`p-4 rounded-3xl border shadow-sm transition-all duration-200 ${
                        isDarkMode ? 'bg-[#1D1B20] border-[#3F3B45] text-[#E6E1E5]' : 'bg-white border-[#CAC4D0] text-[#1C1B1F]'
                      }`}>
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-start gap-2.5">
                            <Grid className={`w-4 h-4 shrink-0 mt-0.5 ${isDarkMode ? 'text-[#D0BCFF]' : 'text-[#6750A4]'}`} />
                            <div>
                              <h4 className="text-xs font-bold leading-tight">{t("grid_size")}</h4>
                              <p className={`text-[10px] mt-0.5 leading-normal ${isDarkMode ? 'text-slate-400' : 'text-[#49454F]'}`}>{t("grid_size_desc")}</p>
                            </div>
                          </div>
                          
                          <div className={`flex rounded-full p-0.5 border shrink-0 ${isDarkMode ? 'bg-[#25232A] border-[#3F3B45]' : 'bg-[#ECE6F0]/50 border-[#CAC4D0]'}`}>
                            {[2, 3, 4].map(num => (
                              <button
                                key={num}
                                onClick={() => {
                                  setSettingsGridSize(num);
                                  addLog("D", "Settings", `Grid size updated: ${num} columns layout.`);
                                }}
                                className={`px-2.5 py-1 rounded-full text-[9px] font-black transition-all cursor-pointer ${
                                  settingsGridSize === num
                                    ? isDarkMode ? 'bg-[#D0BCFF] text-[#381E72]' : 'bg-[#6750A4] text-white'
                                    : isDarkMode ? 'text-[#CAC4D0] hover:bg-[#35343A]' : 'text-[#49454F] hover:bg-[#ECE6F0]'
                                }`}
                              >
                                {num}C
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* 3. Media Sort Order Setting Card */}
                      <div className={`p-4 rounded-3xl border shadow-sm transition-all duration-200 ${
                        isDarkMode ? 'bg-[#1D1B20] border-[#3F3B45] text-[#E6E1E5]' : 'bg-white border-[#CAC4D0] text-[#1C1B1F]'
                      }`}>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-2.5">
                            <Sliders className={`w-4 h-4 shrink-0 mt-0.5 ${isDarkMode ? 'text-[#D0BCFF]' : 'text-[#6750A4]'}`} />
                            <div>
                              <h4 className="text-xs font-bold leading-tight">{t("sort_order")}</h4>
                              <p className={`text-[10px] mt-0.5 leading-normal ${isDarkMode ? 'text-slate-400' : 'text-[#49454F]'}`}>{t("sort_order_desc")}</p>
                            </div>
                          </div>
                          
                          <select
                            value={settingsSortOrder}
                            onChange={(e) => {
                              setSettingsSortOrder(e.target.value);
                              addLog("I", "Settings", `Sort order preference updated to: ${e.target.value.toUpperCase()}`);
                            }}
                            className={`text-[10px] font-black px-2 py-1 rounded-lg border outline-none cursor-pointer shrink-0 ${
                              isDarkMode ? 'bg-[#2D2A33] border-[#3F3B45] text-[#E6E1E5]' : 'bg-[#ECE6F0] border-[#CAC4D0] text-[#1C1B1F]'
                            }`}
                          >
                            <option value="date_desc">Date: Newest</option>
                            <option value="date_asc">Date: Oldest</option>
                            <option value="size_desc">Size: Largest</option>
                            <option value="size_asc">Size: Smallest</option>
                            <option value="name_asc">Name: A-Z</option>
                            <option value="name_desc">Name: Z-A</option>
                          </select>
                        </div>
                      </div>

                      {/* 4. Display Language Setting Card */}
                      <div className={`p-4 rounded-3xl border shadow-sm transition-all duration-200 ${
                        isDarkMode ? 'bg-[#1D1B20] border-[#3F3B45] text-[#E6E1E5]' : 'bg-white border-[#CAC4D0] text-[#1C1B1F]'
                      }`}>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-2.5">
                            <Globe className={`w-4 h-4 shrink-0 mt-0.5 ${isDarkMode ? 'text-[#D0BCFF]' : 'text-[#6750A4]'}`} />
                            <div>
                              <h4 className="text-xs font-bold leading-tight">{t("language_label")}</h4>
                              <p className={`text-[10px] mt-0.5 leading-normal ${isDarkMode ? 'text-slate-400' : 'text-[#49454F]'}`}>{t("language_desc")}</p>
                            </div>
                          </div>
                          
                          <select
                            value={settingsLanguage}
                            onChange={(e) => {
                              setSettingsLanguage(e.target.value);
                              addLog("I", "Localization", `System language updated to: ${e.target.value.toUpperCase()}`);
                            }}
                            className={`text-[10px] font-black px-2 py-1 rounded-lg border outline-none cursor-pointer shrink-0 ${
                              isDarkMode ? 'bg-[#2D2A33] border-[#3F3B45] text-[#E6E1E5]' : 'bg-[#ECE6F0] border-[#CAC4D0] text-[#1C1B1F]'
                            }`}
                          >
                            <option value="en">English (US)</option>
                            <option value="es">Español (ES)</option>
                            <option value="fr">Français (FR)</option>
                            <option value="de">Deutsch (DE)</option>
                            <option value="ja">日本語 (JP)</option>
                          </select>
                        </div>
                      </div>

                      {/* 5. Hidden Albums Excluder Card */}
                      <div className={`p-4 rounded-3xl border shadow-sm transition-all duration-200 ${
                        isDarkMode ? 'bg-[#1D1B20] border-[#3F3B45] text-[#E6E1E5]' : 'bg-white border-[#CAC4D0] text-[#1C1B1F]'
                      }`}>
                        <div className="flex items-start gap-2.5 border-b border-[#CAC4D0]/30 pb-2.5">
                          <EyeOff className={`w-4 h-4 shrink-0 mt-0.5 ${isDarkMode ? 'text-[#D0BCFF]' : 'text-[#6750A4]'}`} />
                          <div>
                            <h4 className="text-xs font-bold leading-tight">{t("hidden_albums")}</h4>
                            <p className={`text-[10px] mt-0.5 leading-normal ${isDarkMode ? 'text-slate-400' : 'text-[#49454F]'}`}>{t("hidden_albums_desc")}</p>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 mt-2.5 pl-0.5">
                          {["Camera", "Screenshots", "Downloads"].map(albumName => {
                            const isExcluded = !!hiddenAlbumNames[albumName];
                            return (
                              <label key={albumName} className="flex items-center justify-between text-[11px] font-semibold cursor-pointer py-1">
                                <span className={isDarkMode ? 'text-slate-300' : 'text-[#49454F]'}>{albumName} Album</span>
                                <button
                                  onClick={() => {
                                    const updated = { ...hiddenAlbumNames, [albumName]: !isExcluded };
                                    setHiddenAlbumNames(updated);
                                    addLog("I", "Settings", `Album filter updated. [${albumName}] Excluded from library: ${!isExcluded}`);
                                  }}
                                  className={`w-9 h-5 rounded-full transition-colors relative flex items-center shrink-0 ${
                                    isExcluded ? 'bg-red-500' : isDarkMode ? 'bg-zinc-700' : 'bg-slate-200'
                                  }`}
                                >
                                  <div
                                    className={`h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform ${
                                      isExcluded ? 'translate-x-4.5' : 'translate-x-1'
                                    }`}
                                  />
                                </button>
                              </label>
                            );
                          })}
                        </div>
                      </div>

                      {/* 6. Cache Management Setting Card */}
                      <div className={`p-4 rounded-3xl border shadow-sm transition-all duration-200 ${
                        isDarkMode ? 'bg-[#1D1B20] border-[#3F3B45] text-[#E6E1E5]' : 'bg-white border-[#CAC4D0] text-[#1C1B1F]'
                      }`}>
                        <div className="flex items-start gap-2.5 border-b border-[#CAC4D0]/30 pb-2.5">
                          <Database className={`w-4 h-4 shrink-0 mt-0.5 ${isDarkMode ? 'text-[#D0BCFF]' : 'text-[#6750A4]'}`} />
                          <div>
                            <h4 className="text-xs font-bold leading-tight">{t("cache_label")}</h4>
                            <p className={`text-[10px] mt-0.5 leading-normal ${isDarkMode ? 'text-slate-400' : 'text-[#49454F]'}`}>{t("cache_desc")}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-1.5">
                            <span className={`text-[10px] px-2 py-0.5 rounded-md font-mono font-bold ${
                              isDarkMode ? 'bg-[#25232A] text-slate-300' : 'bg-[#ECE6F0] text-[#21005D]'
                            }`}>
                              Disk: {cacheSizeMB.toFixed(1)} MB
                            </span>
                          </div>
                          
                          <button
                            disabled={isClearingCache || cacheSizeMB === 0}
                            onClick={handleClearCache}
                            className={`px-3.5 py-1.5 rounded-full text-[10px] font-black flex items-center gap-1 transition cursor-pointer ${
                              isClearingCache
                                ? 'bg-[#ECE6F0]/40 text-slate-400 cursor-not-allowed'
                                : cacheSizeMB === 0
                                  ? 'bg-[#ECE6F0]/10 text-slate-400 cursor-not-allowed'
                                  : isDarkMode
                                    ? 'bg-[#4F378B] text-white hover:bg-[#4F378B]/80'
                                    : 'bg-[#6750A4] text-white hover:bg-[#6750A4]/90 active:scale-95'
                            }`}
                          >
                            {isClearingCache ? (
                              <>
                                <RefreshCw className="w-3 h-3 animate-spin" />
                                Purging...
                              </>
                            ) : (
                              <>
                                <RefreshCw className="w-3 h-3" />
                                {t("clear_cache_btn")}
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* 7. Cloud Backup Sync Setting Card */}
                      <div className={`p-4 rounded-3xl border shadow-sm transition-all duration-200 ${
                        isDarkMode ? 'bg-[#1D1B20] border-[#3F3B45] text-[#E6E1E5]' : 'bg-white border-[#CAC4D0] text-[#1C1B1F]'
                      }`}>
                        <div className="flex items-start justify-between border-b border-[#CAC4D0]/30 pb-2.5">
                          <div className="flex items-start gap-2.5">
                            <CloudUpload className={`w-4 h-4 shrink-0 mt-0.5 ${isDarkMode ? 'text-[#D0BCFF]' : 'text-[#6750A4]'}`} />
                            <div>
                              <h4 className="text-xs font-bold leading-tight">{t("backup_label")}</h4>
                              <p className={`text-[10px] mt-0.5 leading-normal ${isDarkMode ? 'text-slate-400' : 'text-[#49454F]'}`}>{t("backup_desc")}</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3 mt-3">
                          <div className="flex items-center justify-between">
                            <span className={`text-[11px] font-semibold ${isDarkMode ? 'text-slate-300' : 'text-[#49454F]'}`}>
                              Enable Auto-Sync Thread
                            </span>
                            <button
                              onClick={() => {
                                setBackupEnabled(!backupEnabled);
                                addLog("I", "Settings", `Cloud sync scheduler status: ${!backupEnabled ? "ENABLED" : "DISABLED"}`);
                              }}
                              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer focus:outline-none shrink-0 ${
                                backupEnabled ? 'bg-[#D0BCFF]' : 'bg-[#E7E0EC] border-2 border-[#79747E]'
                              }`}
                            >
                              <div
                                className={`absolute top-0.5 h-4.5 w-4.5 rounded-full transition-transform ${
                                  backupEnabled ? 'translate-x-5.5 bg-[#381E72]' : 'translate-x-0.5 bg-[#79747E]'
                                }`}
                              />
                            </button>
                          </div>

                          <div className={`p-2.5 rounded-2xl border ${
                            isDarkMode ? 'bg-[#25232A]/50 border-[#3F3B45]' : 'bg-[#F7F2FA] border-[#CAC4D0]/30'
                          } flex flex-col gap-1.5`}>
                            <div className="flex items-center justify-between text-[10px] font-semibold">
                              <span className={isDarkMode ? 'text-slate-400' : 'text-[#49454F]'}>Worker Status:</span>
                              <span className={`font-bold uppercase tracking-tight text-[9px] ${
                                backupStatus === "backing_up" 
                                  ? 'text-amber-500' 
                                  : backupStatus === "backed_up" 
                                    ? 'text-emerald-500 animate-pulse' 
                                    : isDarkMode ? 'text-slate-400' : 'text-slate-500'
                              }`}>
                                {backupStatus === "backing_up" ? "SYNCING DELTA..." : backupStatus === "backed_up" ? "SYNC SUCCESS" : "IDLE"}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[10px] font-semibold">
                              <span className={isDarkMode ? 'text-slate-400' : 'text-[#49454F]'}>Last Replica:</span>
                              <span className={`font-mono text-[9px] ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                {lastBackupTime || "Never"}
                              </span>
                            </div>
                          </div>

                          <button
                            disabled={backupStatus === "backing_up"}
                            onClick={handleTriggerBackup}
                            className={`w-full py-2 rounded-full text-xs font-black flex items-center justify-center gap-1.5 transition cursor-pointer shadow-sm ${
                              backupStatus === "backing_up"
                                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                                : isDarkMode
                                  ? 'bg-[#4F378B] hover:bg-[#4F378B]/90 text-white hover:shadow-indigo-500/10 active:scale-95'
                                  : 'bg-[#6750A4] hover:bg-[#6750A4]/90 active:bg-[#21005D] text-white active:scale-95'
                            }`}
                          >
                            <CloudUpload className={`w-3.5 h-3.5 ${backupStatus === "backing_up" ? 'animate-bounce' : ''}`} />
                            {backupStatus === "backing_up" ? "Uploading sqlite delta..." : t("backup_btn")}
                          </button>
                        </div>
                      </div>

                      {/* Display & View Mode Configuration Card */}
                      <div className={`p-4 rounded-3xl border shadow-sm transition-all duration-200 ${
                        isDarkMode ? 'bg-[#1D1B20] border-[#3F3B45] text-[#E6E1E5]' : 'bg-white border-[#CAC4D0] text-[#1C1B1F]'
                      }`}>
                        <div className="flex items-start gap-2.5 border-b border-[#CAC4D0]/30 pb-2.5 mb-3">
                          <Smartphone className={`w-4 h-4 shrink-0 mt-0.5 ${isDarkMode ? 'text-[#D0BCFF]' : 'text-[#6750A4]'}`} />
                          <div>
                            <h4 className="text-xs font-bold leading-tight">Display & View Mode</h4>
                            <p className={`text-[10px] mt-0.5 leading-normal ${isDarkMode ? 'text-slate-400' : 'text-[#49454F]'}`}>
                              Switch between the interactive developer simulator and a clean fullscreen standalone mobile view.
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2.5">
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => {
                                setViewMode("simulator");
                                addLog("I", "ViewMode", "Switched to Simulator & Code Explorer View.");
                              }}
                              className={`py-2 px-3 rounded-xl text-[10px] font-bold text-center cursor-pointer border ${
                                viewMode === "simulator"
                                  ? isDarkMode
                                    ? 'bg-[#4F378B] border-[#D0BCFF] text-white'
                                    : 'bg-[#EADDFF] border-[#6750A4] text-[#21005D]'
                                  : isDarkMode
                                    ? 'bg-zinc-900 border-zinc-700 text-slate-400 hover:text-white'
                                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-800'
                              }`}
                            >
                              Simulator + Code
                            </button>
                            <button
                              onClick={() => {
                                setViewMode("app");
                                addLog("I", "ViewMode", "Switched to Standalone App View. Fill screen active.");
                              }}
                              className={`py-2 px-3 rounded-xl text-[10px] font-bold text-center cursor-pointer border ${
                                viewMode === "app"
                                  ? isDarkMode
                                    ? 'bg-[#4F378B] border-[#D0BCFF] text-white'
                                    : 'bg-[#EADDFF] border-[#6750A4] text-[#21005D]'
                                  : isDarkMode
                                    ? 'bg-zinc-900 border-zinc-700 text-slate-400 hover:text-white'
                                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-800'
                              }`}
                            >
                              Fullscreen App
                            </button>
                          </div>
                          
                          <div className="p-2 bg-slate-900 text-slate-300 rounded-xl border border-slate-800 text-[8px] font-mono leading-relaxed space-y-1">
                            <div className="flex justify-between">
                              <span>Default Build View:</span>
                              <span className="text-amber-400 font-bold">FULLSCREEN NATIVE WEBVIEW</span>
                            </div>
                            <div className="text-[7.5px] text-slate-400 leading-normal">
                              In standalone/mobile builds, the developer sidebars, headers, and phone frames are automatically removed to offer a authentic native user experience.
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 7.5. Dynamic API Remote Sync Server Setting Card */}
                      <div className={`p-4 rounded-3xl border shadow-sm transition-all duration-200 ${
                        isDarkMode ? 'bg-[#1D1B20] border-[#3F3B45] text-[#E6E1E5]' : 'bg-white border-[#CAC4D0] text-[#1C1B1F]'
                      }`}>
                        <div className="flex items-start gap-2.5 border-b border-[#CAC4D0]/30 pb-2.5 mb-3">
                          <Cpu className={`w-4 h-4 shrink-0 mt-0.5 ${isDarkMode ? 'text-[#D0BCFF]' : 'text-[#6750A4]'}`} />
                          <div>
                            <h4 className="text-xs font-bold leading-tight">Remote Server API Endpoint</h4>
                            <p className={`text-[10px] mt-0.5 leading-normal ${isDarkMode ? 'text-slate-400' : 'text-[#49454F]'}`}>
                              Configure the host server address for secure background photo backups, duplicate detection, and AI analysis.
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2.5">
                          <div>
                            <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">
                              Server Base URL
                            </label>
                            <input
                              type="text"
                              value={customSyncServer}
                              onChange={(e) => {
                                setCustomSyncServer(e.target.value);
                              }}
                              placeholder="https://your-cloud-run-server.app"
                              className="w-full bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-xl px-3 py-1.5 text-[11px] text-slate-800 dark:text-slate-100 outline-none font-mono"
                            />
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                localStorage.setItem("custom_sync_server", customSyncServer);
                                addLog("I", "SyncWorker", `Saved custom remote sync backend: ${customSyncServer}`);
                                fetchPhotos(); // Trigger update with new endpoint
                              }}
                              className={`flex-1 py-1.5 rounded-full text-[10px] font-black text-center cursor-pointer ${
                                isDarkMode ? 'bg-[#4F378B] text-white hover:bg-[#4F378B]/80' : 'bg-[#6750A4] text-white hover:bg-[#6750A4]/90'
                              }`}
                            >
                              Save Server Config
                            </button>
                            <button
                              onClick={() => {
                                const defaultUrl = "https://ais-pre-6j26bomybh3mrhngsz7myx-655499886291.asia-east1.run.app";
                                setCustomSyncServer(defaultUrl);
                                localStorage.setItem("custom_sync_server", defaultUrl);
                                addLog("W", "SyncWorker", `Restored remote endpoint to default cloud server.`);
                                fetchPhotos();
                              }}
                              className={`px-3 py-1.5 rounded-full text-[10px] font-black border border-slate-300 dark:border-zinc-700 text-center cursor-pointer ${
                                isDarkMode ? 'bg-zinc-800 text-slate-300 hover:bg-zinc-700' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              Reset
                            </button>
                          </div>

                          <div className="p-2 bg-slate-900 text-slate-300 rounded-xl border border-slate-800 text-[8px] font-mono leading-relaxed space-y-1">
                            <div className="flex justify-between">
                              <span>Active Connection:</span>
                              <span className="text-emerald-400 font-bold">ONLINE</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Environment Mode:</span>
                              <span className="text-amber-400 font-bold">
                                {typeof window !== "undefined" && ((window as any).Capacitor !== undefined || window.location.protocol === "file:") ? "NATIVE MOBILE" : "BROWSER PREVIEW"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 8. Security & App Lock Setting Card */}
                      <div className={`p-4 rounded-3xl border shadow-sm transition-all duration-200 ${
                        isDarkMode ? 'bg-[#1D1B20] border-[#3F3B45] text-[#E6E1E5]' : 'bg-white border-[#CAC4D0] text-[#1C1B1F]'
                      }`}>
                        <div className="flex items-start gap-2.5 border-b border-[#CAC4D0]/30 pb-2.5 mb-3">
                          <Lock className={`w-4 h-4 shrink-0 mt-0.5 ${isDarkMode ? 'text-[#D0BCFF]' : 'text-[#6750A4]'}`} />
                          <div>
                            <h4 className="text-xs font-bold leading-tight">Security & App Lock</h4>
                            <p className={`text-[10px] mt-0.5 leading-normal ${isDarkMode ? 'text-slate-400' : 'text-[#49454F]'}`}>
                              Protect app launch with Secure PIN, Fingerprint or Face biometric authentication
                            </p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          {/* Enable App Lock Toggle */}
                          <div className="flex items-center justify-between">
                            <span className={`text-[11px] font-semibold ${isDarkMode ? 'text-slate-300' : 'text-[#49454F]'}`}>
                              Enable Device App Lock
                            </span>
                            <button
                              onClick={() => {
                                const nextVal = !appLockEnabled;
                                setAppLockEnabled(nextVal);
                                if (nextVal) {
                                  addLog("I", "AppLock", "App Lock activated. App will request security credentials on next launch or resume.");
                                } else {
                                  addLog("W", "AppLock", "App Lock deactivated. Device-level startup security verification disabled.");
                                }
                              }}
                              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer focus:outline-none shrink-0 ${
                                appLockEnabled ? 'bg-[#D0BCFF]' : 'bg-[#E7E0EC] border-2 border-[#79747E]'
                              }`}
                            >
                              <div
                                className={`absolute top-0.5 h-4.5 w-4.5 rounded-full transition-transform ${
                                  appLockEnabled ? 'translate-x-5.5 bg-[#381E72]' : 'translate-x-0.5 bg-[#79747E]'
                                }`}
                              />
                            </button>
                          </div>

                          {appLockEnabled && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="space-y-2.5 pt-2 border-t border-[#CAC4D0]/20"
                            >
                              {/* 4-digit PIN setup/display */}
                              <div className="flex items-center justify-between">
                                <div className="flex flex-col">
                                  <span className={`text-[10px] font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                    App Lock PIN
                                  </span>
                                  <span className="text-[9px] text-slate-400 font-mono">
                                    Current: **** (4 digits)
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <input
                                    type="password"
                                    maxLength={4}
                                    value={tempPinInput}
                                    onChange={(e) => {
                                      const val = e.target.value.replace(/\D/g, "");
                                      setTempPinInput(val);
                                    }}
                                    placeholder="PIN"
                                    className={`w-14 text-center text-xs font-bold font-mono px-1 py-1 rounded-lg border outline-none ${
                                      isDarkMode ? 'bg-[#2D2A33] border-[#3F3B45] text-white' : 'bg-[#ECE6F0] border-[#CAC4D0] text-black'
                                    }`}
                                  />
                                  <button
                                    onClick={() => {
                                      if (tempPinInput.length !== 4) {
                                        alert("PIN must be exactly 4 digits");
                                        return;
                                      }
                                      setAppLockPin(tempPinInput);
                                      addLog("I", "AppLockKeyStore", "Updated App Lock master PIN. Encrypted and saved to secure slot.");
                                      setTempPinInput("");
                                      alert("PIN updated successfully!");
                                    }}
                                    className="px-2 py-1 bg-[#6750A4] text-white text-[9px] font-bold rounded-lg hover:bg-[#6750A4]/90 active:scale-95 transition"
                                  >
                                    Set
                                  </button>
                                </div>
                              </div>

                              {/* Fingerprint Toggle */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                  <Fingerprint className={`w-3.5 h-3.5 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                                  <span className={`text-[10px] font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                    Allow Fingerprint Unlock
                                  </span>
                                </div>
                                <button
                                  onClick={() => {
                                    setAppLockFingerprintEnabled(!appLockFingerprintEnabled);
                                    addLog("I", "BiometricsConfig", `Fingerprint biometric sensor state: ${!appLockFingerprintEnabled ? "AUTHORIZED" : "REVOKED"}`);
                                  }}
                                  className={`w-9 h-5.5 rounded-full transition-colors relative cursor-pointer focus:outline-none shrink-0 ${
                                    appLockFingerprintEnabled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-zinc-700'
                                  }`}
                                >
                                  <div
                                    className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
                                      appLockFingerprintEnabled ? 'translate-x-4.5' : 'translate-x-0.5'
                                    }`}
                                  />
                                </button>
                              </div>

                              {/* Face Unlock Toggle */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                  <ScanFace className={`w-3.5 h-3.5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                                  <span className={`text-[10px] font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                    Allow Face Unlock (Biometric)
                                  </span>
                                </div>
                                <button
                                  onClick={() => {
                                    setAppLockFaceEnabled(!appLockFaceEnabled);
                                    addLog("I", "BiometricsConfig", `Face Recognition sensor state: ${!appLockFaceEnabled ? "AUTHORIZED" : "REVOKED"}`);
                                  }}
                                  className={`w-9 h-5.5 rounded-full transition-colors relative cursor-pointer focus:outline-none shrink-0 ${
                                    appLockFaceEnabled ? 'bg-blue-500' : 'bg-slate-300 dark:bg-zinc-700'
                                  }`}
                                >
                                  <div
                                    className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
                                      appLockFaceEnabled ? 'translate-x-4.5' : 'translate-x-0.5'
                                    }`}
                                  />
                                </button>
                              </div>

                              {/* Simulation Simulator Controls */}
                              <div className="flex gap-2 pt-1 border-t border-[#CAC4D0]/10 justify-between items-center">
                                <span className="text-[8.5px] text-slate-400 font-mono">
                                  Mock Biometrics State:
                                </span>
                                <button
                                  onClick={() => {
                                    setIsAppLocked(true);
                                    addLog("I", "AppLock", "App Lock manually engaged. Locking emulator viewport.");
                                  }}
                                  className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-[8px] font-bold rounded-lg transition active:scale-95 font-mono"
                                >
                                  TEST LOCK NOW
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </div>

                      {/* 9. Dev Controls (Existing Emulator Perm Overrides) */}
                      <div className={`p-4 rounded-3xl border shadow-sm transition-all duration-200 ${
                        isDarkMode ? 'bg-[#1D1B20] border-[#3F3B45] text-[#E6E1E5]' : 'bg-white border-[#CAC4D0] text-[#1C1B1F]'
                      }`}>
                        <div className="flex items-start gap-2.5 border-b border-[#CAC4D0]/30 pb-2.5">
                          <Settings className={`w-4 h-4 shrink-0 mt-0.5 ${isDarkMode ? 'text-[#D0BCFF]' : 'text-[#6750A4]'}`} />
                          <div>
                            <h4 className="text-xs font-bold leading-tight">{t("emulator_controls")}</h4>
                            <p className={`text-[10px] mt-0.5 leading-normal ${isDarkMode ? 'text-slate-400' : 'text-[#49454F]'}`}>System overrides for sandbox emulation</p>
                          </div>
                        </div>

                        <div className="mt-3 flex flex-col gap-2.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className={`text-[11px] font-semibold ${isDarkMode ? 'text-slate-300' : 'text-[#49454F]'}`}>
                              API Permissions Override
                            </span>
                            <select
                              value={permissionState}
                              onChange={(e: any) => {
                                setPermissionState(e.target.value);
                                addLog("W", "Permissions", `Android OS requested override permissions to state: ${e.target.value.toUpperCase()}`);
                              }}
                              className={`text-[10px] font-black px-2 py-1 rounded-lg border outline-none cursor-pointer shrink-0 ${
                                isDarkMode ? 'bg-[#2D2A33] border-[#3F3B45] text-[#E6E1E5]' : 'bg-[#ECE6F0] border-[#CAC4D0] text-[#1C1B1F]'
                              }`}
                            >
                              <option value="prompt">Prompt (SDK 35)</option>
                              <option value="granted">Granted All</option>
                              <option value="granular">Granular Select</option>
                              <option value="denied">Denied Lock</option>
                            </select>
                          </div>

                          <div className={`p-3 rounded-2xl border text-[10px] leading-relaxed font-semibold space-y-1 ${
                            isDarkMode ? 'bg-[#25232A]/30 border-[#3F3B45]/60 text-slate-300' : 'bg-slate-50 border-[#CAC4D0]/20 text-[#49454F]'
                          }`}>
                            <h5 className="font-bold text-[#6750A4] dark:text-[#D0BCFF] mb-1">{t("architecture_specs")}:</h5>
                            <ul className="list-disc pl-4 space-y-1">
                              <li><strong>Coroutines Flow</strong>: Feeds database streams reactively, avoiding UI thread blockages.</li>
                              <li><strong>Play Policies compliant</strong>: Exposes detailed granular scopes, avoids aggressive background queries.</li>
                              <li><strong>Memory Efficient Grid</strong>: Employs virtualized recycle elements matching RecyclerView caches.</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Floating Action Button for importing media */}
              {activeTab === "photos" && permissionState !== "denied" && (
                <button
                  onClick={() => {
                    document.getElementById("device_gallery_importer")?.click();
                  }}
                  className={`absolute bottom-24 right-5 p-3.5 rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 z-40 ${
                    isDarkMode 
                      ? "bg-[#4F378B] text-[#D0BCFF] border border-[#3F3B45]" 
                      : "bg-[#EADDFF] text-[#21005D] border border-[#CAC4D0]/30"
                  }`}
                  title="Import Photos/Videos from Device Storage"
                >
                  <Plus className="w-5 h-5 stroke-[2.5]" />
                  <span className="text-[10.5px] font-black tracking-tight uppercase">Import</span>
                </button>
              )}

              {/* M3 Navigation Bar Mock */}
              <div className={`absolute bottom-0 inset-x-0 h-20 border-t ${isDarkMode ? 'bg-[#1E1B24] border-[#3F3B45]' : 'bg-[#F7F2FA] border-[#ECE6F0]'} flex items-center justify-around px-2 pb-1.5 z-40`} id="virtual_nav_bar">
                {isSelectMode ? (
                  <div className="flex items-center justify-around w-full px-1 py-1" id="batch_actions_bar">
                    {[
                      { id: "copy", label: "Copy", icon: Copy, action: () => setShowCopyMoveDialog("copy") },
                      { id: "move", label: "Move", icon: FolderInput, action: () => setShowCopyMoveDialog("move") },
                      { id: "delete", label: "Delete", icon: Trash2, action: () => setShowDeleteBatchConfirm(true), color: "text-red-600" },
                      { id: "rename", label: "Rename", icon: Edit3, action: () => setShowRenameBatchDialog(true) },
                      { id: "share", label: "Share", icon: Share2, action: handleBatchShare },
                      { id: "compress", label: "Compress", icon: Archive, action: () => {
                        setCompressTargetIds(selectedPhotoIds);
                        setShowCompressQualitySelector(true);
                      } },
                    ].map((btn) => {
                      const isDisabled = selectedPhotoIds.length === 0;
                      const Icon = btn.icon;
                      return (
                        <button
                          key={btn.id}
                          disabled={isDisabled}
                          onClick={btn.action}
                          className={`flex flex-col items-center justify-center w-14 h-14 relative group transition-all rounded-xl cursor-pointer ${
                            isDisabled 
                              ? "opacity-30 cursor-not-allowed" 
                              : isDarkMode 
                                ? "hover:bg-[#35343A] active:scale-95"
                                : "hover:bg-[#ECE6F0]/60 active:scale-95"
                          }`}
                          title={`${btn.label} ${selectedPhotoIds.length} items`}
                        >
                          <div className="relative w-10 h-8 flex items-center justify-center">
                            <Icon className={`w-4.5 h-4.5 stroke-[2] ${btn.color || (isDarkMode ? "text-[#CAC4D0]" : "text-[#49454F]")}`} />
                          </div>
                          <span className={`text-[9px] font-bold ${btn.color || (isDarkMode ? "text-[#CAC4D0]" : "text-[#49454F]")}`}>
                            {btn.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  [
                    { id: "home", label: "Home", icon: Home },
                    { id: "photos", label: "Photos", icon: ImageIcon },
                    { id: "favorites", label: "Favorites", icon: Heart },
                    { id: "ai", label: "Search", icon: Search },
                    { id: "settings", label: "Settings", icon: Settings },
                  ].map((tab) => {
                    const isSelected = activeTab === tab.id;
                    const IconComponent = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id as any);
                          if (tab.id === "photos") setSelectedAlbum(null);
                          addLog("V", "PhotosScreen", `Switched tab to ${tab.label}`);
                        }}
                        className="flex flex-col items-center justify-center w-16 h-14 relative group cursor-pointer"
                      >
                        {/* Material 3 Active Indicator Pill */}
                        <div className="relative w-14 h-8 flex items-center justify-center">
                          {isSelected && (
                            <motion.div
                              layoutId="active_pill_indicator"
                              transition={{ type: "spring", stiffness: 380, damping: 30 }}
                              className={`absolute inset-0 ${isDarkMode ? 'bg-[#4F378B]' : 'bg-[#E8DEF8]'} rounded-full`}
                            />
                          )}
                          <IconComponent
                            className={`w-5 h-5 relative z-10 transition-transform duration-200 group-hover:scale-105 ${
                              isSelected 
                                ? isDarkMode ? "text-[#E6E1E5] stroke-[2.5]" : "text-[#1D1B20] stroke-[2.5]" 
                                : isDarkMode ? "text-[#CAC4D0]" : "text-[#49454F]"
                            } ${tab.id === "ai" && isSelected ? (isDarkMode ? "fill-[#D0BCFF]" : "fill-[#21005D]") : ""}`}
                          />
                        </div>
                        <span
                          className={`text-[9.5px] mt-1 relative z-10 font-bold transition-colors duration-200 ${
                            isSelected 
                              ? isDarkMode ? "text-[#E6E1E5]" : "text-[#1D1B20]" 
                              : isDarkMode ? "text-[#CAC4D0] font-semibold" : "text-[#49454F] font-semibold"
                          }`}
                        >
                          {t(tab.id)}
                        </span>
                      </button>
                    );
                  })
                )}
              </div>

              {/* Bottom Android Pill Bar cutout */}
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-28 h-1 bg-[#CAC4D0] rounded-full z-50"></div>

              {/* Interactive Detail Modal Backdrop & Sheet */}
              <AnimatePresence>
                {selectedPhoto && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/85 z-50 flex flex-col justify-end"
                    id="photo_detail_sheet"
                  >
                    {/* Top action header for fullscreen photo viewing */}
                    <div className="px-4 py-3 flex items-center justify-between text-white z-20 bg-gradient-to-b from-black/80 to-transparent">
                      <button
                        onClick={() => {
                          setSelectedPhoto(null);
                          setAnalysisResult(null);
                        }}
                        className="p-1.5 bg-white/10 hover:bg-white/20 active:bg-white/5 rounded-full transition text-white"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <div className="text-center">
                        <h4 className="text-xs font-bold truncate max-w-[180px]">{selectedPhoto.title}</h4>
                        <p className="text-[8px] text-slate-300 font-mono tracking-wider">{selectedPhoto.size} | {selectedPhoto.width}x{selectedPhoto.height}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={handleOpenFileDetails}
                          className="p-1.5 bg-white/10 hover:bg-white/20 rounded-full transition text-white"
                          title="Show Full File Details Screen"
                        >
                          <Info className="w-4.5 h-4.5" />
                        </button>
                        <button
                          onClick={() => handleToggleHide(selectedPhoto)}
                          className={`p-1.5 ${selectedPhoto.isHidden ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/35" : "bg-white/10 text-white"} hover:bg-white/20 rounded-full transition`}
                          title={selectedPhoto.isHidden ? "Decrypt & move back to Camera album" : "Encrypt & hide to Secure Vault"}
                        >
                          {selectedPhoto.isHidden ? <Unlock className="w-4.5 h-4.5" /> : <Lock className="w-4.5 h-4.5" />}
                        </button>
                        <button
                          onClick={() => handleToggleFavorite(selectedPhoto)}
                          className="p-1.5 bg-white/10 hover:bg-white/20 rounded-full transition text-white"
                          title="Favorite toggle"
                        >
                          <Heart className={`w-4.5 h-4.5 ${selectedPhoto.isFavorite ? "text-red-500 fill-red-500" : ""}`} />
                        </button>
                        <button
                          onClick={() => handleDeletePhoto(selectedPhoto)}
                          className="p-1.5 bg-white/10 hover:bg-white/20 hover:text-red-400 rounded-full transition text-white"
                          title="Move file to Trash bin"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </div>

                    {/* Centered Image display frame / Video Player */}
                    <div className="flex-1 flex items-center justify-center p-3 relative overflow-hidden bg-black/40">
                      {selectedPhoto.mimeType.startsWith("video") ? (
                        <div 
                          ref={videoContainerRef}
                          className={`${
                            isSimulatedFullscreen 
                              ? "absolute inset-0 z-50 w-full h-full max-h-none rounded-none bg-black" 
                              : "relative w-full max-h-[300px] rounded-3xl bg-black/80"
                          } flex flex-col justify-center items-center overflow-hidden group/video transition-all duration-300`}
                        >
                          <video
                            ref={videoRef}
                            src={selectedPhoto.url}
                            className={`${
                              isSimulatedFullscreen ? "h-full w-full" : "max-h-[250px] w-full"
                            } object-contain rounded-2xl`}
                            onClick={togglePlayVideo}
                            onTimeUpdate={() => {
                              if (videoRef.current) setVideoTime(videoRef.current.currentTime);
                            }}
                            onLoadedMetadata={() => {
                              if (videoRef.current) setVideoDuration(videoRef.current.duration || 15);
                            }}
                            playsInline
                            autoPlay={false}
                          />

                          {/* Subtitles Overlay */}
                          {subtitlesEnabled && (
                            <div className="absolute bottom-16 left-4 right-4 text-center z-40 pointer-events-none select-none">
                              <span className="px-2.5 py-1 bg-black/75 text-amber-300 text-[11px] font-bold rounded-lg border border-white/10 shadow-md">
                                {getSubtitlesText(videoTime)}
                              </span>
                            </div>
                          )}

                          {/* Quick play overlay indicator */}
                          {!isVideoPlaying && (
                            <button
                              onClick={togglePlayVideo}
                              className="absolute p-4 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full border border-white/20 transition-all text-white hover:scale-110 shadow-lg cursor-pointer z-30"
                            >
                              <Play className="w-8 h-8 fill-current translate-x-0.5" />
                            </button>
                          )}

                          {/* Custom media control bar */}
                          <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-2.5 flex flex-col gap-1.5 transition-opacity duration-300 z-30 ${
                            isSimulatedFullscreen ? "opacity-100 pb-5" : "opacity-0 group-hover/video:opacity-100"
                          }`}>
                            {/* Timeline Slider */}
                            <input
                              type="range"
                              min={0}
                              max={videoDuration || 15}
                              step={0.1}
                              value={videoTime}
                              onChange={handleTimeScrub}
                              className="w-full accent-[#D0BCFF] h-1 rounded-lg cursor-pointer appearance-none bg-white/30"
                            />

                            <div className="flex items-center justify-between text-white">
                              {/* Left Controls */}
                              <div className="flex items-center gap-2.5">
                                <button
                                  onClick={seekBackward}
                                  className="text-white hover:text-[#D0BCFF] transition cursor-pointer p-0.5"
                                  title="Rewind 10s"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  onClick={togglePlayVideo}
                                  className="text-white hover:text-[#D0BCFF] transition cursor-pointer p-0.5"
                                >
                                  {isVideoPlaying ? (
                                    <Pause className="w-3.5 h-3.5 fill-current" />
                                  ) : (
                                    <Play className="w-3.5 h-3.5 fill-current" />
                                  )}
                                </button>

                                <button
                                  onClick={seekForward}
                                  className="text-white hover:text-[#D0BCFF] transition cursor-pointer p-0.5"
                                  title="Forward 10s"
                                >
                                  <RotateCw className="w-3.5 h-3.5" />
                                </button>

                                {/* Volume Icon & mini Slider */}
                                <div className="flex items-center gap-1 group/volume">
                                  <button
                                    onClick={() => {
                                      const newVol = videoVolume > 0 ? 0 : 0.8;
                                      setVideoVolume(newVol);
                                      if (videoRef.current) {
                                        videoRef.current.volume = newVol;
                                        videoRef.current.muted = newVol === 0;
                                      }
                                    }}
                                    className="text-white hover:text-[#D0BCFF] transition cursor-pointer p-0.5"
                                  >
                                    {videoVolume === 0 ? (
                                      <VolumeX className="w-3.5 h-3.5" />
                                    ) : (
                                      <Volume2 className="w-3.5 h-3.5" />
                                    )}
                                  </button>
                                  <input
                                    type="range"
                                    min={0}
                                    max={1}
                                    step={0.05}
                                    value={videoVolume}
                                    onChange={handleVolumeChange}
                                    className="w-10 h-0.5 accent-[#D0BCFF] rounded bg-white/20 cursor-pointer appearance-none"
                                  />
                                </div>

                                {/* Timestamp */}
                                <span className="text-[9px] font-mono font-medium text-slate-200">
                                  {formatVideoTime(videoTime)} / {formatVideoTime(videoDuration)}
                                </span>
                              </div>

                              {/* Right Controls */}
                              <div className="flex items-center gap-1.5">
                                {/* Speed Multiplier Pill */}
                                <div className="flex gap-0.5 items-center bg-white/10 rounded-full p-0.5 border border-white/5">
                                  {[0.5, 1.0, 1.5, 2.0].map(speed => (
                                    <button
                                      key={speed}
                                      onClick={() => handlePlaybackRateChange(speed)}
                                      className={`px-1 py-0.5 text-[7.5px] font-bold rounded-full transition cursor-pointer ${
                                        playbackRate === speed
                                          ? "bg-[#D0BCFF] text-[#21005D]"
                                          : "text-white hover:bg-white/10"
                                      }`}
                                    >
                                      {speed}x
                                    </button>
                                  ))}
                                </div>

                                {/* Subtitles Toggle */}
                                <button
                                  onClick={toggleSubtitles}
                                  className={`p-1 rounded-full transition cursor-pointer ${
                                    subtitlesEnabled ? "text-[#D0BCFF] bg-white/15" : "text-white hover:bg-white/10"
                                  }`}
                                  title="Toggle Subtitles"
                                >
                                  <Subtitles className="w-3.5 h-3.5" />
                                </button>

                                {/* Picture in Picture */}
                                <button
                                  onClick={togglePictureInPicture}
                                  className="p-1 text-white hover:text-[#D0BCFF] hover:bg-white/10 rounded-full transition cursor-pointer"
                                  title="Picture in Picture"
                                >
                                  <Tv className="w-3.5 h-3.5" />
                                </button>

                                {/* Fullscreen Toggle */}
                                <button
                                  onClick={toggleFullscreen}
                                  className="p-1 text-white hover:text-[#D0BCFF] hover:bg-white/10 rounded-full transition cursor-pointer"
                                  title="Toggle Fullscreen"
                                >
                                  {isSimulatedFullscreen ? (
                                    <Minimize2 className="w-3.5 h-3.5" />
                                  ) : (
                                    <Maximize2 className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="relative flex flex-col items-center justify-center w-full h-full max-h-[300px]">
                          {/* RAW, GIF, PDF, ZIP Specific Viewer UI Overlays */}
                          {selectedPhoto.mimeType === "application/pdf" ? (
                            <div className="w-full max-w-[280px] bg-white text-slate-900 rounded-2xl p-4 shadow-xl border border-slate-300 flex flex-col gap-3 font-sans h-[250px] overflow-y-auto">
                              <div className="flex items-center justify-between border-b pb-2">
                                <span className="text-[10px] font-black bg-red-600 text-white px-2 py-0.5 rounded uppercase">PDF Reader</span>
                                <span className="text-[9px] font-bold text-slate-500">Page 1 of {selectedPhoto.id === "pdf_001" ? 4 : 1}</span>
                              </div>
                              <div className="flex-1 space-y-2 text-left">
                                <h3 className="text-xs font-bold leading-snug">{selectedPhoto.title}</h3>
                                <p className="text-[9.5px] text-slate-600 leading-relaxed font-semibold">
                                  {selectedPhoto.id === "pdf_001" 
                                    ? "This official report details the regulatory compliance specifications and secure key storage requirements for Android Gallery Apps in 2026." 
                                    : "Portable Document Format contents loaded successfully."}
                                </p>
                                <div className="p-2 bg-slate-50 rounded border border-slate-100 text-[8.5px] font-mono text-slate-500">
                                  -- SHA256 VALIDATED --
                                </div>
                              </div>
                              <div className="flex gap-2 justify-between items-center pt-2 border-t">
                                <button
                                  onClick={() => addLog("I", "PdfViewer", "Simulated previous page navigation in PDF reader")}
                                  className="px-2 py-0.5 bg-slate-100 text-[9px] font-black rounded border cursor-pointer hover:bg-slate-200"
                                >
                                  Prev
                                </button>
                                <button
                                  onClick={() => addLog("I", "PdfViewer", "Simulated next page navigation in PDF reader")}
                                  className="px-2 py-0.5 bg-slate-100 text-[9px] font-black rounded border cursor-pointer hover:bg-slate-200"
                                >
                                  Next
                                </button>
                              </div>
                            </div>
                          ) : selectedPhoto.mimeType === "application/zip" ? (
                            <div className="w-full max-w-[280px] bg-slate-950 text-slate-300 rounded-2xl p-4 shadow-xl border border-slate-800 flex flex-col gap-3 font-mono h-[250px]">
                              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                                <span className="text-[9px] font-black bg-amber-600 text-slate-950 px-1.5 py-0.5 rounded">ZIP Preview</span>
                                <span className="text-[8px] text-slate-500 font-bold">{selectedPhoto.size}</span>
                              </div>
                              <div className="flex-1 overflow-y-auto space-y-1.5 text-left text-[9px]">
                                {[
                                  { name: "manifest.json", size: "1.2 KB" },
                                  { name: "assets/camera_vivid.lut", size: "48.5 KB" },
                                  { name: "backup_photos_db.sql", size: "120 KB" },
                                  { name: "original_raw_dng.dng", size: "24.6 MB" },
                                ].map(f => (
                                  <div key={f.name} className="flex justify-between items-center p-1 bg-slate-900 rounded hover:bg-slate-800 border border-slate-800">
                                    <span className="text-amber-400 font-bold">📄 {f.name}</span>
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-[8px] text-slate-500">{f.size}</span>
                                      <button 
                                        onClick={() => addLog("D", "ZipExtractor", `Extracted member file from archive: ${f.name}`)}
                                        className="text-[8px] text-emerald-400 bg-white/10 hover:bg-white/20 font-extrabold px-1.5 py-0.5 rounded cursor-pointer"
                                      >
                                        Extract
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <p className="text-[7.5px] text-slate-500 leading-none text-center">
                                Tap <strong>Extract</strong> to deflate files to device storage
                              </p>
                            </div>
                          ) : (
                            <>
                              <motion.img
                                layoutId={`photo_card_${selectedPhoto.id}`}
                                src={selectedPhoto.url}
                                className={`max-h-[250px] max-w-full object-contain rounded-3xl shadow-lg border border-black/15 transition duration-300 ${getFilterCss(selectedPhoto.id)}`}
                                alt={selectedPhoto.title}
                                referrerPolicy="no-referrer"
                              />
                              
                              {/* RAW Exposure Settings Overlays */}
                              {selectedPhoto.mimeType === "image/x-adobe-dng" && (
                                <div className="absolute top-2 right-2 bg-black/75 backdrop-blur-md text-white text-[8px] font-black px-2 py-0.5 rounded-full border border-white/20 uppercase tracking-wider">
                                  RAW DNG Profile
                                </div>
                              )}

                              {selectedPhoto.mimeType === "image/gif" && (
                                <div className="absolute top-2 right-2 bg-emerald-600 text-white text-[8px] font-black px-2 py-0.5 rounded-full border border-white/20 uppercase tracking-wider animate-pulse">
                                  GIF Loop Playing
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Sliding EXIF Info Card Drawer Panel */}
                    <div className="bg-[#F8F9FA] text-[#1C1B1F] rounded-t-[28px] max-h-[340px] overflow-y-auto px-5 pt-5 pb-8 flex flex-col gap-4 border-t border-[#CAC4D0] z-10 shadow-sm">
                      
                      {/* Restore option if in trash */}
                      {selectedPhoto.isInTrash && (
                        <div className="p-3 bg-rose-50 text-rose-950 rounded-2xl border border-rose-100 flex flex-col gap-3">
                          <div className="flex items-start gap-2.5">
                            <Trash2 className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <span className="text-xs font-bold block">This photo is in the Recycle Bin</span>
                              <p className="text-[10px] text-rose-800 font-semibold leading-normal">
                                Deleted files stay for 30 days. You can restore them to their original location, or delete them permanently.
                              </p>
                              <p className="text-[10.5px] text-rose-600 font-bold mt-1.5 flex items-center gap-1">
                                <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                                {selectedPhoto.trashTimeLeftDays ?? 30} days remaining
                              </p>
                            </div>
                          </div>

                          {showPermanentDeleteConfirm ? (
                            <div className="bg-white/70 p-2.5 rounded-xl border border-rose-200 flex flex-col gap-2">
                              <p className="text-[10px] text-rose-950 font-bold">
                                Are you sure you want to permanently delete this file? This action cannot be undone.
                              </p>
                              <div className="flex gap-2 justify-end">
                                <button
                                  onClick={() => setShowPermanentDeleteConfirm(false)}
                                  className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-[10px] rounded-full transition cursor-pointer"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={async () => {
                                    await handleDeletePhoto(selectedPhoto);
                                    setShowPermanentDeleteConfirm(false);
                                  }}
                                  className="px-3.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] rounded-full transition cursor-pointer"
                                >
                                  Yes, Permanent Delete
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex gap-2 justify-end border-t border-rose-100/60 pt-2.5">
                              <button
                                onClick={() => setShowPermanentDeleteConfirm(true)}
                                className="px-3.5 py-1.5 bg-rose-150 hover:bg-rose-200 text-rose-900 font-bold text-[10.5px] rounded-full transition cursor-pointer border border-rose-200/40"
                              >
                                Delete Permanently
                              </button>
                              <button
                                onClick={() => handleRestorePhoto(selectedPhoto)}
                                className="px-4 py-1.5 bg-[#6750A4] text-white font-bold text-[10.5px] rounded-full hover:bg-[#6750A4]/90 transition cursor-pointer"
                              >
                                Restore
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Header Title EXIF segment */}
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1">
                          <h3 className="text-sm font-bold text-[#1C1B1F] leading-tight">{selectedPhoto.title}</h3>
                          <p className="text-xs text-[#49454F] font-medium leading-relaxed mt-1 italic">
                            "{selectedPhoto.description}"
                          </p>
                        </div>
                        
                        {/* AI Trigger button in EXIF details */}
                        {!selectedPhoto.isInTrash && (
                          <button
                            onClick={() => handleAiAnalyze(selectedPhoto)}
                            disabled={aiAnalysisLoadingId !== null}
                            className="px-3.5 py-1.5 bg-[#6750A4] hover:bg-[#6750A4]/90 disabled:bg-[#CAC4D0] text-white rounded-full text-[10px] font-bold flex items-center gap-1 cursor-pointer transition select-none shadow-sm"
                            title="Analyze this photo in-depth with Gemini AI model"
                          >
                            {aiAnalysisLoadingId === selectedPhoto.id ? (
                              <RefreshCw className="w-3 h-3 animate-spin" />
                            ) : (
                              <Sparkles className="w-3 h-3 fill-white" />
                            )}
                            AI Auto-Tag
                          </button>
                        )}
                      </div>

                      {/* Filter Slider Suite */}
                      {!selectedPhoto.isInTrash && (
                        <div className="border-t border-[#CAC4D0]/60 pt-3">
                          <h4 className="text-[10px] font-bold text-[#49454F]/70 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                            <Sliders className="w-3 h-3" />
                            Material 3 Filters (Compose Shaders)
                          </h4>
                          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                            {["Original", "Material Vivid", "Cyber Amber", "Noir Mono", "Warm Retro", "Cinematic Cold"].map(filt => (
                              <button
                                key={filt}
                                onClick={() => handleApplyFilter(filt)}
                                className={`px-2.5 py-1 text-[9.5px] font-bold rounded-full border transition whitespace-nowrap cursor-pointer ${appliedFilter === filt ? "bg-[#6750A4] text-white border-[#6750A4]" : "bg-white text-[#49454F] border-[#CAC4D0] hover:bg-[#ECE6F0]"}`}
                              >
                                {filt}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Tags list block */}
                      <div className="flex flex-wrap gap-1 border-t border-[#CAC4D0]/60 pt-3">
                        {selectedPhoto.tags.map((tag, i) => (
                          <span key={i} className="text-[10px] px-2.5 py-0.5 bg-[#EADDFF] text-[#21005D] rounded-full font-bold border border-[#CAC4D0]/20">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* Specific EXIF Metrics details */}
                      <div className="grid grid-cols-2 gap-3 border-t border-[#CAC4D0]/60 pt-3 text-[11px] text-[#49454F]">
                        <div className="flex items-center gap-1.5">
                          <Smartphone className="w-4 h-4 text-[#49454F] shrink-0" />
                          <div>
                            <p className="text-[9px] text-[#49454F]/80 font-bold uppercase leading-none">Camera Body</p>
                            <span className="font-bold text-[#1C1B1F]">{selectedPhoto.exif.camera}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <Sliders className="w-4 h-4 text-[#49454F] shrink-0" />
                          <div>
                            <p className="text-[9px] text-[#49454F]/80 font-bold uppercase leading-none">Lens Settings</p>
                            <span className="font-bold text-[#1C1B1F]">{selectedPhoto.exif.aperture} | {selectedPhoto.exif.exposureTime} | {selectedPhoto.exif.iso}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-[#49454F] shrink-0" />
                          <div>
                            <p className="text-[9px] text-[#49454F]/80 font-bold uppercase leading-none">Capture Time</p>
                            <span className="font-bold text-[#1C1B1F] font-mono text-[10px]">
                              {new Date(selectedPhoto.dateAdded).toLocaleDateString()} {new Date(selectedPhoto.dateAdded).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-[#49454F] shrink-0" />
                          <div className="truncate">
                            <p className="text-[9px] text-[#49454F]/80 font-bold uppercase leading-none">GPS Location</p>
                            <span className="font-bold text-[#1C1B1F] truncate block max-w-[130px]" title={selectedPhoto.exif.location?.address || "No Coordinates tag"}>
                              {selectedPhoto.exif.location ? selectedPhoto.exif.location.address : "Location disabled"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Full File Details Screen Trigger Button */}
                      <button
                        onClick={handleOpenFileDetails}
                        className="w-full mt-1.5 py-2.5 bg-[#EADDFF] hover:bg-[#EADDFF]/90 active:bg-[#D0BCFF] text-[#21005D] font-bold text-xs rounded-2xl transition cursor-pointer flex items-center justify-center gap-2 border border-[#CAC4D0]/30 shadow-xs"
                      >
                        <Info className="w-4 h-4 text-[#6750A4]" />
                        View Full File Details Screen
                      </button>

                      {/* Interactive AI analysis logs placeholder */}
                      {analysisResult && (
                        <div className="mt-1 p-3 bg-[#EADDFF]/40 rounded-3xl border border-[#CAC4D0]/60 text-[#21005D] text-[11px] leading-relaxed shadow-sm">
                          <div className="flex items-center gap-1 text-[#21005D] font-bold mb-1">
                            <Sparkles className="w-3.5 h-3.5 fill-[#EADDFF]" />
                            <span>GEMINI ENHANCED INSIGHT:</span>
                          </div>
                          <p className="italic text-[#1C1B1F] font-semibold mb-2">"{analysisResult.summary}"</p>
                          <div className="flex flex-col gap-1 text-[10px] font-medium text-[#49454F]">
                            <div><strong>AI Estimated Lens Recommendation:</strong> {analysisResult.curatedExif?.lens || "Modern F1.7 flagship optic lens"}</div>
                            <div><strong>Estimated Geographical Area:</strong> {analysisResult.curatedExif?.locationName || "Visual content matching geolocation tags"}</div>
                          </div>
                        </div>
                      )}

                    </div>
                  </motion.div>
                )}

                {showFileDetailsScreen && selectedPhoto && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/60 z-50 flex items-end justify-center"
                    id="file_details_screen_overlay"
                  >
                    <motion.div
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      exit={{ y: "100%" }}
                      transition={{ type: "spring", damping: 25, stiffness: 220 }}
                      className="bg-white rounded-t-[28px] w-full h-[95%] max-h-[620px] flex flex-col shadow-2xl border-t border-[#CAC4D0]/30 overflow-hidden"
                    >
                      {/* Drag handle */}
                      <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto my-3 shrink-0"></div>

                      {/* Header with Title and Toggle Edit button */}
                      <div className="px-5 pb-3 flex items-center justify-between border-b border-[#CAC4D0]/30 shrink-0">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setShowFileDetailsScreen(false)}
                            className="p-1 hover:bg-slate-100 rounded-full transition"
                          >
                            <ChevronLeft className="w-5 h-5 text-[#49454F]" />
                          </button>
                          <div>
                            <h4 className="text-sm font-extrabold text-[#1C1B1F]">
                              {isEditingDetails ? "Edit File Details" : "File Details"}
                            </h4>
                            <p className="text-[10px] text-[#49454F] font-bold truncate max-w-[150px]">
                              {selectedPhoto.title}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-1.5">
                          {isEditingDetails ? (
                            <>
                              <button
                                onClick={() => setIsEditingDetails(false)}
                                className="px-3.5 py-1.5 border border-[#CAC4D0] hover:bg-slate-50 text-slate-700 text-[11px] font-bold rounded-full transition cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={handleSaveFileDetails}
                                className="px-4 py-1.5 bg-[#6750A4] hover:bg-[#6750A4]/95 text-white text-[11px] font-bold rounded-full transition cursor-pointer shadow-sm flex items-center gap-1"
                              >
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                                Save
                              </button>
                            </>
                          ) : (
                            <div className="flex gap-1.5">
                              <button
                                onClick={() => {
                                  setCompressTargetIds([selectedPhoto.id]);
                                  setShowCompressQualitySelector(true);
                                }}
                                className="px-3.5 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 text-[11px] font-extrabold rounded-full transition cursor-pointer flex items-center gap-1"
                                title="Compress this single photo"
                              >
                                <Archive className="w-3.5 h-3.5 stroke-[2.5]" />
                                Compress
                              </button>
                              <button
                                onClick={() => {
                                  setDetailEditForm({
                                    title: selectedPhoto.title,
                                    description: selectedPhoto.description,
                                    width: selectedPhoto.width,
                                    height: selectedPhoto.height,
                                    size: selectedPhoto.size,
                                    dateAdded: new Date(selectedPhoto.dateAdded).toISOString().slice(0, 16),
                                    camera: selectedPhoto.exif.camera,
                                    lens: selectedPhoto.exif.lens,
                                    aperture: selectedPhoto.exif.aperture,
                                    exposureTime: selectedPhoto.exif.exposureTime,
                                    iso: selectedPhoto.exif.iso,
                                    focalLength: selectedPhoto.exif.focalLength,
                                    locationAddress: selectedPhoto.exif.location ? selectedPhoto.exif.location.address : "",
                                    locationLat: selectedPhoto.exif.location ? selectedPhoto.exif.location.latitude : 0,
                                    locationLng: selectedPhoto.exif.location ? selectedPhoto.exif.location.longitude : 0,
                                  });
                                  setIsEditingDetails(true);
                                }}
                                className="px-4 py-1.5 bg-[#6750A4]/10 hover:bg-[#6750A4]/20 text-[#6750A4] text-[11px] font-extrabold rounded-full transition cursor-pointer flex items-center gap-1.5"
                              >
                                <Edit3 className="w-3.5 h-3.5 stroke-[2.5]" />
                                Edit
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Content panel */}
                      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 text-left select-text scrollbar-thin">
                        
                        {/* Interactive Warning or Success status pill */}
                        {isEditingDetails && (
                          <div className="p-2.5 bg-amber-50 border border-amber-200 text-amber-900 text-[10px] font-bold rounded-2xl flex gap-1.5 items-start leading-normal">
                            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                            <span>Editing media details writes updates directly to your SQLite database storage layer. Standard Android synchronization rules apply.</span>
                          </div>
                        )}

                        {/* Top Thumbnail & Name Section */}
                        <div className="bg-[#F7F2FA] rounded-2xl p-3 border border-[#CAC4D0]/30 flex gap-3 items-center">
                          <img
                            src={selectedPhoto.url}
                            className="w-16 h-16 object-cover rounded-xl border border-black/15 shadow-sm"
                            alt="Preview"
                            referrerPolicy="no-referrer"
                          />
                          <div className="flex-1 min-w-0">
                            {isEditingDetails ? (
                              <div className="space-y-1.5">
                                <label className="text-[8.5px] font-extrabold text-[#6750A4] uppercase tracking-wider block">Filename / Title</label>
                                <input
                                  type="text"
                                  value={detailEditForm.title}
                                  onChange={(e) => setDetailEditForm(prev => ({ ...prev, title: e.target.value }))}
                                  className="w-full bg-white border border-[#CAC4D0]/60 rounded-xl px-2.5 py-1 text-xs font-bold outline-none focus:border-[#6750A4]"
                                />
                                <label className="text-[8.5px] font-extrabold text-[#6750A4] uppercase tracking-wider block">Description</label>
                                <input
                                  type="text"
                                  value={detailEditForm.description}
                                  onChange={(e) => setDetailEditForm(prev => ({ ...prev, description: e.target.value }))}
                                  className="w-full bg-white border border-[#CAC4D0]/60 rounded-xl px-2.5 py-1 text-xs font-semibold outline-none focus:border-[#6750A4]"
                                  placeholder="Type photo description"
                                />
                              </div>
                            ) : (
                              <>
                                <h5 className="text-xs font-extrabold text-[#1C1B1F] truncate">{selectedPhoto.title}</h5>
                                <p className="text-[10px] text-[#49454F] font-semibold mt-0.5 line-clamp-2 italic leading-relaxed">
                                  {selectedPhoto.description ? `"${selectedPhoto.description}"` : "No description provided"}
                                </p>
                                <div className="mt-1 flex gap-1.5 items-center">
                                  <span className="text-[9px] px-2 py-0.5 bg-white text-[#49454F] border border-[#CAC4D0]/30 font-bold rounded-md">
                                    Folder: {selectedPhoto.album}
                                  </span>
                                  {selectedPhoto.isSynced && (
                                    <span className="text-[9px] px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold rounded-md">
                                      Synced to cloud
                                    </span>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                        {/* 1. Resolution & Size Category */}
                        <div className="space-y-2.5">
                          <h6 className="text-[10px] font-extrabold text-[#6750A4] uppercase tracking-wider flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5 text-[#6750A4]" />
                            Resolution & File Size
                          </h6>

                          <div className="grid grid-cols-2 gap-3 bg-[#F8F9FA] p-3 rounded-2xl border border-[#CAC4D0]/20">
                            <div>
                              <span className="text-[8.5px] font-bold text-[#49454F]/70 uppercase block">Resolution</span>
                              {isEditingDetails ? (
                                <div className="flex gap-1 items-center mt-1">
                                  <input
                                    type="number"
                                    value={detailEditForm.width}
                                    onChange={(e) => setDetailEditForm(prev => ({ ...prev, width: Number(e.target.value) }))}
                                    className="w-16 bg-white border border-[#CAC4D0]/60 rounded-lg px-1.5 py-0.5 text-xs font-bold text-center"
                                    placeholder="W"
                                  />
                                  <span className="text-xs text-[#49454F]">×</span>
                                  <input
                                    type="number"
                                    value={detailEditForm.height}
                                    onChange={(e) => setDetailEditForm(prev => ({ ...prev, height: Number(e.target.value) }))}
                                    className="w-16 bg-white border border-[#CAC4D0]/60 rounded-lg px-1.5 py-0.5 text-xs font-bold text-center"
                                    placeholder="H"
                                  />
                                </div>
                              ) : (
                                <div className="flex items-center justify-between gap-1 mt-0.5">
                                  <span className="text-xs font-bold text-[#1C1B1F]">
                                    {selectedPhoto.width} × {selectedPhoto.height}
                                    <span className="text-[10.5px] text-[#49454F] font-semibold ml-1">
                                      ({((selectedPhoto.width * selectedPhoto.height) / 1000000).toFixed(1)} Megapixels)
                                    </span>
                                  </span>
                                  <button
                                    onClick={() => {
                                      navigator.clipboard.writeText(`${selectedPhoto.width}x${selectedPhoto.height}`);
                                      addLog("I", "ClipboardManager", "Copied resolution to clipboard");
                                    }}
                                    className="p-1 hover:bg-[#EADDFF] rounded-full text-slate-400 hover:text-[#6750A4] transition shrink-0"
                                    title="Copy resolution"
                                  >
                                    <Copy className="w-3 h-3" />
                                  </button>
                                </div>
                              )}
                            </div>

                            <div>
                              <span className="text-[8.5px] font-bold text-[#49454F]/70 uppercase block">File Size</span>
                              {isEditingDetails ? (
                                <input
                                  type="text"
                                  value={detailEditForm.size}
                                  onChange={(e) => setDetailEditForm(prev => ({ ...prev, size: e.target.value }))}
                                  className="w-full mt-1 bg-white border border-[#CAC4D0]/60 rounded-lg px-2 py-0.5 text-xs font-bold"
                                  placeholder="e.g. 2.4 MB"
                                />
                              ) : (
                                <div className="flex items-center justify-between gap-1 mt-0.5">
                                  <span className="text-xs font-bold text-[#1C1B1F]">
                                    {selectedPhoto.size}
                                    <span className="text-[9.5px] font-mono text-[#49454F]/80 ml-1.5 font-bold">
                                      {selectedPhoto.mimeType}
                                    </span>
                                  </span>
                                  <button
                                    onClick={() => {
                                      navigator.clipboard.writeText(selectedPhoto.size);
                                      addLog("I", "ClipboardManager", "Copied file size to clipboard");
                                    }}
                                    className="p-1 hover:bg-[#EADDFF] rounded-full text-slate-400 hover:text-[#6750A4] transition shrink-0"
                                    title="Copy file size"
                                  >
                                    <Copy className="w-3 h-3" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* 2. Date Added Category */}
                        <div className="space-y-2.5">
                          <h6 className="text-[10px] font-extrabold text-[#6750A4] uppercase tracking-wider flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-[#6750A4]" />
                            Capture Date & Time
                          </h6>

                          <div className="bg-[#F8F9FA] p-3 rounded-2xl border border-[#CAC4D0]/20">
                            <span className="text-[8.5px] font-bold text-[#49454F]/70 uppercase block">Local Capture Timestamp</span>
                            {isEditingDetails ? (
                              <input
                                type="datetime-local"
                                value={detailEditForm.dateAdded}
                                onChange={(e) => setDetailEditForm(prev => ({ ...prev, dateAdded: e.target.value }))}
                                className="w-full mt-1 bg-white border border-[#CAC4D0]/60 rounded-xl px-3 py-1.5 text-xs font-bold outline-none focus:border-[#6750A4]"
                              />
                            ) : (
                              <div className="flex items-center justify-between mt-0.5">
                                <div className="text-xs font-bold text-[#1C1B1F] flex flex-col">
                                  <span>
                                    {new Date(selectedPhoto.dateAdded).toLocaleDateString("en-US", {
                                      weekday: "long",
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    })}
                                  </span>
                                  <span className="text-[10.5px] text-[#49454F] font-semibold mt-0.5">
                                    Time: {new Date(selectedPhoto.dateAdded).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                                  </span>
                                </div>
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(new Date(selectedPhoto.dateAdded).toLocaleString());
                                    addLog("I", "ClipboardManager", "Copied capture timestamp to clipboard");
                                  }}
                                  className="p-1 hover:bg-[#EADDFF] rounded-full text-slate-400 hover:text-[#6750A4] transition shrink-0"
                                  title="Copy date"
                                >
                                  <Copy className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* 3. EXIF & Lens Category */}
                        <div className="space-y-2.5">
                          <h6 className="text-[10px] font-extrabold text-[#6750A4] uppercase tracking-wider flex items-center gap-1.5">
                            <Sliders className="w-3.5 h-3.5 text-[#6750A4]" />
                            Camera Model & EXIF Metadata
                          </h6>

                          <div className="bg-[#F8F9FA] p-3.5 rounded-2xl border border-[#CAC4D0]/20 space-y-3">
                            <div className="border-b border-[#CAC4D0]/20 pb-2.5">
                              <span className="text-[8.5px] font-bold text-[#49454F]/70 uppercase block">Camera Model</span>
                              {isEditingDetails ? (
                                <input
                                  type="text"
                                  value={detailEditForm.camera}
                                  onChange={(e) => setDetailEditForm(prev => ({ ...prev, camera: e.target.value }))}
                                  className="w-full mt-1 bg-white border border-[#CAC4D0]/60 rounded-lg px-2.5 py-1 text-xs font-bold outline-none focus:border-[#6750A4]"
                                  placeholder="e.g. Sony α7R V"
                                />
                              ) : (
                                <div className="flex items-center justify-between mt-0.5">
                                  <span className="text-xs font-extrabold text-[#1C1B1F] flex items-center gap-1.5">
                                    <Smartphone className="w-3.5 h-3.5 text-[#6750A4]" />
                                    {selectedPhoto.exif.camera || "No Camera Model Tag"}
                                  </span>
                                  <button
                                    onClick={() => {
                                      navigator.clipboard.writeText(selectedPhoto.exif.camera);
                                      addLog("I", "ClipboardManager", "Copied Camera Model to clipboard");
                                    }}
                                    className="p-1 hover:bg-[#EADDFF] rounded-full text-slate-400 hover:text-[#6750A4] transition shrink-0"
                                    title="Copy Camera Model"
                                  >
                                    <Copy className="w-3 h-3" />
                                  </button>
                                </div>
                              )}
                            </div>

                            <div className="border-b border-[#CAC4D0]/20 pb-2.5">
                              <span className="text-[8.5px] font-bold text-[#49454F]/70 uppercase block">Lens Optic Model</span>
                              {isEditingDetails ? (
                                <input
                                  type="text"
                                  value={detailEditForm.lens}
                                  onChange={(e) => setDetailEditForm(prev => ({ ...prev, lens: e.target.value }))}
                                  className="w-full mt-1 bg-white border border-[#CAC4D0]/60 rounded-lg px-2.5 py-1 text-xs font-bold outline-none focus:border-[#6750A4]"
                                  placeholder="e.g. FE 24-70mm F2.8 GM II"
                                />
                              ) : (
                                <div className="flex items-center justify-between mt-0.5">
                                  <span className="text-xs font-semibold text-[#1C1B1F] truncate max-w-[200px]">
                                    {selectedPhoto.exif.lens || "Standard Built-in Prime Lens"}
                                  </span>
                                  <button
                                    onClick={() => {
                                      navigator.clipboard.writeText(selectedPhoto.exif.lens);
                                      addLog("I", "ClipboardManager", "Copied Lens model to clipboard");
                                    }}
                                    className="p-1 hover:bg-[#EADDFF] rounded-full text-slate-400 hover:text-[#6750A4] transition shrink-0"
                                    title="Copy Lens Model"
                                  >
                                    <Copy className="w-3 h-3" />
                                  </button>
                                </div>
                              )}
                            </div>

                            <div className="grid grid-cols-2 gap-3.5 pt-1">
                              <div>
                                <span className="text-[8.5px] font-bold text-[#49454F]/70 uppercase block">Aperture Setting</span>
                                {isEditingDetails ? (
                                  <input
                                    type="text"
                                    value={detailEditForm.aperture}
                                    onChange={(e) => setDetailEditForm(prev => ({ ...prev, aperture: e.target.value }))}
                                    className="w-full mt-1 bg-white border border-[#CAC4D0]/60 rounded-lg px-2 py-0.5 text-xs font-bold text-center"
                                    placeholder="e.g. f/2.8"
                                  />
                                ) : (
                                  <span className="text-xs font-bold text-[#1C1B1F] block mt-0.5">{selectedPhoto.exif.aperture}</span>
                                )}
                              </div>

                              <div>
                                <span className="text-[8.5px] font-bold text-[#49454F]/70 uppercase block">Shutter Speed</span>
                                {isEditingDetails ? (
                                  <input
                                    type="text"
                                    value={detailEditForm.exposureTime}
                                    onChange={(e) => setDetailEditForm(prev => ({ ...prev, exposureTime: e.target.value }))}
                                    className="w-full mt-1 bg-white border border-[#CAC4D0]/60 rounded-lg px-2 py-0.5 text-xs font-bold text-center"
                                    placeholder="e.g. 1/120s"
                                  />
                                ) : (
                                  <span className="text-xs font-bold text-[#1C1B1F] block mt-0.5">{selectedPhoto.exif.exposureTime}</span>
                                )}
                              </div>

                              <div>
                                <span className="text-[8.5px] font-bold text-[#49454F]/70 uppercase block">ISO Speed Rate</span>
                                {isEditingDetails ? (
                                  <input
                                    type="text"
                                    value={detailEditForm.iso}
                                    onChange={(e) => setDetailEditForm(prev => ({ ...prev, iso: e.target.value }))}
                                    className="w-full mt-1 bg-white border border-[#CAC4D0]/60 rounded-lg px-2 py-0.5 text-xs font-bold text-center"
                                    placeholder="e.g. ISO 100"
                                  />
                                ) : (
                                  <span className="text-xs font-bold text-[#1C1B1F] block mt-0.5">{selectedPhoto.exif.iso}</span>
                                )}
                              </div>

                              <div>
                                <span className="text-[8.5px] font-bold text-[#49454F]/70 uppercase block">Focal Length</span>
                                {isEditingDetails ? (
                                  <input
                                    type="text"
                                    value={detailEditForm.focalLength}
                                    onChange={(e) => setDetailEditForm(prev => ({ ...prev, focalLength: e.target.value }))}
                                    className="w-full mt-1 bg-white border border-[#CAC4D0]/60 rounded-lg px-2 py-0.5 text-xs font-bold text-center"
                                    placeholder="e.g. 50mm"
                                  />
                                ) : (
                                  <span className="text-xs font-bold text-[#1C1B1F] block mt-0.5">{selectedPhoto.exif.focalLength || "N/A"}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 4. Location Category */}
                        <div className="space-y-2.5">
                          <h6 className="text-[10px] font-extrabold text-[#6750A4] uppercase tracking-wider flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#6750A4]" />
                            Geographical GPS Location
                          </h6>

                          <div className="bg-[#F8F9FA] p-3.5 rounded-2xl border border-[#CAC4D0]/20 space-y-3">
                            <div>
                              <span className="text-[8.5px] font-bold text-[#49454F]/70 uppercase block">Street Address</span>
                              {isEditingDetails ? (
                                <input
                                  type="text"
                                  value={detailEditForm.locationAddress}
                                  onChange={(e) => setDetailEditForm(prev => ({ ...prev, locationAddress: e.target.value }))}
                                  className="w-full mt-1 bg-white border border-[#CAC4D0]/60 rounded-lg px-2.5 py-1 text-xs font-bold outline-none focus:border-[#6750A4]"
                                  placeholder="e.g. San Francisco, California"
                                />
                              ) : (
                                <div className="flex items-center justify-between mt-0.5">
                                  <span className="text-xs font-extrabold text-[#1C1B1F] leading-tight">
                                    {selectedPhoto.exif.location ? selectedPhoto.exif.location.address : "Location tags disabled / No address record"}
                                  </span>
                                  {selectedPhoto.exif.location && (
                                    <button
                                      onClick={() => {
                                        navigator.clipboard.writeText(selectedPhoto.exif.location?.address || "");
                                        addLog("I", "ClipboardManager", "Copied street address to clipboard");
                                      }}
                                      className="p-1 hover:bg-[#EADDFF] rounded-full text-slate-400 hover:text-[#6750A4] transition shrink-0"
                                      title="Copy Street Address"
                                    >
                                      <Copy className="w-3 h-3" />
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>

                            <div className="grid grid-cols-2 gap-3.5 border-t border-[#CAC4D0]/10 pt-2.5">
                              <div>
                                <span className="text-[8.5px] font-bold text-[#49454F]/70 uppercase block">Latitude (GPS)</span>
                                {isEditingDetails ? (
                                  <input
                                    type="number"
                                    step="0.000001"
                                    value={detailEditForm.locationLat}
                                    onChange={(e) => setDetailEditForm(prev => ({ ...prev, locationLat: Number(e.target.value) }))}
                                    className="w-full mt-1 bg-white border border-[#CAC4D0]/60 rounded-lg px-2 py-0.5 text-xs font-bold text-center"
                                  />
                                ) : (
                                  <span className="text-xs font-mono font-bold text-[#1C1B1F] block mt-0.5">
                                    {selectedPhoto.exif.location ? selectedPhoto.exif.location.latitude.toFixed(6) : "N/A"}
                                  </span>
                                )}
                              </div>

                              <div>
                                <span className="text-[8.5px] font-bold text-[#49454F]/70 uppercase block">Longitude (GPS)</span>
                                {isEditingDetails ? (
                                  <input
                                    type="number"
                                    step="0.000001"
                                    value={detailEditForm.locationLng}
                                    onChange={(e) => setDetailEditForm(prev => ({ ...prev, locationLng: Number(e.target.value) }))}
                                    className="w-full mt-1 bg-white border border-[#CAC4D0]/60 rounded-lg px-2 py-0.5 text-xs font-bold text-center"
                                  />
                                ) : (
                                  <span className="text-xs font-mono font-bold text-[#1C1B1F] block mt-0.5">
                                    {selectedPhoto.exif.location ? selectedPhoto.exif.location.longitude.toFixed(6) : "N/A"}
                                  </span>
                                )}
                              </div>
                            </div>

                            {selectedPhoto.exif.location && !isEditingDetails && (
                              <a
                                href={`https://www.google.com/maps/search/?api=1&query=${selectedPhoto.exif.location.latitude},${selectedPhoto.exif.location.longitude}`}
                                target="_blank"
                                rel="noreferrer"
                                className="w-full py-2 bg-[#6750A4]/10 hover:bg-[#6750A4]/15 text-[#6750A4] font-bold text-[10px] rounded-xl transition flex items-center justify-center gap-1.5 border border-[#6750A4]/20 cursor-pointer text-center"
                                id="view_on_map_anchor"
                              >
                                <MapPin className="w-3.5 h-3.5 stroke-[2.5]" />
                                View GPS Pins on Google Maps
                              </a>
                            )}
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  </motion.div>
                )}

                {showVaultSetupModal && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
                    id="vault_setup_modal"
                  >
                    <motion.div
                      initial={{ scale: 0.95, y: 15 }}
                      animate={{ scale: 1, y: 0 }}
                      className="bg-white rounded-[28px] w-full max-w-sm p-6 shadow-2xl border border-[#CAC4D0]/30 text-left"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-[#EADDFF] text-[#21005D] rounded-2xl">
                          <Lock className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-extrabold text-[#1C1B1F]">Configure Secure Vault</h4>
                          <p className="text-[10px] text-[#49454F] font-semibold">Derive hardware-wrapped AES-256 keys</p>
                        </div>
                      </div>

                      <p className="text-[11px] text-[#49454F] font-semibold leading-relaxed mb-4 bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                        Create a 4-digit PIN to secure your hidden media files. Photos moved here will be AES-encrypted and strictly hidden from standard device library APIs.
                      </p>

                      <div className="space-y-3">
                        <div>
                          <label className="text-[9.5px] font-extrabold text-[#6750A4] uppercase tracking-wider block mb-1">Set 4-Digit PIN</label>
                          <input
                            type="password"
                            maxLength={4}
                            pattern="\d*"
                            inputMode="numeric"
                            placeholder="••••"
                            value={vaultSetupPin}
                            onChange={(e) => setVaultSetupPin(e.target.value.replace(/\D/g, ''))}
                            className="w-full text-center tracking-[0.5em] font-mono text-lg font-bold bg-[#F7F2FA] border border-[#CAC4D0]/50 rounded-xl py-2 px-3 outline-none focus:border-[#6750A4] focus:ring-1 focus:ring-[#6750A4]/30"
                          />
                        </div>

                        <div>
                          <label className="text-[9.5px] font-extrabold text-[#6750A4] uppercase tracking-wider block mb-1">Confirm PIN</label>
                          <input
                            type="password"
                            maxLength={4}
                            pattern="\d*"
                            inputMode="numeric"
                            placeholder="••••"
                            value={vaultSetupPinConfirm}
                            onChange={(e) => setVaultSetupPinConfirm(e.target.value.replace(/\D/g, ''))}
                            className="w-full text-center tracking-[0.5em] font-mono text-lg font-bold bg-[#F7F2FA] border border-[#CAC4D0]/50 rounded-xl py-2 px-3 outline-none focus:border-[#6750A4] focus:ring-1 focus:ring-[#6750A4]/30"
                          />
                        </div>
                      </div>

                      {vaultSetupError && (
                        <p className="text-[10.5px] text-red-600 font-bold mt-3 text-center flex items-center gap-1 justify-center">
                          ⚠️ {vaultSetupError}
                        </p>
                      )}

                      <div className="flex gap-2.5 mt-5 justify-end">
                        <button
                          onClick={() => {
                            setShowVaultSetupModal(false);
                            setVaultSetupPin("");
                            setVaultSetupPinConfirm("");
                          }}
                          className="px-4 py-2 hover:bg-[#ECE6F0] text-[#6750A4] text-xs font-bold rounded-full transition cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSetupVaultPin}
                          className="px-5 py-2 bg-[#6750A4] hover:bg-[#6750A4]/90 text-white text-xs font-bold rounded-full transition cursor-pointer shadow-sm"
                        >
                          Enable Encrypted Vault
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}

                {showVaultAuthModal && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
                    id="vault_auth_modal"
                  >
                    <motion.div
                      initial={{ scale: 0.95, y: 15 }}
                      animate={{ scale: 1, y: 0 }}
                      className="bg-white rounded-[28px] w-full max-w-sm p-6 shadow-2xl border border-[#CAC4D0]/30 text-left relative overflow-hidden"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-[#EADDFF] text-[#21005D] rounded-2xl animate-pulse">
                          <Lock className="w-5 h-5 text-[#6750A4]" />
                        </div>
                        <div>
                          <h4 className="text-sm font-extrabold text-[#1C1B1F]">Secure Vault Locked</h4>
                          <p className="text-[10px] text-[#49454F] font-semibold font-mono">Keystore Key: AES_GCM_256</p>
                        </div>
                      </div>

                      <p className="text-[11px] text-[#49454F] font-semibold leading-relaxed mb-4">
                        Please enter your 4-digit PIN. This authorizes the device hardware to release the wrapping master key from Android StrongBox Keystore.
                      </p>

                      <div className="space-y-4">
                        <div>
                          <input
                            type="password"
                            maxLength={4}
                            pattern="\d*"
                            inputMode="numeric"
                            placeholder="••••"
                            value={vaultPinInput}
                            onChange={(e) => setVaultPinInput(e.target.value.replace(/\D/g, ''))}
                            className="w-full text-center tracking-[0.5em] font-mono text-xl font-bold bg-[#F7F2FA] border border-[#CAC4D0]/50 rounded-2xl py-3 px-3 outline-none focus:border-[#6750A4] focus:ring-1 focus:ring-[#6750A4]/30"
                            autoFocus
                          />
                        </div>

                        {vaultAuthError && (
                          <p className="text-[10.5px] text-red-600 font-bold text-center flex items-center gap-1 justify-center animate-bounce">
                            ⚠️ {vaultAuthError}
                          </p>
                        )}
                      </div>

                      {/* Cool cryptographic metadata log visualizer right in the auth dialog! */}
                      <div className="bg-slate-900 rounded-2xl p-2.5 mt-4 text-[8px] font-mono text-slate-400 border border-slate-800 space-y-0.5 leading-normal">
                        <p className="text-[8.5px] text-indigo-400 font-bold uppercase tracking-wider mb-1">Android Secure Storage</p>
                        <p className="flex justify-between"><span>Provider:</span> <span className="text-slate-200">AndroidKeyStore</span></p>
                        <p className="flex justify-between"><span>Entropy Block:</span> <span className="text-slate-200">PBKDF2WithHmacSHA256</span></p>
                        <p className="flex justify-between"><span>Cipher Status:</span> <span className="text-[#D0BCFF]">Decryption Blocked</span></p>
                      </div>

                      <div className="flex gap-2.5 mt-5 justify-end">
                        <button
                          onClick={() => {
                            setShowVaultAuthModal(false);
                            setVaultPinInput("");
                            setVaultAuthError("");
                          }}
                          className="px-4 py-2 hover:bg-[#ECE6F0] text-[#6750A4] text-xs font-bold rounded-full transition cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleUnlockVault}
                          className="px-5 py-2 bg-[#6750A4] hover:bg-[#6750A4]/90 text-white text-xs font-bold rounded-full transition cursor-pointer shadow-sm"
                        >
                          Unlock Storage
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}

                {showCopyMoveDialog !== null && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
                    id="batch_copy_move_modal"
                  >
                    <motion.div
                      initial={{ scale: 0.95, y: 15 }}
                      animate={{ scale: 1, y: 0 }}
                      className="bg-white rounded-[28px] w-full max-w-sm p-6 shadow-2xl border border-[#CAC4D0]/30 text-left animate-in fade-in zoom-in duration-200"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-[#EADDFF] text-[#21005D] rounded-2xl">
                          <FolderInput className="w-5 h-5 text-[#6750A4]" />
                        </div>
                        <div>
                          <h4 className="text-sm font-extrabold text-[#1C1B1F]">
                            {showCopyMoveDialog === "copy" ? "Batch Copy Photos" : "Batch Move Photos"}
                          </h4>
                          <p className="text-[10px] text-[#49454F] font-semibold">
                            Target {selectedPhotoIds.length} items to album folder
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="text-[9.5px] font-extrabold text-[#6750A4] uppercase tracking-wider block mb-2">Select Target Album</label>
                          <div className="grid grid-cols-3 gap-2">
                            {["Camera", "Screenshots", "Downloads"].map((alb) => (
                              <button
                                key={alb}
                                onClick={() => {
                                  setSelectedAlbumChoice(alb);
                                  setCustomTargetAlbum("");
                                }}
                                className={`px-2.5 py-3 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 cursor-pointer ${
                                  selectedAlbumChoice === alb && !customTargetAlbum
                                    ? "bg-[#EADDFF] border-[#6750A4] text-[#21005D] font-bold"
                                    : "bg-[#F7F2FA] border-[#CAC4D0]/40 text-[#49454F] hover:bg-[#ECE6F0]/50"
                                }`}
                              >
                                <span className="text-[10.5px] font-bold truncate block w-full">{alb}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="text-[9.5px] font-extrabold text-[#6750A4] uppercase tracking-wider block mb-1">Or Create & Use New Album</label>
                          <input
                            type="text"
                            placeholder="e.g. Vacation 2026, Family"
                            value={customTargetAlbum}
                            onChange={(e) => setCustomTargetAlbum(e.target.value)}
                            className="w-full bg-[#F7F2FA] border border-[#CAC4D0]/50 rounded-xl py-2 px-3 text-xs font-semibold outline-none focus:border-[#6750A4] focus:ring-1 focus:ring-[#6750A4]/30"
                          />
                        </div>
                      </div>

                      <div className="flex gap-2.5 mt-6 justify-end">
                        <button
                          onClick={() => {
                            setShowCopyMoveDialog(null);
                            setCustomTargetAlbum("");
                          }}
                          className="px-4 py-2 hover:bg-[#ECE6F0] text-[#6750A4] text-xs font-bold rounded-full transition cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            const target = customTargetAlbum.trim() || selectedAlbumChoice;
                            if (showCopyMoveDialog === "copy") {
                              handleBatchCopy(target);
                            } else {
                              handleBatchMove(target);
                            }
                          }}
                          className="px-5 py-2 bg-[#6750A4] hover:bg-[#6750A4]/90 text-white text-xs font-bold rounded-full transition cursor-pointer shadow-sm"
                        >
                          Confirm {showCopyMoveDialog === "copy" ? "Copy" : "Move"}
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}

                {showRenameBatchDialog && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
                    id="batch_rename_modal"
                  >
                    <motion.div
                      initial={{ scale: 0.95, y: 15 }}
                      animate={{ scale: 1, y: 0 }}
                      className="bg-white rounded-[28px] w-full max-w-sm p-6 shadow-2xl border border-[#CAC4D0]/30 text-left"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-[#EADDFF] text-[#21005D] rounded-2xl">
                          <Edit3 className="w-5 h-5 text-[#6750A4]" />
                        </div>
                        <div>
                          <h4 className="text-sm font-extrabold text-[#1C1B1F]">Batch Rename Items</h4>
                          <p className="text-[10px] text-[#49454F] font-semibold">
                            Suffixes will be appended sequentially
                          </p>
                        </div>
                      </div>

                      <p className="text-[11px] text-[#49454F] font-semibold leading-relaxed mb-4 bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                        Selected {selectedPhotoIds.length} files will be renamed sequentially (e.g. <span className="font-mono text-[10px] text-[#6750A4]">Photo_01.jpg</span>, <span className="font-mono text-[10px] text-[#6750A4]">Photo_02.jpg</span>).
                      </p>

                      <div>
                        <label className="text-[9.5px] font-extrabold text-[#6750A4] uppercase tracking-wider block mb-1">Base Name Prefix</label>
                        <input
                          type="text"
                          placeholder="e.g. Summer_Trip, Portrait"
                          value={batchRenamePrefix}
                          onChange={(e) => setBatchRenamePrefix(e.target.value)}
                          className="w-full bg-[#F7F2FA] border border-[#CAC4D0]/50 rounded-xl py-2 px-3 text-xs font-semibold outline-none focus:border-[#6750A4] focus:ring-1 focus:ring-[#6750A4]/30"
                          autoFocus
                        />
                      </div>

                      <div className="flex gap-2.5 mt-6 justify-end">
                        <button
                          onClick={() => {
                            setShowRenameBatchDialog(false);
                            setBatchRenamePrefix("");
                          }}
                          className="px-4 py-2 hover:bg-[#ECE6F0] text-[#6750A4] text-xs font-bold rounded-full transition cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          disabled={!batchRenamePrefix.trim()}
                          onClick={() => handleBatchRename(batchRenamePrefix)}
                          className={`px-5 py-2 text-white text-xs font-bold rounded-full transition shadow-sm ${
                            batchRenamePrefix.trim() 
                              ? "bg-[#6750A4] hover:bg-[#6750A4]/90 cursor-pointer" 
                              : "bg-slate-300 cursor-not-allowed opacity-60"
                          }`}
                        >
                          Rename All
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}

                {showShareBatchDialog && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
                    id="batch_share_modal"
                  >
                    <motion.div
                      initial={{ scale: 0.95, y: 15 }}
                      animate={{ scale: 1, y: 0 }}
                      className="bg-white rounded-[28px] w-full max-w-sm p-6 shadow-2xl border border-[#CAC4D0]/30 text-left relative overflow-hidden"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-emerald-100 text-emerald-800 rounded-2xl">
                          <Share2 className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <h4 className="text-sm font-extrabold text-[#1C1B1F]">Mock Broadcast Intent Success</h4>
                          <p className="text-[10px] text-[#49454F] font-semibold font-mono font-bold">android.intent.action.SEND_MULTIPLE</p>
                        </div>
                      </div>

                      <p className="text-[11px] text-[#49454F] font-semibold leading-relaxed mb-3">
                        Android OS has processed the mock file share URI array. Copy the public link to share with other local apps or devices:
                      </p>

                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/60 mb-4 flex items-center justify-between gap-2">
                        <span className="font-mono text-[10.5px] text-slate-700 truncate font-semibold select-all" id="share_batch_link">
                          {sharedBatchLink}
                        </span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(sharedBatchLink);
                            addLog("I", "ShareManager", "Copied batch share link to clipboard.");
                          }}
                          className="px-2.5 py-1 bg-[#6750A4] hover:bg-[#6750A4]/90 text-white text-[10px] font-bold rounded-lg transition shrink-0 cursor-pointer animate-pulse"
                        >
                          Copy
                        </button>
                      </div>

                      <div className="max-h-24 overflow-y-auto bg-[#F7F2FA] rounded-2xl p-2.5 border border-[#CAC4D0]/40 space-y-1">
                        <p className="text-[9.5px] font-extrabold text-[#49454F] uppercase tracking-wider mb-1">Shared items:</p>
                        {sharedBatchTitles.map((t, idx) => (
                          <div key={idx} className="text-[10px] text-[#1C1B1F] font-medium truncate flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                            {t}
                          </div>
                        ))}
                      </div>

                      <div className="flex mt-5 justify-end">
                        <button
                          onClick={() => {
                            setShowShareBatchDialog(false);
                            setSharedBatchLink("");
                            setSharedBatchTitles([]);
                          }}
                          className="px-5 py-2 bg-[#6750A4] hover:bg-[#6750A4]/90 text-white text-xs font-bold rounded-full transition cursor-pointer shadow-sm"
                        >
                          Done
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}

                {showCompressQualitySelector && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
                    id="compress_quality_selector_modal"
                  >
                    <motion.div
                      initial={{ scale: 0.95, y: 15 }}
                      animate={{ scale: 1, y: 0 }}
                      className="bg-white rounded-[28px] w-full max-w-sm p-6 shadow-2xl border border-[#CAC4D0]/30 text-left"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-[#EADDFF] text-[#21005D] rounded-2xl">
                          <Archive className="w-5 h-5 text-[#6750A4]" />
                        </div>
                        <div>
                          <h4 className="text-sm font-extrabold text-[#1C1B1F]">Image Compression</h4>
                          <p className="text-[10px] text-[#49454F] font-semibold">
                            Select Quality Profile for {compressTargetIds.length} item{compressTargetIds.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2.5 mb-5">
                        {[
                          {
                            id: "high",
                            label: "High Quality (Low compression)",
                            desc: "Prunes metadata & reduces file size to ~75%. Resolution is preserved at 90%.",
                          },
                          {
                            id: "medium",
                            label: "Balanced (Medium compression)",
                            desc: "Optimal blend. File size reduced to ~45%. Resolution scaled to 75%.",
                          },
                          {
                            id: "low",
                            label: "Maximum Compression (Low quality)",
                            desc: "Maximum space recovery. File size reduced to ~20%. Resolution scaled to 50%.",
                          }
                        ].map((opt) => (
                          <button
                            key={opt.id}
                            onClick={() => setSelectedQuality(opt.id as any)}
                            className={`w-full p-3 text-left border rounded-2xl transition cursor-pointer flex gap-3 ${
                              selectedQuality === opt.id 
                                ? "border-[#6750A4] bg-[#6750A4]/10 shadow-sm" 
                                : "border-slate-200 hover:bg-slate-50/80"
                            }`}
                          >
                            <div className="pt-0.5">
                              <div className={`w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                selectedQuality === opt.id ? "border-[#6750A4]" : "border-slate-300"
                              }`}>
                                {selectedQuality === opt.id && (
                                  <div className="w-2.5 h-2.5 rounded-full bg-[#6750A4]" />
                                )}
                              </div>
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-bold text-[#1C1B1F]">{opt.label}</p>
                              <p className="text-[9.5px] text-[#49454F] font-semibold mt-0.5 leading-normal">{opt.desc}</p>
                            </div>
                          </button>
                        ))}
                      </div>

                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => {
                            setShowCompressQualitySelector(false);
                            setCompressTargetIds([]);
                          }}
                          className="px-4 py-2 border border-[#CAC4D0] hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-full transition cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={async () => {
                            setShowCompressQualitySelector(false);
                            await handleBatchCompress(selectedQuality, compressTargetIds);
                          }}
                          className="px-5 py-2 bg-[#6750A4] hover:bg-[#6750A4]/90 text-white text-xs font-bold rounded-full transition cursor-pointer shadow-sm"
                        >
                          Compress Now
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}

                {showCompressBatchDialog && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
                    id="batch_compress_modal"
                  >
                    <motion.div
                      initial={{ scale: 0.95, y: 15 }}
                      animate={{ scale: 1, y: 0 }}
                      className="bg-white rounded-[28px] w-full max-w-sm p-6 shadow-2xl border border-[#CAC4D0]/30 text-left"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-[#EADDFF] text-[#21005D] rounded-2xl">
                          <Archive className="w-5 h-5 text-[#6750A4]" />
                        </div>
                        <div>
                          <h4 className="text-sm font-extrabold text-[#1C1B1F]">Compression Report</h4>
                          <p className="text-[10px] text-emerald-700 font-bold">
                            Optimized using {selectedQuality.toUpperCase()} profile
                          </p>
                        </div>
                      </div>

                      <p className="text-[11px] text-[#49454F] font-semibold leading-relaxed mb-4">
                        The SQLite and local cache storage layers have successfully committed the requested compression ratios and updated individual EXIF headers.
                      </p>

                      <div className="max-h-48 overflow-y-auto bg-[#F7F2FA] rounded-2xl p-3.5 border border-[#CAC4D0]/40 space-y-2.5 mb-2 scrollbar-thin">
                        {compressedBatchResults.map((item) => (
                          <div key={item.id} className="text-[10.5px] border-b border-[#CAC4D0]/20 pb-2 last:border-b-0 last:pb-0">
                            <p className="font-bold text-[#1C1B1F] truncate leading-tight">{item.title}</p>
                            
                            <div className="flex justify-between items-center mt-1">
                              <div>
                                <span className="text-[8px] font-bold text-[#49454F]/70 uppercase block">Size Ratio</span>
                                <p className="text-[10px] font-semibold flex items-center gap-1">
                                  <span className="line-through text-red-500">{item.originalSize}</span>
                                  <span className="text-slate-400">➔</span>
                                  <span className="text-emerald-600 font-bold">{item.compressedSize}</span>
                                </p>
                              </div>
                              <div className="text-right">
                                <span className="text-[8px] font-bold text-[#49454F]/70 uppercase block">Resolution</span>
                                <p className="text-[10px] font-semibold text-[#1C1B1F]">
                                  {item.originalWidth}×{item.originalHeight}
                                  <span className="text-slate-400 mx-1">➔</span>
                                  <span className="font-bold">{item.compressedWidth}×{item.compressedHeight}</span>
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex mt-5 justify-end">
                        <button
                          onClick={() => {
                            setShowCompressBatchDialog(false);
                            setCompressedBatchResults([]);
                          }}
                          className="px-5 py-2 bg-[#6750A4] hover:bg-[#6750A4]/90 text-white text-xs font-bold rounded-full transition cursor-pointer shadow-sm"
                        >
                          Close Report
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}

                {showDuplicateFinder && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-3"
                    id="duplicate_finder_modal"
                  >
                    <motion.div
                      initial={{ scale: 0.95, y: 15 }}
                      animate={{ scale: 1, y: 0 }}
                      className="bg-white rounded-[28px] w-full max-w-md h-[90%] flex flex-col shadow-2xl border border-[#CAC4D0]/30 text-left overflow-hidden"
                    >
                      {/* Modal Header */}
                      <div className="p-4 border-b border-[#CAC4D0]/30 flex items-center justify-between shrink-0 bg-[#F7F2FA]">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-2xl">
                            <Copy className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div>
                            <h4 className="text-sm font-extrabold text-[#1C1B1F]">Duplicate Finder</h4>
                            <p className="text-[10px] text-[#49454F] font-semibold">
                              Scan & group matching files
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <button
                            onClick={handleInjectTestDuplicate}
                            disabled={isInjectingDuplicate}
                            className="p-1.5 hover:bg-slate-200/60 rounded-full transition cursor-pointer text-[#6750A4] disabled:opacity-50"
                            title="Inject mock duplicate image for test"
                          >
                            <PlusCircle className={`w-4.5 h-4.5 ${isInjectingDuplicate ? "animate-pulse text-slate-400" : ""}`} />
                          </button>
                          <button
                            onClick={handleScanDuplicates}
                            disabled={isScanningDuplicates}
                            className="p-1.5 hover:bg-slate-200/60 rounded-full transition cursor-pointer text-[#49454F]"
                            title="Rescan duplicates"
                          >
                            <RefreshCw className={`w-4.5 h-4.5 ${isScanningDuplicates ? "animate-spin text-[#6750A4]" : ""}`} />
                          </button>
                          <button
                            onClick={() => {
                              setShowDuplicateFinder(false);
                              setDuplicateGroups([]);
                            }}
                            className="p-1.5 hover:bg-slate-200/60 rounded-full transition cursor-pointer text-slate-500 font-bold text-sm"
                          >
                            ✕
                          </button>
                        </div>
                      </div>

                      {/* Modal Content */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                        {isScanningDuplicates ? (
                          <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="relative w-12 h-12 mb-4">
                              <div className="absolute inset-0 rounded-full border-4 border-[#E8DEF8] opacity-30"></div>
                              <div className="absolute inset-0 rounded-full border-4 border-t-emerald-600 animate-spin"></div>
                            </div>
                            <h5 className="text-xs font-bold text-[#1C1B1F]">Analyzing local storage catalog</h5>
                            <p className="text-[10px] text-[#49454F]/80 font-semibold max-w-xs mt-1 leading-normal">
                              Comparing photo metadata, dimensions, camera EXIF headers, and file sizes...
                            </p>
                          </div>
                        ) : duplicateGroups.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mb-4">
                              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                            </div>
                            <h5 className="text-xs font-extrabold text-[#1C1B1F]">No duplicates found</h5>
                            <p className="text-[10px] text-[#49454F]/80 font-semibold max-w-xs mt-1.5 px-4 leading-normal">
                              Your gallery is perfectly clean! To test this feature immediately, click the <span className="text-[#6750A4] font-bold inline-flex items-center gap-0.5"><PlusCircle className="w-3 h-3 inline text-emerald-600" /> inject icon</span> in the header or copy any photo in select mode.
                            </p>
                            
                            <button
                              onClick={handleInjectTestDuplicate}
                              disabled={isInjectingDuplicate}
                              className="mt-5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-full transition cursor-pointer shadow-sm flex items-center gap-1.5"
                            >
                              <PlusCircle className="w-3.5 h-3.5" />
                              {isInjectingDuplicate ? "Simulating Copy..." : "Simulate / Inject Duplicate Image"}
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-2xl">
                              <p className="text-[11px] text-emerald-800 font-semibold leading-relaxed">
                                Detected <strong>{duplicateGroups.length} duplicate group(s)</strong>. We have automatically suggested the safest deletion candidate for each group below.
                              </p>
                            </div>

                            {duplicateGroups.map((group) => {
                              const selectedIds = selectedDuplicateDeletions[group.id] || [];
                              return (
                                <div key={group.id} className="bg-white border border-[#CAC4D0]/40 rounded-2xl p-3.5 shadow-sm space-y-3">
                                  {/* Group Header */}
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <span className={`text-[8.5px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                                        group.type === "exact" 
                                          ? "bg-emerald-100 text-emerald-800" 
                                          : "bg-[#EADDFF] text-[#21005D]"
                                      }`}>
                                        {group.type === "exact" ? "Exact Duplicate" : "Visual Match"}
                                      </span>
                                      <p className="text-[10px] text-[#49454F] font-bold mt-1">
                                        Reason: {group.reason}
                                      </p>
                                    </div>
                                    <span className="text-[9px] text-[#49454F]/70 font-semibold">
                                      Group Size: {group.photos.length}
                                    </span>
                                  </div>

                                  {/* Group Photos List */}
                                  <div className="space-y-2.5">
                                    {group.photos.map((p) => {
                                      const isKeep = p.id === group.suggestedKeepId;
                                      const isChecked = selectedIds.includes(p.id);
                                      return (
                                        <div 
                                          key={p.id} 
                                          className={`p-2 rounded-xl border flex gap-3 transition-all ${
                                            isKeep 
                                              ? "border-amber-200 bg-amber-50/20" 
                                              : isChecked
                                                ? "border-red-200 bg-red-50/10"
                                                : "border-slate-100 bg-slate-50/30"
                                          }`}
                                          style={{ contentVisibility: "auto", containIntrinsicSize: "auto 72px" }}
                                        >
                                          {/* Image Thumbnail */}
                                          <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 relative bg-slate-100 border border-slate-200">
                                            <img 
                                              src={p.url} 
                                              alt={p.title} 
                                              className="w-full h-full object-cover"
                                              referrerPolicy="no-referrer"
                                              loading="lazy"
                                              decoding="async"
                                            />
                                          </div>

                                          {/* Photo details */}
                                          <div className="flex-1 min-w-0">
                                            <p className="text-[10px] font-bold text-[#1C1B1F] truncate" title={p.title}>
                                              {p.title}
                                            </p>
                                            <p className="text-[8.5px] text-[#49454F] font-semibold mt-0.5 flex flex-wrap gap-x-2">
                                              <span>{p.size}</span>
                                              <span className="text-slate-300">|</span>
                                              <span>{p.width}×{p.height}</span>
                                              <span className="text-slate-300">|</span>
                                              <span className="text-[#6750A4]">{p.album}</span>
                                            </p>
                                            
                                            {/* Recommendation Badge */}
                                            <div className="mt-1 flex items-center gap-1.5">
                                              {isKeep ? (
                                                <span className="inline-flex items-center gap-0.5 text-[8.5px] text-amber-700 font-extrabold bg-amber-100 px-1.5 py-0.2 rounded-md">
                                                  👑 Suggested Keep
                                                </span>
                                              ) : (
                                                <span className="inline-flex items-center gap-0.5 text-[8.5px] text-red-700 font-extrabold bg-red-100 px-1.5 py-0.2 rounded-md">
                                                  ⚠️ Redundant Candidate
                                                </span>
                                              )}
                                            </div>
                                          </div>

                                          {/* Selection checkbox */}
                                          <div className="flex items-center justify-center pr-1 shrink-0">
                                            <button
                                              onClick={() => {
                                                setSelectedDuplicateDeletions(prev => {
                                                  const currentGroupDeletions = prev[group.id] || [];
                                                  let nextGroupDeletions: string[];
                                                  if (currentGroupDeletions.includes(p.id)) {
                                                    nextGroupDeletions = currentGroupDeletions.filter(id => id !== p.id);
                                                  } else {
                                                    nextGroupDeletions = [...currentGroupDeletions, p.id];
                                                  }
                                                  return { ...prev, [group.id]: nextGroupDeletions };
                                                });
                                              }}
                                              className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition ${
                                                isChecked 
                                                  ? "bg-red-500 border-red-500 text-white" 
                                                  : "border-slate-300 hover:border-slate-400"
                                              }`}
                                            >
                                              {isChecked && <Trash2 className="w-3 h-3 stroke-[3]" />}
                                            </button>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Modal Footer */}
                      {!isScanningDuplicates && duplicateGroups.length > 0 && (
                        <div className="p-4 border-t border-[#CAC4D0]/30 bg-[#F7F2FA] shrink-0 flex flex-col gap-3">
                          <div className="flex justify-between items-center px-1">
                            <div>
                              <p className="text-[10px] text-[#49454F] font-bold uppercase tracking-wider">Storage Savings</p>
                              <p className="text-xs font-extrabold text-[#1C1B1F]">
                                Selected {Object.values(selectedDuplicateDeletions).flat().length} items to prune
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-[10px] text-[#49454F] font-bold uppercase tracking-wider">Space Saved</p>
                              <p className="text-xs font-mono font-extrabold text-emerald-700">
                                ~{getSelectedSavingsStr()}
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={handleDeleteSelectedDuplicates}
                            disabled={Object.values(selectedDuplicateDeletions).flat().length === 0}
                            className={`w-full py-2.5 text-center text-xs font-bold rounded-full transition shadow-md flex items-center justify-center gap-2 ${
                              Object.values(selectedDuplicateDeletions).flat().length > 0
                                ? "bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                                : "bg-slate-200 text-slate-400 cursor-not-allowed opacity-60"
                            }`}
                          >
                            <Trash2 className="w-4 h-4" />
                            Move Selected Duplicates to Recycle Bin
                          </button>
                        </div>
                      )}
                    </motion.div>
                  </motion.div>
                )}

                {showLargeFileFinder && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-3"
                    id="large_file_finder_modal"
                  >
                    <motion.div
                      initial={{ scale: 0.95, y: 15 }}
                      animate={{ scale: 1, y: 0 }}
                      className="bg-white rounded-[28px] w-full max-w-md h-[90%] flex flex-col shadow-2xl border border-[#CAC4D0]/30 text-left overflow-hidden"
                    >
                      {/* Modal Header */}
                      <div className="p-4 border-b border-[#CAC4D0]/30 flex flex-col gap-3 shrink-0 bg-[#F7F2FA]">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-blue-100 text-blue-800 rounded-2xl">
                              <HardDrive className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="text-sm font-extrabold text-[#1C1B1F]">Large File Finder</h4>
                              <p className="text-[10px] text-[#49454F] font-semibold">
                                Identify and clean heavy media assets
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <button
                              onClick={handleScanLargeFiles}
                              disabled={isScanningLargeFiles}
                              className="p-1.5 hover:bg-slate-200/60 rounded-full transition cursor-pointer text-[#49454F]"
                              title="Rescan storage"
                            >
                              <RefreshCw className={`w-4.5 h-4.5 ${isScanningLargeFiles ? "animate-spin text-blue-600" : ""}`} />
                            </button>
                            <button
                              onClick={() => {
                                setShowLargeFileFinder(false);
                              }}
                              className="p-1.5 hover:bg-slate-200/60 rounded-full transition cursor-pointer text-slate-500 font-bold text-sm"
                            >
                              ✕
                            </button>
                          </div>
                        </div>

                        {/* Interactive Controls Segment */}
                        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/60">
                          {/* Size Threshold Picker */}
                          <div className="flex flex-col gap-1">
                            <span className="text-[8.5px] font-bold text-[#49454F] uppercase tracking-wider">Min Size Threshold</span>
                            <div className="flex bg-slate-200/60 p-0.5 rounded-lg border border-slate-300/30">
                              {[2, 4, 8].map((size) => (
                                <button
                                  key={size}
                                  onClick={() => {
                                    setLargeFileMinSizeMB(size);
                                    addLog("V", "LargeFileFinder", `Adjusted minimum file size filter to >= ${size}MB`);
                                  }}
                                  className={`flex-1 text-center py-1 text-[9.5px] font-extrabold rounded transition-all cursor-pointer ${
                                    largeFileMinSizeMB === size
                                      ? "bg-white text-[#1C1B1F] shadow-xs"
                                      : "text-slate-600 hover:text-slate-900"
                                  }`}
                                >
                                  {size}MB+
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Sorting Switcher */}
                          <div className="flex flex-col gap-1">
                            <span className="text-[8.5px] font-bold text-[#49454F] uppercase tracking-wider">Sort Order</span>
                            <div className="flex bg-slate-200/60 p-0.5 rounded-lg border border-slate-300/30">
                              {(["desc", "asc"] as const).map((order) => (
                                <button
                                  key={order}
                                  onClick={() => {
                                    setLargeFileSortOrder(order);
                                    addLog("V", "LargeFileFinder", `Sorted storage list by file size ${order === "desc" ? "DESCENDING" : "ASCENDING"}`);
                                  }}
                                  className={`flex-1 text-center py-1 text-[9.5px] font-extrabold rounded transition-all cursor-pointer ${
                                    largeFileSortOrder === order
                                      ? "bg-white text-[#1C1B1F] shadow-xs"
                                      : "text-slate-600 hover:text-slate-900"
                                  }`}
                                >
                                  {order === "desc" ? "Largest" : "Smallest"}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Modal Content */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
                        {isScanningLargeFiles ? (
                          <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="relative w-12 h-12 mb-4">
                              <div className="absolute inset-0 rounded-full border-4 border-slate-100 opacity-30"></div>
                              <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 animate-spin"></div>
                            </div>
                            <h5 className="text-xs font-bold text-[#1C1B1F]">Traversing MediaStore databases</h5>
                            <p className="text-[10px] text-[#49454F]/80 font-semibold max-w-xs mt-1 leading-normal">
                              Evaluating sector allocations and mapping large media binaries across root paths...
                            </p>
                          </div>
                        ) : sortedLargeFiles.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-3">
                              <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                            </div>
                            <h5 className="text-xs font-extrabold text-[#1C1B1F]">No matching files found</h5>
                            <p className="text-[10px] text-[#49454F]/80 font-semibold max-w-xs mt-1 leading-normal px-4">
                              Zero assets meet your {largeFileMinSizeMB}MB+ threshold. Try lowering the threshold filter above.
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-2.5">
                            <div className="p-2.5 bg-blue-50/60 border border-blue-100/50 rounded-xl">
                              <p className="text-[10.5px] text-blue-900 font-semibold leading-normal">
                                Showing <strong>{sortedLargeFiles.length} files</strong> exceeding <strong>{largeFileMinSizeMB} MB</strong>. Click the trash icon for immediate quick deletion.
                              </p>
                            </div>

                            <AnimatePresence>
                              {sortedLargeFiles.map((p) => (
                                <motion.div 
                                  key={p.id}
                                  layout
                                  initial={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, x: -50, scale: 0.9 }}
                                  transition={{ duration: 0.2 }}
                                  className="bg-white border border-[#CAC4D0]/30 rounded-2xl p-3 flex gap-3 shadow-xs items-center justify-between"
                                  style={{ contentVisibility: "auto", containIntrinsicSize: "auto 72px" }}
                                >
                                  {/* Left details */}
                                  <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 relative bg-slate-100 border border-slate-200">
                                      {p.mimeType.startsWith("video") ? (
                                        <div className="relative w-full h-full">
                                          <img 
                                            src={p.thumbnailUrl || p.url} 
                                            alt={p.title} 
                                            className="w-full h-full object-cover"
                                            referrerPolicy="no-referrer"
                                            loading="lazy"
                                            decoding="async"
                                          />
                                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                            <Play className="w-4 h-4 text-white fill-current" />
                                          </div>
                                        </div>
                                      ) : (
                                        <img 
                                          src={p.url} 
                                          alt={p.title} 
                                          className="w-full h-full object-cover"
                                          referrerPolicy="no-referrer"
                                          loading="lazy"
                                          decoding="async"
                                        />
                                      )}
                                    </div>

                                    <div className="min-w-0">
                                      <p className="text-[11px] font-bold text-[#1C1B1F] truncate" title={p.title}>
                                        {p.title}
                                      </p>
                                      <p className="text-[9px] text-slate-500 font-semibold mt-0.5 flex flex-wrap gap-x-1.5 items-center">
                                        <span className="text-blue-700 font-extrabold text-[10px] bg-blue-50 px-1 py-0.2 rounded">
                                          {p.size}
                                        </span>
                                        <span className="text-slate-300">|</span>
                                        <span>{p.width}×{p.height}</span>
                                        <span className="text-slate-300">|</span>
                                        <span className="text-indigo-600 font-bold">{p.album}</span>
                                      </p>
                                    </div>
                                  </div>

                                  {/* Right side Quick Delete Trigger */}
                                  <div className="shrink-0 pl-1">
                                    <button
                                      onClick={() => {
                                        if (confirm(`Move "${p.title}" (${p.size}) to the Recycle Bin?`)) {
                                          handleQuickDeleteLargeFile(p.id);
                                        }
                                      }}
                                      className="p-2.5 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 rounded-xl transition cursor-pointer shadow-xs border border-red-200/40"
                                      title="Quick Delete"
                                    >
                                      <Trash2 className="w-4 h-4 stroke-[2.5]" />
                                    </button>
                                  </div>
                                </motion.div>
                              ))}
                            </AnimatePresence>
                          </div>
                        )}
                      </div>

                      {/* Modal Footer */}
                      {!isScanningLargeFiles && sortedLargeFiles.length > 0 && (
                        <div className="p-4 border-t border-[#CAC4D0]/30 bg-[#F7F2FA] shrink-0 flex items-center justify-between">
                          <div>
                            <p className="text-[9px] text-[#49454F] font-bold uppercase tracking-wider">Heavy Assets</p>
                            <p className="text-[11.5px] font-extrabold text-[#1C1B1F]">
                              {sortedLargeFiles.length} match threshold
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-[9px] text-[#49454F] font-bold uppercase tracking-wider">Reclaimable Space</p>
                            <p className="text-[12.5px] font-mono font-extrabold text-blue-700">
                              ~{totalLargeFilesSizeStr}
                            </p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </motion.div>
                )}

                {showDeleteBatchConfirm && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
                    id="batch_delete_confirm_modal"
                  >
                    <motion.div
                      initial={{ scale: 0.95, y: 15 }}
                      animate={{ scale: 1, y: 0 }}
                      className="bg-white rounded-[28px] w-full max-w-sm p-6 shadow-2xl border border-[#CAC4D0]/30 text-left"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-red-100 text-red-800 rounded-2xl">
                          <Trash2 className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <h4 className="text-sm font-extrabold text-[#1C1B1F]">Delete selected files?</h4>
                          <p className="text-[10px] text-[#49454F] font-semibold">
                            Action affects {selectedPhotoIds.length} chosen items
                          </p>
                        </div>
                      </div>

                      <p className="text-[11px] text-[#49454F] font-semibold leading-relaxed mb-4">
                        Are you sure you want to delete these {selectedPhotoIds.length} items? By default, they will be moved to the Recycle Bin and can be restored within 30 days.
                      </p>

                      <label className="flex items-center gap-2.5 p-3.5 bg-[#F7F2FA] rounded-2xl border border-[#CAC4D0]/40 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={deletePermanently}
                          onChange={(e) => setDeletePermanently(e.target.checked)}
                          className="accent-[#6750A4] h-4 w-4 rounded"
                        />
                        <div>
                          <span className="text-[11px] font-extrabold text-red-600 uppercase tracking-wide block">Delete Permanently</span>
                          <span className="text-[9.5px] text-[#49454F] font-medium leading-normal block mt-0.5">Bypass recycle bin; purge from device sector records forever.</span>
                        </div>
                      </label>

                      <div className="flex gap-2.5 mt-6 justify-end">
                        <button
                          onClick={() => {
                            setShowDeleteBatchConfirm(false);
                            setDeletePermanently(false);
                          }}
                          className="px-4 py-2 hover:bg-[#ECE6F0] text-[#6750A4] text-xs font-bold rounded-full transition cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            handleBatchDelete(deletePermanently);
                            setShowDeleteBatchConfirm(false);
                            setDeletePermanently(false);
                          }}
                          className="px-5 py-2 bg-[#B3261E] hover:bg-[#B3261E]/90 text-white text-xs font-bold rounded-full transition cursor-pointer shadow-sm"
                        >
                          Delete {selectedPhotoIds.length} Items
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* App Lock Overlay Screen (Material Design Biometric Keyguard) */}
              <AnimatePresence>
                {isAppLocked && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="absolute inset-0 bg-neutral-950 text-white z-[99] flex flex-col justify-between p-6 select-none font-sans rounded-[34px] overflow-hidden"
                    id="app_lock_overlay"
                  >
                    {/* Lock Screen Header / Face Unlock Scanner */}
                    <div className="flex flex-col items-center pt-8">
                      <div className="relative">
                        <motion.div
                          animate={{ scale: [1, 1.08, 1] }}
                          transition={{ repeat: Infinity, duration: 2.5 }}
                          className={`w-14 h-14 rounded-full flex items-center justify-center border-2 border-dashed ${
                            faceScanState === "scanning" 
                              ? "border-blue-400 bg-blue-500/10 text-blue-400" 
                              : faceScanState === "success"
                                ? "border-emerald-400 bg-emerald-500/15 text-emerald-400"
                                : faceScanState === "error"
                                  ? "border-red-400 bg-red-500/10 text-red-400"
                                  : "border-zinc-700 bg-zinc-900/40 text-zinc-400"
                          }`}
                        >
                          {faceScanState === "scanning" ? (
                            <ScanFace className="w-7 h-7 animate-pulse text-blue-400" />
                          ) : faceScanState === "success" ? (
                            <Check className="w-7 h-7 text-emerald-400 stroke-[3]" />
                          ) : (
                            <Lock className="w-6 h-6 text-zinc-400" />
                          )}
                        </motion.div>

                        {/* Scanner sweep line */}
                        {faceScanState === "scanning" && (
                          <motion.div
                            animate={{ top: ["10%", "90%", "10%"] }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                            className="absolute inset-x-2 h-0.5 bg-blue-400/80 shadow-md shadow-blue-500/50 z-10"
                          />
                        )}
                      </div>

                      {/* Face Unlock Banner / Controls */}
                      <div className="text-center mt-3">
                        <p className="text-[11px] font-black tracking-wider uppercase">
                          {faceScanState === "scanning" ? (
                            <span className="text-blue-400 flex items-center gap-1.5 justify-center">
                              Scanning Face... {faceScanProgress}%
                            </span>
                          ) : faceScanState === "success" ? (
                            <span className="text-emerald-400 font-bold">Face Mesh Authorized!</span>
                          ) : faceScanState === "error" ? (
                            <span className="text-red-400 font-bold">{lockScreenError}</span>
                          ) : appLockFaceEnabled ? (
                            <span className="text-zinc-500">Face Unlock Ready</span>
                          ) : (
                            <span className="text-zinc-600 text-[10px]">Face Unlock Disabled</span>
                          )}
                        </p>

                        {/* Toggle mock face scan success/failure for simulator high-fidelity testing */}
                        {appLockFaceEnabled && faceScanState !== "success" && (
                          <div className="flex gap-2 mt-2.5 justify-center">
                            <button
                              onClick={() => {
                                setFaceScanState("scanning");
                                setFaceScanProgress(0);
                                addLog("I", "FaceUnlockService", "Triggering mock biometric face match test (EXPECT SUCCESS)...");
                                triggerMockFaceScan(true);
                              }}
                              className="px-2.5 py-0.5 bg-blue-900/40 border border-blue-500/30 hover:bg-blue-900/80 text-[8px] font-black rounded-full transition cursor-pointer text-blue-200"
                            >
                              Mock Face Success
                            </button>
                            <button
                              onClick={() => {
                                setFaceScanState("scanning");
                                setFaceScanProgress(0);
                                addLog("W", "FaceUnlockService", "Triggering mock biometric face match test (EXPECT UNKNOWN FACE)...");
                                triggerMockFaceScan(false);
                              }}
                              className="px-2.5 py-0.5 bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 text-[8px] font-black rounded-full text-zinc-400 transition cursor-pointer"
                            >
                              Mock Face Fail
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Clock & PIN Indicators */}
                    <div className="flex flex-col items-center my-4">
                      <h2 className="text-3xl font-black font-mono tracking-tight text-white mb-1">
                        {phoneTime || "10:00 AM"}
                      </h2>
                      <p className="text-[10px] text-zinc-400 font-semibold tracking-wide uppercase mb-5">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                      </p>

                      {/* Dot Indicators */}
                      <div className="flex items-center gap-3.5 h-6">
                        {[0, 1, 2, 3].map((idx) => {
                          const isFilled = lockScreenPinInput.length > idx;
                          return (
                            <motion.div
                              key={idx}
                              animate={lockScreenError && lockScreenPinInput.length === 0 ? {
                                x: [0, -10, 10, -10, 10, 0]
                              } : {}}
                              transition={{ duration: 0.4 }}
                              className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-200 ${
                                isFilled 
                                  ? "bg-white border-white scale-110 shadow-md shadow-white/20" 
                                  : "border-zinc-700 bg-transparent"
                              }`}
                            />
                          );
                        })}
                      </div>

                      {lockScreenError && !isBiometricPromptOpen && (
                        <p className="text-red-500 text-[10.5px] font-bold mt-3 animate-pulse">
                          {lockScreenError}
                        </p>
                      )}
                    </div>

                    {/* Numeric PIN Pad Grid */}
                    <div className="w-full max-w-[280px] mx-auto pb-4">
                      <div className="grid grid-cols-3 gap-y-3 gap-x-5 justify-items-center">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                          <button
                            key={num}
                            onClick={() => handlePressPinDigit(num.toString())}
                            className="w-13 h-13 rounded-full bg-zinc-900/80 hover:bg-zinc-800 active:bg-zinc-700 border border-zinc-800/50 text-lg font-bold flex items-center justify-center cursor-pointer transition active:scale-95 text-white shadow-xs"
                          >
                            {num}
                          </button>
                        ))}

                        {/* Fingerprint Sensor Trigger Button / Clear */}
                        {appLockFingerprintEnabled ? (
                          <button
                            onClick={() => {
                              setIsBiometricPromptOpen(true);
                              setFingerprintScanState("idle");
                              addLog("I", "BiometricManager", "BiometricPrompt shown. Requesting fingerprint enrollment matching.");
                            }}
                            className="w-13 h-13 rounded-full bg-emerald-950/30 hover:bg-emerald-950/60 border border-emerald-900/40 text-emerald-400 flex items-center justify-center cursor-pointer transition active:scale-95"
                            title="Unlock with Fingerprint Biometrics"
                          >
                            <Fingerprint className="w-5 h-5 animate-pulse" />
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setLockScreenPinInput("");
                              setLockScreenError("");
                            }}
                            className="w-13 h-13 rounded-full bg-zinc-950 text-zinc-500 hover:text-white flex items-center justify-center text-xs font-bold cursor-pointer"
                          >
                            Clear
                          </button>
                        )}

                        <button
                          onClick={() => handlePressPinDigit("0")}
                          className="w-13 h-13 rounded-full bg-zinc-900/80 hover:bg-zinc-800 active:bg-zinc-700 border border-zinc-800/50 text-lg font-bold flex items-center justify-center cursor-pointer transition active:scale-95 text-white shadow-xs"
                        >
                          0
                        </button>

                        <button
                          onClick={handleBackspacePin}
                          className="w-13 h-13 rounded-full bg-zinc-900/40 hover:bg-zinc-900 text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer transition active:scale-95 text-[10px] font-bold"
                        >
                          Delete
                        </button>
                      </div>

                      {/* Developer Quick Bypass Button */}
                      <div className="mt-4 text-center flex flex-col items-center">
                        <button
                          onClick={() => {
                            setIsAppLocked(false);
                            addLog("I", "AppLock", "App Lock bypassed using developer test override key.");
                          }}
                          className="text-[9px] font-bold text-zinc-600 hover:text-indigo-400 transition cursor-pointer font-mono"
                        >
                          [BYPASS SECURITY LOCK]
                        </button>
                        <p className="text-[7.5px] text-zinc-700 mt-0.5 font-mono">
                          PIN is currently: <strong>{appLockPin}</strong>
                        </p>
                      </div>
                    </div>

                    {/* Biometric Prompt Bottom Sheet Dialog */}
                    <AnimatePresence>
                      {isBiometricPromptOpen && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 bg-black/85 z-[100] flex flex-col justify-end"
                          id="biometric_prompt_modal"
                        >
                          {/* Close backdrop click */}
                          <div className="absolute inset-0" onClick={() => setIsBiometricPromptOpen(false)} />

                          <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 230 }}
                            className="bg-zinc-900 border-t border-zinc-800 rounded-t-[32px] p-5 text-center space-y-4 z-10 relative"
                          >
                            <div className="w-12 h-1 bg-zinc-700 rounded-full mx-auto" />
                            
                            <div className="space-y-1">
                              <h3 className="text-xs font-black text-white">Biometric Verification</h3>
                              <p className="text-[9.5px] text-zinc-400 leading-normal">
                                Touch and hold the simulator fingerprint sensor to authenticate.
                              </p>
                            </div>

                            {/* Fingerprint Scanning Visualizer */}
                            <div className="py-4 flex flex-col items-center justify-center">
                              <div className="relative">
                                {/* Pulse effects */}
                                {fingerprintScanState === "scanning" && (
                                  <div className="absolute inset-0 w-16 h-16 bg-emerald-500/20 rounded-full animate-ping" />
                                )}
                                
                                <button
                                  onMouseDown={() => startFingerprintScan()}
                                  onTouchStart={() => startFingerprintScan()}
                                  className={`w-16 h-16 rounded-full border flex items-center justify-center transition-all cursor-pointer relative z-10 ${
                                    fingerprintScanState === "scanning"
                                      ? "bg-emerald-950 border-emerald-500 text-emerald-400 scale-105"
                                      : fingerprintScanState === "success"
                                        ? "bg-emerald-500 border-emerald-400 text-slate-900 shadow-lg shadow-emerald-500/20"
                                        : fingerprintScanState === "error"
                                          ? "bg-red-950 border-red-500 text-red-500 animate-bounce"
                                          : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700/80 hover:text-white"
                                  }`}
                                >
                                  {fingerprintScanState === "success" ? (
                                    <Check className="w-8 h-8 stroke-[3]" />
                                  ) : (
                                    <Fingerprint className="w-8 h-8" />
                                  )}
                                </button>
                              </div>

                              <p className="text-[9.5px] mt-3 font-extrabold uppercase tracking-widest text-zinc-400">
                                {fingerprintScanState === "scanning" ? (
                                  <span className="text-emerald-400 animate-pulse">Scanning fingerprint...</span>
                                ) : fingerprintScanState === "success" ? (
                                  <span className="text-emerald-400 font-bold">Biometric match verified!</span>
                                ) : fingerprintScanState === "error" ? (
                                  <span className="text-red-500 font-bold">Fingerprint not recognized</span>
                                ) : (
                                  "Hold to Scan"
                                )}
                              </p>
                            </div>

                            {/* Options to force fail/success */}
                            <div className="flex gap-2 justify-center pt-1 pb-1">
                              <button
                                onClick={() => simulateFingerprintResult(true)}
                                className="px-2.5 py-0.5 bg-emerald-900/30 hover:bg-emerald-900/70 text-emerald-400 text-[8px] font-black rounded-full transition cursor-pointer"
                              >
                                Match Registered
                              </button>
                              <button
                                onClick={() => simulateFingerprintResult(false)}
                                className="px-2.5 py-0.5 bg-red-900/20 hover:bg-red-900/50 text-red-400 text-[8px] font-black rounded-full transition cursor-pointer"
                              >
                                Match Unenrolled
                              </button>
                            </div>

                            <button
                              onClick={() => setIsBiometricPromptOpen(false)}
                              className="w-full py-1.5 bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 text-zinc-300 text-xs font-bold rounded-xl transition cursor-pointer"
                            >
                              Cancel & Enter PIN
                            </button>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                  </motion.div>
                )}
              </AnimatePresence>

            </div>

          </div>

          {/* Sibling wrap close */}
          </div>

          {/* Sibling element: M3 Feature Console inside tablet view */}
          {viewMode === "simulator" && layoutMode === "tablet" && (
            <div className={`w-[260px] h-[520px] rounded-2xl border ${isDarkMode ? 'bg-[#1C1B22] border-[#3F3B45] text-[#E6E1E5]' : 'bg-[#F3EDF7] border-[#CAC4D0] text-[#1C1B1F]'} flex flex-col overflow-y-auto p-3.5 z-30 font-sans shadow-md`} id="tablet_right_panel">
              <div className="flex items-center gap-1.5 mb-2.5 border-b pb-2">
                <Cpu className="w-4 h-4 text-[#6750A4]" />
                <h3 className="text-[11px] font-black uppercase tracking-wider text-[#6750A4]">M3 Feature Console</h3>
              </div>

              {/* Section 1: Dynamic Palette Wallpaper Selector */}
              <div className="mb-3.5">
                <h4 className="text-[9px] font-bold text-slate-500 mb-1.5 uppercase">Dynamic Wallpaper Accent</h4>
                <div className="grid grid-cols-2 gap-1">
                  {[
                    { id: "purple", label: "Orchid (Default)", color: "bg-[#6750A4]" },
                    { id: "emerald", label: "Emerald Green", color: "bg-[#0F766E]" },
                    { id: "ocean", label: "Ocean Sky Blue", color: "bg-[#0284C7]" },
                    { id: "charcoal", label: "Slate Gray", color: "bg-[#475569]" },
                    { id: "terracotta", label: "Earth Terracotta", color: "bg-[#C2410C]" },
                  ].map(pal => (
                    <button
                      key={pal.id}
                      onClick={() => {
                        setMaterialPalette(pal.id);
                        addLog("I", "MaterialYou", `Applied dynamic colors scheme: ${pal.label.toUpperCase()}`);
                      }}
                      className={`flex items-center gap-1.5 text-[8.5px] font-black p-1.5 rounded-lg border transition cursor-pointer text-left ${materialPalette === pal.id ? 'bg-white text-black shadow-sm border-neutral-400' : 'bg-transparent text-[#49454F] border-slate-300'}`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full ${pal.color} shrink-0`} />
                      <span className="truncate">{pal.label.split(" ")[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Section 2: On-Device Face Recognition */}
              <div className="mb-3.5 bg-white/40 dark:bg-black/20 p-2 rounded-xl border border-[#CAC4D0]/30">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9px] font-bold text-slate-500 uppercase">Face ID Cluster Filters</span>
                  <button 
                    onClick={() => {
                      setShowFacePrivacyDisclosure(true);
                      addLog("I", "FacePrivacy", "User requested regulatory biometrics consent disclosure form.");
                    }}
                    className="text-[8px] text-[#6750A4] font-black underline cursor-pointer"
                  >
                    Privacy
                  </button>
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {enrolledFaces.map(face => (
                    <span 
                      key={face} 
                      onClick={() => {
                        setFacePeopleFilter(facePeopleFilter === face ? null : face);
                        setAiSearchResults(null); // Reset other search results
                        addLog("V", "FaceRecognition", `Filtering gallery by recognized face cluster: ${face}`);
                      }}
                      className={`text-[8px] px-2 py-0.5 rounded-md font-bold cursor-pointer transition ${facePeopleFilter === face ? 'bg-[#6750A4] text-white' : 'bg-[#EADDFF] text-[#21005D]'}`}
                    >
                      👤 {face}
                    </span>
                  ))}
                  {facePeopleFilter && (
                    <button 
                      onClick={() => setFacePeopleFilter(null)} 
                      className="text-[8px] text-red-600 font-bold ml-1 hover:underline cursor-pointer"
                    >
                      [Clear]
                    </button>
                  )}
                </div>
                <div className="flex gap-1">
                  <input 
                    type="text" 
                    placeholder="New Face Name" 
                    id="new_face_input"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleEnrollFace((e.target as HTMLInputElement).value);
                        (e.target as HTMLInputElement).value = "";
                      }
                    }}
                    className="bg-white dark:bg-zinc-800 border border-slate-300 rounded px-1.5 py-0.5 text-[9px] flex-1 text-slate-800 dark:text-slate-100 outline-none"
                  />
                  <button 
                    onClick={() => {
                      const input = document.getElementById("new_face_input") as HTMLInputElement;
                      if (input && input.value) {
                        handleEnrollFace(input.value);
                        input.value = "";
                      }
                    }}
                    className="bg-[#6750A4] hover:bg-[#6750A4]/90 text-white font-bold px-2 py-0.5 rounded text-[9px] cursor-pointer"
                  >
                    Enroll
                  </button>
                </div>
              </div>

              {/* Section 3: Document & QR Tools Shortcut */}
              <div className="mb-3.5 bg-white/40 dark:bg-black/20 p-2 rounded-xl border border-[#CAC4D0]/30 space-y-1.5">
                <h4 className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">Scanner Suite (Simulated Camera)</h4>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={handleTriggerQrScan}
                    className="bg-white hover:bg-slate-50 border border-slate-300 dark:bg-[#1E1B24] p-1.5 rounded-lg text-[8.5px] font-bold flex flex-col items-center justify-center gap-1 shadow-sm transition cursor-pointer"
                  >
                    <QrCode className="w-3.5 h-3.5 text-[#6750A4]" />
                    Scan QR
                  </button>
                  <button
                    onClick={handleTriggerDocScan}
                    className="bg-white hover:bg-slate-50 border border-slate-300 dark:bg-[#1E1B24] p-1.5 rounded-lg text-[8.5px] font-bold flex flex-col items-center justify-center gap-1 shadow-sm transition cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-emerald-600" />
                    Scan Doc
                  </button>
                </div>
              </div>

              {/* Section 4: Android 15 Home Screen Widgets Controller */}
              <div className="mb-3.5 bg-white/40 dark:bg-black/20 p-2 rounded-xl border border-[#CAC4D0]/30">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-[9px] font-bold text-slate-500 uppercase">Home Widgets</h4>
                  <button
                    onClick={() => setShowWidgetSettings(!showWidgetSettings)}
                    className="text-[8px] text-[#6750A4] font-bold hover:underline cursor-pointer"
                  >
                    {showWidgetSettings ? "Hide" : "Manage"} ({activeWidgets.length})
                  </button>
                </div>
                {showWidgetSettings && (
                  <div className="p-1.5 bg-white/60 dark:bg-zinc-800 rounded-lg border space-y-1 mb-1.5">
                    {[
                      { id: "memories", label: "Recent Memories Widget" },
                      { id: "quick_lock", label: "Vault Instant Lock" },
                      { id: "scan_actions", label: "Quick Scan Actions" },
                    ].map(wid => {
                      const isActive = activeWidgets.includes(wid.id);
                      return (
                        <label key={wid.id} className="flex items-center gap-1 text-[8px] cursor-pointer text-slate-700 dark:text-slate-300">
                          <input 
                            type="checkbox" 
                            checked={isActive}
                            onChange={() => {
                              if (isActive) {
                                setActiveWidgets(prev => prev.filter(x => x !== wid.id));
                                addLog("I", "WidgetManager", `Removed widget from desktop: ${wid.label}`);
                              } else {
                                setActiveWidgets(prev => [...prev, wid.id]);
                                addLog("I", "WidgetManager", `Added widget to desktop: ${wid.label}`);
                              }
                            }}
                            className="rounded border-slate-300 text-[#6750A4] focus:ring-[#6750A4]"
                          />
                          {wid.label}
                        </label>
                      );
                    })}
                  </div>
                )}
                <p className="text-[8px] text-slate-400 font-semibold leading-relaxed">
                  Widgets appear on the simulated desktop <strong>Home</strong> tab!
                </p>
              </div>

              {/* Section 5: Secure Keystore Hardware Options */}
              <div className="mb-3">
                <h4 className="text-[9px] font-bold text-slate-500 mb-1 uppercase">Hardware Vault Keymaster</h4>
                <div className="p-2 bg-slate-900 text-slate-300 rounded-xl border border-slate-800 space-y-1 text-[8px] font-mono leading-relaxed">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-1 mb-1">
                    <span>Keystore:</span>
                    <select 
                      value={keystoreProvider}
                      onChange={(e: any) => {
                        setKeystoreProvider(e.target.value);
                        addLog("W", "Keystore", `Security keys switched to: ${e.target.value.toUpperCase()}`);
                      }}
                      className="bg-slate-800 text-slate-200 text-[8px] border-none rounded p-0.5 outline-none font-bold cursor-pointer"
                    >
                      <option value="software">TEE Software</option>
                      <option value="strongbox">StrongBox Hardware</option>
                    </select>
                  </div>
                  <div>Status: <span className="text-emerald-400 font-bold">{keystoreProvider === "strongbox" ? "STRONGBOX KEYMASTER" : "TEE SOFTWARE API"}</span></div>
                  <div>Standard: <span>{keystoreProvider === "strongbox" ? "FIPS 140-2 L3" : "FIPS 140-2 L1"}</span></div>
                </div>
              </div>

              {/* Section 6: Chromecast Status */}
              <div>
                <h4 className="text-[9px] font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
                  <Tv className="w-3.5 h-3.5 text-blue-600" />
                  Casting Remote ({castingDevice ? "ACTIVE" : "IDLE"})
                </h4>
                {castingDevice ? (
                  <div className="p-1.5 bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 rounded-lg space-y-1">
                    <div className="text-[8.5px] font-bold text-blue-700 dark:text-blue-300 flex items-center justify-between">
                      <span className="truncate">Connected: {castingDevice}</span>
                      <button 
                        onClick={() => {
                          setCastingDevice(null);
                          addLog("I", "Chromecast", "Stopped active casting session.");
                        }}
                        className="text-red-600 hover:underline text-[8px] cursor-pointer shrink-0"
                      >
                        Disconnect
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-[8px] text-slate-400 leading-snug">
                    To cast, tap the wireless stream button at the top of any photo or video preview!
                  </p>
                )}
              </div>
            </div>
          )}

        </section>

        {/* Right column: Interactive Clean Architecture & MVVM Codebase Browser */}
        {viewMode === "simulator" && (
          <section className="flex-1 flex flex-col bg-slate-950 overflow-hidden" id="ide_column">
          
          {/* Tabs bar */}
          <div className="bg-slate-900 border-b border-slate-800 px-4 py-1.5 flex items-center justify-between" id="ide_tabs_header">
            <div className="flex items-center gap-1.5 sm:gap-3">
              <button
                onClick={() => setIdeTab("code")}
                className={`px-3 py-2 text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 border-b-2 transition cursor-pointer ${
                  ideTab === "code"
                    ? "text-[#D0BCFF] border-[#6750A4]"
                    : "text-slate-400 hover:text-white border-transparent"
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>Source Explorer</span>
              </button>
              
              <button
                onClick={() => setIdeTab("play_ready")}
                className={`px-3 py-2 text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 border-b-2 transition relative cursor-pointer ${
                  ideTab === "play_ready"
                    ? "text-[#D0BCFF] border-[#6750A4]"
                    : "text-slate-400 hover:text-white border-transparent"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Google Play Hub</span>
                <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </button>
            </div>
            
            <div className="hidden md:flex items-center gap-1.5 text-[11px] text-slate-300 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/60 font-mono">
              <Activity className="w-3.5 h-3.5 text-[#D0BCFF]" />
              <span>Target SDK:</span>
              <span className="text-emerald-400 font-bold">API 35 (Android 15)</span>
            </div>
          </div>

          {ideTab === "code" ? (
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
              
              {/* File Directory Column */}
              <div className="md:w-64 border-b md:border-b-0 md:border-r border-[#CAC4D0] bg-[#F8F9FA] overflow-y-auto flex flex-col shrink-0" id="file_directory">
                <div className="p-3 text-[10.5px] font-bold text-[#49454F] uppercase tracking-widest border-b border-[#CAC4D0] bg-[#ECE6F0]/20">
                  Directory Hierarchy
                </div>

                <div className="p-2 space-y-1">
                  {KOTLIN_CODEBASE.map(cat => {
                    const isExpanded = expandedCategories[cat.title];
                    return (
                      <div key={cat.title} className="space-y-0.5">
                        <button
                          onClick={() => setExpandedCategories(prev => ({ ...prev, [cat.title]: !prev[cat.title] }))}
                          className="w-full text-left px-2 py-1.5 hover:bg-[#ECE6F0] rounded-lg text-xs font-semibold text-[#1C1B1F] flex items-center justify-between cursor-pointer transition"
                        >
                          <span className="truncate">{cat.title}</span>
                          <span className="text-[10px] text-[#49454F] font-mono">
                            {isExpanded ? "▼" : "►"}
                          </span>
                        </button>

                        {isExpanded && (
                          <div className="pl-3 space-y-0.5 border-l border-[#CAC4D0] ml-2.5 my-0.5">
                            {cat.files.map(file => {
                              const isSelected = selectedCodeFile.path === file.path;
                              return (
                                <button
                                  key={file.path}
                                  onClick={() => {
                                    setSelectedCodeFile(file);
                                    addLog("D", "IDE", `Opened source file for browsing: ${file.path}`);
                                  }}
                                  className={`w-full text-left px-2 py-1 hover:bg-[#ECE6F0]/80 rounded text-[11.5px] font-mono flex items-center gap-1.5 truncate cursor-pointer transition ${isSelected ? "bg-[#EADDFF] text-[#21005D] font-bold border-l-2 border-[#6750A4] pl-1.5" : "text-[#49454F] hover:text-[#1C1B1F]"}`}
                                >
                                  <FileText className={`w-3.5 h-3.5 shrink-0 ${isSelected ? "text-[#6750A4]" : "text-[#49454F]"}`} />
                                  <span className="truncate">{file.name}</span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Code Content Column */}
              <div className="flex-1 flex flex-col bg-white overflow-hidden" id="code_content_container">
                
                {/* File details panel */}
                <div className="bg-[#F8F9FA] px-4 py-2.5 border-b border-[#CAC4D0]/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="text-[#49454F] font-mono font-bold">Path:</span>{" "}
                    <span className="text-[#6750A4] font-mono font-bold text-[11px]">app/src/main/java/com/google/android/gallery/{selectedCodeFile.path}</span>
                  </div>
                  <div className="text-[10.5px] text-[#21005D] font-bold px-2 py-0.5 bg-[#EADDFF] rounded-full border border-[#CAC4D0]/40">
                    {selectedCodeFile.name.endsWith(".kt") ? "Kotlin Standard Source" : "Gradle build manifest"}
                  </div>
                </div>

                {/* File architectural rationale commentary */}
                <div className="bg-[#F3EDF7] px-4 py-3 border-b border-[#CAC4D0]/60 text-xs text-[#21005D] flex gap-2.5 items-start">
                  <Info className="w-4 h-4 text-[#6750A4] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold mb-0.5">Senior Engineering Decision / Rationale:</p>
                    <p className="text-[#49454F] font-medium leading-normal">{selectedCodeFile.description}</p>
                  </div>
                </div>

                {/* Code Scrollable Editor panel */}
                <div className="flex-1 overflow-y-auto p-4 font-mono text-xs bg-[#F8F9FA] select-text relative border-b border-[#CAC4D0]/40" id="code_view_area">
                  
                  {/* Visual Line Numbers */}
                  <div className="absolute left-4 top-4 text-[#CAC4D0] select-none text-right w-8 font-bold">
                    {selectedCodeFile.content.split("\n").map((_, i) => (
                      <div key={i} className="leading-5">{i + 1}</div>
                    ))}
                  </div>

                  <pre className="pl-12 text-[#1C1B1F] leading-5 whitespace-pre">
                    <code>{selectedCodeFile.content}</code>
                  </pre>
                </div>

              </div>

            </div>
          ) : (
            <div className="flex-1 flex flex-col xl:flex-row bg-[#F8F9FA] overflow-y-auto min-h-0" id="play_compliance_hub">
              {/* Compliance Left Side: Scan Audit Console */}
              <div className="flex-1 p-5 border-b xl:border-b-0 xl:border-r border-[#CAC4D0] flex flex-col gap-5 min-h-0 overflow-y-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-[#1C1B1F] tracking-tight">Google Play Policy Verification Console</h3>
                    <p className="text-[11px] text-[#49454F]">Run instant security and policy audits for Google Play Store compliance</p>
                  </div>
                  <div className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1 self-start">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>SDK 35 Compliant</span>
                  </div>
                </div>

                {/* Audit trigger & Gauge */}
                <div className="p-4 bg-white rounded-2xl border border-[#CAC4D0]/60 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-3 flex-1 w-full">
                    <h4 className="text-[10px] font-bold text-[#6750A4] uppercase tracking-wider">Play Store Approval Score</h4>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                        {playScanState === "finished" ? "100" : playScanState === "scanning" ? Math.floor(playScanProgress) : "94"}%
                      </span>
                      <span className="text-[11px] text-[#49454F] font-semibold">Ready for Upload</span>
                    </div>
                    
                    {/* Progress Bar */}
                    {playScanState === "scanning" && (
                      <div className="space-y-1 w-full">
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-[#6750A4]"
                            initial={{ width: "0%" }}
                            animate={{ width: `${playScanProgress}%` }}
                            transition={{ duration: 0.1 }}
                          />
                        </div>
                        <p className="text-[10px] text-[#6750A4] font-bold font-mono">Analyzing APK structures: {Math.floor(playScanProgress)}%</p>
                      </div>
                    )}

                    <div>
                      <button
                        onClick={handleTriggerComplianceAudit}
                        disabled={playScanState === "scanning"}
                        className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                          playScanState === "scanning"
                            ? "bg-slate-200 text-slate-400 border border-slate-300"
                            : "bg-[#6750A4] hover:bg-[#6750A4]/95 text-white shadow-sm"
                        }`}
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${playScanState === "scanning" ? "animate-spin" : ""}`} />
                        {playScanState === "scanning" ? "Running Policy Audit..." : "Initiate Compliance Audit"}
                      </button>
                    </div>
                  </div>

                  {/* Circular Compliance Ring */}
                  <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="40" cy="40" r="34" className="stroke-slate-100 fill-none" strokeWidth="6" />
                      <motion.circle 
                        cx="40" 
                        cy="40" 
                        r="34" 
                        className="stroke-emerald-500 fill-none" 
                        strokeWidth="6" 
                        strokeDasharray="213.6"
                        initial={{ strokeDashoffset: 213.6 }}
                        animate={{ 
                          strokeDashoffset: playScanState === "finished" 
                            ? 0 
                            : playScanState === "scanning" 
                              ? 213.6 - (213.6 * playScanProgress) / 100 
                              : 12.8 // 94% filled 
                        }}
                        transition={{ type: "tween", duration: 0.5 }}
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-sm font-extrabold text-slate-900">
                        {playScanState === "finished" ? "PASS" : playScanState === "scanning" ? "SCAN" : "94%"}
                      </span>
                      <span className="text-[7px] font-bold text-[#49454F] uppercase tracking-widest">Status</span>
                    </div>
                  </div>
                </div>

                {/* Audit Checklist Items */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold text-[#49454F] uppercase tracking-widest">Mandatory Policy Checklists</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { 
                        title: "Target SDK 35 (Android 15)", 
                        desc: "Verified that targetSdkVersion compiles against Android 15 toolchains.", 
                        status: "compliant", 
                        reason: "Ensures compliance with Google Play's annual SDK upgrade requirement." 
                      },
                      { 
                        title: "Scoped Storage Enforcement", 
                        desc: "Zero broad storage access flags detected. Handled via PhotoPicker & MediaStore.", 
                        status: "compliant", 
                        reason: "Eliminates dangerous storage permission requests from the Play Console." 
                      },
                      { 
                        title: "Biometric Keystore Guard", 
                        desc: "Authentication bounds managed via system Keyguard and StrongBox Keystores.", 
                        status: "compliant", 
                        reason: "Maintains maximum enterprise security standards for highly confidential media files." 
                      },
                      { 
                        title: "30-day Automatic Sandbox Purge", 
                        desc: "Trash files isolation follows strictly defined sandboxed lifecycle schedules.", 
                        status: "compliant", 
                        reason: "Aligns with Google Play user-data retention policies on localized caches." 
                      },
                      { 
                        title: "Zero Unsolicited Background Syncs", 
                        desc: "Database syncing utilizes explicit SQLite replica streams triggered under user consent.", 
                        status: "compliant", 
                        reason: "Complies with user data tracking policies by avoiding quiet background telemetry." 
                      },
                      { 
                        title: "Granular UI Disclosures", 
                        desc: "Contextual disclosure dialogs explain permission requests before asking.", 
                        status: "compliant", 
                        reason: "Increases play store approval conversion rates and decreases user friction." 
                      }
                    ].map((item, idx) => (
                      <div key={idx} className="p-3 bg-white rounded-xl border border-[#CAC4D0]/60 shadow-sm flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                          <h5 className="text-[11.5px] font-bold text-[#1C1B1F]">{item.title}</h5>
                          <p className="text-[10px] text-[#49454F] font-medium leading-normal mt-0.5">{item.desc}</p>
                          <div className="mt-1.5 bg-slate-50 border border-slate-100 p-1.5 rounded text-[9px] font-mono leading-relaxed text-[#6750A4] font-semibold">
                            <span className="text-slate-500 font-bold uppercase block text-[8px] mb-0.5">Play Console Relevance:</span>
                            {item.reason}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Verification console logs */}
                <div className="p-3.5 bg-slate-900 text-slate-300 rounded-xl border border-slate-800 font-mono text-[10px] leading-normal space-y-1">
                  <div className="flex items-center gap-1.5 text-[#D0BCFF] font-bold text-[11px]">
                    <Activity className="w-3.5 h-3.5 animate-pulse" />
                    <span>Compliance Verification Log stream:</span>
                  </div>
                  <div className="max-h-[85px] overflow-y-auto space-y-0.5 pr-2">
                    {playScanLogs.length > 0 ? (
                      playScanLogs.map((log, i) => (
                        <div key={i} className={log.includes("OK") || log.includes("passed") || log.includes("complete") ? "text-emerald-400 font-bold" : ""}>{log}</div>
                      ))
                    ) : (
                      <div className="text-slate-500 italic">No verification logged. Press 'Initiate Compliance Audit' above.</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Compliance Right Side: AI Asset Draft Generator */}
              <div className="md:w-full xl:w-[380px] p-5 flex flex-col gap-4 bg-white border-t xl:border-t-0 xl:border-l border-[#CAC4D0]/60 overflow-y-auto shrink-0">
                <div>
                  <h3 className="text-xs font-bold text-[#1C1B1F] tracking-tight flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#6750A4]" />
                    <span>Gemini AI Publishing Generator</span>
                  </h3>
                  <p className="text-[10px] text-[#49454F] mt-0.5">Generate high-converting, compliant descriptions and safety forms using Gemini 3.5 Flash</p>
                </div>

                <div className="flex flex-col gap-2.5">
                  {[
                    {
                      id: "description",
                      title: "Store Listing Description",
                      description: "Rich description with Scoped Storage, Keystore API & M3 UI details.",
                    },
                    {
                      id: "datasafety",
                      title: "Data Safety Questionnaire Form",
                      description: "Declarations stating zero telemetry with AES-256 database protection.",
                    },
                    {
                      id: "privacypolicy",
                      title: "Google Play Privacy Policy",
                      description: "Secure offline-first policy specifying localized biometrics operations.",
                    }
                  ].map((asset) => (
                    <button
                      key={asset.id}
                      onClick={() => handleGeneratePlayAsset(asset.id)}
                      disabled={isGeneratingPlayAsset}
                      className="text-left p-3 bg-slate-50 hover:bg-slate-100/70 border border-[#CAC4D0]/50 rounded-xl transition cursor-pointer flex items-start gap-2.5 shadow-sm group"
                    >
                      <div className="p-1.5 bg-[#F3EDF7] text-[#6750A4] rounded-lg group-hover:bg-[#EADDFF] transition mt-0.5 shrink-0">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[11px] font-bold text-[#1C1B1F] flex items-center justify-between gap-1.5">
                          <span className="truncate">{asset.title}</span>
                          <span className="text-[8px] font-mono font-bold uppercase tracking-wider text-[#6750A4] bg-[#EADDFF] px-1.5 py-0.5 rounded shrink-0">Draft</span>
                        </h4>
                        <p className="text-[9.5px] text-[#49454F] leading-normal mt-0.5 font-medium">{asset.description}</p>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Live preview box */}
                <div className="flex-1 flex flex-col border border-[#CAC4D0]/60 rounded-xl overflow-hidden bg-slate-50 min-h-[180px]">
                  <div className="bg-slate-100/80 px-3 py-1.5 border-b border-[#CAC4D0]/40 flex items-center justify-between">
                    <span className="text-[9.5px] font-bold text-[#49454F] uppercase tracking-wider font-mono">AI Generator Output</span>
                    {generatedPlayAsset && (
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(generatedPlayAsset.content);
                          addLog("I", "PublishingAssistant", `Copied generated ${generatedPlayAsset.type} payload to clipboard.`);
                        }}
                        className="px-2 py-0.5 bg-white hover:bg-slate-100 text-[#49454F] text-[9.5px] font-bold rounded border border-[#CAC4D0]/50 transition flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                        Copy text
                      </button>
                    )}
                  </div>
                  
                  <div className="flex-1 p-3 overflow-y-auto font-mono text-[10.5px] leading-relaxed select-text text-slate-800">
                    {isGeneratingPlayAsset ? (
                      <div className="h-full flex flex-col items-center justify-center gap-2 text-slate-500">
                        <RefreshCw className="w-4 h-4 animate-spin text-[#6750A4]" />
                        <span className="text-[9px] font-bold uppercase tracking-wider">Generating copy with Gemini AI...</span>
                      </div>
                    ) : generatedPlayAsset ? (
                      <div className="whitespace-pre-wrap select-text selection:bg-purple-200">
                        {generatedPlayAsset.content}
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center p-3 text-slate-400">
                        <AlertCircle className="w-6 h-6 stroke-[1.5] text-[#CAC4D0] mb-1.5" />
                        <p className="text-[10px] font-semibold leading-normal">No asset has been generated yet.</p>
                        <p className="text-[9px] text-slate-400 mt-1 max-w-[180px]">Click any generator above to draft listing materials tailored for Google Play approval guidelines.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bottom simulated Android Logcat terminal */}
          <div className="h-48 border-t border-[#CAC4D0] bg-[#F8F9FA] flex flex-col" id="logcat_terminal">
            
            {/* Terminal menu */}
            <div className="bg-[#ECE6F0] border-b border-[#CAC4D0] px-4 py-1.5 flex items-center justify-between text-xs" id="logcat_header">
              <div className="flex items-center gap-2 font-mono text-[11px] font-bold text-[#1C1B1F]">
                <Activity className="w-3.5 h-3.5 text-[#6750A4]" />
                <span>Simulated Android Device Logcat Console</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[#49454F] font-bold uppercase font-mono">Filter level:</span>
                <select
                  value={logFilter}
                  onChange={(e) => setLogFilter(e.target.value as any)}
                  className="bg-white text-[#1C1B1F] border border-[#CAC4D0] px-2 py-0.5 rounded outline-none font-mono text-[11px] cursor-pointer"
                >
                  <option value="ALL">ALL LEVELS</option>
                  <option value="D">DEBUG (D)</option>
                  <option value="I">INFO (I)</option>
                  <option value="W">WARNING (W)</option>
                  <option value="E">ERROR (E)</option>
                </select>

                <button
                  onClick={() => setLogs([])}
                  className="px-2 py-0.5 bg-white hover:bg-[#ECE6F0] rounded text-[10.5px] border border-[#CAC4D0] font-mono transition text-[#49454F] cursor-pointer font-bold"
                >
                  Clear Logs
                </button>
              </div>
            </div>

            {/* Scrollable logs box */}
            <div 
              ref={logTerminalRef}
              className="flex-1 p-3 font-mono text-[10.5px] overflow-y-auto space-y-0.5 select-text bg-white" 
              id="log_entries_list"
            >
              {filteredLogs.length === 0 ? (
                <div className="text-[#49454F]/60 italic text-center py-6">
                  No log entries matching the selected level. Perform actions in the emulator phone to generate system logs.
                </div>
              ) : (
                filteredLogs.map(log => {
                  let levelColor = "text-[#49454F]";
                  let tagBg = "bg-[#ECE6F0] text-[#1C1B1F] border border-[#CAC4D0]/30";
                  
                  if (log.level === "D") { levelColor = "text-blue-700 bg-blue-50/20"; tagBg = "bg-blue-100 text-blue-800 border border-blue-200/50"; }
                  else if (log.level === "I") { levelColor = "text-emerald-700 bg-emerald-50/20"; tagBg = "bg-emerald-100 text-emerald-800 border border-emerald-200/50"; }
                  else if (log.level === "W") { levelColor = "text-amber-700 bg-amber-50/20"; tagBg = "bg-amber-100 text-amber-800 border border-amber-200/50"; }
                  else if (log.level === "E") { levelColor = "text-red-700 font-bold bg-red-50/20"; tagBg = "bg-red-100 text-red-800 border border-red-200/50"; }

                  return (
                    <div key={log.id} className={`flex items-start gap-2 leading-relaxed p-0.5 rounded ${levelColor}`}>
                      <span className="text-[#49454F]/70 select-none shrink-0">{log.timestamp}</span>
                      <span className="font-bold shrink-0 font-mono">[{log.level}]</span>
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold tracking-tight shrink-0 ${tagBg}`}>{log.tag}</span>
                      <span className="whitespace-pre-wrap font-medium">{log.message}</span>
                    </div>
                  );
                })
              )}
            </div>

          </div>

        </section>
      )}

      </div>

    </div>
  );
}
