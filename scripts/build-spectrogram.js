const fs = require('fs');
const path = require('path');
const sass = require(path.resolve(__dirname, '../arpeggios/node_modules/sass'));
const jade = require(path.resolve(__dirname, '../spectrogram/node_modules/jade'));
const browserify = require(path.resolve(__dirname, '../spectrogram/node_modules/browserify'));

console.log("Building Spectrogram...");

const specDir = path.join(__dirname, '../spectrogram');
const buildDir = path.join(specDir, 'build');

fs.mkdirSync(buildDir, { recursive: true });
fs.mkdirSync(path.join(buildDir, 'css'), { recursive: true });
fs.mkdirSync(path.join(buildDir, 'js'), { recursive: true });

// 1. Compile SASS
const compiledCss = sass.compile(path.join(specDir, 'src/sass/screen.scss'));
fs.writeFileSync(path.join(buildDir, 'css/screen.css'), compiledCss.css);

// 2. Render Jade template
const html = jade.renderFile(path.join(specDir, 'src/jade/index.jade'), { pretty: true });
fs.writeFileSync(path.join(buildDir, 'index.html'), html);

// 3. Bundle o3djs
const o3djsFiles = ["base.js", "math.js", "quaternions.js", "shader.js"];
const o3djsCombined = o3djsFiles
  .map(f => fs.readFileSync(path.join(specDir, 'src/javascripts/o3djs', f), 'utf8'))
  .join('\n;\n');
fs.writeFileSync(path.join(buildDir, 'js/bundle.js'), o3djsCombined);

// 4. Browserify app.js
const b = browserify({
  entries: [path.join(specDir, 'src/javascripts/main.js')],
  insertGlobals: true,
  debug: false
});

const appJsStream = fs.createWriteStream(path.join(buildDir, 'js/app.js'));
b.bundle().pipe(appJsStream);

appJsStream.on('finish', () => {
  console.log("Spectrogram Browserify bundle written.");
});

// 5. Copy static directories bin & images
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

copyDir(path.join(specDir, 'src/bin'), path.join(buildDir, 'bin'));
copyDir(path.join(specDir, 'src/images'), path.join(buildDir, 'img'));

console.log("Spectrogram build finished successfully.");
