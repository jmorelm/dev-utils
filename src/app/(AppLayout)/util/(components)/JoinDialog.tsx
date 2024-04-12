'use client'
import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { JoinDialogProps } from '../(interface)/JoinCondition';

const JoinDialog = ({open, onClose, onSubmit, initialJoin}:JoinDialogProps) => {
    const [leftTable, setLeftTable] = useState(initialJoin ? initialJoin.leftTable : '');
    const [rightTable, setRightTable] = useState(initialJoin ? initialJoin.rightTable : '');
    const [onCondition, setOnCondition] = useState(initialJoin ? initialJoin.onCondition : '');

  useEffect(() => {
    if (initialJoin) {
      setLeftTable(initialJoin.leftTable);
      setRightTable(initialJoin.rightTable);
      setOnCondition(initialJoin.onCondition);
    }
  }, [initialJoin]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{initialJoin ? 'Edit Join Condition' : 'Add Join Condition'}</DialogTitle>
      <DialogContent>
        <TextField
          label="Left Table"
          value={leftTable}
          onChange={(e) => setLeftTable(e.target.value)}
          fullWidth
        />
        <TextField
          label="Right Table"
          value={rightTable}
          onChange={(e) => setRightTable(e.target.value)}
          fullWidth
        />
        <TextField
          label="On Condition"
          value={onCondition}
          onChange={(e) => setOnCondition(e.target.value)}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={() => onSubmit(leftTable, rightTable, onCondition)}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

export default JoinDialog;