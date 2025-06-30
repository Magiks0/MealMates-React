import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
} from "@mui/material";
import { X } from "lucide-react";

export default function AppDialog({
  open,
  onClose,
  title,
  children,
  actions,
  maxWidth = "sm",
  paperSx,
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth={maxWidth}
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            p: 2,
            boxShadow: 5,
            ...paperSx,
          },
        },
        backdrop: { sx: { bgcolor: "rgba(0,0,0,.25)" } },
      }}
    >
      {title && (
        <DialogTitle sx={{ fontWeight: 600, pr: 4, display: "flex" }}>
          {title}
          <IconButton onClick={onClose} sx={{ ml: "auto" }}>
            <X size={20} />
          </IconButton>
        </DialogTitle>
      )}

      <DialogContent sx={{ pt: 1 }}>{children}</DialogContent>

      {actions && (
        <DialogActions sx={{ pb: 2, pr: 3 }}>{actions}</DialogActions>
      )}
    </Dialog>
  );
}
