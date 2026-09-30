import { Directory, File, Paths } from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { newId } from '../util/id';

/**
 * Spec sections 2, 13 and 15: Globeory never opens a camera. The only way to
 * attach an image is choosing an EXISTING photo/file from the device.
 * (`launchCameraAsync` is intentionally never imported and the camera
 * permission is disabled in app.json.)
 */
export const CAMERA_ENABLED = false;

const IMAGE_DIR_NAME = 'destination-images';
const MAX_IMAGE_WIDTH = 1600;
const JPEG_QUALITY = 0.8;

function imageDirectory(): Directory {
  const dir = new Directory(Paths.document, IMAGE_DIR_NAME);
  if (!dir.exists) dir.create({ intermediates: true });
  return dir;
}

/**
 * Opens the device image picker (single selection), compresses/resizes the
 * chosen image and stores a copy in the app's document directory so it
 * survives cache cleanups. Returns the stored file URI, or `null` if the user
 * cancelled.
 */
export async function pickRepresentativeImage(): Promise<string | null> {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsMultipleSelection: false, // one image per destination visit
    allowsEditing: false,
    quality: 1,
  });
  if (result.canceled || result.assets.length === 0) return null;

  const asset = result.assets[0];
  const context = ImageManipulator.ImageManipulator.manipulate(asset.uri);
  if (asset.width > MAX_IMAGE_WIDTH) context.resize({ width: MAX_IMAGE_WIDTH });
  const rendered = await context.renderAsync();
  const saved = await rendered.saveAsync({
    compress: JPEG_QUALITY,
    format: ImageManipulator.SaveFormat.JPEG,
  });

  const target = new File(imageDirectory(), `${newId('img')}.jpg`);
  new File(saved.uri).copy(target);
  return target.uri;
}

/** Deletes an image file that Globeory copied into its own storage. Remote URLs are ignored. */
export function deleteStoredImage(path: string | null | undefined): void {
  if (!path || !path.startsWith('file://') || !path.includes(IMAGE_DIR_NAME)) return;
  try {
    const file = new File(path);
    if (file.exists) file.delete();
  } catch {
    // The file is already gone; nothing to clean up.
  }
}

export type ImageSize = 'thumb' | 'medium';

const SIZE_WIDTH: Record<ImageSize, number> = { thumb: 360, medium: 1000 };

/**
 * Thumbnails in cards/lists, medium images on detail screens (spec section 15).
 * Local files are already resized at pick time; remote demo images are
 * requested at the right width.
 */
export function resolveImageUri(path: string, size: ImageSize): string {
  if (path.includes('images.unsplash.com')) {
    const base = path.split('?')[0];
    return `${base}?auto=format&fit=crop&q=70&w=${SIZE_WIDTH[size]}`;
  }
  return path;
}
