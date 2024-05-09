interface IDimensionsInput {
    width: number;
    height: number;
    maxWidth: number;
    maxHeight: number;
}
interface IDimensionsOutput {
    width: number;
    height: number;
}
declare const _default: ({ width, height, maxWidth, maxHeight }: IDimensionsInput) => IDimensionsOutput;
export default _default;
