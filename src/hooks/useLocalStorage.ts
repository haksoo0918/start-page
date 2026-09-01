import { useState, useEffect } from 'react';

/**
 * 로컬스토리지와 React 상태를 안전하게 동기화하는 커스텀 훅
 * @param key 로컬스토리지 키
 * @param initialValue 초기 기본값
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`로컬스토리지 읽기 실패 ("${key}"):`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(`로컬스토리지 저장 실패 ("${key}"):`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
