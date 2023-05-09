import styled from "styled-components"
import NavBar from "./NavBar";
import React, { useState } from 'react';
import { Link } from 'react-router-dom'
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const handleSubmit = (event) => {
        event.preventDefault();
      };
    return(
        <React.Fragment>
            <LoginComponent>
                
                <div  className="loginContainer"> 
                    <h1 className="loginTitle">Login</h1>
                    <Form onSubmit={handleSubmit}>
                        <FormGroup>
                        <Label className="loginLabel" for="email">Email</Label>
                        <Input
                        className="loginInput"
                        type="email"
                        name="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label className="loginLabel" for="password">Password</Label>
                        <Input
                        className="loginInput"
                        type="password"
                        name="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        />
                    </FormGroup>
                    <div className="bottomContainer">
                    <Button className="btnLogin" color="primary" type="submit">Login</Button>
                    <p>Not have an account? <Link className="registerLink" to="/register">Register here</Link></p>
                    </div>
                </Form>
            </div>
            </LoginComponent>
        </React.Fragment>
    )
}
const LoginComponent = styled.div`
    background: var(--color-brighter-black);
    width: 100%;
    height: 70vh;
    color: var(--color-white);
    display: flex;
    justify-content: center;
    align-items: center;

    .loginContainer {
        width: 50vh;
    } 

    .loginLabel {
        font-size: 18px;
    }
    .loginTitle{
        padding: 10px 0px;
        text-align: center;
        font-size: 40px;
        background: var(--color-gradient);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    

    .loginInput {
        width: 100%;
        height: 50px;
        border-radius: 8px;
        box-shadow: 0px 0px 1px var(--color-white);
        background: transparent;
        color: var(--color-white);
        font-size: 16px;

        ::placeholder {
            color: #bbbbb;
        }

    }

    .bottomContainer {
        text-align: center;
        padding-top: 10px;

        
        .btnLogin {
            background: var(--color-gradient);
            opacity: 0.8;
            text-align: center;
            width: 100%;
            height: 40px;
            font-size: 20px;
            
    
            :hover {
                opacity: 1;
            }
    
    
        }

        p {
            padding-top: 5px;
            .registerLink {
                text-decoration: none;
                color: var(--color-blue);
                
            }
        }
    }
    
`;