

import grid from 'gridfs-stream';
import mongoose from 'mongoose';

const url = 'http://localhost:8000';

let gfs, gfsPhotos, gridfsBucket, gridfsPhotosBucket;
const conn = mongoose.connection;

conn.once('open', () => {
    // Initialize GridFSBucket for the 'fs' bucket
    gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: 'fs'
    });

    // Initialize GridFSBucket for the 'photos' bucket
    gridfsPhotosBucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: 'photos'
    });

    // Initialize GridFS for 'fs' collection
    gfs = grid(conn.db, mongoose.mongo);
    gfs.collection('fs');

    // Initialize GridFS for 'photos' collection
    gfsPhotos = grid(conn.db, mongoose.mongo);
    gfsPhotos.collection('photos');
});

// Function to upload an image
export const uploadImage = (request, response) => {
    if (!request.file)
        return response.status(404).json("File not found");

    const imageUrl = `${url}/file/${request.file.filename}`;
    response.status(200).json(imageUrl);
}

// Function to retrieve an image from either 'fs' or 'photos' bucket
export const getImage = async (request, response) => {
    try {
        // First, try to find the file in the 'photos' bucket
        let file = await gfsPhotos.files.findOne({ filename: request.params.filename });
        if (!file) {
            // If not found in 'photos', try the 'fs' bucket
            file = await gfs.files.findOne({ filename: request.params.filename });
            if (!file) {
                return response.status(404).json({ msg: 'File not found' });
            }

            // Stream the file from the 'fs' bucket
            const readStream = gridfsBucket.openDownloadStream(file._id);
            readStream.pipe(response);
        } else {
            // Stream the file from the 'photos' bucket
            const readStream = gridfsPhotosBucket.openDownloadStream(file._id);
            readStream.pipe(response);
        }
    } catch (error) {
        response.status(500).json({ msg: error.message });
    }
}
