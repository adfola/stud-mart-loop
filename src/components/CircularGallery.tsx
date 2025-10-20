import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform } from 'ogl';
import { useEffect, useRef } from 'react';

type GL = Renderer['gl'];

function lerp(p1: number, p2: number, t: number): number {
  return p1 + (p2 - p1) * t;
}

function createTextTexture(
  gl: GL,
  text: string,
  font: string = 'bold 30px sans-serif',
  color: string = 'white'
): { texture: Texture; width: number; height: number } {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Could not get 2d context');

  context.font = font;
  const metrics = context.measureText(text);
  const textWidth = Math.ceil(metrics.width);
  const fontSize = parseInt(font.match(/(\d+)px/)?.[1] || '30');
  const textHeight = Math.ceil(fontSize * 1.2);

  canvas.width = textWidth + 20;
  canvas.height = textHeight + 20;

  context.font = font;
  context.fillStyle = color;
  context.textBaseline = 'middle';
  context.textAlign = 'center';
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new Texture(gl, { generateMipmaps: false });
  texture.image = canvas;
  return { texture, width: canvas.width, height: canvas.height };
}

interface CircularGalleryProps {
  items?: { image: string; text: string }[];
  bend?: number;
  textColor?: string;
  borderRadius?: number;
  scrollSpeed?: number;
  scrollEase?: number;
}

export default function CircularGallery({
  items,
  bend = 3,
  textColor = '#ffffff',
  borderRadius = 0.05,
  scrollSpeed = 2,
  scrollEase = 0.02
}: CircularGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const renderer = new Renderer({ alpha: true, antialias: true, dpr: Math.min(window.devicePixelRatio || 1, 2) });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    containerRef.current.appendChild(gl.canvas as HTMLCanvasElement);

    const camera = new Camera(gl);
    camera.fov = 45;
    camera.position.z = 20;

    const scene = new Transform();
    const planeGeometry = new Plane(gl, { heightSegments: 50, widthSegments: 100 });

    const defaultItems = [
      { image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop', text: 'Headphones' },
      { image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400&h=400&fit=crop', text: 'Chair' },
      { image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop', text: 'Books' },
      { image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop', text: 'Laptop Stand' },
      { image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop', text: 'Watch' },
      { image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop', text: 'Backpack' }
    ];

    const galleryItems = items && items.length ? items : defaultItems;
    const mediasImages = galleryItems.concat(galleryItems);

    let screen = { width: containerRef.current.clientWidth, height: containerRef.current.clientHeight };
    let viewport = { width: 0, height: 0 };
    let scroll = { ease: scrollEase, current: 0, target: 0, last: 0 };
    let medias: any[] = [];
    let raf = 0;

    const updateViewport = () => {
      const fov = (camera.fov * Math.PI) / 180;
      const height = 2 * Math.tan(fov / 2) * camera.position.z;
      const width = height * camera.aspect;
      viewport = { width, height };
    };

    const onResize = () => {
      screen = { width: containerRef.current!.clientWidth, height: containerRef.current!.clientHeight };
      renderer.setSize(screen.width, screen.height);
      camera.perspective({ aspect: screen.width / screen.height });
      updateViewport();
    };

    onResize();

    mediasImages.forEach((data, index) => {
      const texture = new Texture(gl, { generateMipmaps: true });
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = data.image;
      img.onload = () => { texture.image = img; };

      const program = new Program(gl, {
        vertex: `
          attribute vec3 position; attribute vec2 uv;
          uniform mat4 modelViewMatrix; uniform mat4 projectionMatrix;
          varying vec2 vUv;
          void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
        `,
        fragment: `
          precision highp float;
          uniform sampler2D tMap; varying vec2 vUv;
          void main() { gl_FragColor = texture2D(tMap, vUv); }
        `,
        uniforms: { tMap: { value: texture } },
        transparent: true
      });

      const plane = new Mesh(gl, { geometry: planeGeometry, program });
      plane.setParent(scene);

      const scale = screen.height / 1500;
      plane.scale.y = (viewport.height * (900 * scale)) / screen.height;
      plane.scale.x = (viewport.width * (700 * scale)) / screen.width;

      const width = plane.scale.x + 2;
      const widthTotal = width * mediasImages.length;

      medias.push({ plane, x: width * index, width, widthTotal, extra: 0 });
    });

    const update = () => {
      scroll.current = lerp(scroll.current, scroll.target, scroll.ease);
      const direction = scroll.current > scroll.last ? 'right' : 'left';

      medias.forEach((media) => {
        media.plane.position.x = media.x - scroll.current - media.extra;

        const planeOffset = media.plane.scale.x / 2;
        const viewportOffset = viewport.width / 2;

        if (direction === 'right' && media.plane.position.x + planeOffset < -viewportOffset) {
          media.extra -= media.widthTotal;
        }
        if (direction === 'left' && media.plane.position.x - planeOffset > viewportOffset) {
          media.extra += media.widthTotal;
        }
      });

      renderer.render({ scene, camera });
      scroll.last = scroll.current;
      raf = requestAnimationFrame(update);
    };

    const onWheel = (e: WheelEvent) => {
      scroll.target += (e.deltaY > 0 ? scrollSpeed : -scrollSpeed) * 0.2;
    };

    window.addEventListener('resize', onResize);
    window.addEventListener('wheel', onWheel);
    update();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('wheel', onWheel);
      if (gl.canvas.parentNode) {
        gl.canvas.parentNode.removeChild(gl.canvas as HTMLCanvasElement);
      }
    };
  }, [items, bend, textColor, borderRadius, scrollSpeed, scrollEase]);

  return <div className="w-full h-full overflow-hidden cursor-grab active:cursor-grabbing" ref={containerRef} />;
}
