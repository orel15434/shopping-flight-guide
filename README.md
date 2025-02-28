
# Cloudinary Netlify Integration

This project uses Cloudinary for image storage along with Netlify Functions to handle image uploads.

## Setting Up Environment Variables in Netlify

To make this work, you need to add the following environment variables in your Netlify project settings:

1. Go to your Netlify dashboard
2. Select your site
3. Go to Site settings > Build & deploy > Environment
4. Add the following environment variables:
   - `CLOUDINARY_CLOUD_NAME` - Your Cloudinary cloud name
   - `CLOUDINARY_API_KEY` - Your Cloudinary API key
   - `CLOUDINARY_API_SECRET` - Your Cloudinary API secret

## Getting Cloudinary Credentials

1. Sign up for a free Cloudinary account at [cloudinary.com](https://cloudinary.com)
2. After signing in, go to the Dashboard
3. You'll find your cloud name, API key and API secret there

## Local Development

For local development, create a `.env` file in the root of your project with:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Important Notes

- The free tier of Cloudinary provides 25GB of storage and 25GB of monthly bandwidth
- Make sure not to expose your API keys in the client-side code
- All images are uploaded to a 'qc-gallery' folder in your Cloudinary account
