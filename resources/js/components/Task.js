import React, {Component} from 'react'

class Task extends Component{
    render(){
        return (
            <div className="task">
                <span style={{ textDecoration: this.props.todo.done ? 'Line-through' : 'none' }}>
                    { this.props.todo.value }
                </span>
                <button onClick={(e) => this.props.handleChanged(this.props.index)}>
                    { this.props.todo.done ? 'Undo' : 'Complete'}
                </button>
                <button onClick={() => this.props.handleRemove(this.props.todo)}>Remove</button>
            </div>
        )
    }
}

export default Task
