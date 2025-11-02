import { styled, css } from "styled-components";

export const LoginCard = styled.div`
width: 459px;
height: 552px;
left: 490px;
top: 174px;
position: absolute;
border-radius: 25px;
background: #FFF;
box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.20);
`;


export const InputField = styled.input`
width: 381px;
height: 52px;
flex-shrink: 0; 
padding: 12px;
margin-bottom: 15px;
border: 1px solid #ddd;
border-radius: 6px;
box-sizing: border-box;
font-color: rgba(10, 10, 10, 0.40);
font-family: "Noto Sans";
font-size: 18px;
font-style: normal;
font-weight: 500;
line-height: normal;
`;
export const LoginButton = styled.button`
width: 381px;
height: 52px;
flex-shrink: 0;
padding: 12px;
margin-top: 10px;
border: none;
border-radius: 12px;
background: #4F46E5;
font-color: #FAFAFA;
font-family: Roboto;
font-size: 16px;
font-style: normal;
font-weight: 500;
line-height: normal;
cursor: pointer;
`;

export const SocialButton = styled(MainButton)`
display: flex;
width: 381px;
height: 53px;
justify-content: center;
align-items: center;
flex-shrink: 0;
margin-top: 20px;
background-color: white;
border: 1px solid #ddd;
font-color: #0A0A0A;
font-family: "Noto Sans";
font-size: 16px;
font-style: normal;
font-weight: 400;
line-height: normal;
`;

export const FooterLink = styled.p`
margin-top: 25px;
font-color: rgba(10, 10, 10, 0.75);
font-family: "Noto Sans";
font-size: 16px;
font-style: normal;
font-weight: 400;
line-height: normal;
`;