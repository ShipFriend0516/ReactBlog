import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom'

import Card from '../components/Card'
import LoadingSpinner from '../components/LoadingSpinner';

const ListPage = () => {

  const history = useHistory();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const getPosts = () => {
    axios.get('http://localhost:3001/posts')
    .then((res)=> {
      setPosts(res.data);
      setLoading(false)
    })
  }

  const deleteBlog = (e, id) => {
      e.stopPropagation()
      axios.delete(`http://localhost:3001/posts/${id}`)
      .then(()=> {
        setPosts(prevPosts => prevPosts.filter(post =>  post.id !== id))
      })
  }

  // 리렌더링이 되어도 한 번만 실행이 되는 함수 = UseEffect
  useEffect(()=> {
    getPosts();
  }, []);

  const renderBlogList = () => {
    if(loading) {
      return (
        <LoadingSpinner/>
      )
    }

    if(posts.length === 0) {
      return (<div>No Blog Post Exist</div>)
    }

    return posts.filter(post=>post.publish).map(post => {
      return (
      <Card
        key={post.id} 
        title={post.title} 
        onClick={()=> history.push(`/blogs/${post.id}`) }>
        <div>
          <button 
            className='btn btn-danger btn-sm'
            onClick={(e) => deleteBlog(e,post.id)}
            >Delete
          </button>
        </div>
      </Card>
    )})
  }

  return (
    <div className='mt-3'>
      <div className='d-flex justify-content-between'>
        <h1 className='mb-3'>Blogs</h1>
        <div>
          <Link to="./blogs/create" className="btn btn-success">
            Create New
          </Link>
        </div>
      </div>
      {renderBlogList()}
    </div>
  )
}

export default ListPage;