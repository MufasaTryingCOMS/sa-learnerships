const pageState = document.getElementById('page-state');
const pageContainer = document.getElementById('page-container');
const opportunities = document.getElementById('opportunities');

const getOpportunityElement = (title, location, closingDate) => {
    if (!location) location = 'Not provided';

    return `<li>
        <h3>${title}</h3>
        <section class="opportunity-details">
            <section>
                <p><b>Location:</b> ${location}<p>
                <p><b>Closes:</b> ${closingDate.slice(0, 10)}</p>
            </section>
            <section>
                <button class="approve-btn">Approve</button>
                <button class="remove-btn">Remove</button>
            </section>
        </section>
    </li>`;
};

document.addEventListener('DOMContentLoaded', async () => {
    try {
        pageState.style.display = 'flex';
        pageState.innerHTML = '<p>Loading...</p>';

        const response = await fetch('http://localhost:3000/opportunities?status=Pending', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        const data = await response.json();

        if (response.ok) {
            pageContainer.style.display = 'block';
            data.opportunities.forEach(({ title, location, closingDate }) => {
                opportunities.innerHTML += getOpportunityElement(title, location, closingDate);
            });
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
