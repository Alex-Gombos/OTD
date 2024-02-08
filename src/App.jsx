import React, { useEffect, useRef, useState } from "react";
import './App.css'
import TaskList from './Components/TaskList/taskList';
import "./Components/TaskList/TaskList.css"
import { Frame } from "scenejs";
import MoveableList from './Components/MoveableLists/MoveableList';

function App() {
  const lists = [
    {
      id: 1,
      listName: "School",
      tasks: [
        {
          taskId: 1,
          taskName: "task1"
        },
        {
          taskId: 2,
          taskName: "task2"
        }
      ]
    },
    {
      id: 2,
      listName: "Work",
      tasks: [] // You can add tasks for the "Work" list here
    },
    {
      id: 3,
      listName: "Home",
      tasks: [] // You can add tasks for the "Home" list here
    }
  ];
  

  return (

    <div className="simple-container">

        {lists.map((list)=>(
          <MoveableList
          list={list}
          />
        ))}
    </div>
  );
}

export default App;
