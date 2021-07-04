import "../public/style.css"

function myApp({Component, pageProps}) {
    return (
        <div>
            <Component {...pageProps}/>
        </div>
    )
}

export default myApp;