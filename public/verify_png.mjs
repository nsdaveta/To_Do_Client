import fs from 'fs';
const buffer = fs.readFileSync('c:/Users/nsdav/OneDrive/Desktop/MERN STACK/To_Do_List/To_Do_Client/public/logo-pwa.png');
console.log('Hex Header:', buffer.toString('hex', 0, 8));
