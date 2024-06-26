import { HlsPlayer } from "../hls"
import { useContext, useState,useEffect } from "react";
import { SocketContext } from "../context/SocketContext";

import axios from 'axios';
const URL = import.meta.env.VITE_URL;
export const HlsListen = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [hlsAudioUrl,setHlsAudioUrl]=useState("")
    const { socket } = useContext(SocketContext)
    const [channelName, setChannelName ] = useState('')
    const [ channels, setChannels ] = useState([])
    useEffect(() => {
        if (socket) {
            socket.on("res_hls_link", data => {
                console.log('=====:::', data)
                setHlsAudioUrl(data.link)
                setHlsAudioUrl(data.link)
                setIsPlaying((prevIsPlaying) =>true);
            } )
        }
        if(channelName) {
            socket.on('reconnect', async () => {
                console.log(channelName)
                setTimeout(() => {
                    socket.emit("req_hls_link",{channelId: channelName})
                }, 2000)
            })
            socket.on("res_hls_link", data => {
                console.log('=====:::', data)
                setHlsAudioUrl(data.link)
                setIsPlaying((prevIsPlaying) =>true);
            } )

            socket.emit("req_hls_link",{channelId:channelName})
        }
        
    }, [channelName, socket])

    useEffect(() => {
        axios.get(`${URL}/channel/list`)
        .then(res => {
            console.log(res)
            setChannels(res.data.data)
        })
    }, [])

    return (
        <>
            <div className="w-screen">
                <div className="flex max-w-full">
                <HlsPlayer src={hlsAudioUrl} autoPlay={isPlaying} />
                </div>
                <div >
                {
                    channels.map((channel, key)=> (
                        <div className="my-2" key={key}>
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={()=>setChannelName(channel._id)}> Nghe kenh {channel.name}</button>
                        </div>
                    ))
                }
               </div>
            </div>
    </>)
}