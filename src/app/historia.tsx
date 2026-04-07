import { Header } from "../components/header";

export default function Historia() {
    return <>
        <Header/>
        <main className="flex flex-col gap-10 px-4 py-10 place-self-center max-w-3xl">
            <h2 className="font-bold text-xl text-center">Descubre más sobre nosotros y la historia de esta iniciativa bahiense</h2>
            
            <h3 className="underline">Marzo de 2023</h3>

            <article className="bg-amber-500/20 p-2 flex flex-col gap-2">
                <h1 className="font-semibold text-xl">Primeras pruebas</h1>
                <hr />

                <p className="text-balance">Empecé con la idea de hacer mi propia aplicación móvil para ver fácilmente las líneas, mejorando la experiencia de usuario de la página web del municipio.</p>
                <p className="text-balance">La aplicación fue mejorando y agregando nuevas funcionalidades. Una vez que sentí que era realmente funcional, se la mostré a mis amigos y familia para que la usaran, y hasta el día de hoy la siguen eligiendo.</p>
            </article>

            <h3 className="underline">Febrero de 2024</h3>

            <article className="bg-amber-500/20 p-2 flex flex-col gap-2">
                <h1 className="font-semibold text-xl">Primera difusión</h1>
                <hr />

                <p className="text-balance">Luego de que la aplicación fuera un éxito entre mi círculo cercano, quise compartirla con la ciudad. Por lo tanto, me contacté con distintos medios de comunicación para difundirla y que así más bahienses pudieran disfrutarla.</p>
                <img loading="lazy" src="/federico-2-24.jpg" alt="Federico Corzo mostrando el desarrollo de la app Colectivos Bahía Blanca" className="w-full object-contain" />
            </article>

            <article className="bg-amber-500/20 p-2 flex flex-col gap-2">
                <h1 className="font-semibold text-xl">Censura de datos</h1>
                <hr />
            
                <h2 className="font-bold text-lg">Un poco de contexto:</h2>
                <p className="text-balance">El servicio de posicionamiento en tiempo real de los colectivos es administrado por una empresa privada, el cual es prestado a la municipalidad.</p>
            
                <h2 className="font-bold text-lg">¿El servicio es realmente público?</h2>
                <p className="text-balance">Antes de que hiciera la difusión de la app, los datos eran accesibles desde una página del municipio sin ningún tipo de restricción, lo que facilitaba el desarrollo de nuevas y mejores tecnologías.</p>
                <p className="text-balance">A partir de ese día (y actualmente), el acceso se fue restringiendo cada vez más, dificultando su uso para servicios y herramientas de terceros, afectando no solo a mi aplicación, sino también a todas las alternativas que había.</p>
            </article>

            <h3 className="underline">Mayo de 2024</h3>

            <article className="bg-amber-500/20 p-2 flex flex-col gap-2">
                <h1 className="font-semibold text-xl">Solución temporal</h1>
                <hr />

                <p className="text-balance">Al enterarme de que el servicio de posicionamiento en tiempo real no estaba disponible, rápidamente me puse a buscar soluciones y alternativas para que la aplicación vuelva a funcionar correctamente</p>
                <p className="text-balance">Llegue a contactarme y reunir con un equipo de la municipalidad y el intendente para encontrar una salida al problema, aunque no pudieron darme un solución clara.</p>
                <img loading="lazy" src="/municipalidad.jpg" alt="Federico Corzo y Federico Susbieles en la municipalidad" className="w-full object-contain" />
                
                <h2 className="font-bold text-lg">¿Qué hice?</h2>
                <p className="text-balance">Hable con mis pares. En una charla con el desarrollador de la aplicación <i>Bahía Sube</i>, alternativa no oficial para consultar los colectivos, me compartió cuál fue su solución.</p>
            </article>

            <h3 className="underline">Actualidad</h3>

            <article className="bg-amber-500/20 p-2 flex flex-col gap-2">
                <p className="text-balance">Sigo manteniendo y mejorando la aplicación y su servicio web para que los bahienses puedan disfrutar de una buena experiencia usando el transporte público en la ciudad.</p>
            </article>
        </main>
    </>
}