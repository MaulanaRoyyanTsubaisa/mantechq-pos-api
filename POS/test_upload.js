import fs from 'fs';
import path from 'path';

async function testUpload() {
  const formData = new FormData();
  // Create a dummy small image file
  const buffer = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
  const blob = new Blob([buffer], { type: 'image/gif' });
  formData.append('photo', blob, 'test.gif');

  try {
    const res = await fetch('https://mantechq-pos-api-id83.vercel.app/api/upload', {
      method: 'POST',
      body: formData
    });
    console.log('Status:', res.status);
    const text = await res.text();
    console.log('Response:', text);
  } catch (err) {
    console.error('Error:', err);
  }
}

testUpload();
