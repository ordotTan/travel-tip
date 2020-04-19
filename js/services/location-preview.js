
class LocationPreview {
    constructor(location, onDeleteLocation, onGoToLocation){
        this.location = location;
        this.onDeleteLocation = onDeleteLocation;
        this.onGoToLocation = onGoToLocation;
    }
    render() {
        const location = this.location;
        var elLocation = document.createElement('tr');

            var elTdId = document.createElement('td');
            elTdId.innerText = location.id;
            elLocation.appendChild(elTdId);
        
            var elTdInfo = document.createElement('td');
            elTdInfo.innerText = location.address;
            elLocation.appendChild(elTdInfo);

            var elTdActions = document.createElement('td');
        
                var elBtnDelete = document.createElement('button');
                elBtnDelete.classList.add('btn-delete');
                elBtnDelete.innerHTML = 'Delete';
                elBtnDelete.addEventListener('click', (ev)=>{
                console.log('Hey', location.id);
                this.onDeleteLocation(location.id, ev)
                })
                elTdActions.appendChild(elBtnDelete);

                var elBtnGoTo = document.createElement('button');
                elBtnGoTo.classList.add('btn-go-to');
                elBtnGoTo.innerHTML = 'Go to';
                elBtnGoTo.addEventListener('click', (ev)=>{
                this.onGoToLocation(location.position)
                })
                elTdActions.appendChild(elBtnGoTo);

            elLocation.appendChild(elTdActions)
            
        return elLocation;
    }
}