import axios from 'axios';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'
import PropTypes, { number } from 'prop-types'
import useToast from '../hooks/toast';

import Card from '../components/Card'
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from './Pagination';

const BlogList = ({ isAdmin }) => {
  const navigate = useNavigate();
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const pageParam = params.get('page')

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1)
  const [numberOfPosts, setNumberOfPosts] = useState(0);
  const [numberOfPages, setNumberOfPages] = useState(0);
  const limit = 5;

  // Search Tab
  const [searchText, setSearchText] = useState('');

  // Toast Tab
  const { addToast } = useToast()

  // Error Handling
  const [error, setError] = useState('')

  useEffect(()=> {
    setNumberOfPages(Math.ceil(numberOfPosts / limit))
  }, [numberOfPosts])

  const onClickPageButton = (page) => {
    navigate(`${location.pathname}?page=${page}`)
    setCurrentPage(page);
    getPosts(page);
  }

  const getPosts = useCallback((page = 1) => {
    let params = {
      _page: page,
      _limit: limit,
      _sort: 'id',
      _order: 'desc',
      title_like: searchText
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
    }).catch(e=> {
      setLoading(false)
      setError('Something went wrong in database!')
      addToast({
        text: "Something went wrong",
        type: 'danger'
      })
    })
  }, [isAdmin, searchText])
  

  // 리렌더링이 되어도 한 번만 실행이 되는 함수 = UseEffect
  useEffect(()=> {
    setCurrentPage(parseInt(pageParam) || 1);
    getPosts(parseInt(pageParam) || 1)

  }, []);


  const deleteBlog = (e, id) => {
      e.stopPropagation()
      axios.delete(`http://localhost:3001/posts/${id}`)
      .then(()=> {
        // setPosts(prevPosts => prevPosts.filter(post =>  post.id !== id))
        getPosts(currentPage)
        addToast({
          text: "Successfully deleted",
          type: "success"
        })
      }).catch(e=> {
        setLoading(false)
        addToast({
          text: "The blog could not be deleted.",
          type: 'danger'
        })
      })
  }

  const renderBlogList = () => {
    return ( posts.map(post => {
        return (
        <Card
          key={post.id} 
          title={post.title} 
          onClick={()=> navigate(`/blogs/${post.id}`) }>
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


  const onSearch = (e) => {
    if(e.key === 'Enter') {
      navigate(`${location.pathname}?page=1`)
      setCurrentPage(1);
      getPosts(1);
    }
  }

  if(error) {
    return <div>{error}</div>
  }

  return (
    <div>
      <input 
        className='form-control'
        type='text'
        placeholder='Search'
        value={searchText}
        onChange={(e)=> setSearchText(e.target.value)}
        onKeyUp={onSearch}/>
      <hr/>
      {posts.length === 0 
        ? <div>No Blog Post Exist</div> 
        : <>
        {renderBlogList()}
        {numberOfPages > 1 && <Pagination 
          currentPage={currentPage}
          numberOfPages={numberOfPages}
          onClick={onClickPageButton}/>}
        </>}
      
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