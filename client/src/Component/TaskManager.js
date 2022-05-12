import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { TaskCard } from './TaskCards';

const TaskManager = props => {
  const [task, setTask] = useState('');
  const [date, setDate] = useState('');
  const [taskList, setTaskList] = useState([]);

  useEffect(() => {
    getTaskList();
  }, [props]);

  const onChangeTask = e => setTask(e.target.value);
  const onChangeDate = e => setDate(e.target.value);

  const onDoneClick = () => onDeleteClick;

  const showSignInError = () => <div className="ui red message">Nesesitas logearte primero !</div>

  const onSubmitClick = () => {
    const { userId } = props;
    axios
      .post(`http://localhost:4000/addtask`, {
        task,
        userId,
        date,
      })
      .then(() => {
        getTaskList();
        setDate('');
        setTask('');
      });
  };

  const getTaskList = () => {
    axios
      .get(`http://localhost:4000/tasks/${props.userId}`)
      .then((respose) => respose.data)
      .then((respose) => setTaskList(respose));
  };



  const onDeleteClick = taskid => {
    axios
      .delete(`http://localhost:4000/task/${taskid}`, {
        method: 'DELETE',
      })
      .then(() => getTaskList()); 
  };

  const { isSignedIn, userName } = props;

  return !isSignedIn ? (
    showSignInError()
  ) : (
    <div>
      <h3 style={{ padding: `20px` }}>
        Hola! 
        <span style={{ color: `#6185d3` }}> {userName}</span>! Añade tus tareas del dia
      </h3>
      <div className="ui input"> 
      <input
          type="text"
          value={date}
          onChange={(e) => onChangeDate(e)}
          placeholder="fecha..."
        ></input>
        <input
          type="text"
          value={task}
          onChange={(e) => onChangeTask(e)}
          placeholder="Tarea..."
        ></input>
      </div>
      <button
        className="ui primary basic button"
        onClick={() => onSubmitClick()}
      >
        Submit
      </button>
      <TaskCard
        onChangeTask={onChangeTask}
        onChangeDate={onChangeDate}
        onDeleteClick={onDeleteClick}
        onSubmitClick={onSubmitClick}
        taskList={taskList}
        task={task}
        date={date}
        onDoneClick={onDoneClick}
      />
    </div>
  );
};

const mapStateToProps = ({ auth }) => {
  return {
    isSignedIn: auth.isSignedIn,
    userId: auth.userId,
    userName: auth.userName,
  };
};

export default connect(mapStateToProps)(TaskManager);
