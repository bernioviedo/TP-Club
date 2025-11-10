import UsArticle from "../components/UsArticle/UsArticle.jsx"


export default function Nosotros() {
    return(
        <>
        <section className="us-articles">
            <UsArticle title={'La Gacela FC, mucho más que un club'} image={"../src/assets/LaGacelaFC.png"}></UsArticle>
            <UsArticle title={'Un lugar para aprender y crecer, como atleta y persona'} image={"https://copacovap.es/wp-content/uploads/2017/12/P1190582.jpg"}></UsArticle>
            <UsArticle title={'Contamos con un centro deportivo enorme para todas las actividades'} image={'https://apuntesderabona.com/wp-content/uploads/2021/09/collage.jpg'}></UsArticle>
            <UsArticle title={'HACETE SOCIO, UN CLUB HECHO PARA VOS'} image={"../src/assets/LaGacelaFC.png"}></UsArticle>
        </section>
        </>
    )
}