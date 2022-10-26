import { useEffect, useState ,useCallback} from 'react'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut,} from 'firebase/auth'
import { Routes, Route, Outlet, Link, useOutletContext } from "react-router-dom";
import { createUserDocument, getUser } from './firebase/config'
import styled from 'styled-components';

export default function Projects() {
    const { user } = useOutletContext();
    const [userProjects, setUserProjects] = useState([])

    useEffect(() => {
        getUser(user.uid).then((doc) => {
            setUserProjects(doc.projects)
        })
    }, [])

    // convert object to array
    const projects = userProjects ? Object.entries(userProjects) : []

    // console.log(projects?.[0]?.[1])
    // console.log(projects)

    // iterate over the projects object

    return (
        <PageWrapper>
            <HeaderData>
                <h1>logo</h1>
                <h2>{user?.uid}</h2> 
            </HeaderData>
            <Section>
                <h1>Projects</h1>
                <ProjectWrapper>
                    <NewProjectContainer to='/canvas'>
                        <h1>New Project</h1>
                        <p>+</p>
                    </NewProjectContainer>
                    {projects?.map((project) => {
                        return (
                            <ProjectContainer to={`/canvas?user=${user.uid}&id=${project?.[0]}`}>
                                <img src={project?.[1]} alt="" />
                            </ProjectContainer>
                        )
                    })}
                </ProjectWrapper>
            </Section>
        </PageWrapper>
    )
}

const PageWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background-color: #F5F5F5;
`
const Section = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    width: 100%;
    max-width: 80%;
    height: 100vh;
    padding-top: 70px;
    padding: 0 20px;
    margin: 0 auto;
    h1 {
        font-size: 2rem;
        font-weight: 500;
        margin-bottom: 70px;
        margin-top: 100px;
    }
`        
const ProjectContainer = styled(Link)`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 200px;
    height: 200px;
    background-color: #fff;
    border-radius: 10px;
    margin: 10px;
    border: 2px solid transparent;
    text-decoration: none;
    transition: all 0.1s ease-in-out;
    cursor: pointer;
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 10px;
    }
    &:hover {
        box-shadow: 0 0 3px 0 var(--color-accent);
    }
`
const NewProjectContainer = styled(ProjectContainer)`
    border: 2px dashed var(--color-accent);
    img {
        display: none;
    }
    h1 {
        font-size: 1.3rem;
        font-weight: 600;
        color: var(--color-accent);
        margin: 0;
    }
    p {
        font-size: 3rem;
        line-height: 1;
        color: var(--color-accent);
        font-weight: 500;
        margin: 0;
    }
    &:hover {
        background-color: #eaeaea;
        transition: all 0.1s ease-in-out;
    }
`
const ProjectWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-start;
    gap: 20px;
`
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

