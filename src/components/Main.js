import React, { Component, useState } from 'react';
import { Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';

function Main(props) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [code, setCode] = useState('');
  const [action, setAction] = useState('');
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
  }
  const handleShow = (product, action) => {
    setShow(true);
    setName(product.name);
    setPrice(product.price.toString());
    setAction(action);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    switch (action) {
      case 'orderProduct': {
        props.orderProduct(code, price, name);
      }
      case 'getPayment': {
        props.getPayment(code);
      }
    }

  }

  const onChangeCode = (e) => {
    let value = e.target.value;
    setCode(value);
  }

  return (
    <div id="content" style={{ margin: 'auto', width: '100%' }}>
      <p>&nbsp;</p>

      <div className="container-fluid">
        <div className="row">
          <div className="col-4">
          <div class="card">
            <div class="card-body">
            <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Name</th>
                      <th scope="col">Price</th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody id="productList">
                    {props.products.map((product, key) => {
                      return (
                        <tr key={key}>
                          <th scope="row">{product.id.toString()}</th>
                          <td>{product.name}</td>
                          <td>{window.web3.utils.fromWei(product.price.toString(), 'Ether')} Eth</td>
                          <td>
                            <button name={product.id} value={product.price} onClick={() => handleShow(product, 'orderProduct')}>Order</button>
                          </td>
                        </tr>
                      )
                    })}
                    <tr>
                      <td colSpan={4}>
                        <button onClick={() => handleShow(null, 'getPayment')} className="float-right">Get payment</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
            </div>
          </div>
          </div>
          <div className="col-8">
            <div class="card">
              <div class="card-body">
                <h2>Order Product</h2>
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Name</th>
                      <th scope="col">Price</th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody id="productList">
                    {props.products.map((product, key) => {
                      return (
                        <tr key={key}>
                          <th scope="row">{product.id.toString()}</th>
                          <td>{product.name}</td>
                          <td>{window.web3.utils.fromWei(product.price.toString(), 'Ether')} Eth</td>
                          <td>
                            <button name={product.id} value={product.price} onClick={() => handleShow(product.price.toString(), 'orderProduct')}>Order</button>
                          </td>
                        </tr>
                      )
                    })}
                    <tr>
                      <td colSpan={4}>
                        <button onClick={() => handleShow(0, 'getPayment')} className="float-right">Get payment</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Private code</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit} autoComplete='off'>
            <div className="form-group">
              <input type="text" className="form-control" placeholder="Enter private code" id="code" onChange={onChangeCode} />
            </div>
            <button type="submit" className="btn btn-primary float-right">Submit</button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Main;
