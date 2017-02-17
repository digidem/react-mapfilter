import React from 'react'
import Image from './image'

const styles = {
  wrapper: {
    width: 200,
    height: 200,
    position: 'relative'
  },
  image: {
    width: 200,
    height: 200,
    display: 'block',
    background: '#000000'
  }
}

const Popup = ({imgSrc, title, subtitle}) => (
    {imgSrc && <Image src={imgSrc} style={styles.image} />}
  <div style={styles.wrapper}>
    <div className={'__mf_popup_title' + (imgSrc ? ' __mf_popup_img' : '')}>
      <h1>{title}</h1>
      <h2>{subtitle}</h2>
    </div>
  </div>
)

export default Popup
