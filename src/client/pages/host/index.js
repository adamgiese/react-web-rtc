import React from 'react'
import Peer from 'peerjs'
import useLocalStorage from '/services/hooks/useLocalStorage.js'
import useEventCallback from '/services/hooks/useEventCallback.js'
import peerOptions from '/shared/peerOptions.js'

const { useEffect, useState, useRef, useReducer } = React

const defaultReducer = [(state, action) => {
  if (!action) { return state }

  switch (action.type) {
    case 'sync':
      return {
        ...state,
        status: 'in-sync',
      }
    case 'increment':
      return {
        ...state,
        count: state.count + 1,
        status: 'out-of-sync',
      };
    case 'decrement':
      return {
        ...state,
        count: state.count - 1,
        status: 'out-of-sync',
      };
    default:
      throw new Error();
  }
}, { count: 0 }]

export default () => {
  const [peerId, setPeerId] = useLocalStorage('peerId', undefined)
  const peer = useRef(new Peer(peerId, peerOptions))
  const textArea = useRef(null)
  const [connection, setConnection] = useState(null)
  const [connectionStatus, setConnectionStatus] = useState(null)
  const [state, dispatch] = useReducer(...defaultReducer)

  const {
    status,
    count,
  } = state

  const shared = {
    count,
  }

  useEffect(() => {
    if (connection && connectionStatus === 'open' && status === 'out-of-sync') {
      connection.send(shared)
      dispatch({type: 'sync'})
    }
  }, [status])

  useEffect(() => {
    console.log(`connection status: ${connectionStatus}`)
  }, [connectionStatus])

  useEventCallback(peer && peer.current, 'open', setPeerId)
  useEventCallback(peer && peer.current, 'connection', setConnection)

  useEventCallback(connection, 'open', () => {
    setConnectionStatus('open')
    connection.send(shared)
  })

  useEventCallback(connection, 'data', dispatch)

  useEventCallback(connection, 'error', (error) => {
    setConnectionStatus('error')
    console.log(error)
  })

  const handleIncrement = () => dispatch({type: 'increment'})
  const handleDecrement = () => dispatch({type: 'decrement'})

  return <div>
    <code>{peerId}</code>
    <br />
    <button onClick={handleIncrement}>+</button>
    <button onClick={handleDecrement}>-</button>
    <br />
    <strong>{state.count}</strong>
    <br />
  </div>
}
