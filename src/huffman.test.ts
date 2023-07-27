import HuffmanEncoding from "./huffman";
import { IHuffmanCodes, THuffmanChar, THuffmanTree } from "./huffman.types";
import { describe, expect, it } from 'vitest';

function depth(tree: THuffmanTree, char: THuffmanChar): number {
    if (typeof tree === "string") {
        return tree === char ? 0 : Infinity;
    }
    return Math.min(depth(tree[0], char), depth(tree[1], char)) + 1;
}

describe("HuffmanEncoding", () => {
    it("counts frequencies", () => {
        const huffman = new HuffmanEncoding();
        const frequencies = huffman.getFrequencies("abracadabra");
        expect(frequencies).toMatchObject({
            a: 5,
            b: 2,
            r: 2,
            c: 1,
            d: 1,
        });
    });
    it("builds a tree from frequencies", () => {
        const huffman = new HuffmanEncoding();
        const frequencies = {
            a: 5,
            b: 2,
            r: 2,
            c: 1,
            d: 1,
        };
        const tree = huffman.treeFromFrequencies(frequencies);
        const depthOfA = depth(tree, "a");
        const depthOfB = depth(tree, "b");
        const depthOfR = depth(tree, "r");
        const depthOfC = depth(tree, "c");
        const depthOfD = depth(tree, "d");
        expect(depthOfA).toBe(1);
        expect(depthOfB + depthOfR).toBe(5); // 2 + 3, doesn't matter which is which
        expect(depthOfC).toBe(4);
        expect(depthOfD).toBe(4);
    });
    it("builds codes from tree", () => {
        const huffman = new HuffmanEncoding();
        const tree: THuffmanTree = [
            ["a", "b"],
            ["c", "d"],
        ];
        const codes = huffman.codesFromTree(tree);
        expect(codes).toMatchObject({
            a: [0, 2],
            b: [1, 2],
            c: [2, 2],
            d: [3, 2],
        });
        const tree2: THuffmanTree = [
            ["a", ["b", ["c", ["d", ["e", ["f", "g"]]]]]],
            ["h", ["i", ["j", ["k", ["l", ["m", "n"]]]]]],
        ];
        const codes2 = huffman.codesFromTree(tree2);
        expect(codes2).toMatchObject({
            a: [0, 2],
            b: [2, 3],
            c: [6, 4],
            d: [14, 5],
            e: [30, 6],
            f: [62, 7],
            g: [63, 7],
            h: [2, 2],
            i: [6, 3],
            j: [14, 4],
            k: [30, 5],
            l: [62, 6],
            m: [126, 7],
            n: [127, 7],
        });
    });
    it("encodes a string", () => {
        const huffman = new HuffmanEncoding();
        const text = "aaabca";
        const codes: IHuffmanCodes = {
            a: [0, 1],
            b: [2, 2],
            c: [3, 2],
        };
        const { compressed, skipLast } = huffman.encodeString(text, codes);

        expect(compressed).toBe(String.fromCharCode(0b0_0_0_10_11_0_00000000));
        expect(skipLast).toBe(8);
    });
    it("decodes a string", () => {
        const huffman = new HuffmanEncoding();
        const compressed = String.fromCharCode(0b0_0_0_10_11_0_00000000);
        const codes: IHuffmanCodes = {
            a: [0, 1],
            b: [2, 2],
            c: [3, 2],
        };
        const skipLast = 8;
        const text = huffman.decodeString(compressed, huffman.treeFromCodes(codes), skipLast);
        expect(text).toBe("aaabca");
    });
    it("encodes and decodes a string", () => {
        const huffman = new HuffmanEncoding();
        const text = "Lorem ipsum dolor sit amet";
        const { compressed, codes, skipLast } = huffman.encode(text);
        const decoded = huffman.decode(compressed, codes, skipLast);
        expect(decoded).toBe(text);
    });
    it("encodes and decodes a string with a single character", () => {
        const huffman = new HuffmanEncoding();
        const text = "aaaaaaaaaaaaaaaaaa";
        const { compressed, codes, skipLast } = huffman.encode(text);
        const decoded = huffman.decode(compressed, codes, skipLast);
        expect(decoded).toBe(text);
    });
    it("encodes and decodes an empty string", () => {
        const huffman = new HuffmanEncoding();
        const text = "";
        const { compressed, codes, skipLast } = huffman.encode(text);
        const decoded = huffman.decode(compressed, codes, skipLast);
        expect(decoded).toBe(text);
    });
    it("encodes and decodes a string with a lot of characters", () => {
        const alphabet = "abcdefghijklmnopqrstuvwxyz";
        let text = alphabet
            .split("")
            .map((char, index) => char.repeat(index + 1))
            .join("");
        text += text.toUpperCase();
        const huffman = new HuffmanEncoding();
        const { compressed, codes, skipLast } = huffman.encode(text);
        const decoded = huffman.decode(compressed, codes, skipLast);
        expect(decoded).toBe(text);
    });
    it("encodes and decodes a string with unicode characters", () => {
        const huffman = new HuffmanEncoding();
        const text = `\u24DC\u27C1\u2CE1\u2F33\u2A6C\u27B4\u238D\u265C\u2519\u258B\u2EA3\u2419\u2B50\u2872\u2F53\u208D\u28F3\u2EBB\u23A1\u2392\u26DF\u2456\u2A29\u2CC9\u2C56\u2F33\u2F3E\u2618\u245E\u22B9\u2C44\u2267\u2C4D\u2291\u2B2F\u2146\u20E6\u27B6\u2805\u26D9\u2716\u22D2\u2EEE\u2B4B\u25EA\u2E4F\u2F4E\u21D7\u204A\u2165\u2B84\u2E69\u288F\u25BD\u2BB0\u25F9\u2674\u2913\u2A4E\u2267\u2FF4\u29D7\u2117\u24BC\u231C\u2FB6\u24CD\u2D66\u2DAA\u2091\u26B7\u2D4C\u2BF5\u2195\u2527\u2281\u2C34\u2F7B\u2CE8\u244D\u2259\u234F\u2C55\u2055\u281B\u2940\u2843\u207D\u2961\u249D\u26C6\u27C5\u293D\u269C\u2044\u2155\u20C8\u25B7\u2B8A\u221A`;
        // ⓜ⟁ⳡ⼳⩬➴⎍♜┙▋⺣␙⭐⡲⽓₍⣳⺻⎡⎒⛟⑖⨩ⳉⱖ⼳⼾☘⑞⊹ⱄ≧ⱍ⊑⬯ⅆ ⃦➶⠅⛙✖⋒⻮⭋◪⹏⽎⇗⁊Ⅵ⮄⹩⢏▽⮰◹♴⤓⩎≧⿴⧗℗Ⓖ⌜⾶Ⓧⵦⶪₑ⚷ⵌ⯵↕┧⊁ⰴ⽻⳨⑍≙⍏ⱕ⁕⠛⥀⡃⁽⥡⒝⛆⟅⤽⚜⁄⅕⃈▷⮊√
        const { compressed, codes, skipLast } = huffman.encode(text);
        const decoded = huffman.decode(compressed, codes, skipLast);
        expect(decoded).toBe(text);
    });
});
