import React, { Children } from 'react';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import Player from '@/components/audio-player/player';
function layout({children}) {
  return (
    <>
        <Navbar/>
        <main className='min-h-screen'>
        {children}
        </main>
        <Footer/>
        <Player />
    </>
  )
}

export default layout