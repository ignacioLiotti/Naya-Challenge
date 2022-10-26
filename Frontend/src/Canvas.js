import { useEffect, useState } from 'react'
import { Routes, Route, Outlet, Link, useOutletContext, useSearchParams} from "react-router-dom";
import {useOnDraw} from './customHooks/hook';
import { postProject, getProject } from './firebase/config'
import styled from 'styled-components';
import { createUserDocument, getUser, putColaborator, getColaborators } from './firebase/config'
import {io} from 'socket.io-client';
// import * as Accordion from '@radix-ui/react-accordion';
import Accordion from './Accordion';
export default function Canvas() {
    const { user } = useOutletContext();

    const [searchParams] = useSearchParams();
    const [userProjects, setUserProjects] = useState([])
    const [projectColaborators, setProjectColaborators] = useState([])
    
    const projectID = searchParams.get('id')
    const projectUser = searchParams.get('user')
    console.log(projectUser)


    useEffect(() => {
        getUser(projectUser).then((doc) => {
            console.log(doc)
            setUserProjects(doc.projects)
            putColaborator(doc.uid,user, projectID)
            getColaborators(doc.uid, projectID).then((doc) => {
                setProjectColaborators(projectUser ? Object.entries(doc) : [])
            console.log(doc)

            })
        })
    }, [])

    console.log(projectColaborators)
    // convert object to array
    const projects = Object.entries(userProjects)

    return (
        <PageWrapper>
            <HeaderData>
                <h1>logo</h1>
                <h2>{user?.email}</h2> 
            </HeaderData>
            <Draw width={1120} height={767} user={user} projectId={projectID}/>
            <AccordionsContainer>
                <Accordion title='SKETCHES'>
                    {projects.map((project,index) => {
                            // if the project is the current project, show it as selected
                            const isSelected = project[0] == projectID;
                            return (
                                <ProjectContainer href={`/canvas?id=${project?.[0]}`} isSelected={isSelected}>
                                    SKETCH {index + 1}
                                </ProjectContainer>
                            )
                        }
                        )}
                    <ProjectContainer href={`/canvas`}>
                        + Add New Sketch
                    </ProjectContainer>
                </Accordion>
                <Accordion title='USERS'>
                    {projectColaborators.map((colaborator,index) => {
                        console.log(colaborator)
                            // if the project is the current project, show it as selected
                            return (
                                <ProjectContainer >
                                    {colaborator[1]}
                                </ProjectContainer>
                            )
                        }
                        )}
                    <ProjectContainer href={`/canvas`}>
                        + Add New Sketch
                    </ProjectContainer>
                </Accordion>
            </AccordionsContainer>
        </PageWrapper>
    )

}         
// had to use Anchor tags instead of Link tags because of the way the redirect works with the search params, it was causing a bug that didn't
//  allow to change the project on the canvas
const ProjectContainer = styled.a`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    border-radius: 10px;
    margin: 10px;
    cursor: pointer;
    text-decoration: none;
    color: ${props => props.isSelected ? 'var(--color-accent)' : 'black'};
`        

const AccordionsContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;

    position: absolute;
    right: 0;
    top: 20vh;
    
    width: 260px;
    margin: 0 15px 10px 0;
    border-radius: 4px;
    `


// creates conectio to socket
const socket = io("http://localhost:3001");

// component that handles the drawing
const Draw = ({
    width,
    height,
    user,
    projectId
}) => {
    const [isDrawing, setIsDrawing] = useState(false);
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [userList, setUserList] = useState([]);
    const [project , setProject] = useState(null);

    // get the project id from the url and fetch the project from the database
    useEffect(() => {
        getProject(user, projectId ).then((doc) => {
            updateCanvas(doc)
            console.log(doc)
        })
    }, [projectId])

    useEffect(() => {
        socket.on("connect", () => {
            socket.emit('userConnected', JSON.stringify(user));
            console.log("connected to Socket Server")
        })
        // Canvas events
        socket.on("sendLine", (url)=>{
            updateCanvas(url)
        });
        socket.on("cleanCanvas", ()=>{
            clearCanvas()
        })
        // On user connection
        socket.on("newUser", (newUserJson) => {
            const parsedUser = JSON.parse(newUserJson);
            console.log('User: ', user.uid)
            userList.indexOf(user.uid) == -1 ?? setUserList(prev => prev.push(user.uid))
            console.log('List: ', userList)
        })

        // socket.on("userDisconnected", ())
        socket.on("disconnect", () => {
            
        }) 
        return () => {
            socket.off('connect');
            socket.off('sendLine');
            socket.off('cleanCanvas');
            socket.off('newUser');
            socket.off('disconnect')
        };
    }, [])

    // every time the canvas is updated, the project is emited to the socket, so other users can see the changes
    useEffect(() => {
        if (isConnected) {
        const tumama = makeImage();
        socket.emit("lineDrawed", tumama)
        }
    }, [isDrawing])

    const drawingOver = () => {
        setIsDrawing(prev=>!prev)
    }

    const handleSave = () => {
        const image = makeImage();
        postProject(user, image)
    }

    const {
        setCanvasRef,
        onCanvasMouseDown,
        clearCanvas,
        makeImage,
        updateCanvas
    } = useOnDraw(onDraw);

    function onDraw(ctx, point, prevPoint) {
        drawLine(prevPoint, point, ctx, '#000000', 5);
    }

    function drawLine(
        start,
        end,
        ctx,
        color,
        width
    ) {
        start = start ?? end;
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.strokeStyle = color;
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(start.x, start.y, 2, 0, 2 * Math.PI);
        ctx.fill();
    }

    return(
        <CanvasWrapper>
            <StyledCanva
                width={width}
                height={height}
                onMouseDown={onCanvasMouseDown}
                onMouseOut={drawingOver}
                ref={setCanvasRef}
                />
            <button onClick={() => {
                clearCanvas()
                socket.emit("cleanCanvas")
            }}>borrar</button>
            <button onClick={handleSave}>Guardar</button>
            {/* <img src={makeImage()} alt="" /> */}
        </CanvasWrapper> 
 
    );
}
const CanvasWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    width: 100%;
    height: 100%;
    background-color: #f5f5f5;
    padding: 10vh 0 0 5vw ;
`
const StyledCanva = styled.canvas`
    background-color: white;
`;

const PageWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    position: relative;
    height: 100vh;
    width: 100vw;
    background-color: #f5f5f5;
`;
const HeaderData = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    top: 0;
    width: 100%;
    height: 70px;
    padding: 0px 30px;
    border-bottom: 1px solid #ccc;
    cursor: pointer;
    h1 {
        font-size: 2rem;
    }
    h2 {
        font-size: 1rem;
    }
`