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

/* A simple TextField that only allows numerical input */

import React, {Component} from 'react';
import Edge from "./Edge";

interface GridSizePickerProps {
    value: string;                    // text to display in the text area
    onChange(newSize: number): void;  // called when a new size is picked
    edgeList: Edge[];
}

class GridSizePicker extends Component<GridSizePickerProps> {

    onInputChange = (event: any) => {
        // Every event handler with JS can optionally take a single parameter that
        // is an "event" object - contains information about an event. For mouse clicks,
        // it'll tell you thinks like what x/y coordinates the click was at. For text
        // box updates, it'll tell you the new contents of the text box, like we're using
        // below.
        //
        // We wrote "any" here because the type of this object is long and complex.
        // If you're curious, the exact type would be: React.ChangeEvent<HTMLInputElement>
        //
        const newSize: number = parseInt(event.target.value);
        if (newSize <= this.maxCoordinate()) {
            alert("Cannot draw edges, grid must be at least size " + (this.maxCoordinate() + 1));
            return;
        }
        if (newSize < 0 || newSize > 100) {
            alert("Size must be an integer between 0 and 100 (inclusive).");
        }
        this.props.onChange(newSize); // Tell our parent component about the new size.
    };

    maxCoordinate = (): number => {
        let max = 0;
        for (let edge of this.props.edgeList) {
          let max1 = Math.max(edge.coordinate1[0], edge.coordinate1[1]);
          let max2 = Math.max(edge.coordinate2[0], edge.coordinate2[1]);
          let max3 = Math.max(max1, max2);
          if (max < max3) {
              max = max3;
          }
        }
        return max;
    };

    render() {
        return (
            <div id="grid-size-picker">
                <label>
                    Grid Size:
                    <input
                        value={this.props.value}
                        onChange={this.onInputChange}
                        type="number"
                        min={1}
                        max={100}
                    />
                </label>
            </div>
        );
    }
}

export default GridSizePicker;
