import {  useNavigate } from 'react-router-dom';
export const VerticalNav = () => {
    const navigate = useNavigate();
    const navigateTo = (subpath) => {
        navigate(subpath)
    }
    return (
        <>
            <div className="min-h-screen flex items-start justify-center bg-gray-100 ">
                <div className="flex min-h-screen w-full max-w-xs p-4 bg-white">
                    <ul className="flex flex-col w-full">
                      
                
                        <li className="my-px">
                            <div onClick={() => navigateTo("/hls")} className=" cursor-pointer flex flex-row items-center h-12 px-4 rounded-lg text-gray-600 hover:bg-gray-100">
 
                                <span className="flex items-center justify-center text-lg text-gray-400">
                                    <svg fill="none"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        className="h-6 w-6">
                                        <path d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
                                    </svg>
                                </span>
                                <span className="ml-3">HLS </span>
                            </div>
                          
                        </li>
                        <li className="my-px">
                            <div onClick={() => navigateTo("/listen")} className=" cursor-pointer flex flex-row items-center h-12 px-4 rounded-lg text-gray-600 hover:bg-gray-100">

                                <span className="flex items-center justify-center text-lg text-gray-400">
                                    <svg fill="none"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        className="h-6 w-6">
                                        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                                    </svg>
                                </span>
                                <span className="ml-3" >Listen</span>

                            </div>
                          
                        </li>
                        
                    </ul>
                </div>
            </div>
        </>
    )
}
