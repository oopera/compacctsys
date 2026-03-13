"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const NODE_COUNT = 72;
const CONNECT_DIST = 170; // px
const SPEED = 0.28;

export function HeroCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let w = el.clientWidth;
    let h = el.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-w / 2, w / 2, h / 2, -h / 2, 0, 1);

    // Nodes
    const nodes = Array.from({ length: NODE_COUNT }, () => ({
      x: (Math.random() - 0.5) * w,
      y: (Math.random() - 0.5) * h,
      vx: (Math.random() - 0.5) * SPEED * 2,
      vy: (Math.random() - 0.5) * SPEED * 2,
    }));

    // Points geometry
    const pPos = new Float32Array(NODE_COUNT * 3);
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xd4b8e0,
      size: 4,
      sizeAttenuation: false,
      transparent: true,
      opacity: 0.7,
    });
    scene.add(new THREE.Points(pGeo, pMat));

    // Lines geometry (pre-allocate max)
    const lPos = new Float32Array(NODE_COUNT * NODE_COUNT * 6);
    const lAttr = new THREE.BufferAttribute(lPos, 3);
    lAttr.setUsage(THREE.DynamicDrawUsage);
    const lGeo = new THREE.BufferGeometry();
    lGeo.setAttribute("position", lAttr);
    const lMat = new THREE.LineBasicMaterial({
      color: 0xc4a8d8,
      transparent: true,
      opacity: 0.2,
    });
    const lineSegs = new THREE.LineSegments(lGeo, lMat);
    scene.add(lineSegs);

    const connectSq = CONNECT_DIST * CONNECT_DIST;
    let raf: number;

    function tick() {
      raf = requestAnimationFrame(tick);

      for (let i = 0; i < NODE_COUNT; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;
        if (n.x > w / 2 || n.x < -w / 2) n.vx *= -1;
        if (n.y > h / 2 || n.y < -h / 2) n.vy *= -1;
        pPos[i * 3] = n.x;
        pPos[i * 3 + 1] = n.y;
        pPos[i * 3 + 2] = 0;
      }
      pGeo.attributes.position.needsUpdate = true;

      let ec = 0;
      for (let i = 0; i < NODE_COUNT; i++) {
        for (let j = i + 1; j < NODE_COUNT; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          if (dx * dx + dy * dy < connectSq) {
            lPos[ec * 6 + 0] = nodes[i].x;
            lPos[ec * 6 + 1] = nodes[i].y;
            lPos[ec * 6 + 2] = 0;
            lPos[ec * 6 + 3] = nodes[j].x;
            lPos[ec * 6 + 4] = nodes[j].y;
            lPos[ec * 6 + 5] = 0;
            ec++;
          }
        }
      }
      lGeo.setDrawRange(0, ec * 2);
      lAttr.needsUpdate = true;

      renderer.render(scene, camera);
    }

    tick();

    const onResize = () => {
      w = el.clientWidth;
      h = el.clientHeight;
      renderer.setSize(w, h);
      camera.left = -w / 2;
      camera.right = w / 2;
      camera.top = h / 2;
      camera.bottom = -h / 2;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0" />;
}
