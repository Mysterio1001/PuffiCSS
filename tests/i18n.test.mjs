import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { messages } from '../src/locales/ui.js';
import { supportedLocales, normalizeLocale, readLocale, getLocale, setLocale, t, localeStorageKey } from '../src/i18n.js';

test('first visit and unsupported or corrupt preferences default to English', () => {
  for (const value of [null, undefined, '', 'fr', 'zh-CN', '"ja"', {}, '__proto__']) {
    assert.equal(normalizeLocale(value), 'en');
    assert.equal(readLocale({ getItem: () => value }), 'en');
  }
  assert.equal(readLocale({ getItem() { throw new Error('Storage blocked'); } }), 'en');
  for (const locale of supportedLocales) assert.equal(readLocale({ getItem: () => locale }), locale);
});

test('language selection is saved and remains usable when persistence is blocked', () => {
  const data = new Map();
  const storage = { getItem: key => data.get(key), setItem: (key, value) => data.set(key, value) };
  try {
    for (const locale of supportedLocales) {
      assert.equal(setLocale(locale, storage), true);
      assert.equal(getLocale(), locale);
      assert.equal(data.get(localeStorageKey), locale);
      assert.equal(readLocale(storage), locale);
    }
    assert.equal(setLocale('zh-Hant', { setItem() { throw new Error('Quota exceeded'); } }), false);
    assert.equal(getLocale(), 'zh-Hant');
  } finally { setLocale('en', storage); }
});

test('all UI translations have matching keys and interpolation parameters', () => {
  const keys = Object.keys(messages.en).sort();
  const parameters = value => [...value.matchAll(/\{(\w+)\}/g)].map(match => match[1]).sort();
  for (const locale of supportedLocales) {
    assert.deepEqual(Object.keys(messages[locale]).sort(), keys, locale);
    for (const key of keys) {
      assert.equal(typeof messages[locale][key], 'string', `${locale}/${key}`);
      assert.ok(messages[locale][key].trim(), `${locale}/${key} must not be empty`);
      assert.deepEqual(parameters(messages[locale][key]), parameters(messages.en[key]), `${locale}/${key}`);
      assert.equal(t(key, {}, locale), messages[locale][key]);
    }
  }
  const parameterizedKey = keys.find(key => parameters(messages.en[key]).length);
  assert.ok(parameterizedKey);
  const params = Object.fromEntries(parameters(messages.en[parameterizedKey]).map(name => [name, '$& <example>']));
  assert.ok(t(parameterizedKey, params, 'en').includes('$& <example>'));
});

test('README language navigation resolves and local setup stays removed', async () => {
  const files = ['README.md', 'README.zh-TW.md', 'README.ja.md'];
  for (const file of files) {
    const content = await readFile(new URL(`../${file}`, import.meta.url), 'utf8');
    assert.ok(content.includes('contact@handlebyme.com'), file);
    assert.doesNotMatch(content, /localhost|127\.0\.0\.1|handlebyme\.tech@gmail\.com/);
    for (const other of files.filter(name => name !== file)) {
      assert.ok(content.includes(`](${other})`), `${file} links to ${other}`);
      await access(new URL(`../${other}`, import.meta.url));
    }
  }
});
