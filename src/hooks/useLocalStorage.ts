import { useState, useEffect } from 'react';

/**
 * 로컬스토리지 및 크롬 확장 스토리지와 React 상태를 안전하게 동기화하는 커스텀 훅
 * @param key 스토리지 키
 * @param initialValue 초기 기본값
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const item = window.localStorage.getItem(key);
        if (item) {
          return JSON.parse(item) as T;
        }
      }
      return initialValue;
    } catch (error) {
      console.warn(`로컬스토리지 읽기 실패 ("${key}"):`, error);
      return initialValue;
    }
  });

  // 1. chrome.storage.local 초기 데이터 조회 및 동기화
  useEffect(() => {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.get([key], (result: { [k: string]: any }) => {
          if (result && result[key] !== undefined) {
            setStoredValue(result[key] as T);
          } else {
            // 크롬 스토리지가 비어있을 경우 현재 로컬스토리지/초기값으로 동기화
            chrome.storage.local.set({ [key]: storedValue });
          }
        });

        // 2. 크롬 툴바 팝업 등 외부에서 데이터가 변경될 때 실시간 수신 리스너
        const handleStorageChange = (changes: { [key: string]: chrome.storage.StorageChange }, areaName: string) => {
          if (areaName === 'local' && changes[key] && changes[key].newValue !== undefined) {
            setStoredValue(changes[key].newValue as T);
          }
        };

        chrome.storage.onChanged.addListener(handleStorageChange);
        return () => {
          chrome.storage.onChanged.removeListener(handleStorageChange);
        };
      }
    } catch (err) {
      console.warn(`크롬 스토리지 연동 예외 ("${key}"):`, err);
    }
  }, [key]);

  // 3. 상태 변경 시 localStorage 및 chrome.storage.local에 동시 저장
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      }
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({ [key]: storedValue });
      }
    } catch (error) {
      console.warn(`스토리지 저장 실패 ("${key}"):`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
