import { messages } from './locales/ui.js';

export const supportedLocales = Object.freeze(['en', 'zh-Hant', 'ja']);
export const localeNames = Object.freeze({ en: 'English', 'zh-Hant': '繁體中文', ja: '日本語' });
export const localeStorageKey = 'pufficss-locale';

export function normalizeLocale(value) {
  return supportedLocales.includes(value) ? value : 'en';
}

export function readLocale(storage) {
  try {
    return normalizeLocale((storage ?? globalThis.localStorage)?.getItem(localeStorageKey));
  } catch {
    return 'en';
  }
}

let currentLocale = readLocale();

export function getLocale() {
  return currentLocale;
}

// Keep the chosen language usable even when browser storage is unavailable.
export function setLocale(value, storage) {
  const previousLocale = currentLocale;
  currentLocale = normalizeLocale(value);
  let persisted = false;
  try {
    const target = storage ?? globalThis.localStorage;
    if (target) {
      target.setItem(localeStorageKey, currentLocale);
      persisted = true;
    }
  } catch { /* The choice remains active for this visit. */ }
  if (previousLocale !== currentLocale && globalThis.document) {
    document.dispatchEvent(new CustomEvent('pufficss:localechange', { detail: { locale: currentLocale } }));
  }
  return persisted;
}

export function t(key, params = {}, locale = getLocale()) {
  const message = messages[normalizeLocale(locale)]?.[key] ?? messages.en[key];
  if (typeof message !== 'string') throw new Error(`Missing translation: ${key}`);
  return message.replace(/\{(\w+)\}/g, (match, name) => Object.hasOwn(params, name) ? String(params[name]) : match);
}
