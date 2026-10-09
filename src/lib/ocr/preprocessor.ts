import { ImageQualityReport } from '../types';

/**
 * Analyzes an image using HTML5 Canvas to assess blur, contrast, and brightness.
 */
export async function analyzeImageQuality(imageSource: string | File | Blob): Promise<ImageQualityReport> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const maxDim = 400; // downsample for fast processing
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        canvas.width = Math.floor(img.width * scale);
        canvas.height = Math.floor(img.height * scale);

        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) {
          resolve(getDefaultReport());
          return;
        }

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const width = canvas.width;
        const height = canvas.height;

        // 1. Grayscale luminance calculation
        const grays = new Float32Array(width * height);
        let totalBrightness = 0;

        for (let i = 0; i < data.length; i += 4) {
          const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
          grays[i / 4] = gray;
          totalBrightness += gray;
        }

        const avgBrightness = totalBrightness / (width * height);
        const brightnessScore = Math.min(100, Math.max(0, Math.round((avgBrightness / 255) * 100)));

        // 2. Contrast (RMS contrast)
        let sumSquaredDiff = 0;
        for (let i = 0; i < grays.length; i++) {
          const diff = grays[i] - avgBrightness;
          sumSquaredDiff += diff * diff;
        }
        const rmsContrast = Math.sqrt(sumSquaredDiff / grays.length);
        const contrastScore = Math.min(100, Math.round((rmsContrast / 128) * 100));

        // 3. Blur Detection (Laplacian Variance approximation)
        let laplacianSum = 0;
        let laplacianSumSq = 0;
        let pixelCount = 0;

        for (let y = 1; y < height - 1; y++) {
          for (let x = 1; x < width - 1; x++) {
            const idx = y * width + x;
            // 3x3 Laplacian kernel: [0, 1, 0; 1, -4, 1; 0, 1, 0]
            const lapVal =
              grays[idx - width] +
              grays[idx + width] +
              grays[idx - 1] +
              grays[idx + 1] -
              4 * grays[idx];

            laplacianSum += lapVal;
            laplacianSumSq += lapVal * lapVal;
            pixelCount++;
          }
        }

        const meanLap = laplacianSum / (pixelCount || 1);
        const varianceLap = laplacianSumSq / (pixelCount || 1) - meanLap * meanLap;
        
        // Variance >= 400 is typically very sharp; < 80 is blurry
        const blurScore = Math.min(100, Math.max(10, Math.round((Math.sqrt(Math.max(0, varianceLap)) / 25) * 100)));

        // Generate issues and suggestions
        const issues: string[] = [];
        const suggestions: string[] = [];

        if (blurScore < 50) {
          issues.push('Prescription text appears blurry or soft.');
          suggestions.push('Hold the camera steady or improve lighting for clearer handwriting OCR.');
        }

        if (brightnessScore < 30) {
          issues.push('Image is too dark.');
          suggestions.push('Use brighter ambient lighting or flash.');
        } else if (brightnessScore > 88) {
          issues.push('Image is overexposed or has high glare.');
          suggestions.push('Avoid direct reflection on paper.');
        }

        if (contrastScore < 35) {
          issues.push('Low contrast between ink and prescription paper.');
          suggestions.push('Use the auto-contrast enhancement button below.');
        }

        const isAcceptable = blurScore >= 35 && brightnessScore >= 20 && brightnessScore <= 92;

        resolve({
          isAcceptable,
          blurScore,
          brightnessScore,
          contrastScore,
          issues,
          suggestions,
        });
      } catch (err) {
        console.error('Image analysis error:', err);
        resolve(getDefaultReport());
      }
    };

    img.onerror = () => {
      resolve(getDefaultReport());
    };

    if (typeof imageSource === 'string') {
      img.src = imageSource;
    } else {
      img.src = URL.createObjectURL(imageSource);
    }
  });
}

function getDefaultReport(): ImageQualityReport {
  return {
    isAcceptable: true,
    blurScore: 85,
    brightnessScore: 65,
    contrastScore: 70,
    issues: [],
    suggestions: [],
  };
}

/**
 * Client-side Canvas Image Enhancement
 */
export function enhanceImageCanvas(
  sourceCanvas: HTMLCanvasElement,
  options: {
    brightness?: number; // -100 to 100 (default 0)
    contrast?: number;   // -100 to 100 (default 0)
    binarize?: boolean;
    rotationDegrees?: number; // 0, 90, 180, 270
  }
): string {
  const { brightness = 0, contrast = 0, binarize = false, rotationDegrees = 0 } = options;

  const targetCanvas = document.createElement('canvas');
  const isRotated90 = rotationDegrees === 90 || rotationDegrees === 270;

  targetCanvas.width = isRotated90 ? sourceCanvas.height : sourceCanvas.width;
  targetCanvas.height = isRotated90 ? sourceCanvas.width : sourceCanvas.height;

  const ctx = targetCanvas.getContext('2d');
  if (!ctx) return sourceCanvas.toDataURL('image/jpeg', 0.9);

  ctx.save();
  // Handle rotation
  if (rotationDegrees !== 0) {
    ctx.translate(targetCanvas.width / 2, targetCanvas.height / 2);
    ctx.rotate((rotationDegrees * Math.PI) / 180);
    ctx.drawImage(
      sourceCanvas,
      -sourceCanvas.width / 2,
      -sourceCanvas.height / 2
    );
  } else {
    ctx.drawImage(sourceCanvas, 0, 0);
  }
  ctx.restore();

  // Apply pixel filters
  const imgData = ctx.getImageData(0, 0, targetCanvas.width, targetCanvas.height);
  const d = imgData.data;

  // Contrast factor: [-100..100] -> [0..3]
  const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

  for (let i = 0; i < d.length; i += 4) {
    // Brightness
    let r = d[i] + brightness;
    let g = d[i + 1] + brightness;
    let b = d[i + 2] + brightness;

    // Contrast
    r = factor * (r - 128) + 128;
    g = factor * (g - 128) + 128;
    b = factor * (b - 128) + 128;

    // Optional Binarization / Thresholding
    if (binarize) {
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      const threshold = 140;
      const binVal = gray > threshold ? 255 : 0;
      d[i] = binVal;
      d[i + 1] = binVal;
      d[i + 2] = binVal;
    } else {
      d[i] = Math.min(255, Math.max(0, r));
      d[i + 1] = Math.min(255, Math.max(0, g));
      d[i + 2] = Math.min(255, Math.max(0, b));
    }
  }

  ctx.putImageData(imgData, 0, 0);
  return targetCanvas.toDataURL('image/jpeg', 0.92);
}
