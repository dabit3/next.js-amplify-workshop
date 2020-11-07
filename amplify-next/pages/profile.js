import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react'
import { Auth } from 'aws-amplify'
import { useState, useEffect } from 'react'

function Profile() {
  const [user, setUser] = useState(null)
  useEffect(() => {
    checkUser()
  }, [])
  async function checkUser() {
    const user = await Auth.currentAuthenticatedUser()
    setUser(user)
  }
  if (!user) return null
  return (
    <div>
      <h2>Profile</h2>
      <h3>Username: {user.username}</h3>
      <p>Email: {user.attributes.email}</p>
      <AmplifySignOut />
    </div>
  )
}

export default withAuthenticator(Profile)