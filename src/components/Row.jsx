import "../Css/row.css";

import React, { useEffect, useState } from "react";

import axios from "../axios";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";

const baseImgUrl = "https://image.tmdb.org/t/p/original";

function Row({ title, fetchUrl, isLargeRow }) {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(fetchUrl);
        const data = res.data.results;
        onPosterClick(data[0]);

        setMovies(data);
      } catch (error) {}
    }

    fetchData();
  }, [fetchUrl]);

  const getPosterClasses = () => {
    return `row__poster ${isLargeRow && `row__posterLarge`}`;
  };

  const getImgSrc = ({ poster_path, backdrop_path }) => {
    return baseImgUrl + (isLargeRow ? poster_path : backdrop_path);
  };
  const opts = {
    height: "390",
    width: "99%",
    playerVars: {
      autoplay: 0,
    },
  };

  const onPosterClick = async (movie) => {
    try {
      if (trailerUrl) {
        // إذا كان هناك عنوان URL للفيديو متوفرًا بالفعل، قم بإزالته
        setTrailerUrl("");
      } else {
        // قم ببحث وجلب عنوان URL لمقطع الفيديو الترويجي باستخدام movieTrailer
        const videoUrl = await movieTrailer(movie?.title || "");
        if (videoUrl) {
          // استخدم URLSearchParams للعثور على معرف الفيديو (v) في عنوان URL وتعيينه في trailerUrl
          const urlParams = new URLSearchParams(new URL(videoUrl).search);
          setTrailerUrl(urlParams.get("v"));
        } else {
          // إذا لم يتم العثور على مقطع فيديو ترويجي، يمكنك إتخاذ إجراء آخر مثل عرض رسالة خطأ
          // console.log("مقطع فيديو ترويجي غير متاح لهذا الفيلم");
        }
      }
    } catch (error) {
      // يمكنك التعامل مع الأخطاء هنا إذا حدثت
      // console.error("حدث خطأ أثناء جلب مقطع الفيديو الترويجي:", error);
    }
  };

  return (
    <section className="row">
      <h2>{title}</h2>
      <div className="row__posters">
        {movies.map((movie) => (
          <img
            key={movie.id}
            onClick={() => onPosterClick(movie)}
            className={getPosterClasses()}
            src={getImgSrc(movie)}
            alt={movie.name}
          />
        ))}
      </div>
      <YouTube videoId={trailerUrl} opts={opts} />
    </section>
  );
}

export default Row;
