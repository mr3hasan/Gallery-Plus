import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Initialize Gemini API client securely on the server
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
} else {
  console.warn("GEMINI_API_KEY is not defined. AI features will fallback to offline mock generators.");
}

// Default set of high-fidelity images representing a real Android device's MediaStore
// Standard Unsplash photos representing diverse topics for testing EXIF & visual analysis
let galleryPhotos = [
  {
    id: "photo_001",
    title: "Mountain Sunrise",
    description: "Stunning morning light hitting the alpine peaks during a summer hike.",
    url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
    dateAdded: "2026-07-14T06:12:45Z",
    album: "Camera",
    mimeType: "image/jpeg",
    size: "4.2 MB",
    width: 4032,
    height: 3024,
    isFavorite: true,
    isSynced: true,
    isInTrash: false,
    trashTimeLeftDays: null,
    exif: {
      camera: "Google Pixel 9 Pro",
      lens: "f/1.7 wide, 6.9mm equivalent",
      aperture: "f/1.68",
      exposureTime: "1/450s",
      iso: "ISO 50",
      focalLength: "6.9mm",
      location: {
        latitude: 45.8327,
        longitude: 6.8651,
        address: "Mont Blanc, Alps, France"
      }
    },
    tags: ["mountain", "sunrise", "nature", "landscape", "snow", "hiking"]
  },
  {
    id: "video_001",
    title: "Mountain Stream Loop",
    description: "Relaxing visual of a crystal-clear spring stream flowing through rocks and forest.",
    url: "https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=400&q=80",
    dateAdded: "2026-07-14T02:30:00Z",
    album: "Camera",
    mimeType: "video/mp4",
    size: "8.5 MB",
    width: 1920,
    height: 1080,
    isFavorite: false,
    isSynced: true,
    isInTrash: false,
    trashTimeLeftDays: null,
    exif: {
      camera: "Google Pixel 9 Pro",
      lens: "f/2.2 ultra-wide, Cinematic Mode",
      aperture: "f/2.2",
      exposureTime: "1/60s",
      iso: "ISO 100",
      focalLength: "2.2mm",
      location: {
        latitude: 47.3769,
        longitude: 8.5417,
        address: "Zurich Forest, Switzerland"
      }
    },
    tags: ["stream", "forest", "video", "water", "nature", "relaxing"]
  },
  {
    id: "video_002",
    title: "Ocean Wave Aerial",
    description: "Drone footage of beautiful turquoise waves breaking over a sandy beach shore.",
    url: "https://assets.mixkit.co/videos/preview/mixkit-waves-breaking-in-the-ocean-from-above-43022-large.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=400&q=80",
    dateAdded: "2026-07-13T10:15:00Z",
    album: "Camera",
    mimeType: "video/mp4",
    size: "12.4 MB",
    width: 1920,
    height: 1080,
    isFavorite: true,
    isSynced: true,
    isInTrash: false,
    trashTimeLeftDays: null,
    exif: {
      camera: "DJI Mini 4 Pro",
      lens: "f/1.7, Drone Gimbal Optic",
      aperture: "f/1.7",
      exposureTime: "1/120s",
      iso: "ISO 100",
      focalLength: "6.7mm",
      location: {
        latitude: 21.3069,
        longitude: -157.8583,
        address: "Waikiki Beach, Hawaii, USA"
      }
    },
    tags: ["ocean", "waves", "beach", "drone", "hawaii", "water"]
  },
  {
    id: "photo_002",
    title: "Neon Cyberpunk Streets",
    description: "Rain-slicked alleyways illuminated by flashing pink and cyan advertisements.",
    url: "https://images.unsplash.com/photo-1515621061946-eff1c2a352bd?auto=format&fit=crop&w=1200&q=80",
    dateAdded: "2026-07-13T23:45:10Z",
    album: "Downloads",
    mimeType: "image/jpeg",
    size: "1.8 MB",
    width: 3240,
    height: 4050,
    isFavorite: false,
    isSynced: true,
    isInTrash: false,
    trashTimeLeftDays: null,
    exif: {
      camera: "Sony α7R V",
      lens: "FE 24-70mm F2.8 GM II",
      aperture: "f/2.8",
      exposureTime: "1/60s",
      iso: "ISO 800",
      focalLength: "35mm",
      location: {
        latitude: 35.6895,
        longitude: 139.6917,
        address: "Shinjuku, Tokyo, Japan"
      }
    },
    tags: ["tokyo", "cyberpunk", "neon", "rain", "city", "night"]
  },
  {
    id: "photo_003",
    title: "Workspace Screenshot",
    description: "Vite dev server output and browser terminal console log.",
    url: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&w=1200&q=80",
    dateAdded: "2026-07-13T14:22:01Z",
    album: "Screenshots",
    mimeType: "image/png",
    size: "820 KB",
    width: 1920,
    height: 1080,
    isFavorite: false,
    isSynced: false,
    isInTrash: false,
    trashTimeLeftDays: null,
    exif: {
      camera: "Android System (UI Capture)",
      lens: "Software Capture",
      aperture: "N/A",
      exposureTime: "N/A",
      iso: "N/A",
      focalLength: "N/A",
      location: null
    },
    tags: ["screenshot", "code", "programming", "editor", "tech"]
  },
  {
    id: "photo_004",
    title: "Cozy Coffee & Code",
    description: "Hot latte beside a laptop open to Android Studio in a warm cafe environment.",
    url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80",
    dateAdded: "2026-07-11T09:15:30Z",
    album: "Camera",
    mimeType: "image/jpeg",
    size: "2.5 MB",
    width: 4032,
    height: 3024,
    isFavorite: true,
    isSynced: true,
    isInTrash: false,
    trashTimeLeftDays: null,
    exif: {
      camera: "Google Pixel 9 Pro",
      lens: "f/1.7 wide, 6.9mm equivalent",
      aperture: "f/1.7",
      exposureTime: "1/120s",
      iso: "ISO 160",
      focalLength: "6.9mm",
      location: {
        latitude: 37.7749,
        longitude: -122.4194,
        address: "Coffee Lab, San Francisco, USA"
      }
    },
    tags: ["coffee", "laptop", "cafe", "developer", "morning", "macbook"]
  },
  {
    id: "photo_005",
    title: "Minimalist Desert Dunes",
    description: "Symmetrical orange sand ridges contrasting with a clear light blue sky.",
    url: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80",
    dateAdded: "2026-07-08T18:04:12Z",
    album: "Camera",
    mimeType: "image/jpeg",
    size: "3.1 MB",
    width: 3840,
    height: 2160,
    isFavorite: false,
    isSynced: true,
    isInTrash: false,
    trashTimeLeftDays: null,
    exif: {
      camera: "Google Pixel 9 Pro",
      lens: "f/2.8 telephoto, 110mm equivalent",
      aperture: "f/2.8",
      exposureTime: "1/800s",
      iso: "ISO 40",
      focalLength: "22mm",
      location: {
        latitude: 24.8607,
        longitude: 46.8614,
        address: "Ad Dahna Desert, Saudi Arabia"
      }
    },
    tags: ["desert", "sand", "minimalist", "sky", "orange", "nature"]
  },
  {
    id: "photo_006",
    title: "Golden Retriever Puppy",
    description: "Cute dog running through green grass chasing a red ball in slow motion.",
    url: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1200&q=80",
    dateAdded: "2026-07-05T15:30:18Z",
    album: "Camera",
    mimeType: "image/jpeg",
    size: "3.7 MB",
    width: 4000,
    height: 3000,
    isFavorite: true,
    isSynced: false,
    isInTrash: false,
    trashTimeLeftDays: null,
    exif: {
      camera: "Google Pixel 9 Pro",
      lens: "f/1.7 wide, 6.9mm equivalent",
      aperture: "f/1.68",
      exposureTime: "1/500s",
      iso: "ISO 80",
      focalLength: "6.9mm",
      location: {
        latitude: 34.0522,
        longitude: -118.2437,
        address: "Griffith Park, Los Angeles, USA"
      }
    },
    tags: ["dog", "puppy", "pet", "golden retriever", "animal", "outdoor", "cute"]
  },
  {
    id: "photo_007",
    title: "Deleted Receipt Pic",
    description: "Blurry receipt of grocery shopping from last week, scheduled for permanent erasure.",
    url: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&w=1200&q=80",
    dateAdded: "2026-07-02T11:05:40Z",
    album: "Camera",
    mimeType: "image/jpeg",
    size: "1.2 MB",
    width: 3024,
    height: 4032,
    isFavorite: false,
    isSynced: false,
    isInTrash: true,
    trashTimeLeftDays: 21,
    exif: {
      camera: "Google Pixel 9 Pro",
      lens: "f/1.7 wide",
      aperture: "f/1.7",
      exposureTime: "1/40s",
      iso: "ISO 320",
      focalLength: "6.9mm",
      location: null
    },
    tags: ["receipt", "blurry", "trash", "document"]
  },
  {
    id: "raw_001",
    title: "Alpine RAW Landscape",
    description: "Uncompressed camera sensor capture of the Swiss peaks. Perfect for RAW demosaicing edits.",
    url: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80",
    dateAdded: "2026-07-15T15:20:00Z",
    album: "Camera",
    mimeType: "image/x-adobe-dng",
    size: "24.5 MB",
    width: 6000,
    height: 4000,
    isFavorite: false,
    isSynced: true,
    isInTrash: false,
    trashTimeLeftDays: null,
    exif: {
      camera: "Hasselblad X2D 100C",
      lens: "XCD 38mm f/2.5",
      aperture: "f/5.6",
      exposureTime: "1/250s",
      iso: "ISO 64",
      focalLength: "38mm",
      location: {
        latitude: 46.0207,
        longitude: 7.7491,
        address: "Zermatt, Matterhorn, Switzerland"
      }
    },
    tags: ["raw", "dng", "mountain", "snow", "landscape", "nature"]
  },
  {
    id: "gif_001",
    title: "Playful Cat Animation",
    description: "Looping animation of an adorable orange cat playing with a yarn ball.",
    url: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3h0ZXF2MmI0MHEwdmE2ZHA4NHlqbW96N3NidnhiaXBoODNsc21hdiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oriO0OEd9QIDdllqo/giphy.gif",
    dateAdded: "2026-07-15T11:45:00Z",
    album: "Downloads",
    mimeType: "image/gif",
    size: "3.4 MB",
    width: 480,
    height: 480,
    isFavorite: false,
    isSynced: true,
    isInTrash: false,
    trashTimeLeftDays: null,
    exif: {
      camera: "Web Animation Engine",
      lens: "Procedural",
      aperture: "N/A",
      exposureTime: "N/A",
      iso: "N/A",
      focalLength: "N/A",
      location: null
    },
    tags: ["gif", "cat", "animation", "cute", "animal"]
  },
  {
    id: "pdf_001",
    title: "Secure Keystore Specification",
    description: "Confidential specification detailing Android 15 hardware Keyguard secure-storage architecture.",
    url: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=1200&q=80",
    dateAdded: "2026-07-16T10:00:00Z",
    album: "Secure Vault",
    mimeType: "application/pdf",
    size: "1.4 MB",
    width: 842,
    height: 595,
    isFavorite: false,
    isSynced: false,
    isInTrash: false,
    trashTimeLeftDays: null,
    exif: {
      camera: "Android Doc Scanner",
      lens: "Software PDF compiler",
      aperture: "N/A",
      exposureTime: "N/A",
      iso: "N/A",
      focalLength: "N/A",
      location: null
    },
    tags: ["pdf", "document", "confidential", "keystore", "spec"]
  },
  {
    id: "zip_001",
    title: "Trip Archive Backup",
    description: "Encrypted zip package containing historical vacation images and trip diary files.",
    url: "https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?auto=format&fit=crop&w=1200&q=80",
    dateAdded: "2026-07-16T08:30:00Z",
    album: "Secure Vault",
    mimeType: "application/zip",
    size: "45.2 MB",
    width: 512,
    height: 512,
    isFavorite: true,
    isSynced: true,
    isInTrash: false,
    trashTimeLeftDays: null,
    exif: {
      camera: "AOSP Archiver Engine",
      lens: "ZIP-deflate v2.0",
      aperture: "N/A",
      exposureTime: "N/A",
      iso: "N/A",
      focalLength: "N/A",
      location: null
    },
    tags: ["zip", "archive", "backup", "vacation"]
  }
];

