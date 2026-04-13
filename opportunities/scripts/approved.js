const pageState = document.getElementById('page-state');
const pageContainer = document.getElementById('page-container');
const opportunities = document.getElementById('opportunities'); 

document.addEventListener('DOMContentLoaded', async () => {
    try {
        pageState.style.display = 'flex';
        pageState.innerHTML = '<p>Loading...</p>';
        const response = await fetch('http://localhost:3000/opportunities?status=Approved', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json(); 
        if (response.ok) {
            pageContainer.style.display = 'block';
            data.opportunities.forEach(({_id, title, location, closingDate }) => {
                opportunities.innerHTML += `<li>
                    <h3>${title}</h3>   
                    <section class="opportunity-details">
                        <section>
                            <p><b>Location:</b> ${location || 'Not provided'}<p>
                            <p><b>Closes:</b> ${closingDate.slice(0, 10)}</p>   
                            <button class="view-btn" data-id="${_id}">View Details</button>
                            </section>
                    </section>
                </li>`;
            }   );
            
            opportunities.addEventListener('click', (event) => {
                if (event.target.classList.contains('view-btn')) {
                    const id = event.target.getAttribute('data-id');
                    window.location.href = '../opportunities/view-details.html?id=' + id;
                }
            });
        }
    } catch (error) {   
        pageState.style.display = 'flex';
        pageState.innerHTML = '<p>An error occurred! Please try again later</p>';
        console.error('View opportunity error:', error);
    }   

    finally {
        pageState.style.display = 'none';
        pageState.innerHTML = '';
    }
});


    