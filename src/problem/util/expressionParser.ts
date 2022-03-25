import { MathNode, simplify, OperatorNode } from "mathjs";

const unaryMinusWithOpNode = (root: MathNode) => {
  return root.transform((node) => {
    if (node.type === "OperatorNode" && ["+", "-"].includes(node.op)) {
      const rhs = node.args[1];
      if (rhs.type === "OperatorNode" && ["*", "/"].includes(rhs.op)) {
        const lhsOfRhs = rhs.args[0];
        if (
          lhsOfRhs.type === "OperatorNode" &&
          lhsOfRhs.isUnary &&
          lhsOfRhs.op === "-"
        ) {
          rhs.args[0] = lhsOfRhs.args[0];
          const op = node.op === "+" ? "-" : "+";
          const fn = node.op === "+" ? "subtract" : "add";
          return new OperatorNode(op, fn, node.args, node.implicit);
        }
      }
    }
    return node;
  });
};

const rules = [
  { s: "n+0*n1 -> n" },
  { s: "n-0*n1 -> n" },
  { s: "n+0/n1 -> n" },
  { s: "n-0/n1 -> n" },
  { s: "1*n -> n" },
  { s: "n+-n1 -> n-n1" },
  { s: "n--n1 -> n+n1" },
  unaryMinusWithOpNode, // e.g. n+-n1*n2 -> n-n1*n2
];

export const parse = (expr: string): MathNode => {
  return simplify(expr, rules);
};
