const cloudinary = require("./cloudinary");

const uploadToCloudinary = (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve(result.secure_url);
      }
    );

    stream.end(fileBuffer);
  });
};

module.exports = uploadToCloudinary;
