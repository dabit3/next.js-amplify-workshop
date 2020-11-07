import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react'
import { useState } from 'react'
import { API } from 'aws-amplify'
import { v4 as uuid } from 'uuid'
import { useRouter } from 'next/router'
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { createPost } from '../graphql/mutations';

const initialState = { title: '', content: '' }

function CreatePost() {
  const [post, setPost] = useState(initialState)
  const { title, content } = post
  const router = useRouter()
  function onChange(e) {
    setPost(() => ({ ...post, [e.target.name]: e.target.value }))
  }
  async function createNewPost() {
    if (!title || !content) return
    const id = uuid()
    post.id = id
    console.log('post: ', post)

    await API.graphql({
      query: createPost,
      variables: { input: post },
      authMode: "AMAZON_COGNITO_USER_POOLS"
    })
    router.push(`/posts/${id}`)
  }
  return (
    <div style={containerStyle}>
      <h2>Create new Post</h2>
      <input
        onChange={onChange}
        name="title"
        placeholder="Title"
        value={post.title}
        style={inputStyle}
      /> 
      <SimpleMDE value={post.content} onChange={value => setPost({ ...post, content: value })} />
      <button style={buttonStyle} onClick={createNewPost}>Create Post</button>
      <AmplifySignOut />
    </div>
  )
}

const inputStyle = { marginBottom: 10, height: 35, width: 300, padding: 8, fontSize: 16 }
const containerStyle = { padding: '0px 40px' }
const buttonStyle = { width: 300, backgroundColor: 'white', border: '1px solid', height: 35, marginBottom: 20, cursor: 'pointer' }

export default withAuthenticator(CreatePost)