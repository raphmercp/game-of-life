import { StyledButton } from "./styles/Button.styled";
import React from "react";

export default function Button(props) {
    return (
        <StyledButton disabled={props.disabled} onClick={props.onClick}>
            {props.text}
        </StyledButton>
    )
}