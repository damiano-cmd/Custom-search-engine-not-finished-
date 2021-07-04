import { useRouter } from 'next/router';
import {useState, useEffect} from 'react';
import 'axios';
import axios from 'axios';

function Search() {
    const [queryv, setQuery] = useState("");
    const [rgb, setRgb] = useState([]);
    const [pops, setPop] = useState([]);
    const [pages, setPages] = useState(0)
    const router = useRouter();
    let { q, p } = router.query;

    useEffect(() => {
        let ran = [200, Math.floor(Math.random() * 201), 0];
        setRgb(ran.sort((a, b) => 0.5 - Math.random()));
    }, [])

    useEffect(()=>{
        if (q != undefined) {
            setQuery(q)
            if (!p) {
                p = 0
            }
            axios({method: "post", url: "/api", data: {search: q, page: p}}).then((res) => {
                setPages(res.data.shift());
                setPop(res.data);
            })
        }
    }, [q])

    function handleChange(e) {
        setQuery(e.target.value)
    }

    function handleSubmit (e) {
        e.preventDefault();
        window.location = "search/?q="+queryv.replace(' ', '+')
    }

    return(
        <>
            <nav className="nav" style={{backgroundColor: "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")"}}>
                <form className="off-search" onSubmit={handleSubmit}>
                    <input type="text" placeholder="Search" value={queryv} onChange={handleChange} />
                    <button type='submit'>
                        <svg id="svg" width="95" height="91" viewBox="0 0 95 91" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14 16.5C42.5 -15 92.5 28.5001 63.5 59C34.5 89.5 -14.5 48 14 16.5Z" stroke="black" stroke-width="10"/>
                            <path d="M62 61L91 86.5" stroke="black" stroke-width="10"/>
                        </svg>
                    </button>
                </form>
            </nav>
            <main className="search-main">
                {
                    pops.map(r => {
                        if (r != []) {
                            return (
                                <div className="article">
                                    <a href={r.link}>
                                        <h2>{r.title}</h2>
                                        <p id="link">{r.link}</p>
                                    </a>
                                    <p>{r.seo.description}</p>
                                </div>
                            )
                        }
                        return "wait..."
                    })
                }
            </main>
            <footer>
            </footer>
        </>
    )
}

export default Search;