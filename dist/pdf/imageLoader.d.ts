declare const _default: ({ imageUrl, onProgress, returnsBase64 }: {
    imageUrl: string;
    onProgress?: (progress: number) => void | null;
    returnsBase64?: boolean;
}) => Promise<string | void>;
export default _default;
