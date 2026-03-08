class ImageService {
    async fetchVehicleImage(make, model, year) {
        const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
        const cx = process.env.GOOGLE_SEARCH_CX;

        if (!apiKey || !cx) {
            console.warn('Google API keys missing. Skipping image fetch.');
            return null;
        }

        const query = encodeURIComponent(`${year} ${make} ${model}`);
        const url = `https://www.googleapis.com/customsearch/v1?q=${query}&cx=${cx}&key=${apiKey}&searchType=image&num=1`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.error) {
                console.error('\n❌ GOOGLE API ERROR:');
                console.error(data.error.message);
                console.error('Check your API key in Google Cloud Console.\n');
                return null;
            }

            if (data.items && data.items.length > 0) {
                console.log(`\n✅ Image found for ${year} ${make} ${model}!`);
                return data.items[0].link; 
            }
            
            console.warn(`\n⚠️ Google searched for "${year} ${make} ${model}" but found 0 images.`);
            console.warn('Ensure your Google Programmable Search has sites like *.edmunds.com/* added to "Sites to Search".\n');
            return null;

        } catch (error) {
            console.error('\n❌ Image Search Network Error:', error);
            return null;
        }
    }
}

module.exports = new ImageService();