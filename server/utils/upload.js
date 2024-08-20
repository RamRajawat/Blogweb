
import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';
import dotenv from 'dotenv';

dotenv.config();

// MongoDB connection URL with credentials (make sure to replace with actual credentials)
const mongoURI = `mongodb://localhost:27017/BlogWeb`;

// Set up GridFsStorage with multer
const storage = new GridFsStorage({
    url: mongoURI,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (request, file) => {
        const match = ["image/png", "image/jpeg", "image/jpg"];

        if (match.indexOf(file.mimetype) === -1) {
            return `${Date.now()}-blog-${file.originalname}`;
        }

        return {
            bucketName: "photos",  // GridFS collection name
            filename: `${Date.now()}-blog-${file.originalname}`
        };
    }
});

// Export the configured multer instance
export default multer({ storage });

