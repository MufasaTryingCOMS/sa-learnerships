const getOpportunityElement = (title, location, closingDate) => {
    return `<li>
        <h3>${title}</h3>
        <section class="opportunity-details">
            <section>
                <p><b>Location:</b> ${location}<p>
                <p><b>Closes:</b> ${closingDate}</p>
            </section>
            <section>
                <button class="approve-btn">Approve</button>
                <button class="remove-btn">Remove</button>
            </section>
        </section>
    </li>`;
};

const listCotainer = document.getElementById('opportunities');

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
