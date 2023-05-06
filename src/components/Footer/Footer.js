import styled from "styled-components";

export default function Footer() {
    return (
        <FooterComponent>
            <div>
                <span>Author : Minh Nguyen</span>
                <span> &copy;2023 @QUT</span>
            </div>
            <div>
                <span>Email to: </span>
                <a href="mailto: hoangminh0268@gmail.com">hoangminh0268@gmail.com </a>
            </div>
        </FooterComponent>
    )
}

const FooterComponent = styled.div` 
    position: fixed;
    color: var(--color-white);
    background-color: var(--color-black);
    bottom: 0;
    left: 0;
    right: 0;
    padding: 1rem;
    height: 10vh;
    text-align: center;
    a {
        text-decoration: none;
        color: var(--color-white);
    }

`;