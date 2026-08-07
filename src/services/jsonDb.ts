import fs from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

/**
 * Ensures that the data directory exists.
 */
async function ensureDataDirectory() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (err) {
    // Ignore error if directory exists
  }
}

/**
 * Reads a JSON file from the data folder.
 * If the file does not exist, it initializes it with the provided default value.
 */
export async function readJsonData<T>(filename: string, defaultValue: T): Promise<T> {
  await ensureDataDirectory();
  const filePath = path.join(DATA_DIR, filename);
  try {
    const fileContent = await fs.readFile(filePath, "utf-8");
    return JSON.parse(fileContent) as T;
  } catch (error) {
    // File not found or unparseable, seed with default value
    await writeJsonData(filename, defaultValue);
    return defaultValue;
  }
}

/**
 * Writes data to a JSON file in the data folder.
 */
export async function writeJsonData<T>(filename: string, data: T): Promise<void> {
  await ensureDataDirectory();
  const filePath = path.join(DATA_DIR, filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}
