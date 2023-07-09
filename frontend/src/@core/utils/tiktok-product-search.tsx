import axios from 'axios';

export const getTiktokProductByKeywords = async (keywords: string, count: number) => {
  try {
    const options = {
      method: 'GET',
      url: 'https://tiktok-video-feature-summary.p.rapidapi.com/feed/search',
      params: {
        keywords,
        count: count.toString(),
        cursor: '0',
        region: 'US',
        publish_time: '0',
        sort_type: '0'
      },
      headers: {
        'X-RapidAPI-Key': 'd3fa2a421dmshba371501b9104dfp1e5058jsn0bda7b922113',
        'X-RapidAPI-Host': 'tiktok-video-feature-summary.p.rapidapi.com'
      }
    };

    const response = await axios.request(options);

    console.log(response)
    
    return response.data
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};
