import React, { Component } from 'react'

class How extends Component {
  render () {
    return (
      <article>
        <h1>How it works</h1>
        <br />
        <br />
        <p>ZeroTube is a platform that allow to share videos. You can find the code and report bug on the <a href="https://github.com/rllola/zeroTube">github</a>.
          <br />
          <br />
          It use webtorrent to download and seed the videos. More information on the project <a href="https://webtorrent.io/">here</a>.
          <br />
          Warining ! It use Webrtc and make your IP vunerable even with a VPN.
          <br />
          <br />
          With ZeroTube, you can look for videos or add one. If you add one please think of adding it to your <a href="https://webtorrent.io/desktop">webtorrent desktop</a> and keep it open.
          You can then seed the videos even if your zeronet app is not running and you can check how many people is viewing/seeding your video.
          <br />
          <br />
          I will soon start a feature that will let you choose an external seeder in exchange of some bitcoins.
          <br />
          <br />
          Like the project ? Then support Zeronet.<br /><br />
          You can also send Bitcoins to support ZeroTube dev : <br />
        <a href="bitcoin:1DMjveQ9iRqT8ELnxPU2vRnFgCMGt6Y9EA">1DMjveQ9iRqT8ELnxPU2vRnFgCMGt6Y9EA</a>
        </p>
      </article>
    )
  }
}

export default How
