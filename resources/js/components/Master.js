
import React, { Component,  } from 'react'
import ReactDOM from 'react-dom'

export default class Master extends Component{
    state = {
        inputValue: "",
        todos: []
    };

    handleChange = (e) => {
        this.setState({inputValue: e.target.value});
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const newTodo = {
            value: this.state.inputValue,
            done: false
        };

        const todos = this.state.todos;
        todos.push(newTodo);
        this.setState({todos, inputValue: ''})
    }

    handleChanged = (index) => {
        const todos = this.state.todos;
        todos[index].done = !todos[index].done;
        this.setState({todos});
    }

    handleRemove = (todo) => {
        // console.log(todo);
        const todos = this.state.todos;
        todos.splice(todo,1);
        this.setState({todos});
    }

    render = () => {
        return <div>
            <TodoList
                inputValue={this.state.inputValue}
                handleChange={this.handleChange}
                handleSubmit={this.handleSubmit}
            />
            <TodoItem
                todos={this.state.todos}
                handleChanged = {this.handleChanged}
                handleRemove = {this.handleRemove}
            />
        </div>
    }
}
