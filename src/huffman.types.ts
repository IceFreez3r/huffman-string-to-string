export type THuffmanChar = string;

export type THuffmanTree = [THuffmanTree, THuffmanTree] | THuffmanChar;

export type THuffmanTreeWithFrequencies = [THuffmanTree, number][];

export interface IHuffmanCodes {
    [char: THuffmanChar]: [prefix: number, length: number];
}
