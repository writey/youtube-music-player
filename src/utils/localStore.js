const get = (key, storageType = 'localStorage') => {
  const storage = window[storageType];
  try {
    const storedValue = storage.getItem(key);
    return JSON.parse(storedValue);
  } catch (error) {
    console.error(`Error getting value for key "${key}":`, error);
    return null;
  }
};

const set = (key, value, storageType = 'localStorage') => {
  const storage = window[storageType];
  try {
    const serializedValue = JSON.stringify(value);
    storage.setItem(key, serializedValue);
  } catch (error) {
    console.error(`Error setting value for key "${key}":`, error);
  }
};

const remove = (key, storageType = 'localStorage') => {
  const storage = window[storageType];
  try {
    storage.removeItem(key);
  } catch (error) {
    console.error(`Error removing value for key "${key}":`, error);
  }
};

const clear = (storageType = 'localStorage') => {
  const storage = window[storageType];
  try {
    storage.clear();
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
};

export { get, set, remove, clear };