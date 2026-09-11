/**
 * COMPRESSION DES PHOTOS TÉLÉVERSÉES
 * ---------------------------------------------------------------------------
 * Réencode toute image envoyée en JPEG qualité 82 (même traitement que celui
 * appliqué à la main aux premières photos du site), pour ne jamais alourdir
 * le dépôt avec des fichiers PNG de plusieurs mégaoctets.
 *
 * Implémenté via PowerShell + System.Drawing (déjà disponible sur Windows,
 * sans dépendance native supplémentaire côté Node). Best-effort : si
 * PowerShell est indisponible (autre OS), le fichier téléversé est conservé
 * tel quel plutôt que de faire échouer l'envoi.
 */

import { spawn } from 'node:child_process';
import path from 'node:path';
import { promises as fs } from 'node:fs';

const SCRIPT = (src: string, dst: string) => `
Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile('${src}')
$encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$params = New-Object System.Drawing.Imaging.EncoderParameters(1)
$params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 82L)
$img.Save('${dst}', $encoder, $params)
$img.Dispose()
`;

function runPowerShell(script: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', script], {
      windowsHide: true,
    });
    let stderr = '';
    child.stderr.on('data', (chunk) => (stderr += String(chunk)));
    child.on('error', reject);
    child.on('close', (code) => (code === 0 ? resolve() : reject(new Error(stderr || `exit ${code}`))));
  });
}

/**
 * Réencode `absPath` en JPEG qualité 82 et retourne le nouveau nom de fichier
 * (toujours `.jpg`). En cas d'échec, retourne le nom de fichier d'origine
 * sans lever d'erreur : l'envoi reste utilisable.
 */
export async function compressToJpeg(absPath: string): Promise<string> {
  const dir = path.dirname(absPath);
  const base = path.basename(absPath, path.extname(absPath));
  const jpgName = `${base}.jpg`;
  const jpgPath = path.join(dir, jpgName);
  const alreadyJpeg = /\.jpe?g$/i.test(absPath);

  try {
    if (alreadyJpeg) {
      // Réencodage sur place via un fichier temporaire (impossible d'ouvrir
      // et réécrire le même fichier simultanément avec System.Drawing).
      const tmpPath = path.join(dir, `${base}.tmp.jpg`);
      await runPowerShell(SCRIPT(absPath, tmpPath));
      await fs.rm(absPath, { force: true });
      await fs.rename(tmpPath, jpgPath);
    } else {
      await runPowerShell(SCRIPT(absPath, jpgPath));
      await fs.rm(absPath, { force: true });
    }
    return jpgName;
  } catch {
    // PowerShell indisponible ou échec de conversion : on garde l'original.
    return path.basename(absPath);
  }
}
