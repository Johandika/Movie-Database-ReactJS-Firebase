import React,{useEffect, useState} from 'react'
import Footer from './components/Footer'
import Header from './components/Header'
import Movie from './components/Movie'

// key 
// 5b62a2b585db49d02d97877b164636c6
// discover
// https://api.themoviedb.org/3/discover/movie?api_key=5b62a2b585db49d02d97877b164636c6&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate
// genres
// https://api.themoviedb.org/3/genre/movie/list?api_key=5b62a2b585db49d02d97877b164636c6&language=en-US
// images
// https://image.tmdb.org/t/p/w500/kqjL17yufvn9OVLyXYpvtyrFfak.jpg
// configuratin
// https://api.themoviedb.org/3/configuration?api_key=5b62a2b585db49d02d97877b164636c6

// contoh jadi
// https://image.tmdb.org/t/p/w342/wSqAXL1EHVJ3MOnJzMhUngc8gFs.jpg

// Generate genre
const genres = [
  {"id":"", "name":"All"},{"id":28,"name":"Action"},{"id":12,"name":"Adventure"},{"id":16,"name":"Animation"},{"id":35,"name":"Comedy"},{"id":80,"name":"Crime"},{"id":99,"name":"Documentary"},{"id":18,"name":"Drama"},{"id":10751,"name":"Family"},{"id":14,"name":"Fantasy"},{"id":36,"name":"History"},{"id":27,"name":"Horror"},{"id":10402,"name":"Music"},{"id":9648,"name":"Mystery"},{"id":10749,"name":"Romance"},{"id":878,"name":"Science Fiction"},{"id":10770,"name":"TV Movie"},{"id":53,"name":"Thriller"},{"id":10752,"name":"War"},{"id":37,"name":"Western"}
];

// Generate tahun
let years = [];
const thisYear = new Date().getFullYear();
for (let i = 0 ; i < 10 ; i++){
  years.push(thisYear - i);
}

const App = () => {
  const [movies, setMovies] = useState([]);
  const [year, setYear] = useState(thisYear);
  const [genreId, setGenreId] = useState("");
  const [genreName, setGenreName] = useState("All");
  const [page, setPage] = useState(1);

  const handleYearChange = (e) => {
    // Untuk mengambil tahun dari <select>
    setYear(e.target.value);

    // Untuk reset page
    setPage(1);
  }

  const handleGenreChange = (e) => {
    setGenreId(e.target.value);

    // Untuk mengambil nama genre dari <select>
    let index = e.target.selectedIndex;
    setGenreName(e.target[index].text);
    // console.log(e.target) // menampilkan genres
    // console.log(e.target.value) // nilai dari id genres
    // console.log(e.target.selectedIndex) // menampilkan index
    // console.log(e.target[1].text) // menampilkan nama setiap genre dari genres

    // Untuk reset page
    setPage(1);
  }
  
  const handleLoadMoreClick = () => {
    setPage(prevPage => prevPage + 1);
  }

  useEffect (() => {
    const myFetch = async () => {
        try { let url = 'https://api.themoviedb.org/3/discover/movie?api_key=5b62a2b585db49d02d97877b164636c6'
                  url += '&certification_country=US'
                  url += '&certification.lte=PG-13'
                  url += `&primary_release_year=${year}`
                  url += `&with_genres=${genreId}`
                  url += `&page=${page}`
          let response = await fetch (url);
          if(!response.ok){
            throw new Error (`Terjadi gangguan dengan kode ${response.status}`)
          }
          let data = await response.json()
          // Jika halaman 1, isi ulang state movies
          // Jika halaman 2 atau lebih, tambahkan state movie
          if (page === 1) {
            setMovies(data.results)
          } else {
            setMovies((prevMovie) => [...prevMovie,...data.results]);
          }
        }
        catch (error) {
          console.log(error)
        }
    } 
    myFetch();
  }, [year,genreId,page]); 
  // console.log(movies[0])
  

  return(
    <React.Fragment>
      <Header/>
      <nav>
        <div className="container text-white">
          <div className="row">
            <div className="col d-none d-md-flex align-items-center">
              <hr className="flex-grow-1 me-3" />
              <small>Powered by themoviedb.org</small>
            </div>
            <div className="col col-md-3 d-flex">
              <div className="me-3">
                <label htmlFor="year" className="form-label">Year</label>
                <select id="year" className="form-select" onChange={handleYearChange} value={year}>
                  {
                    years.map((year) => 
                      <option key={year.toString()} value={year}>
                        {year}
                      </option>
                    )
                  }
                </select>
                </div>
                <div>
                  <label htmlFor="genre" className="form-label">Genre</label>
                  <select id="genre" className="form-select" value={genreId} onChange={handleGenreChange}>
                    {
                      genres.map((genre) => 
                      <option value={genre.id} key={genre.id}>
                        {genre.name}
                      </option> )
                    }
                  </select>
                </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="pb-5">
        <div className="container">
          <h2 className="py-5 text-white text-center">
            {`Best Movie ${year}, Genre : ${genreName}`}
          </h2>
          <h2 className="py5 text-white text-center pb-5">Best Movie</h2>
          <div className='row'>
            { movies.map((movie) => <Movie key={movie.id} movie={movie}/>) }
          </div>
          <div className="row">
            <div className="col text-center">
              <button className="btn btn-dark" onClick={handleLoadMoreClick}>
                Load More ...
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer/>
    </React.Fragment>
  )
}

export default App;