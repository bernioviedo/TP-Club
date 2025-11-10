import { motion as Motion  } from 'framer-motion'
import './UsArticle.css'


export default function UsArticle({title, image}){

    return(
        <>
        <article className="usArticle">
            <h2 className='article-title oswald-article'>{title}</h2>
            <img className="article-image" src={image} alt="imagen" />
        </article>
        </>
    )
}