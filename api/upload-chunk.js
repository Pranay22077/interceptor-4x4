/**
 * Chunked Upload API - Receive Individual Chunks
 * 
 * Handles individual chunk uploads and stores them temporarily for reassembly.
 * Part of the Resumable Chunked Upload Protocol implementation.
 */

import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

// Temporary storage for chunks (Vercel provides /tmp directory)
const TEMP_DIR = '/tmp/uploads';

// Ensure temp directory exists
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse multipart form data
    const form = formidable({
      maxFileSize: 5 * 1024 * 1024, // 5MB max per chunk
      keepExtensions: true,
    });

    const [fields, files] = await form.parse(req);
    
    // Extract chunk data
    const chunk = files.chunk?.[0];
    const chunkIndex = parseInt(fields.chunkIndex?.[0] || '0');
    const totalChunks = parseInt(fields.totalChunks?.[0] || '0');
    const uploadId = fields.uploadId?.[0];
    const fileName = fields.fileName?.[0];
    const fileSize = parseInt(fields.fileSize?.[0] || '0');

    if (!chunk || !uploadId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create directory for this upload
    const uploadDir = path.join(TEMP_DIR, uploadId);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Save chunk to disk with zero-padded index for proper sorting
    const chunkPath = path.join(uploadDir, `chunk_${String(chunkIndex).padStart(4, '0')}`);
    const chunkBuffer = fs.readFileSync(chunk.filepath);
    fs.writeFileSync(chunkPath, chunkBuffer);

    // Clean up formidable temp file
    fs.unlinkSync(chunk.filepath);

    // Update metadata file
    const metadataPath = path.join(uploadDir, 'metadata.json');
    const metadata = {
      fileName,
      fileSize,
      totalChunks,
      uploadedChunks: chunkIndex + 1,
      lastChunkTime: new Date().toISOString(),
    };
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

    console.log(`Chunk ${chunkIndex + 1}/${totalChunks} received for ${uploadId}`);

    return res.status(200).json({
      success: true,
      chunkIndex,
      uploadId,
      message: `Chunk ${chunkIndex + 1}/${totalChunks} uploaded successfully`,
    });

  } catch (error) {
    console.error('Chunk upload error:', error);
    return res.status(500).json({
      error: `Chunk upload failed: ${error.message}`,
    });
  }
}
