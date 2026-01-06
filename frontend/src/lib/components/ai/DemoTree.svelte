<script lang="ts">
    import { onMount } from "svelte";
    import * as THREE from "three";

    let container: HTMLDivElement;
    let rootGroup: THREE.Group;

    onMount(() => {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x111111);

        const camera = new THREE.PerspectiveCamera(
            75,
            container.clientWidth / container.clientHeight,
            0.1,
            1000,
        );
        camera.position.z = 500;

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);

        rootGroup = new THREE.Group();
        scene.add(rootGroup);

        const jointMaterial = new THREE.MeshBasicMaterial({ color: 0xff00ff });
        const headLandmarkIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const headLandmarks: [number, number, number][] =
            headLandmarkIndices.map((i) => {
                const angle = (i / headLandmarkIndices.length) * Math.PI * 2;
                return [Math.cos(angle) * 50, Math.sin(angle) * 50 + 150, 0];
            });

        const headSpheres: THREE.Mesh[] = [];
        for (const pos of headLandmarks) {
            const sphere = new THREE.Mesh(
                new THREE.SphereGeometry(4, 12, 12),
                jointMaterial,
            );
            sphere.position.set(...pos);
            rootGroup.add(sphere);
            headSpheres.push(sphere);
        }

        const boneMaterial = new THREE.LineBasicMaterial({ color: 0x00ffff });
        for (let i = 0; i < headSpheres.length; i++) {
            const current = headSpheres[i];
            const next = headSpheres[(i + 1) % headSpheres.length];
            const points = [current.position, next.position];
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const line = new THREE.Line(geometry, boneMaterial);
            rootGroup.add(line);
        }

        const animate = () => {
            requestAnimationFrame(animate);
            rootGroup.rotation.y += 0.01;
            renderer.render(scene, camera);
        };
        animate();
    });
</script>

<div bind:this={container} style="width: 100%; height: 600px;"></div>
