import { useState, useEffect } from 'react'
import Link from 'next/link'
import { API, Storage } from 'aws-amplify'
import { listPosts } from '../graphql/queries'

export default function Home() {
  const [posts, setPosts] = useState([])
  useEffect(() => {
    fetchPosts()
  }, [])
  async function fetchPosts() {
    const postData = await API.graphql({
      query: listPosts
    })
    const { items } = postData.data.listPosts
    // Fetch images from S3 for posts that contain a cover image
    const postsWithImages = await Promise.all(items.map(async post => {
      if (post.coverImage) {
        post.coverImage = await Storage.get(post.coverImage)
      }
      return post
    }))
    setPosts(postsWithImages)
  }
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-wide mt-6 mb-8">Posts</h1>
      {
        posts.map((post, index) => (
        <Link key={index} href={`/posts/${post.id}`}>
          <div className="my-6 pb-6 border-b border-gray-300	">
            {
              post.coverImage && <img src={post.coverImage} className="w-56" />
            }
            <div className="cursor-pointer mt-2">
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p className="text-gray-500 mt-2">Author: {post.username}</p>
            </div>
          </div>
        </Link>)
        )
      }
    </div>
  )
}