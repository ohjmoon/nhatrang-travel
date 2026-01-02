const mammoth = require('mammoth');
const fs = require('fs');
const path = require('path');

async function extractDocx(filePath) {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    console.log(result.value);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

const filePath = process.argv[2];
if (filePath) {
  extractDocx(filePath);
} else {
  console.log('Usage: node extract-docx.js <file.docx>');
}
