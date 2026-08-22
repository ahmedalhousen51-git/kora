/* Design reminder: Neo-Folk Editorial — the canvas is the tactile stage: navy depth, copper practical light, emerald character accents. */
import { useEffect, useRef } from "react";
import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { Color3, Color4 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { ShaderMaterial } from "@babylonjs/core/Materials/shaderMaterial";
import { Effect } from "@babylonjs/core/Materials/effect";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { SpotLight } from "@babylonjs/core/Lights/spotLight";
import { PointLight } from "@babylonjs/core/Lights/pointLight";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { TransformNode } from "@babylonjs/core/Meshes/transformNode";
import type { Material } from "@babylonjs/core/Materials/material";

Effect.ShadersStore["koraVertexShader"] = `precision highp float; attribute vec3 position; uniform mat4 worldViewProjection; void main(void) { gl_Position = worldViewProjection * vec4(position, 1.0); }`;
Effect.ShadersStore["koraFragmentShader"] = `precision highp float; uniform vec3 color; void main(void) { gl_FragColor = vec4(color, 1.0); }`;

function mat(scene: Scene, name: string, color: Color3, _roughness = 0.65, _metallic = 0.05): Material {
  const m = new ShaderMaterial(name, scene, { vertex: "kora", fragment: "kora" }, { attributes: ["position"], uniforms: ["worldViewProjection", "color"] });
  m.setColor3("color", color);
  return m;
}

type GameCanvasProps = { onStationReached?: (station: string) => void };

export default function GameCanvas({ onStationReached }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const engine = new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: true });
    const scene = new Scene(engine);
    scene.clearColor = new Color4(0.025, 0.065, 0.09, 1);
    scene.fogMode = Scene.FOGMODE_EXP2;
    scene.fogDensity = 0.012;
    scene.fogColor = new Color3(0.025, 0.065, 0.09);

    const camera = new ArcRotateCamera("camera", Math.PI / 2.35, 1.16, 13.5, new Vector3(0, 2.2, 0), scene);
    camera.lowerRadiusLimit = 9;
    camera.upperRadiusLimit = 18;
    camera.wheelPrecision = 90;
    camera.attachControl(canvas, true);
    camera.panningSensibility = 0;

    const hemi = new HemisphericLight("soft-fill", new Vector3(0, 1, 0), scene);
    hemi.intensity = 1.15;
    hemi.diffuse = new Color3(0.33, 0.48, 0.52);
    const key = new SpotLight("amber-key", new Vector3(-3, 8, 5), new Vector3(0.3, -1, -0.5), Math.PI / 2.2, 24, scene);
    key.intensity = 5.4;
    key.diffuse = new Color3(1, 0.55, 0.25);
    const rim = new PointLight("emerald-rim", new Vector3(5, 4, -4), scene);
    rim.intensity = 3.2;
    rim.diffuse = new Color3(0.05, 0.65, 0.48);

    const navy = mat(scene, "navy", new Color3(0.035, 0.095, 0.12), 0.85);
    const walnut = mat(scene, "walnut", new Color3(0.19, 0.09, 0.045), 0.5);
    const copper = mat(scene, "copper", new Color3(0.72, 0.29, 0.12), 0.25, 0.7);
    const ivory = mat(scene, "ivory", new Color3(0.86, 0.78, 0.63), 0.72);
    const marble = mat(scene, "marble", new Color3(0.72, 0.68, 0.58), 0.78);
    const tile = mat(scene, "tile", new Color3(0.68, 0.58, 0.45), 0.42);
    const emerald = mat(scene, "emerald", new Color3(0.03, 0.48, 0.38), 0.5);
    const charcoal = mat(scene, "charcoal", new Color3(0.025, 0.03, 0.035), 0.9);

    const box = (name: string, size: Vector3, pos: Vector3, material: Material) => {
      const mesh = MeshBuilder.CreateBox(name, { width: size.x, height: size.y, depth: size.z }, scene);
      mesh.position = pos;
      mesh.material = material;
      return mesh;
    };
    const cyl = (name: string, diameter: number, height: number, pos: Vector3, material: Material) => {
      const mesh = MeshBuilder.CreateCylinder(name, { diameter, height, tessellation: 32 }, scene);
      mesh.position = pos;
      mesh.material = material;
      return mesh;
    };

    box("floor", new Vector3(18, 0.25, 12), new Vector3(0, -0.15, 0), walnut);
    box("back-wall", new Vector3(18, 8, 0.25), new Vector3(0, 3.9, -4.4), navy);
    box("left-wall", new Vector3(0.25, 8, 10), new Vector3(-8.9, 3.9, 0), navy);
    for (let x = -7.6; x <= 7.6; x += 1.7) {
      for (let y = 1.1; y <= 6.2; y += 1.55) box(`tile-${x}-${y}`, new Vector3(1.4, 1.25, 0.07), new Vector3(x, y, -4.24), tile);
    }
    box("counter-top", new Vector3(12, 0.35, 2.3), new Vector3(0.3, 1.2, 0.2), marble);
    box("counter-front", new Vector3(12, 1.3, 0.22), new Vector3(0.3, 0.55, 1.25), copper);
    box("shelf-top", new Vector3(12, 0.22, 0.65), new Vector3(0.3, 5.1, -3.75), walnut);
    box("shelf-mid", new Vector3(12, 0.22, 0.65), new Vector3(0.3, 3.6, -3.75), walnut);
    for (let i = -5; i <= 5; i += 2) {
      cyl(`jar-${i}`, 0.55, 0.65, new Vector3(i, 4.15, -3.45), ivory);
      cyl(`jar-lid-${i}`, 0.58, 0.06, new Vector3(i, 4.5, -3.45), copper);
    }

    const machine = box("espresso-machine", new Vector3(2.4, 1.4, 1.3), new Vector3(3.8, 2.05, -1.2), copper);
    machine.rotation.y = -0.08;
    cyl("boiler", 0.72, 1.25, new Vector3(3.8, 2.95, -1.2), ivory);
    cyl("portafilter", 0.55, 0.08, new Vector3(3.8, 1.45, -0.5), charcoal).rotation.x = Math.PI / 2;
    for (const x of [2.75, 3.45, 4.15]) cyl(`cup-${x}`, 0.45, 0.34, new Vector3(x, 1.58, 0.25), ivory);
    // Espresso station equipment: grinder, tamper, and bean hopper.
    box("grinder", new Vector3(0.75, 1.25, 0.72), new Vector3(1.7, 2.05, -1.2), charcoal);
    cyl("grinder-hopper", 0.55, 0.62, new Vector3(1.7, 3.0, -1.2), ivory);
    cyl("tamper", 0.18, 0.62, new Vector3(2.65, 2.05, -0.9), copper);
    cyl("bean-hopper", 0.42, 0.34, new Vector3(2.65, 2.52, -0.9), walnut);
    // Cold station: JTC-style blender, ice maker and microwave.
    box("jtc-blender-base", new Vector3(0.9, 0.9, 0.9), new Vector3(-4.2, 1.75, -1.15), charcoal);
    box("jtc-blender-jar", new Vector3(0.7, 1.25, 0.7), new Vector3(-4.2, 2.8, -1.15), ivory);
    box("ice-maker", new Vector3(1.0, 1.1, 0.9), new Vector3(-5.7, 1.85, -1.15), marble);
    box("microwave", new Vector3(1.2, 0.85, 0.9), new Vector3(-2.4, 1.82, -1.15), charcoal);
    // Syrup and matcha stations on the upper shelf.
    for (const x of [-0.6, 0.05, 0.7]) { cyl(`syrup-bottle-${x}`, 0.28, 0.9, new Vector3(x, 4.1, -3.38), copper); cyl(`syrup-pump-${x}`, 0.08, 0.32, new Vector3(x, 4.72, -3.38), ivory); }
    for (const x of [-3.2, -2.55]) cyl(`matcha-tin-${x}`, 0.48, 0.65, new Vector3(x, 4.15, -3.38), emerald);
    cyl("chasen-handle", 0.1, 0.85, new Vector3(-1.85, 4.15, -3.38), walnut);

    // New procedural character: Noura, built from readable silhouette layers.
    const character = new TransformNode("noura", scene);
    character.position = new Vector3(-2.1, 0, 0.55);
    const stationTargets: Record<string, Vector3> = {
      espresso: new Vector3(3.3, 0, -0.2),
      cold: new Vector3(-3.7, 0, 0.1),
      syrup: new Vector3(0.2, 0, -2.9),
      matcha: new Vector3(-2.8, 0, -2.9),
    };
    let destination = character.position.clone();
    let destinationStation = "bar";
    let announcedStation = "";
    const torso = MeshBuilder.CreateCylinder("noura-torso", { diameterTop: 1.15, diameterBottom: 1.55, height: 2.15, tessellation: 24 }, scene);
    torso.position.y = 2.25; torso.material = emerald; torso.parent = character;
    const apron = MeshBuilder.CreateBox("noura-apron", { width: 1.12, height: 1.45, depth: 0.12 }, scene);
    apron.position = new Vector3(0, 2.1, 0.7); apron.material = copper; apron.parent = character;
    const head = MeshBuilder.CreateSphere("noura-head", { diameter: 1.18, segments: 24 }, scene);
    head.position.y = 3.85; head.material = ivory; head.parent = character;
    const scarf = MeshBuilder.CreateTorus("noura-scarf", { diameter: 1.3, thickness: 0.28, tessellation: 32 }, scene);
    scarf.position.y = 4.16; scarf.rotation.x = Math.PI / 2; scarf.material = emerald; scarf.parent = character;
    const eyeMat = mat(scene, "eyes", new Color3(0.02, 0.02, 0.018), 0.3);
    for (const x of [-0.19, 0.19]) { const eye = MeshBuilder.CreateSphere(`eye-${x}`, { diameter: 0.09 }, scene); eye.position = new Vector3(x, 3.91, 0.53); eye.material = eyeMat; eye.parent = character; }
    for (const x of [-0.75, 0.75]) { const arm = MeshBuilder.CreateCylinder(`arm-${x}`, { diameter: 0.28, height: 1.65, tessellation: 16 }, scene); arm.position = new Vector3(x, 2.3, 0); arm.rotation.z = x < 0 ? -0.35 : 0.35; arm.material = ivory; arm.parent = character; }
    for (const x of [-0.4, 0.4]) { const leg = MeshBuilder.CreateCylinder(`leg-${x}`, { diameter: 0.38, height: 1.7, tessellation: 16 }, scene); leg.position = new Vector3(x, 0.75, 0); leg.material = charcoal; leg.parent = character; }
    const tray = MeshBuilder.CreateCylinder("noura-tray", { diameter: 0.72, height: 0.08, tessellation: 32 }, scene);
    tray.position = new Vector3(-0.95, 2.05, 0.1); tray.rotation.z = -0.15; tray.material = copper; tray.parent = character;


    const moveTo = (point: Vector3, station = "bar") => { destination = new Vector3(point.x, 0, point.z); destinationStation = station; };
    const nearestStation = (position: Vector3) => Object.entries(stationTargets).sort((a, b) => Vector3.Distance(position, a[1]) - Vector3.Distance(position, b[1]))[0];
    const onKeyDown = (event: KeyboardEvent) => {
      const step = event.shiftKey ? 1.2 : 0.55;
      const next = destination.clone();
      if (["ArrowLeft", "a", "A"].includes(event.key)) next.x -= step;
      if (["ArrowRight", "d", "D"].includes(event.key)) next.x += step;
      if (["ArrowUp", "w", "W"].includes(event.key)) next.z -= step;
      if (["ArrowDown", "s", "S"].includes(event.key)) next.z += step;
      if (next.equals(destination)) return;
      event.preventDefault();
      moveTo(next, nearestStation(next)[0]);
    };
    let dragging = false;
    const moveFromPointer = (event: PointerEvent) => {
      const pick = scene.pick(event.clientX, event.clientY);
      if (!pick?.pickedPoint) return;
      const target = nearestStation(pick.pickedPoint);
      moveTo(target[1], target[0]);
    };
    const onPointerDown = (event: PointerEvent) => { dragging = true; canvas.setPointerCapture?.(event.pointerId); moveFromPointer(event); };
    const onPointerMove = (event: PointerEvent) => { if (dragging) moveFromPointer(event); };
    const onPointerUp = (event: PointerEvent) => { dragging = false; canvas.releasePointerCapture?.(event.pointerId); };
    const onHudStation = (event: Event) => {
      const station = (event as CustomEvent<string>).detail;
      if (station && stationTargets[station]) moveTo(stationTargets[station], station);
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("kora-move-to", onHudStation);
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);
    let t = 0;
    engine.runRenderLoop(() => {
      t += engine.getDeltaTime() * 0.001;
      const delta = destination.subtract(character.position);
      if (delta.length() > 0.08) {
        const direction = delta.normalize();
        character.position.addInPlace(direction.scale(Math.min(engine.getDeltaTime() * 0.0023, delta.length())));
        character.rotation.y = Math.atan2(direction.x, direction.z);
      } else if (announcedStation !== destinationStation) {
        announcedStation = destinationStation;
        onStationReached?.(destinationStation);
      }
      character.position.y = Math.sin(t * 1.8) * 0.025;
      torso.scaling.y = 1 + Math.sin(t * 1.8) * 0.012;
      const targetRadius = destinationStation === "bar" ? 13.5 : 9.8;
      camera.radius += (targetRadius - camera.radius) * 0.035;
      if (destinationStation !== "bar") camera.setTarget(new Vector3(destination.x, 2.2, destination.z - 1.2));
      else camera.setTarget(new Vector3(0, 2.2, 0));
      scene.render();
    });
    const resize = () => engine.resize();
    window.addEventListener("resize", resize);
    return () => { window.removeEventListener("resize", resize); canvas.removeEventListener("pointerdown", onPointerDown); canvas.removeEventListener("pointermove", onPointerMove); canvas.removeEventListener("pointerup", onPointerUp); canvas.removeEventListener("pointercancel", onPointerUp); window.removeEventListener("keydown", onKeyDown); window.removeEventListener("kora-move-to", onHudStation); engine.dispose(); };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-label="مشهد المطبخ ثلاثي الأبعاد" />;
}
