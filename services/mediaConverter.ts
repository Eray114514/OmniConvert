import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { ConversionResult } from '../types';

let ffmpeg: FFmpeg | null = null;

const initFFmpeg = async (onLog?: (msg: string) => void): Promise<FFmpeg> => {
  if (ffmpeg) return ffmpeg;
  
  ffmpeg = new FFmpeg();
  
  if (onLog) {
    ffmpeg.on('log', ({ message }) => onLog(message));
  }
  
  const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
  });
  
  return ffmpeg;
};

export const convertMedia = async (file: File, targetFormat: string, onProgress?: (progress: number) => void, onLog?: (msg: string) => void): Promise<ConversionResult> => {
  try {
    if (onProgress) onProgress(5);
    const ffmpegInstance = await initFFmpeg(onLog);
    
    if (onProgress) {
      ffmpegInstance.on('progress', ({ progress }) => {
        // progress is a ratio from 0 to 1
        // We map it from 10 to 95
        const currentProgress = 10 + Math.round(progress * 85);
        onProgress(Math.min(currentProgress, 95));
      });
    }

    const inputName = `input_${Date.now()}.${file.name.split('.').pop()}`;
    const outputName = `output_${Date.now()}.${targetFormat}`;
    
    await ffmpegInstance.writeFile(inputName, await fetchFile(file));
    
    let args: string[] = [];
    if (targetFormat === 'gif') {
      // Optimize GIF conversion
      args = ['-i', inputName, '-vf', 'fps=15,scale=320:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse', '-loop', '0', outputName];
    } else if (targetFormat === 'mp3') {
      args = ['-i', inputName, '-vn', '-acodec', 'libmp3lame', '-q:a', '2', outputName];
    } else if (targetFormat === 'wav') {
      args = ['-i', inputName, '-vn', '-acodec', 'pcm_s16le', '-ar', '44100', '-ac', '2', outputName];
    } else {
      // General video conversion
      args = ['-i', inputName, outputName];
    }
    
    await ffmpegInstance.exec(args);
    
    if (onProgress) onProgress(98);
    
    const data = await ffmpegInstance.readFile(outputName);
    
    // Clean up memory
    await ffmpegInstance.deleteFile(inputName);
    await ffmpegInstance.deleteFile(outputName);
    
    if (onProgress) onProgress(100);
    
    // Determine mime type
    let mimeType = 'application/octet-stream';
    if (targetFormat === 'mp4') mimeType = 'video/mp4';
    if (targetFormat === 'webm') mimeType = 'video/webm';
    if (targetFormat === 'gif') mimeType = 'image/gif';
    if (targetFormat === 'mp3') mimeType = 'audio/mpeg';
    if (targetFormat === 'wav') mimeType = 'audio/wav';

    return {
      success: true,
      blob: new Blob([(data as Uint8Array).buffer], { type: mimeType }),
    };
    
  } catch (error: any) {
    console.error('Media conversion error:', error);
    return { success: false, error: error.message || 'Media conversion failed' };
  }
};
