export type LocalStorageKeys = {
    metamobName: string;
    metamobApiKey: string;
    metamobUniqueId: string;
    monsterSort: string;
    ocreAmount: number;
};

type LocalStorageItem = {
    storedData: unknown;
};

export function setLocalStorageItem<K extends keyof LocalStorageKeys>(key: K, value: LocalStorageKeys[K]) {
    try {
        const serializedValue = JSON.stringify({
            storedData: value,
        } as LocalStorageItem);
        localStorage.setItem(key, serializedValue);
    } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
    }
}

export function getLocalStorageItem<K extends keyof LocalStorageKeys>(key: K): LocalStorageKeys[K] | null {
    try {
        const serializedValue = localStorage.getItem(key);
        if (serializedValue === null) {
            return null;
        }
        const storedItem = JSON.parse(serializedValue) as LocalStorageItem;
        return storedItem.storedData as LocalStorageKeys[K];
    } catch (error) {
        console.error(`Error getting localStorage key "${key}":`, error);
        return null;
    }
}

export function removeLocalStorageItem<K extends keyof LocalStorageKeys>(key: K): void {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error(`Error removing localStorage key "${key}":`, error);
    }
}

export function clearLocalStorage(): void {
    localStorage.clear();
}
