import { API } from 'aws-amplify'
import { useRouter } from 'next/router'
import '../../configureAmplify'
import ReactMarkdown from 'react-markdown'
import { listPosts, getPost } from '../../graphql/queries';

export default function Home({ post }) {
  const router = useRouter()
  if (router.isFallback) {
    return <div>Loading...</div>
  }
  return (
    <div>
      <h3>{post.title}</h3>
      <div style={markdownStyle}>
        <ReactMarkdown children={post.content} />
      </div>
      <p>Created by: {post.username}</p>
    </div>
  )
}

export async function getStaticPaths() {
  const postData = await API.graphql({
    query: listPosts
  })
  const paths = postData.data.listPosts.items.map(post => ({ params: { id: post.id }}))
  return {
    paths,
    fallback: true
  };
}

export async function getStaticProps ({ params }) {
  const { id } = params
  const postData = await API.graphql({
    query: getPost, variables: { id }
  })
  return {
    props: {
      post: postData.data.getPost
    }
  }
}

const markdownStyle = { padding: 20, border: '1px solid #ddd', borderRadius: 5 }