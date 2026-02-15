import { createReadStream, createWriteStream, promises as fs } from "node:fs";
import path from "node:path";
import { pipeline } from "node:stream/promises";
import { constants, createBrotliCompress, createGzip } from "node:zlib";

const DEFAULT_TARGETS = ["out"];
const MIN_BYTES = 1024;

const COMPRESSIBLE_EXTENSIONS = new Set([
  ".css",
  ".csv",
  ".html",
  ".js",
  ".json",
  ".mjs",
  ".svg",
  ".txt",
  ".wasm",
  ".xml",
]);

const formatBytes = (value) => {
  if (value < 1024) {
    return `${value} B`;
  }
  const kb = value / 1024;
  if (kb < 1024) {
    return `${kb.toFixed(1)} KB`;
  }
  const mb = kb / 1024;
  if (mb < 1024) {
    return `${mb.toFixed(2)} MB`;
  }
  const gb = mb / 1024;
  return `${gb.toFixed(2)} GB`;
};

const shouldCompressFile = (filePath) => {
  if (filePath.endsWith(".br") || filePath.endsWith(".gz")) {
    return false;
  }

  const extension = path.extname(filePath).toLowerCase();
  return COMPRESSIBLE_EXTENSIONS.has(extension);
};

const collectFiles = async (targetDir) => {
  const files = [];

  const walk = async (currentDir) => {
    const entries = await fs.readdir(currentDir, { withFileTypes: true });
    entries.sort((left, right) => left.name.localeCompare(right.name));

    for (const entry of entries) {
      const absolutePath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        await walk(absolutePath);
        continue;
      }
      if (entry.isFile() && shouldCompressFile(absolutePath)) {
        files.push(absolutePath);
      }
    }
  };

  await walk(targetDir);
  return files;
};

const compressGzip = async (sourcePath, targetPath) => {
  await pipeline(
    createReadStream(sourcePath),
    createGzip({ level: 9 }),
    createWriteStream(targetPath),
  );
};

const compressBrotli = async (sourcePath, targetPath) => {
  await pipeline(
    createReadStream(sourcePath),
    createBrotliCompress({
      params: {
        [constants.BROTLI_PARAM_QUALITY]: 11,
      },
    }),
    createWriteStream(targetPath),
  );
};

const maybeKeepCompressed = async (sourcePath, compressedPath) => {
  const [sourceStats, compressedStats] = await Promise.all([
    fs.stat(sourcePath),
    fs.stat(compressedPath),
  ]);

  if (compressedStats.size >= sourceStats.size) {
    await fs.unlink(compressedPath);
    return null;
  }

  return {
    sourceBytes: sourceStats.size,
    compressedBytes: compressedStats.size,
  };
};

const processFile = async (sourcePath) => {
  const sourceStats = await fs.stat(sourcePath);
  if (sourceStats.size < MIN_BYTES) {
    return [];
  }

  const compressed = [];
  const gzipPath = `${sourcePath}.gz`;
  const brotliPath = `${sourcePath}.br`;

  await compressGzip(sourcePath, gzipPath);
  const gzipResult = await maybeKeepCompressed(sourcePath, gzipPath);
  if (gzipResult) {
    compressed.push({
      algorithm: "gzip",
      outputPath: gzipPath,
      ...gzipResult,
    });
  }

  await compressBrotli(sourcePath, brotliPath);
  const brotliResult = await maybeKeepCompressed(sourcePath, brotliPath);
  if (brotliResult) {
    compressed.push({
      algorithm: "brotli",
      outputPath: brotliPath,
      ...brotliResult,
    });
  }

  return compressed;
};

const main = async () => {
  const targets = process.argv.slice(2);
  const effectiveTargets = targets.length > 0 ? targets : DEFAULT_TARGETS;

  let totalCompressed = 0;
  let totalSavedBytes = 0;
  let touchedFiles = 0;

  for (const target of effectiveTargets) {
    const absoluteTarget = path.resolve(target);

    try {
      const stats = await fs.stat(absoluteTarget);
      if (!stats.isDirectory()) {
        console.log(`Skipping ${target}: not a directory`);
        continue;
      }
    } catch {
      console.log(`Skipping ${target}: not found`);
      continue;
    }

    const files = await collectFiles(absoluteTarget);
    console.log(`\nPrecompressing ${files.length} files under ${target}`);

    for (const filePath of files) {
      const results = await processFile(filePath);
      if (results.length === 0) {
        continue;
      }

      touchedFiles += 1;
      for (const result of results) {
        const savedBytes = result.sourceBytes - result.compressedBytes;
        totalCompressed += 1;
        totalSavedBytes += savedBytes;
        console.log(
          `- ${path.relative(process.cwd(), result.outputPath)} (${result.algorithm}, saved ${formatBytes(savedBytes)})`,
        );
      }
    }
  }

  if (totalCompressed === 0) {
    console.log("\nNo compressed assets were generated.");
    return;
  }

  console.log(
    `\nGenerated ${totalCompressed} compressed files across ${touchedFiles} source files.`,
  );
  console.log(`Total size reduction: ${formatBytes(totalSavedBytes)}`);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
