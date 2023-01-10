import { Component, Input, Output, Socket } from "rete";
import { generalSocket } from "./sockets";

export class DecisionComponent extends Component {
  constructor() {
    const type = "Decision";
    super(type);
  }

  builder(node) {
    const input = new Input("decisionInput", node.data.name, generalSocket);
    node.addInput(input);

    node.data.options.forEach((option) => {
      const output = new Output(option, option, generalSocket);
      node.addOutput(output);

    });
  }

  worker(node, inputs, outputs) {}
}

export class ActionComponent extends Component {
  constructor() {
    const type = "Action";
    super(type);
  }

  builder(node) {
    const input = new Input("actionInput", node.data.name, generalSocket);
    node.addInput(input);
  }

  worker(node, inputs, outputs) { }
}

export class SequenceComponent extends Component {
  constructor() {
    const type = "Sequence";
    super(type);
  }

  builder(node) {
    const input = new Input("sequenceInput", node.data.name, generalSocket);
    node.addInput(input);

    node.data.elements.forEach((element, index) => {
      const output = new Output(element + index, element, generalSocket);
      node.addOutput(output);

    });
  }
  worker(node, inputs, outputs) { }
}