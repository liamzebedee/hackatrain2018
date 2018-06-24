import React from 'react';
import { connect } from 'react-redux'

import NumericInput from 'react-numeric-input';

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import moment from 'moment';

import {
    load
} from '../actions/index';

import ReactTable from 'react-table'


const stateEnums = [
    'UNFUNDED', 'OPEN', 'CANCELLED', 'FULFILLED'
]

class App extends React.Component {
    componentDidMount() {
        this.props.load();
    }
    render() {
        let { load, offers, requests } = this.props;
        
        return <div className='container'>
            <h1>Proof of Last Mile</h1>

            <div style={{
                display: 'flex',
                flexDirection: 'column'
            }}>

            <section style={{ flex: 1 }}>
                <h3>Offers</h3>
                <table className="table">
                    <thead className="thead-dark">
                        <tr>
                        <th scope="col">Datetime</th>
                        <th scope="col">Min people</th>
                        <th scope="col">Max capacity</th>
                        <th scope="col">From</th>
                        <th scope="col">To</th>
                        <th scope="col">Fee</th>
                        </tr>
                    </thead>
                    <tbody>
                        <Offers offers={offers}/>
                    </tbody>
                </table>
            </section>

            <section style={{ flex: 1 }}>
                <h3>Requests</h3>
                <table className="table">
                    <thead className="thead-dark">
                        <tr>
                        <th scope="col">Datetime</th>
                        <th scope="col">Request state</th>
                        <th scope="col">From</th>
                        <th scope="col">To</th>
                        <th scope="col">Max budget</th>
                        </tr>
                    </thead>
                    <tbody>
                        <Requests reqs={requests}/>
                    </tbody>
                </table>
            </section>

            </div>
        </div>
    }
}

const Offers = ({ offers }) => {
    return offers.map((offer, i) => <Offer key={i} offer={offer}/>);
}

class Offer extends React.Component {
    state = {
        data: {},
    }
    componentDidMount() {
        let data = {};
        const setProp = (name, call) => {
            return call().then(val => {
                data[name] = val;
            })
        }
        Promise.all([
            setProp('datetime', this.props.offer.methods.datetime().call),
            setProp('minPeople', this.props.offer.methods.minPeople().call),
            setProp('maxCapacity', this.props.offer.methods.maxCapacity().call),
            setProp('from', this.props.offer.methods.from().call),
            setProp('to', this.props.offer.methods.to().call),
            setProp('fee', this.props.offer.methods.fee().call),
        ]).then(() => {
            this.setState({ data, })
        })
    }

    render() {
        return this.state.data !== {} ? <OfferRow {...this.state.data}/> : <tr></tr>
    }
}

const OfferRow = ({ datetime, minPeople, maxCapacity, from, to, fee }) => <tr>
    <td>{moment(new Date(datetime*1000)).fromNow()}</td>
    <td>👱 {minPeople}</td>
    <td>👱 {maxCapacity}</td>
    <td>{from}</td>
    <td>{to}</td>
    <td>${fee}</td>
</tr>;




const Requests = ({ reqs }) => {
    return reqs.map((req, i) => <Request key={i} req={req}/>);
}

class Request extends React.Component {
    state = {
        data: {},
    }
    componentDidMount() {
        let data = {};
        const setProp = (name, call) => {
            return call().then(val => {
                data[name] = val;
            })
        }
        Promise.all([
            setProp('datetime', this.props.req.methods.datetime().call),
            setProp('maxAmount', this.props.req.methods.maxAmount().call),
            setProp('from', this.props.req.methods.from().call),
            setProp('to', this.props.req.methods.to().call),
            setProp('state', this.props.req.methods.state().call),
        ]).then(() => {
            this.setState({ data, })
        })
    }

    render() {
        return this.state.data !== {} ? <ReqRow {...this.state.data}/> : <tr></tr>
    }
}

const ReqRow = ({ datetime, from, to, maxAmount, state }) => <tr>
    <td>{moment(new Date(datetime*1000)).fromNow()}</td>
    <td>{stateEnums[state]}</td>
    <td>{from}</td>
    <td>{to}</td>
    <td>${maxAmount}</td>
</tr>;


const mapStateToProps = state => {
    return {
        ...state
    }
}

const mapDispatchToProps = dispatch => {
    return {
        load: () => dispatch(load())
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);