import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import Moveable from "react-moveable";
import { Frame } from "scenejs";

const MoveableList = ({list}) => {

    const [frame, setFrame] = useState(
        new Frame({
          width: "250px",
          height: "200px",
          left: "0px",
          top: "0px",
          transform: {
            rotate: "0deg",
            scaleX: 1,
            scaleY: 1,
            matrix3d: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
          },
        }));

    const moveableRef = useRef(null);
    const labelRef = useRef(null);
    const [target, setTarget] = useState(null);
    const [scalable, setScalable] = useState(true);
    const [resizable, setResizable] = useState(false);
    const [warpable, setWarpable] = useState(true);

    const {id, listName, tasks} = list;

    const targetId = `moveable-${id}`;

    const setTransform = (target) => {
        target.style.cssText = frame.toCSS();
    };

    const setLabel = (clientX, clientY, text) => {
        labelRef.current.style.cssText = `
        display: block;
        transform: translate(${clientX}px, ${clientY - 10}px) translate(-100%, -100%) translateZ(-100px);
        `;
        labelRef.current.innerHTML = text;
    };

    const onPinch = ({ clientX, clientY }) => {
        setTimeout(() => {
        setLabel(
            clientX,
            clientY,
            `X: ${frame.get("left")}
            <br/>Y: ${frame.get("top")}
            <br/>W: ${frame.get("width")}
            <br/>H: ${frame.get("height")}
            <br/>S: ${frame.get("transform", "scaleX").toFixed(2)}, ${frame
            .get("transform", "scaleY")
            .toFixed(2)}
            <br/>R: ${parseFloat(frame.get("transform", "rotate")).toFixed(1)}deg
            `
        );
        });
    };

    const onDrag = ({ target, clientX, clientY, top, left, isPinch }) => {
        frame.set("left", `${left}px`);
        frame.set("top", `${top}px`);
        setTransform(target);
        if (!isPinch) {
        setLabel(clientX, clientY, `X: ${left}px<br/>Y: ${top}px`);
        }
    };

    const onScale = ({ target, delta, clientX, clientY, isPinch }) => {
        const scaleX = frame.get("transform", "scaleX") * delta[0];
        const scaleY = frame.get("transform", "scaleY") * delta[1];
        frame.set("transform", "scaleX", scaleX);
        frame.set("transform", "scaleY", scaleY);
        setTransform(target);
        if (!isPinch) {
        setLabel(
            clientX,
            clientY,
            `S: ${scaleX.toFixed(2)}, ${scaleY.toFixed(2)}`
        );
        }
    };

    const onRotate = ({ target, clientX, clientY, beforeDelta, isPinch }) => {
        const deg = parseFloat(frame.get("transform", "rotate")) + beforeDelta;

        frame.set("transform", "rotate", `${deg}deg`);
        setTransform(target);
        if (!isPinch) {
        setLabel(clientX, clientY, `R: ${deg.toFixed(1)}`);
        }
    };

    const onResize = ({ target, clientX, clientY, width, height, isPinch }) => {
        frame.set("width", `${width}px`);
        frame.set("height", `${height}px`);
        setTransform(target);
        if (!isPinch) {
        setLabel(clientX, clientY, `W: ${width}px<br/>H: ${height}px`);
        }
    };

    const onWarp = ({ target, clientX, clientY, delta, multiply }) => {
        frame.set(
        "transform",
        "matrix3d",
        multiply(frame.get("transform", "matrix3d"), delta)
        );
        setTransform(target);
        setLabel(clientX, clientY, `X: ${clientX}px<br/>Y: ${clientY}px`);
    };

    const onEnd = () => {
        labelRef.current.style.display = "none";
    };

    const onWindowResize = () => {
        moveableRef.current.updateRect();
        };

        useEffect(() => {
            setTarget(document.getElementById(targetId));
            window.addEventListener("resize", onWindowResize);
          
            return () => {
              window.removeEventListener("resize", onWindowResize);
            };
          }, [targetId]);
    
    return(
        <div className="under-page-main">
            <Moveable
                ref={moveableRef}
                target={target}
                pinchThreshold={20}
                container={document.body}
                draggable={true}
                scalable={scalable}
                resizable={resizable}
                warpable={warpable}
                rotatable={true}
                pinchable={true}
                origin={false}
                throttleDrag={1}
                throttleRotate={0.2}
                throttleResize={1}
                throttleScale={0.01}
                onDrag={onDrag}
                onResize={onResize}
                onScale={onScale}
                onWarp={onWarp}
                onRotate={onRotate}
                onPinch={onPinch}
                onDragEnd={onEnd}
                onScaleEnd={onEnd}
                onResizeEnd={onEnd}
                onWarpEnd={onEnd}
                onRotateEnd={onEnd}
                onPinchEnd={onEnd}
            />
            <div className="container">
            <div className={`moveable`} id={targetId} style={{ zIndex: id, marginLeft: `${id * 100}px` }}>
                <span>
                    <h4>{listName}</h4>
                    <div className="task-list-container">
                    {tasks.map((task) => (
                        <div key={task.taskId}>
                            {/* Render task properties */}
                            <div className="task">{task.taskName}</div>
                        </div>
                    ))}
                    </div>
                </span>
                </div>
            </div>
            <div className="label" id={id} ref={labelRef} />
        </div>
    );
};

export default MoveableList;