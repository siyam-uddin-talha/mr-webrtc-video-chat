import React, { useCallback, useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import { Button, Container, } from '@mui/material'
import { useParams } from 'react-router-dom'
import { Box } from "@mui/system";
import { Redirect, } from "react-router"
import BackDropLoading from '../More/BackDropLoading';
import Options from './Options';
import UseGetData from '../../api/UseGetData'
import { ErrorBoundary } from 'react-error-boundary'


function ErrorFallback({ error, resetErrorBoundary }) {
    return (
        <div className="error_ d-flex a-i-c j-c-c" role="alert">
            <p>Something went wrong:</p>
            <pre>{error.message}</pre>
            <Button variant="outlined" onClick={resetErrorBoundary}>Try again</Button>
        </div>
    )

}

const Video = (props) => {
    const ref = useRef();

    useEffect(() => {
        props.peer.on("stream", stream => {
            ref.current.srcObject = stream;
        })
    }, [props.peer]);

    return (

        <video autoPlay ref={ref} className='u-v-sswa' />

    );
}


const NewRoom = () => {

    const { roomID } = useParams()

    const [loading, setloading] = useState(true);
    const userVideo = useRef(null);

    const [user, setUser] = useState({
        login: false, user: {}
    })
    const [peers, setPeers] = useState([]);

    const socketRef = useRef();
    const peersRef = useRef([]);



    const GetUser = useCallback(async () => {
        try {
            const { data } = await UseGetData(`/api/user`)
            if (data.success) {
                setUser({
                    login: true,
                    user: data.user
                })
                setloading(false)

            } else {
                setUser({
                    login: false,
                    user: {}
                })
                setloading(false)

            }

        } catch (error) {
            setUser({
                login: false,
                user: {}
            })
        }
    }, [])


    useEffect(() => {
        GetUser()
    }, [GetUser])

    //========================= giant useEffect ====================

    useEffect(() => {
        socketRef.current = io.connect("/");
        navigator.getMedia =
            navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia;


        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {


            socketRef.current.emit("join room", roomID);
            socketRef.current.on("all users", users => {

                const allPeers = [];

                users.forEach(userID => {
                    const peer = createPeer(userID, socketRef.current.id, stream,);
                    peersRef.current.push({
                        peerID: userID,
                        peer,
                    })
                    allPeers.push({
                        peerID: userID,
                        peer,
                    });
                })

                setPeers(allPeers);
            })

            socketRef.current.on("user joined", payload => {
                const roomUser = []
                const peer = addPeer(payload.signal, payload.callerID, stream,);
                peersRef.current.push({
                    peerID: payload.callerID,
                    peer,
                })
                roomUser.push({
                    peerID: payload.callerID,
                    peer,
                })

                setPeers(users => {
                    const result = [...users, ...roomUser].filter((value, index, self) => self.findIndex((m) => m.peerID === value.peerID) === index);
                    return result
                });
            });

            socketRef.current.on("receiving returned signal", payload => {
                const item = peersRef.current.find(p => p.peerID === payload.id);
                item.peer.signal(payload.signal);
            });

            socketRef.current.on("user left", id => {
                const peeeObj = peersRef.current.find(p => p.peerID === id)
                if (peeeObj) {
                    peeeObj.peer.destroy()
                }
                const peers = peersRef.current.filter(p => p.peerID !== id)
                peersRef.current = peers
                setPeers(peers)
            })

            setTimeout(() => {
                userVideo.current.srcObject = stream;
            }, 2000)


        }).catch(err => {
            console.log(err)


            if (err.message === "Permission denied") {
                socketRef.current.emit("join room", roomID);

                socketRef.current.on("all users", users => {

                    const allPeers = [];
                    users.forEach(userID => {
                        const peer = createPeer(userID, socketRef.current.id, null);
                        peersRef.current.push({
                            peerID: userID,
                            peer,
                        })
                        allPeers.push({
                            peerID: userID,
                            peer,
                        });
                    })

                    setPeers(allPeers);
                })
                socketRef.current.on("user joined", payload => {

                    const roomUser = []
                    const peer = addPeer(payload.signal, payload.callerID, null);
                    peersRef.current.push({
                        peerID: payload.callerID,
                        peer,
                    })
                    roomUser.push({
                        peerID: payload.callerID,
                        peer,
                    })


                    setPeers(users => {
                        const result = [...users, ...roomUser].filter((value, index, self) => self.findIndex((m) => m.peerID === value.peerID) === index);
                        return result
                    });
                });

                socketRef.current.on("receiving returned signal", payload => {
                    const item = peersRef.current.find(p => p.peerID === payload.id);
                    item.peer.signal(payload.signal);
                });

                socketRef.current.on("user left", id => {
                    const peeeObj = peersRef.current.find(p => p.peerID === id)
                    if (peeeObj) {
                        peeeObj.peer.destroy()
                    }
                    const peers = peersRef.current.filter(p => p.peerID !== id)
                    peersRef.current = peers

                    setPeers(peers)
                })
            }
        })



    }, [userVideo, roomID,]);



    useEffect(() => {
        return () => {
            socketRef.current.close();
        }
    }, [])

    const createPeer = (userToSignal, callerID, stream, name) => {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });

        peer.on("signal", signal => {
            socketRef.current.emit("sending signal", { userToSignal, callerID, signal, name })
        })

        return peer;
    }

    const addPeer = (incomingSignal, callerID, stream, name) => {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        })

        peer.on("signal", signal => {
            socketRef.current.emit("returning signal", { signal, callerID, name })
        })

        peer.signal(incomingSignal);

        return peer;
    }


    if (loading) {
        return <BackDropLoading />
    }
    if (!user.login) {
        return <Redirect to="/user/login" />
    }

    return (
        <React.Fragment>
            <section className="s-pad video_sector_lss" >
                <Container maxWidth='xl' className='d-flex gap-4 vedio_sector__ a-i-c j-c-c' sx={{ minHeight: '100%' }} >
                    <>
                        <Box className='v-box alwlikj d-flex a-i-c gap-2 f-w-w j-c-c' sx={{ "& > video": { borderRadius: "1rem", background: "#ffffff52" }, width: "100%", }} >

                            {/* user-video */}
                            <React.Fragment>
                                <div className="col-md-4 col-sm-5">
                                    {<video autoPlay ref={el => { userVideo.current = el; }} className='u-v-sswa' ></video>}
                                </div>
                            </React.Fragment>

                            {/* other-user-vidoe */}
                            <React.Fragment>
                                {peers.length !== 0 &&
                                    <>
                                        {
                                            peers.map((peer, i) => {
                                                return (
                                                    <div className="col-md-4 col-sm-5" key={peer.peerID} >

                                                        <Video peer={peer.peer} />
                                                    </div>
                                                );
                                            })
                                        }
                                    </>
                                }
                            </React.Fragment>
                        </Box>
                    </>

                </Container>
            </section>
            <Options stream={userVideo.current} />
        </React.Fragment>

    );
};


const Room = () => {
    return (
        <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onReset={() => {
                window.reload();
            }}
        >
            <NewRoom />
        </ErrorBoundary>
    )
}



export default Room;