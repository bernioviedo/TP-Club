function Card({imgRoute, text, name, title}){
    return(
        <div className={`card ${name}`}>
            <img src={imgRoute} class="card-img-top" alt="..."/>
            <div className="card-body">
                <h3 className="card-title">{title}</h3>
                <p className="card-text">{text}</p>
            </div>
        </div>
    )
}

export default Card