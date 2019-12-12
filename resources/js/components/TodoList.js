import React, {Component} from 'react'

class TodoList extends Component{
    render(){
        return (
            <div className="todoList">
                <form onSubmit={(e) => this.props.handleSubmit(e)}>
                    <input
                        placeholder="Add task"
                        value={this.props.inputValue}
                        onChange={(e) => this.props.handleChange(e)}
                    />
                    <button type="submit">Add Task</button>
                </form>
            </div>
        )
    }
}

export default TodoList
