import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Row, Col, ListGroup, Image, Button, Card } from "react-bootstrap";
import { addToCart } from "../actions/cartActions";

const CartScreen = () => {
  const [query] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  const productId = query.get("id");
  const qty = Number(query.get("qty") || 1);
  const { cartItems } = cart;

  useEffect(() => {
    if (productId) {
      dispatch(addToCart(productId, qty));
    }

    return () => {};
  }, [productId, qty, dispatch]);

  return (
    <div>
      <div>asas</div>
      <h1>{JSON.stringify(`qty: ${cartItems}`)}</h1>
    </div>
  );
};

export default CartScreen;
