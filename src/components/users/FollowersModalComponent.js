import React from 'react'
import { Link } from 'react-router-dom'
import { Modal } from 'react-bootstrap'

function FollowersModalComponent({ props, userData }) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      dialogClassName="custom-dialog"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Followers
        </Modal.Title>
      </Modal.Header>
      {userData && userData.followedBy.length < 1 && (
        <Modal.Body className="flex-row-center ">
          <div className="my-4"><p >{userData.username} has no followers</p></div>
        </Modal.Body>
      )}
      {userData && userData.followedBy.length > 0 && (
        <Modal.Body className="p-0 scroll-height">
          {userData.followedBy.map(follow => (
            <>
              <Link key={follow.id} className="normal-text flex-row-col-3 no-decoration hover-color" to={`/profile/${follow.id}/`}>
                <div className="flex-center py-2 mx-2">
                  <img className="profile-images mx-2" src={follow.profileImage} alt="profile-image" />
                  <p className="mb-0 mx-2">{follow.username}</p>
                </div>
                <div className="flex-center py-2 px-4">
                  <p className="mx-4 mb-0">{follow.following.length > 0 ? `${follow.following.length}` : '0'} following</p>
                  <p className="mb-0">{follow.followedBy.length > 0 ? `${follow.followedBy.length}` : '0'} followers</p>
                </div>
              </Link>
              <hr className="my-0" />
            </>
          ))}
        </Modal.Body>
      )}
    </Modal>
  )
}

export default FollowersModalComponent