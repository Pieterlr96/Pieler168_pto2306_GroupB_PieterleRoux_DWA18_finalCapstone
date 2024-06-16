import supabase from '@/config/supabaseClient';
import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const response = await fetch('https://podcast-api.netlify.app/id/10716');
      const data = await response.json();

      // Insert data into Supabase
      const { error } = await supabase
        .from('podcasts')  // Ensure this matches your table name
        .insert(data);

      if (error) {
        console.error('Error inserting data:', error);
        res.status(500).json({ error: 'Error inserting data' });
      } else {
        res.status(200).json({ message: 'Data inserted successfully!' });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Error fetching data' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
