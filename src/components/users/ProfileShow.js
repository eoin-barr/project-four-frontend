import React from 'react'
import { Container } from 'react-bootstrap'
import { useLocation, useParams, useHistory } from 'react-router-dom'

import Error from '../extras/Error'
import Loading from '../extras/Loading'
import FollowersModalComponent from './FollowersModalComponent'
import FollowingModalComponent from './FollowingModalComponent'
import EditProfileModalComponent from './EditProfileModalComponent'
import ChatIndexModalComponent from './ChatIndexModalComponent'
import { checkForExistingChat, createAChat, followToggle, getSingleUser, getAllChatsUserIsIn } from '../../lib/api'
import { getPayLoad, isOwner, isAuthenticated } from '../../lib/auth'
import StandardPostCard from '../posts/StandardPostCard'

function ProfileShow() {
  const { userId } = useParams()
  const history = useHistory()
  const [userData, setUserData] = React.useState(null)
  const [isError, setIsError] = React.useState(false)
  const loading = !userData && !isError
  const [owner, setOwner] = React.useState()
  const [following, setFollowing] = React.useState()
  const [canFollow, setCanFollow] = React.useState()
  const currentUser = getPayLoad().sub
  const location = useLocation()
  const [savedPosts, setSavedPosts] = React.useState(true)
  const [createdPosts, setCreatedPosts] = React.useState(false)
  const [modalShow, setModalShow] = React.useState(false)
  const [modalFollowingShow, setModalFollowingShow] = React.useState(false)
  const [modalEditShow, setModalEditShow] = React.useState(false)
  const [modalChatShow, setModalChatShow] = React.useState(false)
  const [chatArray, setChatArray] = React.useState(null)
  const [userChats, setUserChats] = React.useState(null)


  React.useEffect(() => {
    async function getData() {
      try {
        const response = await getSingleUser(userId)
        setUserData(response.data)
        setModalShow(false)
        setModalFollowingShow(false)
        setModalEditShow(false)
        setModalChatShow(false)
        const res = await checkForExistingChat(userId)
        setChatArray(res.data)
      } catch (err) {
        setIsError(true)
        console.log(err)
      }
    }
    getData()
  }, [userId])


  React.useEffect(() => {
    const getData = async () => {
      try {
        const res = await getAllChatsUserIsIn(userData.id)
        setUserChats(res.data)
      } catch (err) {
        console.log(err)
      }
    }
    getData()
  }, [userData])


  React.useEffect(() => {
    const areYouOwner = isOwner(parseInt(userId))
    const isAuth = isAuthenticated()
    if (areYouOwner && isAuth) {
      setOwner(true)
    } else {
      setOwner(false)
    }
  }, [userId])

  React.useEffect(() => {
    setCanFollow(parseInt(userId) !== currentUser)
  }, [location, currentUser, userId])

  React.useEffect(() => {
    async function compareUser() {
      try {
        const user = await getSingleUser(currentUser)
        const currentUserData = user.data
        if (currentUserData.following.some(user => user.id === parseInt(userId))) {
          setFollowing(true)
        } else {
          setFollowing(false)
        }
      } catch (err) {
        console.log(err)
      }
    }
    compareUser()
    setCanFollow(parseInt(userId) !== currentUser)
  }, [location, currentUser, userId])


  async function handleFollow() {
    try {
      if (following) {
        await followToggle(userId)
        setFollowing(false)
      } else {
        await followToggle(userId)
        setFollowing(true)
      }
      const updateState = await getSingleUser(userId)
      setUserData(updateState.data)
    } catch (err) {
      console.log(err)
    }
  }

  const handleShowSavedPosts = () => {
    setCreatedPosts(false)
    setSavedPosts(true)
  }

  const handleShowCreatedPosts = () => {
    setSavedPosts(false)
    setCreatedPosts(true)
  }

  const FollowersModal = (props) => {
    return (
      <FollowersModalComponent props={props} userData={userData} />
    )
  }

  const FollowingModal = (props) => {
    return (
      <FollowingModalComponent props={props} userData={userData} setModalFollowingShow={setModalFollowingShow} />
    )
  }

  const EditProfileModal = (props) => {
    return (
      <EditProfileModalComponent props={props} userData={userData} setModalEditShow={setModalEditShow} setUserData={setUserData} />
    )
  }

  const ChatModal = (props) => {
    return (
      <ChatIndexModalComponent props={props} userData={userData} setModalChatShow={setModalChatShow} setUserData={setUserData} userChats={userChats} />
    )
  }

  const handeChatRequest = async () => {
    if (chatArray.length < 1) {
      try {
        const res = await createAChat(userId)
        history.push(`/profile/${userId}/chats/${res.data.id}`)
      } catch (err) {
        console.log(err)
      }
    } else {
      history.push(`/profile/${userId}/chats/${chatArray[0].id}`)
    }
  }


  return (
    <>
      <Container fluid className="pt-4 mt-4 ">
        <div>
          {loading && <Loading />}
          {isError && <Error />}
          {userData && (
            <div className="flex-col-center profile-container">
              <div className="pt-4"></div>
              {userData.profileImage && <div><img src={userData.profileImage} className="profile-image"></img></div>}
              {userData.firstName && userData.lastName && <h2 className="pt-2"><strong>{userData.firstName} {userData.lastName}</strong></h2>}
              <p className="mb-0">@{userData.username.toLowerCase()}</p>
              <a className="normal-text cursor-pointer" onClick={() => setModalFollowingShow(true)}><p className="mb-0">{userData.following.length < 1 ? '0' : userData.following.length} following</p></a>
              <a className="normal-text cursor-pointer" onClick={() => setModalShow(true)}><p className="mb-0">{userData.followedBy.length < 1 ? '0' : userData.followedBy.length} followers</p></a>
              <FollowingModal
                show={modalFollowingShow}
                onHide={() => setModalFollowingShow(false)}
              />
              <FollowersModal
                show={modalShow}
                onHide={() => setModalShow(false)}
              />
              <EditProfileModal
                show={modalEditShow}
                onHide={() => setModalEditShow(false)}
              />
              <ChatModal
                show={modalChatShow}
                onHide={() => setModalChatShow(false)}
              />
              {isAuthenticated() &&
                <div>
                  {canFollow ?
                    <>
                      {!following ? (
                        <div className="flex">
                          <i onClick={handleFollow} className="fas fa-user-plus pop-out p-2 mx-2 follow-circle"></i>
                          <i onClick={handeChatRequest} className="fas fa-comments pop-out p-2 mx-2 follow-circle"></i>
                        </div>
                      ) : (
                        <div className="flex">
                          <i onClick={handleFollow} className="fas fa-user-times pop-out p-2 mx-2 follow-circle"></i>
                          <i onClick={handeChatRequest} className="fas fa-comments pop-out p-2 mx-2 follow-circle"></i>
                        </div>
                      )}
                    </>
                    :
                    <>
                      {owner && <a className="normal-text cursor-pointer" onClick={() => setModalEditShow(true)}>
                        <i className="fas fa-pen pop-out p-2 mx-1 follow-circle"></i>
                      </a>}
                      {/* <Button variant="dark" className="following-btn extra-width mt-2">Edit</Button> */}
                      {/* {owner && <Link to={`/profile/${userId}/chats`} className="normal-text cursor-pointer"><i className="fas fa-inbox pop-out p-2 mx-1"></i></Link>}
                      {owner && <a className="normal-text cursor-pointer" onClick={() => setModalChatShow(true)}><i className="fas fa-inbox pop-out p-2 mx-1"></i></a>} */}
                    </>
                  }
                </div>
              }
            </div>
          )}
        </div>
      </Container>
      <Container className="w-75 bt-1 mt-4">
        <div className="flex-row-center">
          <a onClick={handleShowSavedPosts}><p className={`cursor-pointer px-3 pt-1 ${savedPosts ? 'bordertop' : ''}`}>Posts Saved</p></a>
          <a onClick={handleShowCreatedPosts}><p className={`cursor-pointer px-3 pt-1 ${createdPosts ? 'bordertop' : ''}`}>Posts Added</p></a>
        </div>
        {userData && !createdPosts && userData.savedPosts.length < 1 && (
          <div><p className="mt-2 text-center">{userData.username} has not saved any posts</p></div>
        )}
        {userData && !savedPosts && userData.createdPosts.length < 1 && (
          <div><p className="mt-2 text-center">{userData.username} has not created any posts</p></div>
        )}
      </Container>
      <Container className="posts-body profile-posts" >
        {userData && savedPosts &&
          userData.savedPosts.map(post => <StandardPostCard post={post} key={post.id} />)}
        {userData && createdPosts &&
          userData.createdPosts.map(post => <StandardPostCard post={post} key={post.id} />)}
      </Container>
    </>
  )
}

export default ProfileShow