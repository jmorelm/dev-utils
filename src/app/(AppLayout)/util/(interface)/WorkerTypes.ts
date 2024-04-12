export interface WorkerInput {
    script: string;
}

export interface WorkerOutput {
    result: { originalName: string; transformedName: string; cSharpType: string; isId: boolean }[];
}