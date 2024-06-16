import React from 'react';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import Player from '@/components/audio-player/player';

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main className='min-h-screen'>{children}</main>
      <Footer />
      <Player />
    </>
  );
}

export default Layout;