import React, { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { Form, Button } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { getUserDetails, updateUser } from "../actions/userActions"
import FormContainer from "../components/FormContainer"
import Message from "../components/Message"
import Loader from "../components/Loader"
import { USER_UPDATE_RESET } from "../constants/userConstants"

const UserEditScreen = () => {
  const dispatch = useDispatch()
  const params = useParams()
  const navigate = useNavigate()

  const userDetails = useSelector((state) => state.userDetails)
  const { loading, error, user } = userDetails

  const userUpdate = useSelector((state) => state.userUpdate)
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = userUpdate

  const userId = params.id

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: USER_UPDATE_RESET })
      navigate("/admin/userList")
    } else {
      if (!user.name || user._id !== userId) {
        dispatch(getUserDetails(userId))
      } else {
        setName(user.name)
        setEmail(user.email)
        setIsAdmin(user.isAdmin)
      }
    }

    return () => {}
  }, [user, dispatch, userId, successUpdate, navigate])

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(updateUser({ _id: userId, name, email, isAdmin }))
  }

  return (
    <>
      <Link to="/admin/userlist" className="btn btn-light my-3">
        Go Back
      </Link>

      <FormContainer>
        <h1>Edit User</h1>

        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant="danger"> {errorUpdate} </Message>}

        {/* {message && <Message variant="danger"> {message} </Message>} */}

        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger"> {error} </Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name" className="my-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="name"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="email" className="my-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="isAdmin" className="my-3">
              <Form.Check
                type="checkbox"
                label="Is Admin"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              ></Form.Check>
            </Form.Group>

            <Button type="submit" variant="primary" className="my-3">
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  )
}

export default UserEditScreen
