
import axios from "axios";

const uploadBanner = async (img) => {
    try {
        // Get the presigned URL for uploading
        const { data: { url } } = await axios.put('http://localhost:3000/upload-banner');

        // Upload the image to S3 using the presigned URL
        const response = await axios.put(url, img, {
            headers: {
                "Content-Type": 'image/jpeg' // Make sure this matches the content type used when generating the URL
            }
        });
        
        if (response.status === 200) {
            console.log('Image uploaded successfully.');
            // Return the URL of the uploaded image (excluding query parameters)
            return url.split("?")[0];
        }
    } catch (error) {
        console.error("Error uploading image.", error);
    }
};

export default uploadBanner;