// In-memory backup copy to reset state
const originalPhotos = JSON.parse(JSON.stringify(galleryPhotos));

// In-memory Secure Vault PIN (Simulates Encrypted Android Keystore Settings storage)
let secureVaultPin: string | null = null;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Get all photos (add default isHidden if missing)
  app.get("/api/photos", (req, res) => {
    const photosWithHidden = galleryPhotos.map(p => ({
      ...p,
      isHidden: (p as any).isHidden || false
    }));
    res.json(photosWithHidden);
  });

  // API Route: Toggle Favorite Status
  app.patch("/api/photos/:id/favorite", (req, res) => {
    const { id } = req.params;
    const photo = galleryPhotos.find(p => p.id === id);
    if (!photo) {
      return res.status(404).json({ error: "Photo not found" });
    }
    photo.isFavorite = !photo.isFavorite;
    photo.isSynced = false; // Set unsynced when modified locally
    res.json({ success: true, photo });
  });

  // API Route: Sync Photo to Cloud (Room DB Background Worker simulation)
  app.post("/api/photos/:id/sync", (req, res) => {
    const { id } = req.params;
    const photo = galleryPhotos.find(p => p.id === id);
    if (!photo) {
      return res.status(404).json({ error: "Photo not found" });
    }
    photo.isSynced = true; // Synced successfully
    res.json({ success: true, photo });
  });

  // API Route: Soft Delete Photo (Move to Trash)
  app.delete("/api/photos/:id", (req, res) => {
    const { id } = req.params;
    const photo = galleryPhotos.find(p => p.id === id);
    if (!photo) {
      return res.status(404).json({ error: "Photo not found" });
    }
    
    if (photo.isInTrash) {
      // Hard delete
      galleryPhotos = galleryPhotos.filter(p => p.id !== id);
      res.json({ success: true, action: "hard_delete", id });
    } else {
      // Soft delete (Play Store Policy Compliant Trash Bin)
      photo.isInTrash = true;
      photo.trashTimeLeftDays = 30; // 30 Days left according to Android standards
      res.json({ success: true, action: "soft_delete", photo });
    }
  });

  // API Route: Restore Photo from Trash
  app.post("/api/photos/:id/restore", (req, res) => {
    const { id } = req.params;
    const photo = galleryPhotos.find(p => p.id === id);
    if (!photo) {
      return res.status(404).json({ error: "Photo not found" });
    }
    photo.isInTrash = false;
    photo.trashTimeLeftDays = null;
    res.json({ success: true, photo });
  });

  // API Route: Reset database (re-seed)
  app.post("/api/photos/reset", (req, res) => {
    galleryPhotos = JSON.parse(JSON.stringify(originalPhotos));
    secureVaultPin = null; // Clear secure PIN
    res.json({ success: true, message: "Database re-seeded and Secure Vault PIN reset successfully." });
  });

  // API Route: Secure Vault Status
  app.get("/api/vault/status", (req, res) => {
    res.json({ success: true, hasPin: secureVaultPin !== null });
  });

  // API Route: Setup Secure Vault PIN
  app.post("/api/vault/setup", (req, res) => {
    const { pin } = req.body;
    if (!pin || pin.length !== 4 || isNaN(Number(pin))) {
      return res.status(400).json({ error: "Invalid PIN format. Must be a 4-digit number." });
    }
    secureVaultPin = pin;
    res.json({ success: true, message: "Secure Vault PIN configured successfully." });
  });

  // API Route: Unlock Secure Vault
  app.post("/api/vault/unlock", (req, res) => {
    const { pin } = req.body;
    if (secureVaultPin === null) {
      return res.status(400).json({ error: "Secure Vault PIN has not been set up yet." });
    }
    if (secureVaultPin === pin) {
      res.json({ success: true, message: "Decryption Key authorized." });
    } else {
      res.status(401).json({ error: "Incorrect PIN. Encrypted storage access denied." });
    }
  });

  // API Route: Hide / Unhide Photo (AES Encrypted Vault Simulation)
  app.patch("/api/photos/:id/hide", (req, res) => {
    const { id } = req.params;
    const { isHidden } = req.body;
    const photo = galleryPhotos.find(p => p.id === id);
    if (!photo) {
      return res.status(404).json({ error: "Photo not found" });
    }
    (photo as any).isHidden = isHidden;
    photo.isSynced = false; // Flag unsynced to require sync worker update
    res.json({ success: true, photo });
  });

  // API Route: Edit photo metadata
  app.put("/api/photos/:id", (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const index = galleryPhotos.findIndex(p => p.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Photo not found" });
    }
    galleryPhotos[index] = { ...galleryPhotos[index], ...updates };
    res.json({ success: true, photo: galleryPhotos[index] });
  });

  // API Route: Batch Copy Photos
  app.post("/api/photos/batch/copy", (req, res) => {
    const { ids, targetAlbum } = req.body;
    if (!Array.isArray(ids) || !targetAlbum) {
      return res.status(400).json({ error: "Invalid parameters. ids array and targetAlbum required." });
    }
    const copiedPhotos: any[] = [];
    ids.forEach(id => {
      const original = galleryPhotos.find(p => p.id === id);
      if (original) {
        const clone = JSON.parse(JSON.stringify(original));
        clone.id = "p_" + Date.now() + "_" + Math.floor(Math.random() * 10000);
        clone.title = original.title.replace(/\.[^/.]+$/, "") + " - Copy" + (original.title.match(/\.[^/.]+$/) ? original.title.match(/\.[^/.]+$/)[0] : "");
        clone.album = targetAlbum;
        clone.isSynced = false;
        clone.isFavorite = false;
        clone.isInTrash = false;
        galleryPhotos.push(clone);
        copiedPhotos.push(clone);
      }
    });
    res.json({ success: true, count: copiedPhotos.length, copiedPhotos });
  });

  // API Route: Batch Move Photos
  app.post("/api/photos/batch/move", (req, res) => {
    const { ids, targetAlbum } = req.body;
    if (!Array.isArray(ids) || !targetAlbum) {
      return res.status(400).json({ error: "Invalid parameters. ids array and targetAlbum required." });
    }
    const movedPhotos: any[] = [];
    galleryPhotos.forEach(p => {
      if (ids.includes(p.id)) {
        p.album = targetAlbum;
        p.isSynced = false;
        movedPhotos.push(p);
      }
    });
    res.json({ success: true, count: movedPhotos.length, movedPhotos });
  });

  // API Route: Batch Delete Photos (Soft/Hard Delete)
  app.post("/api/photos/batch/delete", (req, res) => {
    const { ids, forcePermanent } = req.body;
    if (!Array.isArray(ids)) {
      return res.status(400).json({ error: "Invalid parameters. ids array required." });
    }
    const deletedIds: string[] = [];
    const softDeletedPhotos: any[] = [];
    
    if (forcePermanent) {
      galleryPhotos = galleryPhotos.filter(p => {
        if (ids.includes(p.id)) {
          deletedIds.push(p.id);
          return false;
        }
        return true;
      });
      res.json({ success: true, action: "hard_delete", count: deletedIds.length, ids: deletedIds });
    } else {
      const toHardDelete: string[] = [];
      galleryPhotos.forEach(p => {
        if (ids.includes(p.id)) {
          if (p.isInTrash) {
            toHardDelete.push(p.id);
          } else {
            p.isInTrash = true;
            p.trashTimeLeftDays = 30;
            softDeletedPhotos.push(p);
          }
        }
      });
      
      if (toHardDelete.length > 0) {
        galleryPhotos = galleryPhotos.filter(p => !toHardDelete.includes(p.id));
      }
      
      res.json({ 
        success: true, 
        softDeletedCount: softDeletedPhotos.length, 
        hardDeletedCount: toHardDelete.length,
        softDeleted: softDeletedPhotos,
        hardDeletedIds: toHardDelete
      });
    }
  });

  // API Route: Batch Rename Photos
  app.post("/api/photos/batch/rename", (req, res) => {
    const { ids, baseName } = req.body;
    if (!Array.isArray(ids) || !baseName) {
      return res.status(400).json({ error: "Invalid parameters. ids array and baseName required." });
    }
    const renamedPhotos: any[] = [];
    let counter = 1;
    galleryPhotos.forEach(p => {
      if (ids.includes(p.id)) {
        const ext = p.title.match(/\.[^/.]+$/) ? p.title.match(/\.[^/.]+$/)[0] : ".jpg";
        if (ids.length === 1) {
          p.title = baseName.endsWith(ext) ? baseName : baseName + ext;
        } else {
          const cleanName = baseName.replace(/\.[^/.]+$/, "");
          p.title = `${cleanName}_${String(counter).padStart(2, '0')}${ext}`;
          counter++;
        }
        p.isSynced = false;
        renamedPhotos.push(p);
      }
    });
    res.json({ success: true, count: renamedPhotos.length, renamedPhotos });
  });

  // Helper functions for file size conversion and compression
  function parseSizeToKB(sizeStr: string): number {
    const match = sizeStr.match(/^([\d.]+)\s*(MB|KB|GB)$/i);
    if (!match) return 1024; // default 1MB
    const val = parseFloat(match[1]);
    const unit = match[2].toUpperCase();
    if (unit === "GB") return val * 1024 * 1024;
    if (unit === "MB") return val * 1024;
    return val;
  }

  function formatKBToSize(kbVal: number): string {
    if (kbVal >= 1024 * 1024) {
      return `${(kbVal / (1024 * 1024)).toFixed(1)} GB`;
    }
    if (kbVal >= 1024) {
      return `${(kbVal / 1024).toFixed(1)} MB`;
    }
    return `${Math.round(kbVal)} KB`;
  }

  // API Route: Batch/Single Compress Photos
  app.post("/api/photos/batch/compress", (req, res) => {
    const { ids, quality = "medium" } = req.body;
    if (!Array.isArray(ids)) {
      return res.status(400).json({ error: "Invalid parameters. ids array required." });
    }
    
    // Quality-based settings
    // LOW: high compression, half resolution (0.5 scale), ~15-25% of original size
    // MEDIUM: balanced, 0.75 resolution scale, ~40-50% of original size
    // HIGH: visual preservation, 0.9 resolution scale, ~70-80% of original size
    let scale = 1.0;
    let baseRatio = 0.45;
    if (quality === "low") {
      scale = 0.5;
      baseRatio = 0.20;
    } else if (quality === "medium") {
      scale = 0.75;
      baseRatio = 0.45;
    } else if (quality === "high") {
      scale = 0.9;
      baseRatio = 0.75;
    }

    const compressedPhotos: any[] = [];
    galleryPhotos.forEach(p => {
      if (ids.includes(p.id)) {
        const originalSize = p.size;
        const originalWidth = p.width;
        const originalHeight = p.height;

        // Apply quality scale to resolution
        p.width = Math.round(p.width * scale);
        p.height = Math.round(p.height * scale);

        // Apply quality size reduction
        const origKB = parseSizeToKB(originalSize);
        // Add minor randomized variation (+/- 5%) to make it look highly authentic
        const randomVariation = (Math.random() * 0.1) - 0.05;
        const compressionRatio = baseRatio + randomVariation;
        const newKB = Math.max(10, origKB * compressionRatio); // floor at 10KB
        p.size = formatKBToSize(newKB);

        // Append label to filename/title cleanly
        p.title = p.title.replace(/\s*\(Compressed.*\)/g, ""); // strip existing suffix
        const ext = p.title.match(/\.[^/.]+$/) ? p.title.match(/\.[^/.]+$/)[0] : ".jpg";
        const baseName = p.title.replace(/\.[^/.]+$/, "");
        p.title = `${baseName} (Compressed ${quality.toUpperCase()})${ext}`;

        p.isSynced = false;

        compressedPhotos.push({
          id: p.id,
          originalSize,
          compressedSize: p.size,
          originalWidth,
          originalHeight,
          compressedWidth: p.width,
          compressedHeight: p.height,
          title: p.title,
          quality: quality.toUpperCase()
        });
      }
    });
    res.json({ success: true, count: compressedPhotos.length, compressedPhotos });
  });

  // API Route: Batch Share Photos
  app.post("/api/photos/batch/share", (req, res) => {
    const { ids } = req.body;
    if (!Array.isArray(ids)) {
      return res.status(400).json({ error: "Invalid parameters. ids array required." });
    }
    const sharedPhotoDetails = galleryPhotos.filter(p => ids.includes(p.id));
    const shareId = "share_" + Math.random().toString(36).substring(2, 9);
    const mockSharedLink = `https://android-gallery-share.local/${shareId}`;
    res.json({ 
      success: true, 
      count: sharedPhotoDetails.length, 
      shareId, 
      sharedLink: mockSharedLink,
      titles: sharedPhotoDetails.map(p => p.title)
    });
  });

  // API Route: Detect Duplicates
  app.get("/api/photos/duplicates/scan", (req, res) => {
    const activePhotos = galleryPhotos.filter(p => !p.isInTrash);
    
    const groups: {
      id: string;
      type: "exact" | "similar";
      reason: string;
      photos: any[];
      suggestedKeepId: string;
    }[] = [];

    const visited = new Set<string>();

    for (let i = 0; i < activePhotos.length; i++) {
      const p1 = activePhotos[i];
      if (visited.has(p1.id)) continue;

      const groupPhotos = [p1];

      for (let j = i + 1; j < activePhotos.length; j++) {
        const p2 = activePhotos[j];
        if (visited.has(p2.id)) continue;

        let isMatch = false;
        let matchType: "exact" | "similar" = "exact";
        let reason = "";

        // Rule 1: Exact same URL (pointing to the same binary source)
        if (p1.url === p2.url) {
          isMatch = true;
          matchType = "exact";
          reason = "Identical image source (Exact duplicate)";
        }
        // Rule 2: Same title prefix/suffix and same dimensions & size
        else if (
          p1.width === p2.width && 
          p1.height === p2.height && 
          p1.size === p2.size &&
          (p1.title.replace(/\s*-\s*Copy.*/i, "").replace(/\s*\(Compressed.*\)/i, "") === 
           p2.title.replace(/\s*-\s*Copy.*/i, "").replace(/\s*\(Compressed.*\)/i, ""))
        ) {
          isMatch = true;
          matchType = "exact";
          reason = "Identical size & dimensions (Exact copy)";
        }
        // Rule 3: Close title & same dimensions & close size (within 10%)
        else if (
          p1.width === p2.width && 
          p1.height === p2.height &&
          (p1.title.replace(/\.[^/.]+$/, "").toLowerCase().includes(p2.title.replace(/\.[^/.]+$/, "").toLowerCase()) ||
           p2.title.replace(/\.[^/.]+$/, "").toLowerCase().includes(p1.title.replace(/\.[^/.]+$/, "").toLowerCase()))
        ) {
          isMatch = true;
          matchType = "similar";
          reason = "Very high visual similarity & dimensions";
        }

        if (isMatch) {
          groupPhotos.push(p2);
          visited.add(p2.id);
        }
      }

      if (groupPhotos.length > 1) {
        visited.add(p1.id);
        
        // Find the best photo to KEEP
        // Strategy:
        // 1. Prefer original name (doesn't contain "Copy" or "Compressed")
        // 2. Prefer oldest dateAdded
        // 3. Prefer larger file size (original, uncompressed)
        let suggestedKeep = groupPhotos[0];
        
        for (let k = 1; k < groupPhotos.length; k++) {
          const candidate = groupPhotos[k];
          const curIsCopy = suggestedKeep.title.toLowerCase().includes("copy") || suggestedKeep.title.toLowerCase().includes("compressed");
          const candIsCopy = candidate.title.toLowerCase().includes("copy") || candidate.title.toLowerCase().includes("compressed");
          
          if (curIsCopy && !candIsCopy) {
            suggestedKeep = candidate;
          } else if (!curIsCopy && candIsCopy) {
            // Keep current
          } else {
            // Compare dates
            const dateCur = new Date(suggestedKeep.dateAdded).getTime();
            const dateCand = new Date(candidate.dateAdded).getTime();
            if (dateCand < dateCur) {
              suggestedKeep = candidate;
            }
          }
        }

        const hasUrlMatch = groupPhotos.some((p, idx) => idx > 0 && p.url === groupPhotos[0].url);
        
        groups.push({
          id: "dup_group_" + Math.random().toString(36).substring(2, 9),
          type: hasUrlMatch ? "exact" : "similar",
          reason: hasUrlMatch ? "Identical image source (Exact duplicate)" : "Same resolution & metadata",
          photos: groupPhotos,
          suggestedKeepId: suggestedKeep.id
        });
      }
    }

    res.json({ success: true, count: groups.length, groups });
  });

  // API Route: Inject Test Duplicate
  app.post("/api/photos/duplicates/inject", (req, res) => {
    const original = galleryPhotos.find(p => !p.isInTrash && p.mimeType.startsWith("image"));
    if (!original) {
      return res.status(404).json({ error: "No active images found to duplicate." });
    }
    
    const clone1 = JSON.parse(JSON.stringify(original));
    clone1.id = "p_dup_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
    const ext = original.title.match(/\.[^/.]+$/) ? original.title.match(/\.[^/.]+$/)[0] : ".jpg";
    const baseName = original.title.replace(/\.[^/.]+$/, "");
    clone1.title = `${baseName} - Copy${ext}`;
    clone1.dateAdded = new Date(Date.now() + 1000).toISOString();
    clone1.isSynced = false;
    clone1.isFavorite = false;
    clone1.isInTrash = false;

    galleryPhotos.push(clone1);
    res.json({ success: true, duplicate: clone1 });
  });

  // API Route: AI-powered Image Analysis (using Gemini)
  app.post("/api/gemini/analyze", async (req, res) => {
    const { id, title, description, url } = req.body;
    
    if (!ai) {
      // Fallback response for offline sandbox
      return res.json({
        success: true,
        aiGenerated: true,
        offlineFallback: true,
        summary: "Beautifully captured image showcasing clear contrasts, rich textures, and dramatic lighting typical of dynamic outdoor photography.",
        suggestedTitle: title + " (Enhanced)",
        suggestedTags: ["captured", "exif-calibrated", "composition", "outdoor", "vibrant"],
        cameraConfidence: "High (Estimated f/1.8)",
        curatedExif: {
          lens: "Ultra-precise primary f/1.7 lens",
          aperture: "f/1.8",
          exposureTime: "1/250s",
          iso: "ISO 100",
          focalLength: "6.5mm",
          location: "Simulated Latitude/Longitude"
        }
      });
    }

    try {
      const prompt = `You are an expert AI Camera Metadata Analyser and professional photographer.
      Analyze this photo details:
      Title: "${title || "Untitled"}"
      Current Description: "${description || "None"}"
      Image URL: ${url}

      Please analyze the scene composition and return:
      1. An enhanced, descriptive camera caption (1-2 sentences).
      2. A more professional photographic title.
      3. A list of 6-8 highly specific keywords/tags (e.g., color tones, weather, subject matter, mood).
      4. Curated expert estimation of camera specs (Aperture, Exposure Time, ISO, Lens type, Focal Length) if this was taken on a modern Android flagship device (e.g. Pixel 9 Pro).
      5. A estimated city location or country based on context or theme.

      You must return the response in strict JSON format.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING, description: "Enhanced artistic/photographic caption." },
              suggestedTitle: { type: Type.STRING, description: "A high-quality gallery-ready title." },
              suggestedTags: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Array of 6-8 specific image labels."
              },
              curatedExif: {
                type: Type.OBJECT,
                properties: {
                  lens: { type: Type.STRING },
                  aperture: { type: Type.STRING },
                  exposureTime: { type: Type.STRING },
                  iso: { type: Type.STRING },
                  focalLength: { type: Type.STRING },
                  locationName: { type: Type.STRING }
                },
                required: ["lens", "aperture", "exposureTime", "iso", "focalLength", "locationName"]
              }
            },
            required: ["summary", "suggestedTitle", "suggestedTags", "curatedExif"]
          }
        }
      });

      const dataText = response.text || "{}";
      const aiData = JSON.parse(dataText);

      // Optionally, we can save this updated metadata back into our memory database
      const photo = galleryPhotos.find(p => p.id === id);
      if (photo) {
        photo.title = aiData.suggestedTitle || photo.title;
        photo.description = aiData.summary || photo.description;
        photo.tags = [...new Set([...photo.tags, ...(aiData.suggestedTags || [])])];
        if (photo.exif) {
          photo.exif.lens = aiData.curatedExif?.lens || photo.exif.lens;
          photo.exif.aperture = aiData.curatedExif?.aperture || photo.exif.aperture;
          photo.exif.exposureTime = aiData.curatedExif?.exposureTime || photo.exif.exposureTime;
          photo.exif.iso = aiData.curatedExif?.iso || photo.exif.iso;
          photo.exif.focalLength = aiData.curatedExif?.focalLength || photo.exif.focalLength;
          if (aiData.curatedExif?.locationName) {
            photo.exif.location = photo.exif.location || { latitude: 0, longitude: 0, address: "" };
            photo.exif.location.address = aiData.curatedExif.locationName;
          }
        }
      }

      res.json({
        success: true,
        aiGenerated: true,
        ...aiData
      });
    } catch (error: any) {
      console.error("Gemini AI API Call failed:", error);
      res.status(500).json({ error: "Gemini analysis failed", details: error.message });
    }
  });

  // API Route: AI Semantic search of the gallery
  app.post("/api/gemini/search", async (req, res) => {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: "Search query is required." });
    }

    if (!ai) {
      // Offline fallback: Client-side local string matching
      const keywords = query.toLowerCase().split(/\s+/);
      const results = galleryPhotos
        .filter(p => !p.isInTrash)
        .map(photo => {
          let score = 0;
          if (photo.title.toLowerCase().includes(query.toLowerCase())) score += 10;
          if (photo.description.toLowerCase().includes(query.toLowerCase())) score += 5;
          photo.tags.forEach(tag => {
            if (keywords.some(k => tag.toLowerCase().includes(k))) score += 4;
          });
          return { id: photo.id, score, matchReason: `Matched keywords in title or tags.` };
        })
        .filter(r => r.score > 0)
        .sort((a, b) => b.score - a.score);

      return res.json({ success: true, offlineFallback: true, results });
    }

    try {
      // We pass the list of photos and metadata to Gemini to let it rank them based on semantic compatibility
      const photosPayload = galleryPhotos
        .filter(p => !p.isInTrash)
        .map(p => ({
          id: p.id,
          title: p.title,
          description: p.description,
          tags: p.tags,
          album: p.album
        }));

      const prompt = `You are a semantic photo search engine.
      A user is searching their gallery for: "${query}"

      Here is the list of photo metadata in their gallery:
      ${JSON.stringify(photosPayload)}

      Select and rank the photos that are semantically relevant to the search query.
      For example, if the query is "mountains or hiking", match mountain photos. If the query is "work", match screenshots or laptops.
      For each matched photo, provide:
      1. The photo 'id'
      2. A numeric relevance 'score' (1 to 10, where 10 is perfect match)
      3. A short 'matchReason' explaining why this photo fits the query.

      Only return photos that have a relevance score greater than 3.
      Return the response in strict JSON format.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              results: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    score: { type: Type.NUMBER },
                    matchReason: { type: Type.STRING }
                  },
                  required: ["id", "score", "matchReason"]
                }
              }
            },
            required: ["results"]
          }
        }
      });

      const searchData = JSON.parse(response.text || '{"results":[]}');
      res.json({
        success: true,
        aiGenerated: true,
        results: searchData.results
      });
    } catch (error: any) {
      console.error("Gemini Search failed, running fallback search:", error);
      // Failover to offline fallback
      const keywords = query.toLowerCase().split(/\s+/);
      const results = galleryPhotos
        .filter(p => !p.isInTrash)
        .map(photo => {
          let score = 0;
          if (photo.title.toLowerCase().includes(query.toLowerCase())) score += 10;
          if (photo.description.toLowerCase().includes(query.toLowerCase())) score += 5;
          photo.tags.forEach(tag => {
            if (keywords.some(k => tag.toLowerCase().includes(k))) score += 4;
          });
          return { id: photo.id, score, matchReason: `Local fallback match in title/tags` };
        })
        .filter(r => r.score > 0)
        .sort((a, b) => b.score - a.score);

      res.json({ success: true, offlineFallback: true, results, error: error.message });
    }
  });

  // API Route: AI-powered Google Play Publishing Assistant
  app.post("/api/gemini/play-assistant", async (req, res) => {
    const { type } = req.body;
    if (!type) {
      return res.status(400).json({ error: "Draft type is required." });
    }

    if (!ai) {
      // Offline fallback: returns realistic templates
      let content = "";
      if (type === "description") {
        content = `### Secure Photo Vault & Gallery (M3 Compliance)

**Overview**
A state-of-the-art secure local media library designed for Android 15 (API level 35). Fully compliant with Google Play storage policies, utilizing Scoped Storage and MediaStore APIs to eliminate the need for dangerous permissions.

**Key Features:**
• **Hardware-Backed Encryption**: Protect files in the Secure Vault with cryptographic keys protected by Android Keystore and StrongBox (on supported devices).
• **Material 3 Design**: Fully responsive, adaptive interface optimized for foldable screens, tablets, and mobile devices.
• **Privacy First**: Zero remote tracking. Backup syncing is optional, user-controlled, and utilizes secure SQLite delta replicas.
• **Offline AI Search**: Classify, search, and manage your images without sending personal assets to external servers.`;
      } else if (type === "datasafety") {
        content = `### Play Store Data Safety Declaration

**1. Data Collection & Sharing**
• **No Data Shared**: This application does not share user photos, videos, or files with third parties.
• **No Personal Info Collected**: No personal identification info (emails, names, locations) is collected.

**2. Security Practices**
• **In-Transit Encryption**: All user-initiated data syncing utilizes secure end-to-end HTTPS pathways.
• **Robust On-Device Security**: Authenticate using standard secure Biometrics (FingerprintManager / BiometricPrompt APIs) integrated natively with the Android Keyguard.
• **Complete Erasure Supported**: Users can clear database cache and secure keys, resulting in immediate physical deletion of vault data.`;
      } else if (type === "privacypolicy") {
        content = `### Privacy Policy for Secure Gallery App
**Effective Date: July 16, 2026**

This Privacy Policy explains how our Secure Gallery App handles your physical media files and sensitive system interactions.

**1. Local Permissions Strategy**
We adhere strictly to Android's granular permissions framework. Media files are loaded through the standard system PhotoPicker or scoped MediaStore APIs.

**2. Biometrics and Security Keys**
The application uses the Android BiometricPrompt API to authorize access to encrypted vault databases. We have no access to your fingerprint or face landmarks.

**3. Third-Party Services**
No remote tracking, advertising SDKs, or unauthorized telemetry are embedded. Cloud sync is optional and handled via personal endpoints.`;
      }
      return res.json({ success: true, offlineFallback: true, content });
    }

    try {
      let systemPrompt = "";
      if (type === "description") {
        systemPrompt = "Draft a highly professional, high-converting Google Play Store description (using rich text and markdown bullet points) for a 'Secure Local Gallery App'. Highlight target SDK 35 (Android 15), Material 3 styling, and StrongBox Hardware-backed Keystore security. Highlight the use of Scoped Storage to prevent requesting wide external storage access, making play store approval easy.";
      } else if (type === "datasafety") {
        systemPrompt = "Draft a comprehensive Data Safety Declaration text suitable for copying into the Google Play Console for a secure photo vault app. Specify that no data is shared with third parties, media data is encrypted on device using AES-256 GCM keys via Android Keystore, and biometrics are processed purely by the operating system Keyguard with zero credentials stored on app servers.";
      } else if (type === "privacypolicy") {
        systemPrompt = "Draft a formal, legally-sound Privacy Policy for a secure offline-first photo gallery app on Google Play. Explain Scoped Storage media permissions, biometric authentication boundaries, and that user data is never harvested or shared.";
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: systemPrompt,
      });

      res.json({
        success: true,
        aiGenerated: true,
        content: response.text || "Draft could not be generated."
      });
    } catch (error: any) {
      console.error("Gemini Play Assistant draft failed:", error);
      res.status(500).json({ error: "Gemini draft failed", details: error.message });
    }
  });

  // Vite development integration or static serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

startServer();
