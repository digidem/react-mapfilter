import React from 'react'
import Image from './image'

const styles = {
  image: {
    width: 200,
    height: 200,
    display: 'block',
    background: '#000000'
  }
}

const Popup = ({imgSrc, title, subtitle}) => (
  <div>
    {imgSrc && <Image src={imgSrc} style={styles.image} />}
    <div className={'__mf_popup_title' + (imgSrc ? ' __mf_popup_img' : '')}>
      <h1>{title}</h1>
      <h2>{subtitle}</h2>
    </div>
  </div>
)

export default Popup
