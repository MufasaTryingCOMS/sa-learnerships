const pageState = document.getElementById('page-state');
const detailsContainer = document.getElementById('details-container');
const pageTitle = document.getElementById('page-title');
const title = document.getElementById('title');
const statusElement = document.getElementById('status');
const descriptionContainer = document.getElementById('description-container');
const description = document.getElementById('description');
const requirements = document.getElementById('requirements');
const stipend = document.getElementById('stipend');
const duration = document.getElementById('duration');
const locationElement = document.getElementById('location');
const closingDate = document.getElementById('closing-date');
const backButton = document.getElementById('back-btn');
const approveButton = document.getElementById('approve-btn');
const rejectButton = document.getElementById('reject-btn');


document.addEventListener('DOMContentLoaded', async () => {
    try {
        pageState.style.display = 'flex';
        pageState.innerHTML = '<p>Loading...</p>';

        // Get the id of the opportunity
        const queryString = window.location.search;
        const params = new URLSearchParams(queryString);
        const id = params.get('id');

        const response = await fetch(`http://localhost:3000/opportunities/${id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        const data = await response.json();

        if (response.ok) {
            detailsContainer.style.display = 'block';

            pageTitle.innerHTML = 'Opportunity | ' + data.title;
            title.innerHTML = data.title;
            statusElement.innerHTML = data.status;
            currentStatus = data.status;

            if (data.status === 'Approved') {
                approveButton.disabled = true;
                rejectButton.disabled = false;
            } else if (data.status === 'Rejected') {
                approveButton.disabled = false;
                rejectButton.disabled = true;
            } else {
                approveButton.disabled = false;
                rejectButton.disabled = false;
            }

            if (data.description) description.innerHTML = data.description;
            else description.innerHTML = 'Not Provided';

            if (data.location) locationElement.innerHTML = data.location;
            else locationElement.innerHTML = 'Not Provided';

            if (data.stipend) stipend.innerHTML = 'R ' + data.stipend + ' pm';
            else stipend.innerHTML = 'Not Provided';

            if (data.duration) duration.innerHTML = data.duration + ' months';
            else duration.innerHTML = 'Not Provided';

            if (data.closingDate) closingDate.innerHTML = data.closingDate.slice(0, 10);
            else closingDate.innerHTML = 'Not Provided';

            data.requirements.forEach((item) => {
                requirements.innerHTML += `<li><p>${item}</p></li>`;
            });
        } else {
            pageState.style.display = 'flex';
            pageState.innerHTML = data.error;
        }
    } catch (error) {
        pageState.style.display = 'flex';
        pageState.innerHTML = '<p>An error occurred! Please try again later</p>';
        console.error('View opportunity error:', error);
    } finally {
        pageState.style.display = 'none';
        pageState.innerHTML = '';
    }
});

approveButton.addEventListener('click', async () => {
    const id = new URLSearchParams(window.location.search).get('id');

    if (currentStatus === 'Approved') {
        alert('This opportunity is already approved');
        return;
    }

    try {

        approveButton.disabled = true;
        approveButton.textContent = 'Approving...';

        const response = await fetch('http://localhost:3000/opportunities/' + id + '/approve', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        });

        const data = await response.json();

        if (response.ok) {
            approveButton.disabled = true;
            approveButton.textContent = 'Approved';
            rejectButton.disabled = false;
            statusElement.innerHTML = 'Approved';
            approveButton.style.cursor = 'not-allowed';
            alert('Opportunity approved successfully!');
        }else {
            approveButton.disabled = false;
            approveButton.textContent = 'Approve';
            alert(data.error);
        }

    } catch (error) {
        approveButton.disabled = false;
        approveButton.textContent = 'Approve';
        alert('Something went wrong! Please try again later');
    }
});

rejectButton.addEventListener('click', async () => {
    const id = new URLSearchParams(window.location.search).get('id');
    
    if (currentStatus === 'Rejected') {
        alert('This opportunity is already rejected');
        return;
    }

    try {
        rejectButton.disabled = true;
        rejectButton.textContent = 'Rejecting...';

        const response = await fetch('http://localhost:3000/opportunities/' + id + '/reject', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        });

        const data = await response.json();

        if (response.ok) {
            rejectButton.disabled = true;
            rejectButton.textContent = 'Rejected';
            approveButton.disabled = false;
            statusElement.innerHTML = 'Rejected';
            currentStatus = 'Rejected';
            rejectButton.style.cursor = 'not-allowed';
            alert('Opportunity rejected successfully!');
        }else {
            rejectButton.disabled = false;
            rejectButton.textContent = 'Reject';
            alert(data.error);
        }

    } catch (error) {
        rejectButton.disabled = false;
        rejectButton.textContent = 'Reject';
        alert('Something went wrong! Please try again later');
    }
});


backButton.addEventListener('click', () => {
    if (currentStatus === 'Approved') {
        window.location.href = '/opportunities/approved.html';
    } else if (currentStatus === 'Rejected') {
        window.location.href = '/opportunities/rejected.html';
    } else {
        window.location.href = '/opportunities/pending.html';
    }
});