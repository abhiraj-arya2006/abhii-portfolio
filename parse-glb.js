import fs from 'fs';

function readGLBJSON() {
  const buffer = fs.readFileSync('public/models/character_decrypted.glb');
  const magic = buffer.readUInt32LE(0);
  const version = buffer.readUInt32LE(4);
  const length = buffer.readUInt32LE(8);
  
  const chunkLength = buffer.readUInt32LE(12);
  const chunkType = buffer.readUInt32LE(16);
  
  if (magic === 0x46546C67 && chunkType === 0x4E4F534A) { // 'glTF' and 'JSON'
    const jsonStr = buffer.toString('utf8', 20, 20 + chunkLength);
    const gltf = JSON.parse(jsonStr);
    const meshes = gltf.meshes.map(m => m.name);
    console.log("Meshes:", meshes);
    const materials = gltf.materials.map(m => m.name);
    console.log("Materials:", materials);
  } else {
    console.log("Not a valid GLB");
  }
}

readGLBJSON();
