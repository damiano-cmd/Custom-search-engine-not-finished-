import {useState, useEffect} from 'react'

function index() {
    const [queryv, setQuery] = useState("");
    const [rgb, setRgb] = useState([]);

    useEffect(() => {
        let ran = [200, Math.floor(Math.random() * 201), 0];
        setRgb(ran.sort((a, b) => 0.5 - Math.random()));
    }, [])

    function handleChange(e) {
        setQuery(e.target.value.replace(' ', '+'))
    }

    function handleSubmit (e) {
        e.preventDefault();
        window.location = "search/?q="+ queryv
    }

    return (
        <main className="main" style={{backgroundColor: "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")"}}>
            <form className="main-search" onSubmit={handleSubmit}>
                <input id="si" type="text" placeholder="Search" value={queryv} onChange={handleChange} />
                <button id="sb" type='submit'>
                    <svg id="svg" width="95" height="91" viewBox="0 0 95 91" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 16.5C42.5 -15 92.5 28.5001 63.5 59C34.5 89.5 -14.5 48 14 16.5Z" stroke="black" stroke-width="10"/>
                        <path d="M62 61L91 86.5" stroke="black" stroke-width="10"/>
                    </svg>
                </button>
            </form>
        </main>
    )
}

export default index;