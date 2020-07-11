/*
 * Copyright (C) 2020 Kevin Zatloukal.  All rights reserved.  Permission is
 * hereby granted to students registered for University of Washington
 * CSE 331 for use solely during Spring Quarter 2020 for purposes of
 * the course.  No other use, copying, distribution, or modification
 * is permitted without prior written consent. Copyrights for
 * third-party components of this work must be honored.  Instructors
 * interested in reusing these course materials should contact the
 * author.
 */

import React, {Component} from 'react';
import Edge from "./Edge";

interface EdgeListProps {
    gridSize: number;
    onChange(edges: any): void;  // called when a new edge list is ready
}

interface EdgeListState {
    values: string;
    edgeList: Edge[];
}

/**
 * A Textfield that allows the user to enter the list of edges.
 * Also contains the buttons that the user will use to interact with the app.
 */
class EdgeList extends Component<EdgeListProps, EdgeListState> {

    constructor(props: EdgeListProps) {
        super(props);
        this.state = {
            values: "",
            edgeList: [],
        };
    }

    onInputChange = (event: any) => {
        const newValues = event.target.value;
        this.setState({
            values: newValues,
        });
    };

    draw = () => {
        let alertMsg: string = '';
        let flag: boolean = true;
        if (this.state.values.length === 0) {
            return;
        }
        const inputList = this.state.values.split('\n');
        for (let line of inputList) {
            let containsNeg: boolean = false;
            let isNaN: boolean = false;
            if (line.length === 0) {
                continue;
            }
            const compartments = line.split(' ');
            if (compartments.length !== 3) {
                alertMsg = alertMsg.concat("Line " + (inputList.indexOf(line) + 1) + ": Missing a portion of the line, or missing a space.\n");
                flag = false;
                continue;
            }
            if (compartments.length > 3) {
                alertMsg = alertMsg.concat("Line " + (inputList.indexOf(line) + 1) + ": Extra portion of the line, or an extra space.\n");
                flag = false;
                continue;
            }
            if (!parseInt(compartments[0]) && parseInt(compartments[0]) !== 0) {
                alertMsg = alertMsg.concat("Line " + (inputList.indexOf(line) + 1) + ": Wrong number of l4 to the first coordinate\n");
                flag = false;
                continue;
            } else if (!parseInt(compartments[1]) && parseInt(compartments[1]) !== 0) {
                alertMsg = alertMsg.concat("Line " + (inputList.indexOf(line) + 1) + ": Wrong number of l4 to the second coordinate\n");
                flag = false;
                continue;
            }

            let edge = new Edge();
            let p = compartments[0].split(',');
            let coordinate: [number, number] = [0,0];
            if (p.length === 2) {
                coordinate.pop();
                coordinate.pop();
                for (let c of p) {
                    if (!Number.isInteger(Number(c)) && !isNaN) {
                        alertMsg = alertMsg.concat("Line " + (inputList.indexOf(line) + 1) + ": Wrong number of l4 to the first coordinate\n");
                        flag = false;
                        isNaN = true;
                        continue;
                    }
                    let temp = parseInt(c);
                    if (temp < 0 && !containsNeg) {
                        alertMsg = alertMsg.concat("Line " + (inputList.indexOf(line) + 1) + ": Coordinate(s) contain negative value(s)\n");
                        flag = false;
                        containsNeg = true;
                        continue;
                    }
                    if (temp > this.props.gridSize - 1) {
                        alert("Cannot draw edges, grid must be at least " + (temp + 1) + ".\n");
                        return;
                    }
                    coordinate.push(temp);
                }
            }
            edge.coordinate1 = coordinate;
            p = compartments[1].split(',');
            coordinate = [0, 0];
            if (p.length === 2) {
                coordinate.pop();
                coordinate.pop();
                for (let c of p) {
                    if (!Number.isInteger(Number(c)) && !isNaN) {
                        alertMsg = alertMsg.concat("Line " + (inputList.indexOf(line) + 1) + ": Wrong number of l4 to the second coordinate\n");
                        flag = false;
                        isNaN = true;
                        continue;
                    }
                    let temp = parseInt(c);
                    if (temp < 0 && !containsNeg) {
                        alertMsg = alertMsg.concat("Line " + (inputList.indexOf(line) + 1) + ": Coordinate(s) contain negative value(s)\n");
                        flag = false;
                        containsNeg = true;
                        continue;
                    }
                    if (temp > this.props.gridSize - 1) {
                        alert("Cannot draw edges, grid must be at least " + (temp + 1) + ".\n");
                        return;
                    }
                    coordinate.push(temp);
                }
            }
            edge.coordinate2 = coordinate;
            edge.color = compartments[2];
            this.state.edgeList.push(edge);
        }
        if (!flag) {
            let str: string = "There was an error with some of your line input.\n" +
                "For reference, the correct form for each line is: x1,y1 x2,y2 color\n\n";
            alert(str.concat(alertMsg));
            return;
        }
        this.props.onChange(this.state.edgeList);
    };

    clear = () => {
      const newEdgelist: Edge[] = [];
      this.setState({
          edgeList: newEdgelist,
          values: '',
      });
    };

    render() {
        return (
            <div id="edge-list">
                Edges <br/>
                <textarea
                    rows={5}
                    cols={30}
                    onChange={this.onInputChange}
                    value={this.state.values}
                /> <br/>
                <button onClick={this.draw}>Draw</button>
                <button onClick={this.clear}>Clear</button>
            </div>
        );
    }
}

export default EdgeList;
