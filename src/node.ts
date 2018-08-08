export interface TreeNode {
    nw: TreeNode;
    ne: TreeNode;
    sw: TreeNode;
    se: TreeNode;
    population: number;
    level: number;
}

export function createNode(
    nw: TreeNode,
    ne: TreeNode,
    sw: TreeNode,
    se: TreeNode,
): TreeNode {
    const level = nw.level + 1;
    const population = nw.population + ne.population + sw.population + se.population;
    return {level, nw, ne, sw, se, population};
}

const stub = {} as TreeNode;

export function createLeaf(population: number): TreeNode {
    return {
        level: 0,
        population,
        nw: stub,
        ne: stub,
        sw: stub,
        se: stub,
    };
}

export function setBit(node: TreeNode, x: number, y: number, bit: number): TreeNode {
    const {level, nw, ne, sw, se} = node;

    if (level === 0) {
        return createLeaf(bit);
    }

    const offset = 2 ** (level - 2);

    if (x < 0) {
        if (y < 0) {
            return createNode(setBit(nw, x + offset, y + offset, bit), ne, sw, se);
        } else {
            return createNode(nw, ne, setBit(node.sw, x + offset, y - offset, bit), se);
        }
    } else {
        if (y < 0) {
            return createNode(nw, setBit(node.ne, x - offset, y + offset, bit), sw, se);
        } else {
            return createNode(nw, ne, sw, setBit(node.se, x - offset, y - offset, bit));
        }
    }
}

export function getBit(node: TreeNode, x: number, y: number): number {
    if (node.level === 0) {
        return node.population;
    }

    const offset = 2 ** (node.level - 2);

    if (x < 0) {
        if (y < 0) {
            return getBit(node.nw, x + offset, y + offset);
        } else {
            return getBit(node.sw, x + offset, y - offset);
        }
    } else {
        if (y < 0) {
            return getBit(node.ne, x - offset, y + offset);
        } else {
            return getBit(node.se, x - offset, y - offset);
        }
    }
}

function simulate(node: TreeNode): TreeNode {
    let bits = 0;

    for (let y = -2; y < 2; y++) {
        for (let x = -2; x < 2; x++) {
            bits = (bits << 1) + getBit(node, x, y);
        }
    }

    return createNode(
        bitStep(bits >> 5),
        bitStep(bits >> 4),
        bitStep(bits >> 1),
        bitStep(bits),
    );
}

function bitStep(bitmask: number): TreeNode {
    if (bitmask === 0) {
        return createLeaf(0);
    }

    const self = (bitmask >> 5) & 1;

    bitmask &= 0x757;

    let neighbors = 0;
    while (bitmask !== 0) {
        neighbors++;
        bitmask &= bitmask - 1;
    }

    if (neighbors === 3 || (neighbors === 2 && self !== 0)) {
        return createLeaf(1);
    } else {
        return createLeaf(0);
    }
}

function centeredSubnode(node: TreeNode): TreeNode {
    return createNode(node.nw.se, node.ne.sw, node.sw.ne, node.se.nw);
}

function centeredHorizontal(w: TreeNode, e: TreeNode): TreeNode {
    return createNode(w.ne.se, e.nw.sw, w.se.ne, e.sw.nw);
}

function centeredVertical(n: TreeNode, s: TreeNode): TreeNode {
    return createNode(n.sw.se, n.se.sw, s.nw.ne, s.ne.nw);
}

function centeredSubSubnode(node: TreeNode): TreeNode {
    return createNode(node.nw.se.se, node.ne.sw.sw, node.sw.ne.ne, node.se.nw.nw);
}

export function step(node: TreeNode): TreeNode {
    const {level, population, nw, ne, sw, se} = node;

    if (population === 0) {
        return nw;
    }

    if (level === 2) {
        return simulate(node);
    }

    const n00 = centeredSubnode(nw);
    const n01 = centeredHorizontal(nw, ne);
    const n02 = centeredSubnode(ne);
    const n10 = centeredVertical(nw, sw);
    const n11 = centeredSubSubnode(node);
    const n12 = centeredVertical(ne, se);
    const n20 = centeredSubnode(sw);
    const n21 = centeredHorizontal(sw, se);
    const n22 = centeredSubnode(se);

    const tnw = step(createNode(n00, n01, n10, n11));
    const tne = step(createNode(n01, n02, n11, n12));
    const tsw = step(createNode(n10, n11, n20, n21));
    const tse = step(createNode(n11, n12, n21, n22));

    return createNode(tnw, tne, tsw, tse);
}

export function emptyTree(level: number): TreeNode {
    if (level === 0) {
        return createLeaf(0);
    }

    const node = emptyTree(level - 1);
    return createNode(node, node, node, node);
}

export function expand(node: TreeNode): TreeNode {
    const border = emptyTree(node.level - 1);
    const tnw = createNode(border, border, border, node.nw);
    const tne = createNode(border, border, node.ne, border);
    const tsw = createNode(border, node.sw, border, border);
    const tse = createNode(node.se, border, border, border);
    return createNode(tnw, tne, tsw, tse);
}
