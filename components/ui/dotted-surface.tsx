'use client';

import { cn } from '@/lib/utils';
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

type DottedSurfaceProps = Omit<React.ComponentProps<'div'>, 'ref'>;

export function DottedSurface({ className, ...props }: DottedSurfaceProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const animationIdRef = useRef<number | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;


        const SEPARATION = 150;
        const AMOUNTX = 40;
        const AMOUNTY = 60;

        // Scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000);

        // Camera
        const camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            1,
            10000
        );
        camera.position.set(0, 355, 1220);

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        containerRef.current.appendChild(renderer.domElement);

        // Geometry
        const positions: number[] = [];
        const colors: number[] = [];
        const geometry = new THREE.BufferGeometry();

        for (let ix = 0; ix < AMOUNTX; ix++) {
            for (let iy = 0; iy < AMOUNTY; iy++) {
                const x = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
                const y = 0;
                const z = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;
                positions.push(x, y, z);
                colors.push(1, 1, 1); // white
            }
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 8,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            sizeAttenuation: true,
        });

        const points = new THREE.Points(geometry, material);
        scene.add(points);

        let count = 0;

        const animate = () => {
            animationIdRef.current = requestAnimationFrame(animate);

            const positionAttr = geometry.attributes.position as THREE.BufferAttribute;
            let i = 0;
            for (let ix = 0; ix < AMOUNTX; ix++) {
                for (let iy = 0; iy < AMOUNTY; iy++) {
                    positionAttr.setY(
                        i,
                        Math.sin((ix + count) * 0.3) * 50 + Math.sin((iy + count) * 0.5) * 50
                    );
                    i++;
                }
            }
            positionAttr.needsUpdate = true;

            count += 0.1;
            renderer.render(scene, camera);
        };

        animate();

        // Resize handler
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
            window.removeEventListener('resize', handleResize);
            geometry.dispose();
            material.dispose();
            renderer.dispose();
            if (containerRef.current && renderer.domElement.parentElement === containerRef.current) {
                containerRef.current.removeChild(renderer.domElement);
            }
        };


    }, []);

    return (
        <div
            ref={containerRef}
            className={cn('pointer-events-none fixed inset-0 -z-1', className)}
            {...props}
        />
    );
}
