import React, { Component } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";

export class News extends Component {

  static defaultProps = {
    country : "in",
    pageSize : 8,
    category : "general"
  };

  static  propTypes = {
    country : PropTypes.string,
    pageSize: PropTypes.number,
    category : PropTypes.string,
  };

  capitalizeFirstLetter = (string)=>{
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  constructor(props){
    super(props);
    this.state ={
      articles : [],
      loading : true,
      page : 1,
      totalResults : 0,
    }
    document.title = `${this.capitalizeFirstLetter(this.props.category)}-NewsDaily`;
  }

  updateNews = async()=>{
    this.props.setProgress(10);
    let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`
    this.setState({loading:true})
    let data = await fetch(url);
    this.props.setProgress(30);
    let parsedData = await data.json();
    this.props.setProgress(70);
    this.setState({
      articles:parsedData.articles,
      loading:false,
      totalResults: parsedData.totalResults,
    })
    this.props.setProgress(100);
    }

  async componentDidMount(){
    this.updateNews();
  }

   handlePreviousClick = async()=>{
    // let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=79c3b23a2b704578a00aec891ed65fb7&page=${this.state.page - 1}&pageSize=${this.props.pageSize}`
    // this.setState({loading:true})
    // let data = await fetch(url);
    // let parsedData = await data.json();
    // this.setState({
    //   page:this.state.page - 1,
    //   articles:parsedData.articles,
    //   loading:false
    // })
    this.setState({
      page:this.state.page - 1,
    })
    this.updateNews();
  }

  handleNextClick = async ()=>{
    // if(!(Math.ceil(this.state.totalResults/this.props.pageSize) <this.state.page + 1)) {
    //   //Math.ceil(this.state.totalResults/this.props.pageSize) = It specifies the number of pages required to display all the articles
    //   //<this.state.page + 1 = means that we are at the end of the specified limit
    //   let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=79c3b23a2b704578a00aec891ed65fb7&page=${this.state.page + 1}&pageSize=${this.props.pageSize}`
    //   this.setState({loading:true})
    //   let data = await fetch(url);
    //   let parsedData = await data.json();
    //   this.setState({
    //     page:this.state.page + 1,
    //     articles:parsedData.articles,
    //     loading:false
    //   })
      this.setState({
        page:this.state.page + 1,
      })
      this.updateNews();
    }
    fetchMoreData = async() => {
      
      this.setState({page : this.state.page + 1});
      let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`
      let data = await fetch(url);
      let parsedData = await data.json();
      this.setState({
      articles: this.state.articles.concat(parsedData.articles),
      totalResults: parsedData.totalResults,
    })
    };
  render() {
    return (
      <div>
        <>
          <h1 className='text-center'>NewsDaily- Top {this.capitalizeFirstLetter(this.props.category)} Headlines</h1>
          
          {this.state.loading && <Spinner/>}

          <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length !== this.state.totalResults}
          loader={<Spinner/>}
          >
          <div className="container">
            <div className="row my-4">
            {/*!this.state.loading &&*/}{this.state.articles.map((element)=>{
                return <div className="col-md-4" key = {element.url}>
                <NewsItem title = {element.title?element.title:""} description = {element.description?element.description:""} imageUrl = {element.urlToImage} newsUrl = {element.url} author = {element.author} date = {element.publishedAt} source = {element.source.name}/>
              </div>
              })}
            </div>
          </div>
          
          </InfiniteScroll>

          {/* <div className="container d-flex justify-content-between">
          <button disabled={this.state.page<=1} type="button" className="btn btn-dark" onClick={this.handlePreviousClick}>&larr; Previous</button>
          <button disabled={Math.ceil(this.state.totalResults/this.props.pageSize) <this.state.page + 1} type="button" className="btn btn-dark" onClick={this.handleNextClick}> Next &rarr;</button>
          </div> */}
          
          
        </>
      </div>
    )
  }
}

export default News
