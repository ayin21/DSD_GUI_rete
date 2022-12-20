import Rete from "rete";
import ConnectionPlugin from "rete-connection-plugin";
import VueRenderPlugin from "rete-vue-render-plugin";
import AutoArrangePlugin from "rete-auto-arrange-plugin";

import headBehaviour from "./head-behaviour.json" assert { type: "json" };
import { DecisionComponent } from "./num-component";


async function buildDecisionNode(decision) {
  const options = decision.options.map(({ option }) => option);
  const parentNode = await decisionComponent.createNode({ options });
  editor.addNode(parentNode);

  for (const { option, result } of decision.options) {
    if (result.type == "decision") {
      const node = await buildDecisionNode(result);

      editor.connect(parentNode.outputs.get(option), node.inputs.get("decisionInput"))
    }
  }

  return parentNode;
}


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
buildDecisionNode(headBehaviour);
editor.trigger("arrange");

console.log(headBehaviour);
