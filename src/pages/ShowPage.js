import { useParams } from 'react-router-dom'
import axios from 'axios'
import { useEffect, useState } from 'react'

import LoadingSpinner from '../components/LoadingSpinner'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'

const ShowPage = () => {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const history = useHistory()

  const getPost = (id) => {
    axios.get(`http://localhost:3001/posts/${id}`).then((res) => {
    setPost(res.data)
    setLoading(false)
    })  
  }

  useEffect(()=>{getPost(id)},[id])

  if (loading) {
    return <LoadingSpinner/>
  }

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
    </div>
  )
}

export default ShowPage