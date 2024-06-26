import { useState ,useContext} from "react";
import { useEffect ,useRef} from "react";
import { SocketError } from "./SocketError";
import { SocketContext } from "../context/SocketContext";
import * as mediasoupClient from "mediasoup-client"

import axios from 'axios';
const URL = import.meta.env.VITE_URL;
let device
let rtpCapabilities
let consumerTransport
let consumer
export const Listen = () => {
    const { socket } = useContext(SocketContext);
    const audioRef = useRef(null);
    const [ channelName, setChannelName ] = useState('')
    const [ channels, setChannels ] = useState([])
    useEffect(() => {
        if (socket) {
            socket.on('connect', () => {
                console.log('Connected to socket server');
            });
            // Cleanup on unmount
            return () => {
                socket.off('connect');
                socket.off('message');
            };
        }
    }, [socket]);

    // socket.on("closeproduce", () => {
    //     const video = document.getElementById("remoteVideo")
    //     // mediaRecorder.stop()
    //     video.src = ''
    // })

    const goConsume = () => {
        device === undefined ? getRtpCapabilities() : createRecvTransport()
    }
    const getRtpCapabilities = () => {
        console.log('stage1');
        socket.emit('createRoom', (data) => {
            rtpCapabilities = data.rtpCapabilities
            createDevice()
        })
    }
    const createDevice = async () => {
        console.log('stage2');

        try {
            device = new mediasoupClient.Device()
            await device.load({
                routerRtpCapabilities: rtpCapabilities
            })

            createRecvTransport()

        } catch (error) {
            console.log(error)
            if (error.name === 'UnsupportedError')
                console.warn('browser not supported')
        }
    }

    

    const createRecvTransport = async () => {
        console.log('stage3');

        await socket.emit('createWebRtcTransport', { sender: false }, ({ params }) => {

            if (params.error) {
                console.log(params.error)
                return
            }
            consumerTransport = device.createRecvTransport(params)

            consumerTransport.on('connect', async ({ dtlsParameters }, callback, errback) => {
                try {
                    await socket.emit('transport-recv-connect', {
                        dtlsParameters,
                    })

                    callback()
                } catch (error) {
                    errback(error)
                }
            })

            connectRecvTransport()
        })
    }

    const connectRecvTransport = async () => {
        console.log('stage4');
        await socket.emit('consume', {
            rtpCapabilities: device.rtpCapabilities,
            channelId: channelName
        }, async ({ params }) => {
            if (params.error) {
                console.log('error', params.error);
                audioRef.current.pause();
                setChannelName('')
                return
            }

            consumer = await consumerTransport.consume({
                id: params.id,
                producerId: params.producerId,
                kind: params.kind,
                rtpParameters: params.rtpParameters
            })
            const { track } = consumer
            let audiostream = new MediaStream([track])
            audioRef.current.srcObject = audiostream
        })
    }

    useEffect(() => {
        if(channelName) {
            goConsume()
            socket.on('reconnect', async () => {
                createRecvTransport()
            })
        }
        
    }, [channelName])

    useEffect(() => {
        axios.get(`${URL}/channel/list`)
        .then(res => {
            setChannels(res.data.data);
        })
    }, [])

    return (
        <>
            {
                socket != null ? <>
                    <div className="p-3">

                        <div id="sharedBtns">
                            <audio ref={audioRef} id="remoteVideo" autoPlay ></audio>
                        </div>
                        {
                            channels.map((channel, key)=> (
                                <div key={key} id="sharedBtns">
                                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => setChannelName(channel._id)}>Nghe kênh {channel.name}</button>
                                </div>
                            ))
                        }
                    </div>
                </> : <>
                
                    <SocketError/>
                    </>
             }
          
        </>
    )
}
