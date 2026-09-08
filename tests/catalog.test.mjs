import { test } from 'node:test';
import assert from 'node:assert/strict';
import { animations, categories, filterAnimations, generateCode, defaultSettings, demoClass, demoCSS } from '../src/catalog.js';

test('catalog has unique portable IDs and valid category membership', () => {
  assert.equal(new Set(animations.map(a => a.id)).size, animations.length);
  for (const item of animations) {
    assert.match(item.id, /^[a-z]+(?:-[a-z]+)*$/);
    assert.ok(categories.some(c => c.id === item.category));
    assert.ok(item.html.includes(`class="mk-${item.id}"`));
  }
});

test('search matches Chinese, English and tags without case sensitivity', () => {
  assert.equal(filterAnimations({query:'懸浮'}).length, 1);
  assert.equal(filterAnimations({query:'HOVER button'})[0].id, 'lift-button');
  assert.equal(filterAnimations({query:'  orbit  '})[0].id, 'orbit-loader');
  assert.equal(filterAnimations({query:'不存在的效果'}).length, 0);
});

test('category, favorites and search filters compose correctly', () => {
  const favorites = ['lift-button', 'text-reveal', 'underline'];
  const found = filterAnimations({category:'interaction', favoritesOnly:true, favorites, query:'hover'});
  assert.deepEqual(found.map(a => a.id), ['lift-button', 'underline']);
  assert.deepEqual(filterAnimations({favoritesOnly:true}), []);
  assert.equal(filterAnimations({category:'text'}).length, 3);
});

test('sorting does not mutate the original catalog order', () => {
  const original = animations.map(a => a.id);
  assert.equal(filterAnimations({sort:'newest'})[0].id, original.at(-1));
  const names = filterAnimations({sort:'name'}).map(a => a.english);
  assert.deepEqual(names, [...names].sort((a,b) => a.localeCompare(b)));
  assert.deepEqual(animations.map(a => a.id), original);
});

test('every export includes its markup, complete CSS and reduced-motion support', () => {
  for (const item of animations) {
    for (const format of ['html','css','react','vue']) {
      const output = generateCode(item, undefined, format);
      assert.ok(output.includes(`.mk-demo-${item.id}`), `${item.id}/${format}: isolated wrapper`);
      assert.ok(output.includes('prefers-reduced-motion: reduce'));
      assert.ok(output.includes(`--mk-duration: ${item.duration}s`));
      assert.ok(!/https?:\/\//.test(output), 'exports work without remote dependencies');
      if (format !== 'css') assert.ok(output.includes(`mk-${item.id}"`));
      if (format === 'html') assert.ok(output.startsWith('<!doctype html>') && output.endsWith('</html>\n'));
      if (format === 'react') {
        assert.ok(output.includes('export default function MotionDemo()'));
        assert.ok(!/\bclass=/.test(output));
        assert.ok(!/<(?:br|hr|img|input)(?:\s[^>]*)?(?<!\/)>(?!<\/)/.test(output));
      }
      if (format === 'vue') assert.ok(output.includes('<template>') && output.includes('<style scoped>'));
    }
  }
});

test('custom timing, color, easing and iteration settings appear in every format', () => {
  for (const item of animations) {
    const settings = {...defaultSettings(item), duration:2.3, delay:0.7, accent:'#ff5566', easing:'ease-out', loop:false};
    for (const format of ['html','css','react','vue']) {
      const output = generateCode(item, settings, format);
      for (const expected of ['--mk-duration: 2.3s','--mk-delay: 0.7s','--mk-accent: #ff5566','--mk-easing: ease-out','--mk-iterations: 1']) assert.ok(output.includes(expected));
    }
    if (item.trigger === 'auto' && item.id !== 'typewriter') assert.ok(demoCSS(item, settings).includes('var(--mk-easing) var(--mk-delay)'));
  }
});

test('different exported variants have isolated selectors and scoped animation rules', () => {
  const item = animations.find(a => a.id === 'orbit-loader');
  const red = {...defaultSettings(item), duration:1, accent:'#ff0000'};
  const blue = {...defaultSettings(item), duration:5, accent:'#0000ff'};
  assert.notEqual(demoClass(item, red), demoClass(item, blue));
  for (const settings of [red, blue]) {
    const selector = `.${demoClass(item, settings)}`;
    assert.ok(demoCSS(item, settings).includes(`${selector} .mk-orbit-loader`));
    assert.ok(generateCode(item, settings, 'react').includes(demoClass(item, settings)));
  }
});

test('single entrance exports use dedicated keyframes that end visibly', () => {
  for (const id of ['text-reveal','stack-reveal','fade-up','scale-in','typewriter']) {
    const item = animations.find(a => a.id === id);
    const css = demoCSS(item, {...defaultSettings(item), loop:false});
    assert.match(css, /@keyframes mk-[\w-]+-once/);
    assert.ok(css.includes('--mk-iterations: 1'));
    const lastFrame = css.match(/@keyframes[^]*?\{([^]*?)\}\s*\}/)[1];
    if (id === 'typewriter') assert.ok(lastFrame.endsWith('to { width: 15ch; '));
    else assert.ok(lastFrame.endsWith('opacity: 1; '));
  }
});
