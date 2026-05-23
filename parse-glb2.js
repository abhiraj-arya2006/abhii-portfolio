import fs from 'fs';

function readGLBJSON() {
  const buffer = fs.readFileSync('public/models/character_decrypted.glb');
  const magic = buffer.readUInt32LE(0);
  const chunkLength = buffer.readUInt32LE(12);
  const jsonStr = buffer.toString('utf8', 20, 20 + chunkLength);
  const gltf = JSON.parse(jsonStr);
  gltf.meshes.forEach(m => console.log("Mesh: " + m.name));
  gltf.materials.forEach(m => console.log("Material: " + m.name));
}
readGLBJSON();
