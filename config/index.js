import fetch from 'node-fetch';

export async function getStaticProps() {
  const response = await fetch('https://podcast-api.netlify.app/id/10716');
  const data = await response.json();

  return {
    props: {
      podcasts: data,
    },
    revalidate: 3600, // Revalidate the data every hour
  };
}

export default function Home({ podcasts }) {
  return (
    <div>
      <h1>Podcast Data</h1>
      <ul>
        {podcasts.map((podcast) => (
          <li key={podcast.id}>
            <h2>{podcast.title}</h2>
            <p>{podcast.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
