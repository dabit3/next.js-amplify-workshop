import { useState, useEffect } from 'react'
import Link from 'next/link'
import { API, Auth } from 'aws-amplify'
import { postsByUsername } from '../graphql/queries'
import { deletePost as deletePostMutation } from '../graphql/mutations'

export default function MyPosts() {
  const [posts, setPosts] = useState([])
  useEffect(() => {
    fetchPosts()
  }, [])
  async function fetchPosts() {
    const { username } = await Auth.currentAuthenticatedUser()
    const postData = await API.graphql({
      query: postsByUsername, variables: { username }
    })
    setPosts(postData.data.postsByUsername.items)
  }
  async function deletePost(id) {
    await API.graphql({
      query: deletePostMutation,
      variables: { input: { id } },
      authMode: "AMAZON_COGNITO_USER_POOLS"
    })
    fetchPosts()
  }
  return (
    <div>
      <h1>My Posts</h1>
      {
        posts.map((post, index) => (
          <div key={index} style={itemStyle}>
            <h2>{post.title}</h2>
            <p style={authorStyle}>Author: {post.username}</p>
            <Link href={`/edit-post/${post.id}`}><a style={linkStyle}>Edit Post</a></Link>
            <Link href={`/posts/${post.id}`}><a style={linkStyle}>View Post</a></Link>
            <button
              style={buttonStyle}
              onClick={() => deletePost(post.id)}
            >Delete Post</button>
          </div>
        )
        )
      }
    </div>
  )
}

const buttonStyle = { cursor: 'pointer', backgroundColor: '#ddd', border: 'none', padding: '5px 20px' }
const linkStyle = { fontSize: 14, marginRight: 10 }
const itemStyle = { borderBottom: '1px solid rgba(0, 0, 0 ,.1)', padding: '20px 0px' }
const authorStyle = { color: 'rgba(0, 0, 0, .55)', fontWeight: '600' }