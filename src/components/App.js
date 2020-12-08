import React, { Component } from 'react';
import Web3 from 'web3'
import logo from '../logo.png';
import './App.css';
import Marketplace from '../abis/Marketplace.json'
import Navbar from './Navbar'
import Main from './Main'

const listProduct = [
  {
    id: 1,
    name: 'Coat',
    price: 1000000000000000000
  },
  {
    id: 2,
    name: 'Mac 2021',
    price: 20000000000000000000
  }
]

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
    const networkId = await web3.eth.net.getId();
    const networkData = Marketplace.networks[networkId]
    if (networkData) {
      const marketplace = web3.eth.Contract(Marketplace.abi, networkData.address)

      this.setState({ marketplace })
      const orderCount = await marketplace.methods.orderCount().call();
      this.setState({ orderCount })
      // Load products
      for (var i = 1; i <= orderCount; i++) {
        const order = await marketplace.methods.orders(i).call();
        console.log(order);
        this.setState({
          orders: [...this.state.orders, order]
        })
      }
      this.setState({ loading: false, products: listProduct})

    } else {
      window.alert('Marketplace contract not deployed to detected network.')
    }

  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      orderCount: 0,
      products: [],
      orders: [],
      loading: true
    }
    this.getPayment = this.getPayment.bind(this);
    this.orderProduct = this.orderProduct.bind(this);
  }

  orderProduct(code, price, name) {
    const web3 = window.web3;
    this.setState({ loading: true })
    let hashCode = web3.utils.sha3(code);
    var process = this.state.marketplace.methods.orderProduct(hashCode, name).send({ from: this.state.account, value: price });
    process.on('confirmation', (confirmationNumber, receipt) => {
      window.location.reload();
    })
    process.on('error', (confirmationNumber, receipt) => {
      window.location.reload();
    })
  }

  getPayment(code){
    const web3 = window.web3;
    this.setState({ loading: true })
    let hashCode = web3.utils.sha3(code);
    var process = this.state.marketplace.methods.getPayment(hashCode).send({ from: this.state.account });
    process.on('confirmation', (confirmationNumber, receipt) => {
      window.location.reload();
    })
    process.on('error', (confirmationNumber, receipt) => {
      window.location.reload();
    })
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex">
              {this.state.loading
                ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
                : <Main
                  account={this.state.account}
                  products={this.state.products}
                  orders={this.state.orders}
                  orderProduct={this.orderProduct} 
                  getPayment={this.getPayment}/>
              }
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
