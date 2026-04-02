const getOpportunityElement = (title, location, closingDate) => {
    return `<li>
        <h3>${title}</h3>
        <section class="opportunity-details">
            <section>
                <p><b>Location:</b> ${location}<p>
                <p><b>Closes:</b> ${closingDate}</p>
            </section>
            <button>Apply</button>
        </section>
    </li>`;
};

const listCotainer = document.getElementById('opportunities');

// Dummy data for now. This will come from the server in this format
const opportunities = [
    {
        title: 'The Entelect Graduate Program - 2026',
        location: 'Melrose, Johannesburg, Gauteng',
        closingDate: '20-07-2026',
    },
    {
        title: 'Umuzi 2026 Learnership',
        location: 'Online, South Africa',
        closingDate: '10-03-2026',
    },
    {
        title: 'Gauteng Youth Learnership',
        location: 'Kagiso, Krugersdrop, Gauteng',
        closingDate: '10-03-2026',
    },
];

opportunities.forEach(({ title, location, closingDate }) => {
    listCotainer.innerHTML += getOpportunityElement(title, location, closingDate);
});
