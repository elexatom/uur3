/**
 * Component: tlacitko pro potvrzeni akce
 */

/*
Finalni revize - 100%
 */

import React from "react"
import {Button} from "@mui/material"

interface ConfirmButtonProps {
  handleConfirm: () => void;
  textContent: string;
  disabled?: boolean;
  colorScheme?: "primary" | "secondary" | "error" | "info" | "success" | undefined;
  fullWidth?: boolean;
}

export const ConfirmButton: React.FC<ConfirmButtonProps> = (props) =>
  <Button
    fullWidth={props.fullWidth}
    variant="contained"
    disableElevation
    onClick={props.handleConfirm}
    color={props.colorScheme ? props.colorScheme : 'primary'} size="medium"
    className="rounded-xl font-semibold text-xs"
    style={{textTransform: "none" as const}}
    disabled={props.disabled}
  >
    <span className="text-white">{props.textContent}</span>
  </Button>