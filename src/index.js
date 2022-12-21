import Rete from "rete";
import ConnectionPlugin from "rete-connection-plugin";
import VueRenderPlugin from "rete-vue-render-plugin";
import AutoArrangePlugin from "rete-auto-arrange-plugin";

import headBehaviour from "./head-behaviour.json" assert { type: "json" };
import { ActionComponent, DecisionComponent } from "./components";

/*

*/
async function buildDecisionNode(decision) {
  const options = decision.options.map(({ option }) => option); // Array of direct children
  const parentNode = await decisionComponent.createNode({ options, name: decision.name }); // root node created with options as outputs
  editor.addNode(parentNode); // parent node added

  for (const { option, result } of decision.options) {
    if (result.type == "decision") {
      const node = await buildDecisionNode(result); // recursion with decision child nodes

      editor.connect(parentNode.outputs.get(option), node.inputs.get("decisionInput")) // parent-child connection
    }
    if (result.type == "action") {
      const actionNode = await actionComponent.createNode({name: result.name});
      editor.addNode(actionNode);
      editor.connect(parentNode.outputs.get(option), actionNode.inputs.get("decisionInput"));
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
  margin: { x: 200, y: 50 },
  offset: { x: 100, y: 50 },
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
const actionComponent = new ActionComponent();
editor.register(actionComponent);
engine.register(actionComponent);
editor.register(decisionComponent);
engine.register(decisionComponent);

// createNodes().then((nodes) => {
// nodes.forEach((node) => editor.addNode(node));
// });
buildDecisionNode(headBehaviour).then((node)=>editor.trigger('arrange',{node}));
editor.trigger("arrange");

console.log(headBehaviour);
