import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import setCharacter from "./utils/character";
import setLighting from "./utils/lighting";
import { useLoading } from "../../context/LoadingProvider";
import handleResize from "./utils/resizeUtils";
import {
  handleMouseMove,
  handleTouchEnd,
  handleHeadRotation,
  handleTouchMove,
} from "./utils/mouseUtils";
import setAnimations from "./utils/animationUtils";
import { setProgress } from "../Loading";

const Scene = () => {
  const canvasDiv = useRef<HTMLDivElement | null>(null);
  const hoverDivRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef(new THREE.Scene());
  const { setLoading } = useLoading();

  const [character, setChar] = useState<THREE.Object3D | null>(null);
  useEffect(() => {
    if (canvasDiv.current) {
      let rect = canvasDiv.current.getBoundingClientRect();
      let container = { width: rect.width, height: rect.height };
      const aspect = container.width / container.height;
      const scene = sceneRef.current;

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
      });
      renderer.setSize(container.width, container.height);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1;
      canvasDiv.current.appendChild(renderer.domElement);

      const camera = new THREE.PerspectiveCamera(14.5, aspect, 0.1, 1000);
      camera.position.z = 10;
      camera.position.set(0, 13.1, 24.7);
      camera.zoom = 1.1;
      camera.updateProjectionMatrix();

      let headBone: THREE.Object3D | null = null;
      let screenLight: any | null = null;
      let mixer: THREE.AnimationMixer;

      const clock = new THREE.Clock();

      const light = setLighting(scene);
      let progress = setProgress((value) => setLoading(value));
      const { loadCharacter } = setCharacter(renderer, scene, camera);

      loadCharacter().then((gltf) => {
        if (gltf) {
          const animations = setAnimations(gltf);
          hoverDivRef.current && animations.hover(gltf, hoverDivRef.current);
          mixer = animations.mixer;
          let character = gltf.scene;
          setChar(character);
          scene.add(character);
          headBone = character.getObjectByName("spine006") || null;
          if (headBone) {
            const glasses = new THREE.Group();
            const frameMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8 });
            const lensMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.8, opacity: 0.3, transparent: true, roughness: 0.2 });
            
            const frameGeo = new THREE.TorusGeometry(0.3, 0.05, 16, 50);
            const leftFrame = new THREE.Mesh(frameGeo, frameMat);
            leftFrame.position.set(-0.35, 1.2, 0.8);
            leftFrame.scale.set(1, 0.8, 1);
            
            const rightFrame = new THREE.Mesh(frameGeo, frameMat);
            rightFrame.position.set(0.35, 1.2, 0.8);
            rightFrame.scale.set(1, 0.8, 1);
            
            const bridgeGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.2);
            const bridge = new THREE.Mesh(bridgeGeo, frameMat);
            bridge.rotation.z = Math.PI / 2;
            bridge.position.set(0, 1.2, 0.82);
            
            const leftTemple = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.0), frameMat);
            leftTemple.rotation.x = Math.PI / 2;
            leftTemple.position.set(-0.65, 1.2, 0.3);
            
            const rightTemple = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.0), frameMat);
            rightTemple.rotation.x = Math.PI / 2;
            rightTemple.position.set(0.65, 1.2, 0.3);

            const lensGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.02, 32);
            const leftLens = new THREE.Mesh(lensGeo, lensMat);
            leftLens.rotation.x = Math.PI / 2;
            leftLens.position.set(-0.35, 1.2, 0.8);
            leftLens.scale.set(1, 1, 0.8);
            
            const rightLens = new THREE.Mesh(lensGeo, lensMat);
            rightLens.rotation.x = Math.PI / 2;
            rightLens.position.set(0.35, 1.2, 0.8);
            rightLens.scale.set(1, 1, 0.8);

            glasses.add(leftFrame, rightFrame, bridge, leftTemple, rightTemple, leftLens, rightLens);
            glasses.scale.set(2.5, 2.5, 2.5);
            glasses.position.set(-0.1, 0, 0); 
            
            headBone.add(glasses);
          }
          screenLight = character.getObjectByName("screenlight") || null;
          progress.loaded().then(() => {
            setTimeout(() => {
              light.turnOnLights();
              animations.startIntro();
            }, 2500);
          });
          window.addEventListener("resize", () =>
            handleResize(renderer, camera, canvasDiv, character)
          );
        }
      });

      let mouse = { x: 0, y: 0 },
        interpolation = { x: 0.1, y: 0.2 };

      const onMouseMove = (event: MouseEvent) => {
        handleMouseMove(event, (x, y) => (mouse = { x, y }));
      };
      let debounce: number | undefined;
      const onTouchStart = (event: TouchEvent) => {
        const element = event.target as HTMLElement;
        debounce = setTimeout(() => {
          element?.addEventListener("touchmove", (e: TouchEvent) =>
            handleTouchMove(e, (x, y) => (mouse = { x, y }))
          );
        }, 200);
      };

      const onTouchEnd = () => {
        handleTouchEnd((x, y, interpolationX, interpolationY) => {
          mouse = { x, y };
          interpolation = { x: interpolationX, y: interpolationY };
        });
      };

      document.addEventListener("mousemove", (event) => {
        onMouseMove(event);
      });
      const landingDiv = document.getElementById("landingDiv");
      if (landingDiv) {
        landingDiv.addEventListener("touchstart", onTouchStart);
        landingDiv.addEventListener("touchend", onTouchEnd);
      }
      const animate = () => {
        requestAnimationFrame(animate);
        if (headBone) {
          handleHeadRotation(
            headBone,
            mouse.x,
            mouse.y,
            interpolation.x,
            interpolation.y,
            THREE.MathUtils.lerp
          );
          light.setPointLight(screenLight);
        }
        const delta = clock.getDelta();
        if (mixer) {
          mixer.update(delta);
        }
        renderer.render(scene, camera);
      };
      animate();
      return () => {
        clearTimeout(debounce);
        scene.clear();
        renderer.dispose();
        window.removeEventListener("resize", () =>
          handleResize(renderer, camera, canvasDiv, character!)
        );
        if (canvasDiv.current) {
          canvasDiv.current.removeChild(renderer.domElement);
        }
        if (landingDiv) {
          document.removeEventListener("mousemove", onMouseMove);
          landingDiv.removeEventListener("touchstart", onTouchStart);
          landingDiv.removeEventListener("touchend", onTouchEnd);
        }
      };
    }
  }, []);

  return (
    <>
      <div className="character-container">
        <div className="character-model" ref={canvasDiv}>
          <div className="character-rim"></div>
          <div className="character-hover" ref={hoverDivRef}></div>
        </div>
      </div>
    </>
  );
};

export default Scene;
