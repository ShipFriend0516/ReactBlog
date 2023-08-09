import { useEffect, useState } from 'react';
import axios from 'axios'
import { useHistory } from 'react-router-dom';
import { bool } from 'prop-types';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';

const BlogForm = ({editing, addToast}) => {
  const history = useHistory();
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [originalTitle, setOriginalTitle] = useState('');
  const [body, setBody] = useState('');
  const [originalBody, setOriginalBody] = useState('');
  const [publish, setPublish] = useState(false);
  const [originalPublish, setOriginalPublish] = useState('');
  const [titleError, setTitleError] = useState(false)
  const [bodyError, setBodyError] = useState(false)


  const isEdited = () => {
    return title !== originalTitle || body !== originalBody || publish !== originalPublish
  }

  const goBack = () => {
    if(editing) {
      history.push(`/blogs/${id}`)
    } else {
      history.push('/blogs')
    }
  }

  const validateForm = () => {
    let validated = true;

    if(title === '') {
      setTitleError(true);
      validated = false;
    } 

    if(body === '') {
      setBodyError(true);
      validated = false;
    }

    return validated;
  }

  

  const onSummit = () => {
    setTitleError(false)
    setBodyError(false)

    if(validateForm()) {

      if(editing) {
        // Edit 버튼 클릭
        axios.patch(`http://localhost:3001/posts/${id}`, {
          title,
          body,
          publish,
        }).then(() => {
          history.push(`/blogs/${id}`)
        })
      } else {
        // Post 버튼 클릭
        axios.post('http://localhost:3001/posts', {
          title,
          body,
          publish,
          createdAt: Date.now()
        }).then(() => {
          addToast({
            text: "Successfully created",
            type: 'success'
          })
          history.push('/admin')
        })
      }
    } 
  }

  const onChangePublish = (e) => {
    setPublish(e.target.checked)
  }

  useEffect(()=> {
    if(editing) {
      axios.get(`http://localhost:3001/posts/${id}`).then((res)=> {
        setTitle(res.data.title);
        setBody(res.data.body);
        setPublish(res.data.publish)
        setOriginalTitle(res.data.title);
        setOriginalBody(res.data.body);
        setOriginalPublish(res.data.publish);

      })
    }
  }, [id, editing])

  return (
    <div className="mt-3">
      <h1>{editing ? 'Edit' : 'Create'} a Blog Post</h1>
      <div className='mb-3'>
        <label className="form-label mt-1">Title</label>
        <input 
          className={`form-control ${titleError && 'border-danger'}`}
          value={title}
          onChange={(event)=> setTitle(event.target.value)}
        />
        {titleError && <div className='text-danger'>
          Title is required.
        </div>}
      </div>
      <div className='mb-3'>
        <label className="form-label">Body</label>
        <textarea 
          className={`form-control ${bodyError && 'border-danger'}`}
          value={body}
          rows={18}
          onChange={(event)=> setBody(event.target.value)}
        />
        {bodyError && <div className='text-danger'>
          Body is required.
        </div>}
      </div>
      <div className='form-check mb-3'>
        <label className='form-check-label'>
          <input
          className='form-check-input'
          type="checkbox"
          checked={publish}
          onChange={onChangePublish}
          />Publish
        </label>
      </div>
      <div>
        <button 
          className='btn btn-primary'
          onClick={()=> onSummit()}
          disabled={editing && !isEdited()}
          >{editing ? 'Edit' : 'Post'}
        </button>
        <button 
          className='btn btn-danger ms-2'
          onClick={()=> {
            goBack()
          }}
          >Cancel
        </button>
      </div>
    </div>
  )
};

BlogForm.propTypes = {
  editing: bool,
}

BlogForm.defaultProps = {
  editing: false,
}

export default BlogForm;