import React from 'react'
import Peer from 'peerjs'
import useLocalStorage from '/services/hooks/useLocalStorage.js'
import useEventCallback from '/services/hooks/useEventCallback.js'
import { useLocation } from 'react-router-dom';
import queryString from 'query-string'
import peerOptions from '/shared/peerOptions.js'

const { useEffect, useState, useRef, Fragment } = React

export default () => {
  const params = queryString.parse(useLocation().search)

  const defaultFriendId = params.id
  const [peerId, setPeerId] = useLocalStorage('peerId', null)
  const peer = useRef(new Peer(peerId, peerOptions))
  const textArea = useRef(null)
  const [friendId, setFriendId] = useState(null)
  const [connection, setConnection] = useState(null)
  const [connectionStatus, setConnectionStatus] = useState(null)
  const input = useRef(null)
  const [receivedState, setReceivedState] = useState({})
  const {
    count,
  } = receivedState

  useEffect(() => {
    console.log(`connection status: ${connectionStatus}`)
  }, [connectionStatus])

  useEventCallback(peer && peer.current, 'open', setPeerId)

  useEventCallback(connection, 'open', () => {
    setConnectionStatus('open')
  })

  useEventCallback(connection, 'data', (data) => {
    setReceivedState(data)
  })

  useEventCallback(connection, 'error', () => {
    setConnectionStatus('error')
    console.log(error)
  })

  const connectToPeer = id => {
    setFriendId(id)
    setConnectionStatus('pending')
    setConnection(peer.current.connect(id))
  }

  const onSubmit = e => {
    const val = input.current.value
    connectToPeer(val)
    e.preventDefault()
  }

  useEffect(() => {
    connectToPeer(defaultFriendId)
  }, [defaultFriendId])

  const handleIncrement = () => {
    if (connection && connectionStatus === 'open') {
      connection.send({
        type: 'increment'
      })
    }
  }

  const handleDecrement = () => {
    if (connection && connectionStatus === 'open') {
      connection.send({
        type: 'decrement'
      })
    }
  }

  return <div>
    { ['open', 'pending'].includes(connectionStatus) ? null :
      <form onSubmit={onSubmit}>
        <code>{peerId}</code>
        <pre>
          Your ID: {peerId}
          Friend ID: {friendId}
        </pre>
        <br />
        <label>Peer ID: <input type='text' ref={input} value={params.id} /></label>
        <input
          type="submit"
          value="Connect"
        />
      </form>
    }

    { connectionStatus === 'open' ? <Fragment>
      <br />
      <button onClick={handleIncrement}>+</button>
      <button onClick={handleDecrement}>-</button>
      <br />
      <strong>{count}</strong>
    </Fragment> : null }

    { connectionStatus === 'pending' ? <h2>Pending</h2> : null }
  </div>
}
