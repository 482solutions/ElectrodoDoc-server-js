import { initDB } from './utils/initdb';

initDB().then(() => {
  console.log('DB successfully initiated');
  process.exit()
}).catch(
  () => {
    console.log('Failed to initiate db');
  },
);