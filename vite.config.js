import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Auto copy assets on Vite startup/config change
const srcDir = 'C:\\Users\\ELCOT\\.gemini\\antigravity\\brain\\9062d9f3-93c9-4a1e-8023-f06ed6fb6906';
const destDir = path.join(process.cwd(), 'public', 'assets', 'images');

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
  'shoemaking_brass_nails_1781508592559.png': 'shoemaking_brass_nails.png'
};

try {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  Object.entries(filesMap).forEach(([srcFile, destFile]) => {
    const srcPath = path.join(srcDir, srcFile);
    const destPath = path.join(destDir, destFile);
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`[Vite AutoSync] Synced asset: ${destFile}`);
    }
  });
} catch (error) {
  console.error('[Vite AutoSync] Error copying assets:', error.message);
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})
