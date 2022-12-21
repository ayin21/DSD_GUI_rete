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

    // const input = new Input("BALL_MODE", "BALL_MODE", this.socket);
    // node.addInput(input);
    // console.log(node.data.parentNode);
  }

  worker(node, inputs, outputs) {}
}

export class ActionComponent extends Component {
  constructor() {
    const type = "Action";
    super(type);
  }

  builder(node) {
    const input = new Input("decisionInput", node.data.name, generalSocket);
    node.addInput(input);
    console.log(node.data)
  }

  worker(node, inputs, outputs) {}
}


export class NumComponent extends Component {
  constructor(socket) {
    super("Number");
    this.socket = socket;
  }

  builder(node) {
    const out = new Output("num", "Number", this.socket);
    node.addOutput(out);
    const input = new Input("num2", "Number", this.socket);
    node.addInput(input);
  }

  worker(node, inputs, outputs) {
    outputs["num"] = node.data.num;
    inputs["num2"] = node.data.num2;
  }
}

export class BoolComponent extends Component {
  constructor(socket) {
    super("Boolean");
    this.socket = socket;
  }

  builder(node) {
    const out = new Output("bool", "Boolean", this.socket);
    node.addOutput(out);
    const input = new Input("bool2", "Boolean", this.socket);
    node.addInput(input);
    const out2 = new Output("bool3", "Boolean", this.socket);
    node.addOutput(out2);
  }

  worker(node, inputs, outputs) {
    outputs["bool"] = node.data.num;
    outputs["bool3"] = node.data.num3;
    inputs["bool2"] = node.data.num2;
  }
}
