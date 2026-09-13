import React, { useEffect, useRef } from 'react';

const skills = [
  'Python', 'Machine Learning', 'NLP', 'LLMs',
  'RAG', 'ANN', 'PCA', 'TensorFlow', 'OpenCV',
  'Scikit-Learn', 'Streamlit', 'SQLite', 'Pandas',
  'NumPy', 'Java', 'Git', 'GitHub', 'Matplotlib'
];

interface Tag {
  text: string;
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
}

export const SkillsSphere3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = container.clientWidth;
    let height = container.clientHeight;
    
    // Scale canvas for retina displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const radius = Math.min(width, height) * 0.40;
    const centerX = width / 2;
    const centerY = height / 2;
    const depth = 350; // Focus depth for perspective

    // Initialize tags distributed evenly on a sphere using Fibonacci grid
    const tags: Tag[] = skills.map((text, i) => {
      const count = skills.length;
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      return {
        text,
        x,
        y,
        z,
        width: 0,
        height: 0,
      };
    });

    // Interaction states
    const mouse = { x: centerX, y: centerY, isOver: false };
    let currentRotationX = 0.003;
    let currentRotationY = 0.005;
    let activeTagIndex: number | null = null;

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.isOver = true;
    };

    const onMouseLeave = () => {
      mouse.isOver = false;
    };

    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseleave', onMouseLeave);

    const handleResize = () => {
      if (!containerRef.current) return;
      width = containerRef.current.clientWidth;
      height = containerRef.current.clientHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener('resize', handleResize);

    let animationId: number;

    const updateAndDraw = () => {
      ctx.clearRect(0, 0, width, height);

      // Determine rotation speeds based on mouse position
      let targetRotationX = 0.002;
      let targetRotationY = 0.003;

      if (mouse.isOver) {
        // Spin faster or reverse depending on position relative to center
        targetRotationX = -(mouse.y - centerY) * 0.000075;
        targetRotationY = (mouse.x - centerX) * 0.000075;
      }

      // Smooth damping/interpolation for rotation transitions
      currentRotationX += (targetRotationX - currentRotationX) * 0.05;
      currentRotationY += (targetRotationY - currentRotationY) * 0.05;

      const cosX = Math.cos(currentRotationX);
      const sinX = Math.sin(currentRotationX);
      const cosY = Math.cos(currentRotationY);
      const sinY = Math.sin(currentRotationY);

      // Rotate and Project Tags
      const projectedTags = tags.map((tag, idx) => {
        // Rotate Y (left/right)
        const x1 = tag.x * cosY - tag.z * sinY;
        const z1 = tag.z * cosY + tag.x * sinY;

        // Rotate X (up/down)
        const y2 = tag.y * cosX - z1 * sinX;
        const z2 = z1 * cosX + tag.y * sinX;

        // Update tag 3D coordinate
        tag.x = x1;
        tag.y = y2;
        tag.z = z2;

        // Perspective Projection calculation
        const perspectiveScale = depth / (depth - z2);
        const screenX = centerX + x1 * perspectiveScale;
        const screenY = centerY + y2 * perspectiveScale;

        return {
          tag,
          idx,
          screenX,
          screenY,
          scale: perspectiveScale,
          depthVal: z2,
        };
      });

      // Sort by depth (render back tags first, front tags on top)
      projectedTags.sort((a, b) => a.depthVal - b.depthVal);

      // Reset hover cursor state
      let foundHover = false;
      let hoveredIndex: number | null = null;

      // Draw projected tags
      projectedTags.forEach(({ tag, idx, screenX, screenY, scale }) => {
        // Scale font and opacity based on depth scale factor
        const isHovered = activeTagIndex === idx;
        const opacity = Math.min(1, Math.max(0.12, (scale - 0.4) / 1.1));
        const fontSize = Math.round(13 * scale * (isHovered ? 1.25 : 1));

        ctx.font = `600 ${fontSize}px 'Outfit', sans-serif`;

        // Measure text width for hit bounds
        const textMetrics = ctx.measureText(tag.text);
        tag.width = textMetrics.width;
        tag.height = fontSize;

        // Hit testing for hover
        if (
          mouse.isOver &&
          !foundHover &&
          mouse.x >= screenX - tag.width / 2 - 10 &&
          mouse.x <= screenX + tag.width / 2 + 10 &&
          mouse.y >= screenY - tag.height / 2 - 10 &&
          mouse.y <= screenY + tag.height / 2 + 10
        ) {
          hoveredIndex = idx;
          foundHover = true;
        }

        // Text color transition based on hover and depth (Silver White to Sky Cyan on Midnight Slate)
        if (isHovered) {
          ctx.fillStyle = 'rgba(56, 189, 248, 1)'; // Electric Sky Cyan
        } else {
          const blendVal = Math.min(1, Math.max(0, (tag.z + radius) / (2 * radius)));
          // Blend between cool slate (148, 163, 184) in back to crisp white (248, 250, 252) in front
          const r = Math.round(148 + (248 - 148) * blendVal);
          const g = Math.round(163 + (250 - 163) * blendVal);
          const b = Math.round(184 + (252 - 184) * blendVal);
          const effectiveOpacity = Math.max(0.3, opacity);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${effectiveOpacity})`;
        }

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Draw text
        ctx.fillText(tag.text, screenX, screenY);
      });

      // Update hovered tag and cursor styling
      activeTagIndex = hoveredIndex;
      canvas.style.cursor = foundHover ? 'pointer' : 'default';

      animationId = requestAnimationFrame(updateAndDraw);
    };

    let isSphereVisible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isSphereVisible = entry.isIntersecting;
        if (isSphereVisible && !animationId) {
          animationId = requestAnimationFrame(updateAndDraw);
        } else if (!isSphereVisible && animationId) {
          cancelAnimationFrame(animationId);
          animationId = 0;
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    animationId = requestAnimationFrame(updateAndDraw);

    return () => {
      observer.disconnect();
      if (animationId) cancelAnimationFrame(animationId);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[320px] md:h-[400px] flex items-center justify-center pointer-events-auto"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />
    </div>
  );
};
