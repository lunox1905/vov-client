import React, { useRef, useEffect } from 'react';
import Hls from 'hls.js';

export const HlsPlayer = ({ src, autoPlay = true }) => {
    const audioRef = useRef(null);
    let hlsInstance = null;
    
    const startPlayback = () => {
        if (audioRef.current) {
            audioRef.current.play();
        }
    };

    const stopPlayback = () => {
        if (audioRef.current) {
            audioRef.current.pause();
        }
    };

    useEffect(() => {
        const audio = audioRef.current;
        if (Hls.isSupported()) {
            hlsInstance = new Hls();
            hlsInstance.loadSource(src);
            hlsInstance.attachMedia(audio);
            hlsInstance.on(Hls.Events.ERROR, function (event, data) {
                console.error('HLS error:', data);
            });
            
            hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
                if (autoPlay) {
                    console.log("play",src)
                    startPlayback();
                }
            });

            return () => {
                if (hlsInstance) {
                    hlsInstance.destroy();
                }
            };
        } else if (audio.canPlayType('application/vnd.apple.mpegurl')) {
            audio.src = src;
            audio.addEventListener('loadedmetadata', () => {
                if (autoPlay) {
                    startPlayback();
                }
            });
        }
    }, [src, autoPlay]);

    return (
        <audio ref={audioRef} controls style={{ width: '100%' }} />
    );
};

export default HlsPlayer;