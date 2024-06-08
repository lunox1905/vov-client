import { HlsPlayer } from "../hls"
import { useContext, useState,useEffect } from "react";
import { SocketContext } from "../context/SocketContext";
export const HlsListen = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [hlsAudioUrl,setHlsAudioUrl]=useState("")
    const { socket } = useContext(SocketContext)
    const [channelName, setChannelName ] = useState('')

    useEffect(() => {
        if (socket) {
            socket.on("res_hls_link", data => {
                setHlsAudioUrl(data.link)
                setIsPlaying((prevIsPlaying) =>true);
            } )
        }
        if(channelName) {
            socket.on('reconnect', async () => {
                console.log(channelName)
                setTimeout(() => {
                    socket.emit("req_hls_link",{channel: channelName})
                }, 2000)
            })

            socket.on("res_hls_link", data => {
                setHlsAudioUrl(data.link)
                setIsPlaying((prevIsPlaying) =>true);
            } )

            socket.emit("req_hls_link",{channel:channelName})
        }
        
    }, [channelName, socket])

    return (
        <>
            <div className="w-screen">
                <div className="flex max-w-full">
                <HlsPlayer src={hlsAudioUrl} autoPlay={isPlaying} />
                </div>
                <div className="flex">

            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={()=>setChannelName("Kênh 1")}> Nghe kenh 1</button>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={()=>setChannelName("Kênh 2")}> Nghe kenh 2</button>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={()=>setChannelName("Kênh 3")}> Nghe kenh 3</button>
                </div>
            </div>
    </>)
}