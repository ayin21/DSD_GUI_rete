import Rete from "rete";
import ConnectionPlugin from "rete-connection-plugin";
import VueRenderPlugin from "rete-vue-render-plugin";
import AutoArrangePlugin from "rete-auto-arrange-plugin";

import headBehaviour from "./head-behaviour.json" assert { type: "json" };
import bodyBehavior from "./body-behaviour.json" assert {type: "json"};
import { ActionComponent, DecisionComponent, SequenceComponent } from "./components";

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
      createActionNode(result.name,parentNode.outputs.get(option));
    }
    if (result.type == "sequence"){
      const elements = result.action_sequence.map((element) => element.name);
      const sequenceNode = await sequenceComponent.createNode({elements, name: `${option}_sequence`});
      editor.addNode(sequenceNode);
      editor.connect(parentNode.outputs.get(option), sequenceNode.inputs.get("sequenceInput"));
      result.action_sequence.forEach((element, index) => {
        createActionNode(element.name, sequenceNode.outputs.get(element.name+index));
      });
    }
  }

  return parentNode;
}

async function createActionNode(name, parentOutput){
  const actionNode = await actionComponent.createNode({name});
      editor.addNode(actionNode);
      editor.connect(parentOutput, actionNode.inputs.get("actionInput"));
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
const sequenceComponent = new SequenceComponent();
editor.register(actionComponent);
engine.register(actionComponent);
editor.register(decisionComponent);
engine.register(decisionComponent);
editor.register(sequenceComponent);
engine.register(sequenceComponent);

// createNodes().then((nodes) => {
// nodes.forEach((node) => editor.addNode(node));
// });
buildDecisionNode(bodyBehavior).then((node)=>editor.trigger('arrange',{node}));
editor.trigger("arrange");

console.log(headBehaviour);
