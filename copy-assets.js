import fs from 'fs';
import path from 'path';
import https from 'https';

const srcDir = 'C:\\Users\\ELCOT\\.gemini\\antigravity\\brain\\9062d9f3-93c9-4a1e-8023-f06ed6fb6906';
const destDir = path.join(process.cwd(), 'public', 'assets', 'images');
const videoDestDir = path.join(process.cwd(), 'public', 'assets', 'videos');

const filesMap = {
  'luxury_leather_boot_1781462153323.png': 'luxury_leather_boot.png',
  'leather_grain_texture_1781462168958.png': 'leather_grain_texture.png',
  'wholecut_oxford_1781462183742.png': 'wholecut_oxford.png',
  'leather_travel_bag_1781463265074.png': 'leather_travel_bag.png',
  'leather_ladies_handbag_1781463280859.png': 'leather_ladies_handbag.png',
  'artisan_workspace_1781462229359.png': 'artisan_workspace.png',
  'raw_leather_material_1781465853796.png': 'raw_leather_material.png',
  'shoemaking_threads_1781465871777.png': 'shoemaking_threads.png',
  'leather_shoe_soles_1781465888067.png': 'leather_shoe_soles.png',
  'shoemaking_wax_1781465903559.png': 'shoemaking_wax.png',
  'plain_black_formal_shoe_1781505794955.png': 'plain_black_formal_shoe.png',
  'light_promise_bg_1781507637697.png': 'light_promise_bg.png',
  'promise_shoe_bg_1781508057570.png': 'promise_shoe_bg.png',
  'leather_cutting_bg_1781508483228.png': 'leather_cutting_bg.png',
  'shoemaking_steel_shank_1781508541682.png': 'shoemaking_steel_shank.png',
  'shoemaking_leather_heels_1781508558667.png': 'shoemaking_leather_heels.png',
  'shoemaking_lining_leather_1781508574363.png': 'shoemaking_lining_leather.png',
  'shoemaking_brass_nails_1781508592559.png': 'shoemaking_brass_nails.png',
  'service_support_1781511904829.png': 'service_support.png',
  'service_consultation_1781511924185.png': 'service_consultation.png',
  'service_showroom_1781511940214.png': 'service_showroom.png',
  'service_restoration_1781511957290.png': 'service_restoration.png'
};

console.log('Starting asset sync...');

try {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
    console.log('Created directory:', destDir);
  }

  if (!fs.existsSync(videoDestDir)) {
    fs.mkdirSync(videoDestDir, { recursive: true });
    console.log('Created directory:', videoDestDir);
  }

  // Copy images
  Object.entries(filesMap).forEach(([srcFile, destFile]) => {
    const srcPath = path.join(srcDir, srcFile);
    const destPath = path.join(destDir, destFile);
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`Successfully synced: ${destFile}`);
    } else {
      console.warn(`Warning: Source file not found: ${srcFile}`);
    }
  });

  // Download video
  const videoUrl = 'https://assets.mixkit.co/videos/preview/mixkit-shoemaker-working-on-leather-shoe-34358-large.mp4';
  const videoPath = path.join(videoDestDir, 'shoemaker.mp4');

  if (!fs.existsSync(videoPath)) {
    console.log('Downloading background video from online...');
    const file = fs.createWriteStream(videoPath);
    https.get(videoUrl, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log('Background video downloaded successfully to assets/videos/shoemaker.mp4');
      });
    }).on('error', (err) => {
      fs.unlink(videoPath, () => {});
      console.error('Error downloading video:', err.message);
    });
  } else {
    console.log('Background video already exists locally.');
  }

  console.log('Asset sync completed successfully.');
} catch (error) {
  console.error('Error during asset sync:', error.message);
}
