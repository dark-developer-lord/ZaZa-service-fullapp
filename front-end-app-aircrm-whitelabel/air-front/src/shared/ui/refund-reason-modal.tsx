import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';

interface RefundReasonModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export const RefundReasonModal: React.FC<RefundReasonModalProps> = ({ open, onClose, onConfirm }) => {
  const [reason, setReason] = useState('');

  const handleConfirm = () => {
    onConfirm(reason);
    setReason('');
  };

  const handleClose = () => {
    setReason('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Укажите причину возврата</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          multiline
          minRows={3}
          label="Причина возврата"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Отмена</Button>
        <Button onClick={handleConfirm} variant="contained" color="error">
          Подтвердить
        </Button>
      </DialogActions>
    </Dialog>
  );
};
