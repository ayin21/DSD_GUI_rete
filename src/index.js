import Rete from "rete";
import ConnectionPlugin from "rete-connection-plugin";
import VueRenderPlugin from "rete-vue-render-plugin";
import AutoArrangePlugin from "rete-auto-arrange-plugin";

import headBehaviour from "./head-behaviour.json" assert { type: "json" };
import { DecisionComponent } from "./num-component";

async function buildChildDecisionNode(childDecision, parentNode) {
  const options = childDecision.options.map(({ option, result }) => option);
  const node = await decisionComponent.createNode({ options, parentNode });
  editor.addNode(node);
  return node;
}

async function buildRootDecisionNode() {
  const options = headBehaviour.options.map(({ option }) => option);
  const node = await decisionComponent.createNode({ options });

  const children = headBehaviour.options.map(({ result }) => {
    if (result.type == "decision") {
      return buildChildDecisionNode(result, node);
    }
  });

  editor.addNode(node);
}

// async function createNodes() {
// const n1 = await numComponent.createNode({ num: 2 });
// const n2 = await numComponent.createNode({ num: 8 });
// const n3 = await boolComponent.createNode({ bool: true });
// return [n1, n2, n3];
// return [await buildRootDecisionNode()];
// }

const container = document.querySelector("#rete");
const editor = new Rete.NodeEditor("rete-dsd@0.0.1", container);
const engine = new Rete.Engine("rete-dsd@0.0.1");

editor.use(ConnectionPlugin);
editor.use(VueRenderPlugin);
editor.use(AutoArrangePlugin, {
  margin: { x: 50, y: 50 },
  offset: { x: 50, y: 50 },
});
editor.view.resize();

editor.on(
  "process nodecreated noderemoved connectioncreated connectionremoved",
  async () => {
    await engine.abort();
    await engine.process(editor.toJSON());
  }
);

// const numSocket = new Rete.Socket("Number value");
// const boolSocket = new Rete.Socket("Boolean value");
// const numComponent = new NumComponent(numSocket);
// const boolComponent = new BoolComponent(boolSocket);
// editor.register(boolComponent);
// engine.register(numComponent);
// editor.register(numComponent);
// engine.register(boolComponent);

const decisionComponent = new DecisionComponent();
editor.register(decisionComponent);
engine.register(decisionComponent);

// createNodes().then((nodes) => {
// nodes.forEach((node) => editor.addNode(node));
// });
buildRootDecisionNode();
editor.trigger("arrange");

console.log(headBehaviour);
