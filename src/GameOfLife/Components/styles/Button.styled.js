import React from "react";
import styled from "styled-components";

export const StyledButton = styled.button`
    background: transparent;
    background-color: ${props => props.inputColor || "lightblue"};
    color: black;
    border-radius: 5px;
    outline: 0;
    margin: 10px 10px;
    cursor: pointer;
    box-shadow: 0px 2px 2px lightgray;
    transition: ease background-color 250ms;
    &:hover {
        disabled ? "lightblue" : "red";
    }
    &:disabled {
    cursor: default;
    opacity: 0.7;
    }
`