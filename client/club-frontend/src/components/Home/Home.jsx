import React from 'react'
import './Home.css'
import CarouselHome from '../CarouselHome/CarouselHome.jsx'
import Card from '../Card/Card.jsx'

export default function Home() {
  return (
    <div className='main-content'>
      <div className='main-content-position'>   
        <CarouselHome className="carousel"></CarouselHome>
        <div className='news'>
            <h2 className='title'>Ultimas noticias</h2>
            <section className='news-cards-section'>
              <Card name={'card1'} text={'Esto es una noticia, pero imporante'} title={'Titulo de la noticia'}
              imgRoute={"https://resizer.glanacion.com/resizer/v2/la-seleccion-argentina-viene-de-perder-por-la-Z6BREBEP3NGD7KHNDDYGVDPZTI.JPG?auth=d0759eac651a98b2523ad958adef8244f981dc695f669a421c8a48a97e1ef156&width=1280&height=854&quality=70&smart=true"}></Card>
              <Card name={'card2'} text={'Esto es una noticia'} title={'Titulo de la noticia'}
              imgRoute={"https://resizer.glanacion.com/resizer/v2/la-seleccion-argentina-viene-de-perder-por-la-Z6BREBEP3NGD7KHNDDYGVDPZTI.JPG?auth=d0759eac651a98b2523ad958adef8244f981dc695f669a421c8a48a97e1ef156&width=1280&height=854&quality=70&smart=true"}></Card>
              <Card name={'card3'} text={'Esto es una noticia'} title={'Titulo de la noticia'}
              imgRoute={"https://resizer.glanacion.com/resizer/v2/la-seleccion-argentina-viene-de-perder-por-la-Z6BREBEP3NGD7KHNDDYGVDPZTI.JPG?auth=d0759eac651a98b2523ad958adef8244f981dc695f669a421c8a48a97e1ef156&width=1280&height=854&quality=70&smart=true"}></Card>
              <Card name={'card4'} text={'Esto es una noticia'} title={'Titulo de la noticia'}
              imgRoute={"https://resizer.glanacion.com/resizer/v2/la-seleccion-argentina-viene-de-perder-por-la-Z6BREBEP3NGD7KHNDDYGVDPZTI.JPG?auth=d0759eac651a98b2523ad958adef8244f981dc695f669a421c8a48a97e1ef156&width=1280&height=854&quality=70&smart=true"}></Card>
            </section>
        </div>
      </div>
    </div>
  ) //TODO: agregar mas contenido, un calendario o un carousel mostrando
  // merchandising del club
}
