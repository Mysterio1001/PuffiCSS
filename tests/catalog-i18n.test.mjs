import { test } from 'node:test';
import assert from 'node:assert/strict';
import { animations, categories, easings, getAnimations, getCategories, getEasings, filterAnimations, generateCode, defaultSettings, demoClass, demoCSS } from '../src/catalog.js';
import { getLocale, setLocale, supportedLocales } from '../src/i18n.js';

test('every locale covers the same 18 animations, categories, tags, and easing values', () => {
  const source = JSON.stringify(animations);
  assert.equal(animations.length, 18);
  for (const locale of supportedLocales) {
    const translated = getAnimations(locale);
    assert.deepEqual(translated.map(item => item.id), animations.map(item => item.id));
    assert.deepEqual(getCategories(locale).map(category => category.id), categories.map(category => category.id));
    assert.deepEqual(Object.keys(getEasings(locale)), Object.keys(easings));
    for (const item of translated) {
      const original = animations.find(source => source.id === item.id);
      assert.equal(item.category, original.category);
      assert.equal(item.english, original.english, 'canonical search subtitle is preserved');
      for (const value of [item.name, item.tagline, item.description, ...item.tags]) assert.ok(typeof value === 'string' && value.length > 0, `${locale}/${item.id}: complete metadata`);
      assert.equal(item.tags.length, original.tags.length);
      if (original.badge) assert.ok(item.badge);
      assert.ok(item.html.includes(`class="mk-${item.id}"`));
      assert.equal(item.duration, original.duration);
      if (locale === 'en') assert.ok(!/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/u.test(`${item.name} ${item.tagline} ${item.description} ${item.html}`), `${item.id}: no untranslated CJK text in English`);
    }
  }
  assert.equal(JSON.stringify(animations), source, 'localization leaves the source catalog intact');
});

test('search finds names, descriptions, categories, and tags from every language in any display locale', () => {
  for (const locale of supportedLocales) {
    for (const query of ['floating button', '輕盈懸浮按鈕', 'ふわっと浮くボタン', 'HOVER 按鈕', 'ホバー button', 'ｈｏｖｅｒ　ｂｕｔｔｏｎ']) {
      assert.deepEqual(filterAnimations({ locale, query }).map(item => item.id), ['lift-button'], `${locale}/${query}`);
    }
    for (const query of ['celestial bodies', '兩道星體', '二つの天体']) {
      assert.deepEqual(filterAnimations({ locale, query }).map(item => item.id), ['orbit-loader']);
    }
    for (const query of ['Microinteractions', '微互動', 'マイクロインタラクション']) {
      assert.deepEqual(filterAnimations({ locale, query }).map(item => item.id), ['lift-button', 'underline', 'tilt-card']);
    }
    assert.deepEqual(filterAnimations({ locale, category: 'interaction', favoritesOnly: true, favorites: ['underline', 'text-reveal'], query: 'ホバー' }).map(item => item.id), ['underline']);
    assert.equal(filterAnimations({ locale, query: '懸浮' })[0].name, getAnimations(locale)[0].name, 'results use the selected display language');
  }
});

test('name sorting follows the visible translated name and preserves catalog order', () => {
  const original = animations.map(item => item.id);
  for (const locale of supportedLocales) {
    const names = filterAnimations({ locale, sort: 'name' }).map(item => item.name);
    assert.deepEqual(names, [...names].sort((a, b) => a.localeCompare(b, locale)));
    assert.deepEqual(filterAnimations({ locale, sort: 'newest' }).map(item => item.id), [...original].reverse());
  }
  assert.deepEqual(animations.map(item => item.id), original);
});

