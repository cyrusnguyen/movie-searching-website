import styled from "styled-components"
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';
import { useRegistration } from "../api/authAPI"
export default function Register() {
    const [name, setName] = useState('');
    const [isClickable, setIsClickable] = useState(false);
    const [isPassMatch, setIsPassMatch] = useState(true);
    const [state, setState] = useState({
        email: "",
        password: "",
        confirmPassword: ""
      });
    const { register, isCreated, message, loading } = useRegistration();


    useEffect(() => {
        if (state.password && state.confirmPassword){
            validatePassword();
        }
        
      }, [state]);
    const validatePassword = () => {
        if (state.password === state.confirmPassword) {
            setIsPassMatch(true);
            setIsClickable(true)
        } else{
            setIsPassMatch(false);
            setIsClickable(false)
        }
      };
    
    

    const handleChange = (e) => {
        const { id, value } = e.target;
        setState((prevState) => ({
            ...prevState,
            [id]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        register(state.email, state.password);
    };

    return(
        <React.Fragment>
            <RegisterComponent>
                <div  className="registerContainer"> 
                    <h1 className="registerTitle">Create an account</h1>
                    {/* Temporarily put it here for now (store into API later) */}
                    <FormGroup>
                        <Label className="registerLabel" for="name">Full Name</Label>
                        <Input
                        className="registerInput"
                        type="text"
                        name="name"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your full name"
                        />
                    </FormGroup>
                    <Form onSubmit={handleSubmit}>
                        <FormGroup>
                        <Label className="registerLabel" for="email">Email<span> *</span></Label>
                        <Input
                        className="registerInput"
                        type="email"
                        name="email"
                        id="email"
                        value={state.email.value}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        />
                        </FormGroup>
                        <FormGroup>
                            <Label className="registerLabel" for="password">Password<span> *</span></Label>
                            <Input
                            className="registerInput"
                            type="password"
                            name="password"
                            id="password"
                            value={state.password.value}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            aria-required="true"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label className="registerLabel" for="confirmPassword">Confirm Password<span> *</span></Label>
                            <Input
                            className="registerInput"
                            type="password"
                            name="confirmPassword"
                            id="confirmPassword"
                            value={state.confirmPassword.value}
                            onChange={handleChange}
                            placeholder="Enter your password again"
                            aria-required="true"
                            
                            />
                        </FormGroup>
                        
                        <div className="bottomContainer">
                        <Button className="btnRegister" disabled={!isClickable} color="primary" type="submit">Sign up</Button>
                        <p>Already a member? <Link className="loginLink" to="/login">Login here</Link></p>
                        </div>
                        {isPassMatch ? "" : <div className="errorMessage">Error: Passwords do not match</div>}
                        {isCreated && isPassMatch &&
                        <div className="successMessage">
                            {message}. <Link className="loginLink" to="/login">Click here to log in.</Link>
                        </div>
                        }
                        {!isCreated && message && isPassMatch && <div className="errorMessage">{message}</div>}


                    </Form>
                    
            </div>
            </RegisterComponent>
        </React.Fragment>
    )
}
const RegisterComponent = styled.div`
    background: var(--color-brighter-black);
    color: var(--color-white);
    display: flex;
    justify-content: center;
    align-items: center;

    .registerContainer {
        width: 50vh;
    } 

    .registerLabel {
        font-size: 18px;
    }
    .registerTitle{
        padding: 10px 0px;
        text-align: center;
        font-size: 40px;
        background: var(--color-gradient);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    

    .registerInput {
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

    .errorMessage {
        color: red;
        margin-bottom: 10px;
        text-align: center;

    }

    .successMessage {
        color: green;
        margin-bottom: 10px;
        text-align: center;
    }

    .loginLink {
        text-decoration: none;
        color: var(--color-blue);
        
    }

    .bottomContainer {
        text-align: center;
        padding-top: 10px;

        
        .btnRegister {
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
            
        }
    }
    
`;