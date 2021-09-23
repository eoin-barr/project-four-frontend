import axios from 'axios'
import { getToken } from './auth'
import { baseUrl } from '../config'

function headers() {
  return {
    headers: { Authorization: `Bearer ${getToken()}` },
  }
}

//* users

export function registerUser(formData) {
  return axios.post(`${baseUrl}/auth/register/`, formData)
}

export function loginUser(formData) {
  return axios.post(`${baseUrl}/auth/login/`, formData)
}

export function getSingleUser(userId) {
  return axios.get(`${baseUrl}/auth/profile/${userId}/`, headers())
}

export function editUser(userId, formData) {
  return axios.put(`${baseUrl}/auth/profile/${userId}/edit/`, formData, headers())
}

export function followToggle(userId) {
  return axios.post(`${baseUrl}/auth/profile/${userId}/follow/`, null, headers())
}

//* posts

export function getAllPosts() {
  return axios.get(`${baseUrl}/posts/`)
}

export function getSinglePost(postId) {
  return axios.get(`${baseUrl}/posts/${postId}/`, headers())
}

export function filterPosts(searchInput) {
  return axios.get(`${baseUrl}/posts/search?q=${searchInput}/`, headers())
}

export function savePost(postId) {
  return axios.post(`${baseUrl}/posts/${postId}/save/`, null, headers())
}

export function createPost(formData) {
  return axios.post(`${baseUrl}/posts/`, formData, headers())
}

export function editPost(postId, formData) {
  return axios.put(`${baseUrl}/posts/${postId}/`, formData, headers())
}

//* chats

export function getAllChatsUserIsIn(userId) {
  return axios.get(`${baseUrl}/auth/profile/${userId}/loaduserchats/`, headers(), null)
}

export function getSingleChat(userId, chatId) {
  return axios.get(`${baseUrl}/auth/profile/${userId}/chats/${chatId}/`, headers(), null)
}

export function checkForExistingChat(userId) {
  return axios.get(`${baseUrl}/auth/profile/${userId}/loadchats/`, headers(), null)
}

export function createAChat(userId) {
  return axios.post(`${baseUrl}/auth/profile/${userId}/chats/`, headers(), headers())
}

//* messages

export function createMessage(userId, chatId, formData) {
  return axios.post(`${baseUrl}/auth/profile/${userId}/chats/${chatId}/messages/`, formData, headers())
}

export function deleteMessage(userId, chatId, messageId) {
  return axios.delete(`${baseUrl}/auth/profile/${userId}/chats/${chatId}/messages/${messageId}/`, headers())
}

export function editMessage(userId, chatId, messageId, formData) {
  return axios.put(`${baseUrl}/auth/profile/${userId}/chats/${chatId}/messages/${messageId}/edit/`, formData, headers())
}

// export function editMessage(userId, chatId, formData) {
//   return axios.put(`${baseUrl}/auth/profile/${userId}/chats/${chatId}/edit/`, formData, headers())
// }

//* comments

export function createComment(postId, formData) {
  return axios.post(`${baseUrl}/posts/${postId}/comments/`, formData, headers())
}

export function deleteComment(postId, commentId) {
  return axios.delete(`${baseUrl}/posts/${postId}/comments/${commentId}/`, headers())
}