import React, { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { Form, Button } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { listProductDetails, updateProduct } from "../actions/productActions"
import FormContainer from "../components/FormContainer"
import Message from "../components/Message"
import Loader from "../components/Loader"
import { PRODUCT_UPDATE_RESET } from "../constants/productConstants"
import axios from "axios"

const ProductEditScreen = () => {
  const dispatch = useDispatch()
  const params = useParams()
  const navigate = useNavigate()

  const productDetails = useSelector((state) => state.productDetails)
  const { loading, error, product } = productDetails

  const productUpdate = useSelector((state) => state.productUpdate)
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = productUpdate

  const productId = params.id

  const [name, setName] = useState("")
  const [price, setPrice] = useState(0)
  const [image, setImage] = useState("")
  const [brand, setBrand] = useState("")
  const [category, setCategory] = useState("")
  const [countInStock, setCountInStock] = useState(0)
  const [description, setDescription] = useState("")
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET })
      navigate("/admin/productlist")
    } else {
      if (!product.name || product._id !== productId) {
        dispatch(listProductDetails(productId))
        console.log("new", "product.name", product.name)
      } else {
        setName(product.name)
        setPrice(product.price)
        setImage(product.image)
        setBrand(product.brand)
        setCategory(product.category)
        setCountInStock(product.countInStock)
        setDescription(product.description)
        console.log("old", product._id, productId)
      }
    }

    return () => {}
  }, [dispatch, productId, product, navigate, successUpdate])

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(
      updateProduct({
        _id: productId,
        name,
        price,
        image,
        brand,
        category,
        description,
        countInStock,
      })
    )
  }

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append("image", file)
    setUploading(true)
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
      const { data } = await axios.post(`/api/upload`, formData, config)
      setImage(data)
      setUploading(false)
    } catch (error) {
      console.error(error)
      setUploading(false)
    }
  }

  return (
    <>
      <Link to="/admin/productlist" className="btn btn-light my-3">
        Go Back
      </Link>

      <FormContainer>
        <h1>Edit Product</h1>

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

            <Form.Group controlId="price" className="my-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Price"
                value={price}
                required
                onChange={(e) => setPrice(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="image" className="my-3">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Image Url"
                value={image}
                required
                onChange={(e) => setImage(e.target.value)}
              ></Form.Control>

              <Form.Group className="mb-3">
                <Form.Label>Choose file</Form.Label>
                <Form.Control
                  type="file"
                  id="image-file"
                  custom
                  onChange={uploadFileHandler}
                />
              </Form.Group>
              {uploading && <Loader />}
            </Form.Group>

            <Form.Group controlId="brand" className="my-3">
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter brand"
                value={brand}
                required
                onChange={(e) => setBrand(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="countInStock" className="my-3">
              <Form.Label>Count In Stock</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Count In Stock"
                value={countInStock}
                required
                onChange={(e) => setCountInStock(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="category" className="my-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Category"
                value={category}
                required
                onChange={(e) => setCategory(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="description" className="my-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Description"
                value={description}
                required
                onChange={(e) => setDescription(e.target.value)}
              ></Form.Control>
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

export default ProductEditScreen
