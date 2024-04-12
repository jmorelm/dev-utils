export interface JoinCondition {
    leftTable: string;
    rightTable: string;
    onCondition: string;
}

export interface JoinDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (leftTable: string, rightTable: string, onCondition: string) => void;
    initialJoin?: JoinCondition;
}