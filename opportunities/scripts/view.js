const pageState = document.getElementById('page-state');
const detailsContainer = document.getElementById('details-container');
const title = document.getElementById('title');
const statusElement = document.getElementById('status');
const descriptionContainer = document.getElementById('description-container');
const description = document.getElementById('description');
const requirements = document.getElementById('requirements');
const stipend = document.getElementById('stipend');
const duration = document.getElementById('duration');
const locationElement = document.getElementById('location');
const closingDate = document.getElementById('closing-date');

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
            title.innerHTML = data.title;
            statusElement.innerHTML = data.status;

            if (data.description) {
                descriptionContainer.style.display = 'block';
                description.innerHTML = data.description;
            }

            if (data.location) locationElement.innerHTML = data.location;
            if (data.stipend) stipend.innerHTML = 'R ' + data.stipend + ' pm';
            if (data.duration) duration.innerHTML = data.duration + ' months';
            if (data.closingDate) closingDate.innerHTML = data.closingDate;
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
