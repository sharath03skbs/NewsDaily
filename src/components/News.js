import React, { useEffect, useState } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";
import ScrollToTopButton from "./ScrollToTopButton";

const News = (props) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const updateNews = async () => {
    props.setProgress(10);
    let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
    setLoading(true);
    let data = await fetch(url);
    props.setProgress(30);
    let parsedData = await data.json();
    props.setProgress(70);
    setArticles(parsedData.articles);
    setLoading(false);
    setTotalResults(parsedData.totalResults);
    props.setProgress(100);
  };

  useEffect(() => {
    document.title = `${capitalizeFirstLetter(props.category)}-NewsDaily`;
    updateNews();
    //eslint-disable-next-line
  }, []);

  //  const handlePreviousClick = async()=>{
  //Not a part    // let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page - 1}&pageSize=${props.pageSize}`
  //   // setLoading(true)
  //   // let data = await fetch(url);
  //   // let parsedData = await data.json();
  //   // setPage(page - 1);
  //   // setArticles(parsedData.articles);
  //   // setLoading(false);
  //Not a part   // })
  //   setPage(page - 1)
  //   updateNews();
  // }

  // const handleNextClick = async ()=>{
  //Not a Part   // if(!(Math.ceil(totalResults/props.pageSize) <page + 1)) {
  //   //   //Math.ceil(totalResults/props.pageSize) = It specifies the number of pages required to display all the articles
  //   //   //<page + 1 = means that we are at the end of the specified limit
  //   //   let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page + 1}&pageSize=${props.pageSize}`
  //   //   setLoading(true)
  //   //   let data = await fetch(url);
  //   //   let parsedData = await data.json();
  //   //  setPage(page + 1);
  //   //  setArticles(parsedData.articles);
  //   //  setLoading(false);
  //Not a Part   //
  //     setPage(page + 1)
  //     updateNews();
  //   }

  const fetchMoreData = async () => {
    let url = `https://newsapi.org/v2/top-headlines?country=${
      props.country
    }&category=${props.category}&apiKey=${props.apiKey}&page=${
      page + 1
    }&pageSize=${props.pageSize}`;
    setPage(page + 1);
    let data = await fetch(url);
    let parsedData = await data.json();
    setArticles(articles.concat(parsedData.articles));
    setTotalResults(parsedData.totalResults);
  };

  return (
    <>
      <h1 className="text-center">
        NewsDaily- Top {capitalizeFirstLetter(props.category)} Headlines
      </h1>

      {loading && <Spinner />}

      <InfiniteScroll
        dataLength={articles.length}
        next={fetchMoreData}
        hasMore={articles.length !== totalResults}
        loader={<Spinner />}
      >
        <div className="container">
          <div className="row my-4">
            {/*!loading &&*/}
            {articles.map((element) => {
              return (
                <div className="col-md-4" key={element.url}>
                  <NewsItem
                    title={element.title ? element.title : ""}
                    description={element.description ? element.description : ""}
                    imageUrl={element.urlToImage}
                    newsUrl={element.url}
                    author={element.author}
                    date={element.publishedAt}
                    source={element.source.name}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </InfiniteScroll>

      {/* <div className="container d-flex justify-content-between">
          <button disabled={page<=1} type="button" className="btn btn-dark" onClick={handlePreviousClick}>&larr; Previous</button>
          <button disabled={Math.ceil(totalResults/props.pageSize) <page + 1} type="button" className="btn btn-dark" onClick={handleNextClick}> Next &rarr;</button>
          </div> */}

      <ScrollToTopButton />
    </>
  );
};

News.defaultProps = {
  country: "in",
  pageSize: 8,
  category: "general",
};

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
};

export default News;
