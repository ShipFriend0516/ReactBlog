import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom'

import Card from '../components/Card'
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from './Pagination';
import PropTypes, { number } from 'prop-types'
import { useLocation } from 'react-router-dom';

const BlogList = ({ isAdmin }) => {
  const history = useHistory();
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const pageParam = params.get('page')

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1)
  const [numberOfPosts, setNumberOfPosts] = useState(0);
  const [numberOfPages, setNumberOfPages] = useState(0);
  const limit = 1;

  useEffect(()=> {
    setNumberOfPages(Math.ceil(numberOfPosts / limit))
  }, [numberOfPosts])

  const onClickPageButton = (page) => {
    history.push(`${location.pathname}?page=${page}`)
    getPosts(page);
  }

  const getPosts = (page = 1) => {
    let params = {
      _page: page,
      _limit: limit,
      _sort: 'id',
      _order: 'desc',
    }

    if(!isAdmin) {
      params = {...params, publish: true}
    }

    axios.get(`http://localhost:3001/posts`, {
      params: params
    }).then((res)=> {
      setNumberOfPosts(res.headers['x-total-count'])
      setPosts(res.data);
      setLoading(false)
    })
  }

  // 리렌더링이 되어도 한 번만 실행이 되는 함수 = UseEffect
  useEffect(()=> {
    setCurrentPage(parseInt(pageParam) || 1);
    getPosts(parseInt(pageParam) || 1);
  }, [pageParam])

  const deleteBlog = (e, id) => {
      e.stopPropagation()
      axios.delete(`http://localhost:3001/posts/${id}`)
      .then(()=> {
        setPosts(prevPosts => prevPosts.filter(post =>  post.id !== id))
      })
  }

  const renderBlogList = () => {
    return ( posts.map(post => {
        return (
        <Card
          key={post.id} 
          title={post.title} 
          onClick={()=> history.push(`/blogs/${post.id}`) }>
          { isAdmin ? <div>
            <button 
              className='btn btn-danger btn-sm'
              onClick={(e) => deleteBlog(e,post.id)}

              >Delete
            </button>
          </div> : null}
        </Card>
      )})
    )
  }



  if(loading) {
    return (
      <LoadingSpinner/>
    )
  }

  if(posts.length === 0) {
    return (<div>No Blog Post Exist</div>)
  }

  return (
    <div>
      {renderBlogList()}
      {numberOfPages > 1 && <Pagination 
        currentPage={currentPage}
        numberOfPages={numberOfPages}
        onClick={onClickPageButton}/>}
    </div>
  )
}

BlogList.propTypes = {
  isAdmin: PropTypes.bool
}

BlogList.defaultProps = {
  isAdmin: false,
}

export default BlogList