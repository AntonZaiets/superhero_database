import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';

let gridfsBucket;

const initGridFS = () => {
  const conn = mongoose.connection;

  conn.once('open', () => {
    gridfsBucket = new GridFSBucket(conn.db, {
      bucketName: 'superhero_images',
    });
    console.log('GridFS initialized');
  });
};

const getGridFSBucket = () => {
  if (!gridfsBucket) {
    throw new Error('GridFS not initialized');
  }
  return gridfsBucket;
};

export { initGridFS, getGridFSBucket };
