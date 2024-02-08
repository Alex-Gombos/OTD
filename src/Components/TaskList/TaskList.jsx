const TaskList = ({task}) => {
    const {id, taskName, taskDescription} = task;

return (
        <div className="task" id= {`${id}`}>
            <h3>{`${taskName}`}</h3>
            <h4>{`${taskDescription}`}</h4>
        </div>
    );
};

export default TaskList;