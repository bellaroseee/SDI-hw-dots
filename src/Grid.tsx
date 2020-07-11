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

interface GridProps {
    size: number;      // size of the grid to display
    width: number;     // width of the canvas on which to draw
    height: number;    // height of the canvas on which to draw
    edgeList: Edge[];  // list of edges to draw on the canvas
}

interface GridState {
    backgroundImage: any,  // image object rendered into the canvas (once loaded)
}

/**
 *  A simple grid with a variable size
 *
 *  Most of the assignment involves changes to this class
 */
class Grid extends Component<GridProps, GridState> {

    canvasReference: React.RefObject<HTMLCanvasElement>

    constructor(props: GridProps) {
        super(props);
        this.state = {
            backgroundImage: null  // An image object to render into the canvas.
        };
        this.canvasReference = React.createRef();
    }

    componentDidMount() {
        // Since we're saving the image in the state and re-using it any time we
        // redraw the canvas, we only need to load it once, when our component first mounts.
        this.fetchAndSaveImage();
        this.redraw();
    }

    componentDidUpdate() {
        this.redraw()
    }

    fetchAndSaveImage() {
        // Creates an Image object, and sets a callback function
        // for when the image is done loading (it might take a while).
        const background = new Image();
        background.onload = () => {
            const newState = {
                backgroundImage: background
            };
            this.setState(newState);
        };
        // Once our callback is set up, we tell the image what file it should
        // load from. This also triggers the loading process.
        background.src = "./image.jpg";
    }

    redraw = () => {
        if(this.canvasReference.current === null) {
            throw new Error("Unable to access canvas.");
        }
        const ctx = this.canvasReference.current.getContext('2d');
        if (ctx === null) {
            throw new Error("Unable to create canvas drawing context.");
        }

        ctx.clearRect(0, 0, this.props.width, this.props.height);
        // Once the image is done loading, it'll be saved inside our state.
        // Otherwise, we can't draw the image, so skip it.
        if (this.state.backgroundImage !== null) {
            ctx.drawImage(this.state.backgroundImage, 0, 0);
        }
        // Draw all the dots.
        const coordinates = this.getCoordinates();
        for (let coordinate of coordinates) {
            this.drawCircle(ctx, coordinate);
        }
        // draw the points from edgelist
        const edgeList = this.props.edgeList;
        for (let edge of edgeList) {
            this.drawLine(ctx, edge.coordinate1, edge.coordinate2, edge.color);
        }
    };

    /**
     * Returns an array of coordinate pairs that represent all the points where grid dots should
     * be drawn.
     */
    getCoordinates = (): [number, number][] => {
        const gridSize = this.props.size + 1;
        let arr: [number, number][] = [];
        const width = this.props.width / gridSize;
        for (let i = 0; i < gridSize-1; i++) {
            for (let j = 0; j < gridSize-1; j++) {
                const [x, y] = [((i + 1) * width), ((j + 1) * width)];
                arr.push([x,y])
            }
        }
        return arr;
    };

    // You could write CanvasRenderingContext2D as the type for ctx, if you wanted.
    drawCircle = (ctx: any , coordinate: [number, number]) => {
        ctx.fillStyle = "white";
        // Generally use a radius of 4, but when there are lots of dots on the grid (> 50)
        // we slowly scale the radius down so they'll all fit next to each other.
        const radius = Math.min(4, 100 / this.props.size);
        ctx.beginPath();
        ctx.arc(coordinate[0], coordinate[1], radius, 0, 2 * Math.PI);
        ctx.fill();
    };

    drawLine = (ctx: any,  coordinate1: [number, number],  coordinate2: [number, number], color: any) => {
        // default color is set to white
        ctx.strokeStyle = "white";
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        const width = this.props.width / (this.props.size+1);
        ctx.beginPath();
        ctx.moveTo((coordinate1[0]+1)*width, (coordinate1[1]+1)*width);
        ctx.lineTo((coordinate2[0]+1)*width, (coordinate2[1]+1)*width);
        ctx.stroke();
    };

    deleteLine = (ctx: any, coordinate1: [number, number],  coordinate2: [number, number]) => {

    };

    render() {
        return (
            <div id="grid">
                <canvas ref={this.canvasReference} width={this.props.width} height={this.props.height}/>
                <p>Current Grid Size: {(this.props.size) ? this.props.size : 0}
                </p>
            </div>
        );
    }
}

export default Grid;
