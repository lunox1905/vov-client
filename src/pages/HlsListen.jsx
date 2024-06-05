import { HlsPlayer } from "../hls"
import { useContext, useState,useEffect } from "react";
import { SocketContext } from "../context/SocketContext";
export const HlsListen = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [hlsAudioUrl,setHlsAudioUrl]=useState("")
    const { socket } = useContext(SocketContext)
    useEffect(() => {
        if (socket) {
            socket.on("res_hls_link", data => {
                setHlsAudioUrl(data.link)
                setIsPlaying((prevIsPlaying) =>true);
            } )
        }
    },[socket] )
    const playHls = (channel) => {
        socket.emit("req_hls_link",{channel:channel})
    }

    return (
        <>
            <div className="w-screen">
                <div className="flex max-w-full">
            <HlsPlayer src={hlsAudioUrl} autoPlay={isPlaying} />
                </div>
                <div className="flex">

            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={()=>playHls("kenh1")}> Nghe kenh 1</button>
                </div>
            </div>
    </>)
}