const fs = require('fs');
const path = require('path');

function read(p){ return fs.readFileSync(path.join(__dirname,p),'utf8'); }

const index = read('index.html');
const js = read('script.js');
const css = read('styles.css');

const checks = [];

function assert(cond, msg){ checks.push({ok:!!cond, msg}); }

assert(/id="menu-toggle"/.test(index), 'index: has #menu-toggle');
assert(/id="menu-overlay"/.test(index), 'index: has #menu-overlay');
assert(/id="menu-close"/.test(index), 'index: has #menu-close');
assert(/<script\s+src="script\.js"/.test(index), 'index: includes script.js');
assert(/viewport-fit=cover/.test(index), 'index: meta viewport-fit=cover');

assert(/function\s+updateVh\s*\(/.test(js), 'script: has updateVh()');
assert(/function\s+positionMenuPanelToViewport\s*\(/.test(js), 'script: has positionMenuPanelToViewport()');
assert(/function\s+attachViewportHandlers\s*\(/.test(js), 'script: has attachViewportHandlers()');
assert(/function\s+activateFocusTrap\s*\(/.test(js), 'script: has activateFocusTrap()');
assert(/DOMContentLoaded/.test(js) || /initializeApp\(\)/.test(js), 'script: initializes app on DOM ready');

assert(/--vh/.test(css), 'css: uses --vh variable');
assert(/menu-panel/.test(css), 'css: contains .menu-panel rules');
assert(/max-height:\s*calc\(\(var\(--vh,\s*1vh\)\s*\*\s*100\)\s*-\s*56px\)/.test(css) || /max-height:\s*calc\(var\(--vh,\s*1vh\)\s*\*\s*100\)/.test(css), 'css: menu-panel max-height or height uses --vh');

// Summary
const failures = checks.filter(c=>!c.ok);
console.log('Smoke check results:');
checks.forEach(c=> console.log((c.ok? 'PASS':'FAIL') + ' - ' + c.msg));
console.log('');
if(failures.length){
  console.error('SMOKE CHECK FAILED: ' + failures.length + ' issues');
  process.exit(2);
} else {
  console.log('SMOKE CHECK PASSED');
  process.exit(0);
}
