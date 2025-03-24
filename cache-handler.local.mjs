import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CACHE_DIR = path.join(__dirname, "shared-cache");

if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

export default class CacheHandler {
  constructor(options) {
    this.options = options;
  }

  async get(key) {
    const filePath = path.join(CACHE_DIR, `${key}.json`);
    if (fs.existsSync(filePath)) {
      try {
        const data = fs.readFileSync(filePath, "utf-8");
        return JSON.parse(data);
      } catch (error) {
        console.error(`Failed to read cache for key ${key}:`, error);
      }
    }
    return null;
  }

  async set(key, data, ctx) {
    const filePath = path.join(CACHE_DIR, `${key}.json`);
    const dirPath = path.dirname(filePath);

    // Ensure parent directories exist
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    const cacheData = {
      value: data,
      lastModified: Date.now(),
      tags: ctx.tags,
    };
    try {
      fs.writeFileSync(filePath, JSON.stringify(cacheData), "utf-8");
    } catch (error) {
      console.error(`Failed to save cache for key ${key}:`, error);
    }
  }
}
