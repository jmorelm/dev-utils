import { Join, Table } from "../(types)/types";

export interface JoinCondition {
    leftTable: string;
    rightTable: string;
    onCondition: string;
}

export interface JoinDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (leftTable: string, leftColumn: string, rightTable: string, onCondition: string, rightColumn: string) => void;
    initialJoin?: JoinCondition;
    tables: Table[];
    setJoins: React.Dispatch<React.SetStateAction<Join[]>>;
}
