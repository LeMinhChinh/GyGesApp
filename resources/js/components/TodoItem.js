import React, {Component} from 'react'

import Task from './Task'

class TodoItem extends Component{

    render(){
        return (
            <div className="todoItem">
                { this.props.todos.map((todo, index) => {
                    return (
                        <Task
                            key = {index}
                            todo = {todo}
                            index = {index}
                            handleChanged = {this.props.handleChanged}
                            handleRemove = {this.props.handleRemove}
                        />
                    )
                })}
            </div>
        )
    }
}

export default TodoItem