test('all 18 animations export localized content and portable language semantics in all four formats', () => {
  for (const locale of supportedLocales) {
    for (const item of getAnimations(locale)) {
      const source = animations.find(animation => animation.id === item.id);
      for (const format of ['html', 'css', 'react', 'vue']) {
        const code = generateCode(source, { ...defaultSettings(source), delay: .7, loop: false }, format, locale);
        assert.ok(code.includes('prefers-reduced-motion: reduce'), `${locale}/${item.id}/${format}: reduced motion`);
        assert.ok(code.includes('--mk-delay: 0.7s'));
        assert.ok(code.includes('--mk-iterations: 1'));
        assert.ok(!code.includes('undefined'));
        assert.ok(!/https?:\/\//.test(code), 'exports have no remote dependencies');
        if (format === 'css') {
          assert.ok(!code.includes('<html'));
        } else {
          assert.ok(code.includes(`lang="${locale}"`), `${locale}/${item.id}/${format}: language semantics`);
          const markup = format === 'react' ? item.html.replaceAll('class=', 'className=').replaceAll('<br>', '<br />') : item.html;
          assert.ok(code.includes(markup), `${locale}/${item.id}/${format}: translated visible text and aria labels`);
        }
        if (format === 'html') {
          assert.ok(code.includes(`<html lang="${locale}">`));
          assert.ok(code.includes(`<title>${item.name} — PuffiCSS</title>`));
        }
        if (format === 'react') {
          assert.ok(!/\bclass=|style="/.test(code), 'JSX does not contain HTML-only class or style attributes');
          assert.ok(!/<br>/.test(code));
        }
      }
    }
  }
});

test('generated demos translate visible copy and accessible status labels', () => {
  const expectations = {
    en: { button: 'Hover me', loading: 'Loading', processing: 'Processing', success: 'All done!' },
    'zh-Hant': { button: '移過來試試', loading: '載入中', processing: '處理中', success: '完成了！' },
    ja: { button: '触れてみて', loading: '読み込み中', processing: '処理中', success: 'できました！' },
  };
  for (const [locale, expected] of Object.entries(expectations)) {
    const items = getAnimations(locale);
    assert.ok(items.find(item => item.id === 'lift-button').html.includes(expected.button));
    for (const id of ['orbit-loader', 'dot-wave']) assert.ok(items.find(item => item.id === id).html.includes(`aria-label="${expected.loading}"`));
    assert.ok(items.find(item => item.id === 'bars').html.includes(`aria-label="${expected.processing}"`));
    assert.ok(items.find(item => item.id === 'scale-in').html.includes(expected.success));
  }
});

test('typewriter sizing and single-play end states match English and full-width CJK text', () => {
  const expected = { en: ['15ch', 15], 'zh-Hant': ['7em', 7], ja: ['9em', 9] };
  const selectors = [];
  for (const [locale, [width, steps]] of Object.entries(expected)) {
    const item = getAnimations(locale).find(item => item.id === 'typewriter');
    const text = item.html.match(/<span>([^<]+)<\/span>/)[1];
    assert.equal(Array.from(text).length, steps);
    assert.ok(item.css.includes(`--mk-type-width: ${width};`));
    assert.ok(item.css.includes(`--mk-type-steps: ${steps};`));
    assert.ok(item.css.includes('steps(var(--mk-type-steps), end)'));
    assert.ok(demoCSS(item, { ...defaultSettings(item), loop: false }).includes('to { width: var(--mk-type-width); }'));
    if (locale !== 'en') assert.ok(!/\d+ch\b/.test(item.css), 'full-width characters do not use Latin ch widths');
    selectors.push(demoClass(item));
  }
  assert.equal(new Set(selectors).size, supportedLocales.length, 'different language variants have isolated selectors');
});

test('letter reveal keeps an accessible sentence and a delay for each translated character', () => {
  for (const locale of supportedLocales) {
    const item = getAnimations(locale).find(item => item.id === 'text-reveal');
    const characters = [...item.html.matchAll(/<i>([^<]+)<\/i>/g)].map(match => match[1]);
    const lead = item.html.match(/<span aria-hidden="true">([^<]+)<\/span>/)[1];
    const accessible = item.html.match(/aria-label="([^"]+)"/)[1];
    assert.equal(accessible.replaceAll(' ', ''), (lead + characters.join('')).replaceAll(' ', ''));
    for (let index = 2; index <= characters.length; index++) assert.ok(item.css.includes(`i:nth-child(${index}) { animation-delay:`));
    assert.ok(item.css.includes('i:last-child { color:'));
    if (locale !== 'en') assert.ok(!item.css.includes('font-size: 64px;'), 'translated text fits the preview');
  }
});

test('helpers use the active locale, safely fall back to English, and can retarget a localized export', () => {
  const initialLocale = getLocale();
  try {
    setLocale('ja');
    assert.equal(getAnimations()[0].name, 'ふわっと浮くボタン');
    assert.equal(getCategories()[0].name, 'すべてのアニメーション');
    assert.ok(getEasings().linear.includes('等速'));
    assert.ok(generateCode(animations[0]).includes('触れてみて'));
    const japaneseItem = getAnimations()[0];
    assert.ok(generateCode(japaneseItem, undefined, 'html', 'en').includes('Hover me'));
    assert.ok(!generateCode(japaneseItem, undefined, 'html', 'en').includes('触れてみて'));
    assert.equal(getAnimations('unsupported')[0].name, 'Floating button');
    assert.ok(generateCode(japaneseItem, undefined, 'html', 'unsupported').includes('<html lang="en">'));
  } finally {
    setLocale(initialLocale);
  }
});
