import axios from "../axios";
import React, { useEffect, useState } from "react";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";

import "../Css/row.css";

function Row({ title, fetchUrl, isLargeRow }) {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(fetchUrl);
        setMovies(res.data.results);
      } catch (error) {}
    }

    fetchData();
  }, [fetchUrl]);

  const opts = {
    height: "390",
    width: "99%",
    playerVars: {
      autoplay: 0,
    },
  };

  const onPosterClick = (movie) => {
    try {
      if (trailerUrl) return setTrailerUrl("");

      movieTrailer(movie?.title || "")
        .then((url) => {
          const urlParams = new URLSearchParams(new URL(url).search);
          setTrailerUrl(urlParams.get("v"));
        })
        .catch((error) => {});
    } catch (ex) {}
  };

  return (
    <section className="row">
      <h2>{title}</h2>
      <div className="row__posters">
        {movies.map((movie) => (
          <img
            key={movie.id}
            className={`row__poster ${isLargeRow && `row__posterLarge`}`}
            src={
              "https://image.tmdb.org/t/p/original" +
              (isLargeRow ? movie.poster_path : movie.backdrop_path)
            }
            alt={movie.name}
          />
        ))}
      </div>
      <YouTube videoId={trailerUrl} opts={opts} />
    </section>
  );
}

export default Row;
