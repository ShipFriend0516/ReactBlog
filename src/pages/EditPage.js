import { useParams } from 'react-router-dom'

// Components Here~!
import BlogForm from '../components/BlogForm';

const EditPage = () => {

  // const {id} = useParams(id);

  return (
    <div>
      <BlogForm editing={true}/>
    </div>
  )
}

export default EditPage