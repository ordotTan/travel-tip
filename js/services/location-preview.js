
export class TodoPreview {
    constructor(location){
        this.location = location;
    }
    render() {
        const location = this.location;

        var elLocation = document.createElement('tr');
        // elTodo.addEventListener('click', ()=>{
        //     console.log('LI CLICKED', todo.id);
        //     this.onTodoClicked(todo.id)
        // })
        
        var elBtnDelete = document.createElement('button');
        elBtnDelete.classList.add('btn-delete');
        elBtnDelete.innerHTML = '&times'
        elBtnDelete.addEventListener('click', (ev)=>{
            console.log('Hey', todo.id);
            this.onDeleteTodo(location.id, ev)
        })

        elTodo.appendChild(elBtnDelete)
        var elP = document.createElement('p');
        elP.innerText = todo.txt;
        elTodo.appendChild(elP)
        return elTodo;
    }
}