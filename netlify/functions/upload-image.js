
const cloudinary = require('cloudinary').v2;

// הגדרות Cloudinary (אלו צריכים להיות באזור ההגדרות של הסביבה ב-Netlify)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

exports.handler = async (event, context) => {
  // בדיקה שהבקשה היא מסוג POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    // קבלת הנתונים מהבקשה
    const { image } = JSON.parse(event.body);
    
    if (!image) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No image data provided' })
      };
    }

    // העלאת התמונה ל-Cloudinary
    // בפורמט base64 שמתקבל מהקליינט
    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder: 'qc-gallery',
      resource_type: 'auto'
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        url: uploadResponse.secure_url,
        publicId: uploadResponse.public_id
      })
    };
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to upload image' })
    };
  }
};
