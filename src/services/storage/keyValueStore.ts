import AsyncStorage from '@react-native-async-storage/async-storage';

/** Thin typed JSON wrapper over AsyncStorage. The only file that touches it. */
export async function readJson<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export async function writeJson<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function removeKeys(keys: string[]): Promise<void> {
  if (keys.length > 0) await AsyncStorage.multiRemove(keys);
}

export async function writeMany(entries: [string, unknown][]): Promise<void> {
  if (entries.length === 0) return;
  await AsyncStorage.multiSet(entries.map(([key, value]) => [key, JSON.stringify(value)]));
}

export async function readMany<T>(keys: string[]): Promise<(T | null)[]> {
  const pairs = await AsyncStorage.multiGet(keys);
  return pairs.map(([, raw]) => {
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  });
}
