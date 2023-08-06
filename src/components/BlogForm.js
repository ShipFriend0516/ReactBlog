import { useState } from 'react';
import axios from 'axios'
import { useHistory } from 'react-router-dom';

const BlogForm = () => {
  const history = useHistory();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const onSummit = () => {
    axios.post('http://localhost:3001/posts', {
      title,
      body
    }).then(() => {
      history.push('/blogs')
    })
  }

  return (
    <div className="mt-3">
      <h1>Create a Blog Post</h1>
      <div className='mb-3'>
        <label className="form-label mt-1">Title</label>
        <input 
          className='form-control'
          value={title}
          onChange={(event)=> setTitle(event.target.value)}
        />
      </div>
      <div className='mb-3'>
        <label className="form-label">Body</label>
        <textarea 
          className='form-control'
          value={body}
          rows={20}
          onChange={(event)=> setBody(event.target.value)}
        />
      </div>
      <button 
        className='btn btn-primary'
        onClick={()=> onSummit()}
        >Post</button>
    </div>
  )
};

export default BlogForm;