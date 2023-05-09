import styled from "styled-components";
import React from "react";

export default function Footer() {
    return (
        <React.Fragment>
            <FooterComponent className="page-footer">
                <div>
                    <span>Author : Minh Nguyen</span>
                    <span> &copy;2023 @QUT</span>
                </div>
                <div>
                    <span>Email to: </span>
                    <a href="mailto: hoangminh0268@gmail.com">hoangminh0268@gmail.com </a>
                </div>
            </FooterComponent>
        </React.Fragment>
    )
}

const FooterComponent = styled.footer` 
    color: var(--color-white);
    background-color: var(--color-black);
    text-align: center;
    width: 100%;
    height: 6rem;
    padding: 1rem;
    a {
        text-decoration: none;
        color: var(--color-white);
    }

`;