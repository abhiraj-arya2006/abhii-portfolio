import fs from 'fs';
import crypto from 'crypto';

async function decrypt() {
  const encryptedData = fs.readFileSync('public/models/character.enc');
  // the first 16 bytes are IV
  const iv = encryptedData.slice(0, 16);
  const data = encryptedData.slice(16);
  
  // recreate generateAESKey logic in Node
  const password = "MyCharacter12";
  const hash = crypto.createHash('sha256').update(password).digest();
  const key = hash.slice(0, 32); // exactly 32 bytes for AES-256
  
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  // GLTF is an arraybuffer, turn off auto padding since it could be binary
  decipher.setAutoPadding(true);
  let decrypted = decipher.update(data);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  
  fs.writeFileSync('public/models/character_decrypted.glb', decrypted);
  console.log("Decrypted to character_decrypted.glb");
}
decrypt().catch(console.error);
