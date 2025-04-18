// ImagePreloader.ts
import heroAttributes from "../server/heroAttributes.json";

interface ImageCache {
  [key: string]: HTMLImageElement;
}

const imageCache: ImageCache = {};

const imageList = Object.values(heroAttributes).map(hero => 
  `/panorama/images/heroes/selection/npc_dota_hero_${hero.name}_png.png`
);
imageList.push('/panorama/images/heroes/selection/empty.png');

export const preloadImages = () => {
  return Promise.all(
    imageList.map((src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          imageCache[src] = img;
          resolve(img);
        };
        img.onerror = reject;
        img.src = src;
      });
    })
  );
};

export const getImage = (src: string): HTMLImageElement | undefined => {
  return imageCache[src];
};


export const isImageCached = (src: string): boolean => {
  return src in imageCache;
};