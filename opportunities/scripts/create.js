const form = document.getElementById('create-opportunity-form');
const title = document.getElementById('title');
const closingDate = document.getElementById('closing-date');
const errorMessage = document.getElementById('error-message');
const submitBtn = document.getElementById('submit-btn');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!title.value) {
        errorMessage.style.display = 'block';
        errorMessage.innerHTML = 'Title required! Please provide the title of the opportunity';
        return;
    }

    if (!closingDate.value) {
        errorMessage.style.display = 'block';
        errorMessage.innerHTML = 'Closing date required! Please provide the closing date of the opportunity';
        return;
    }

    errorMessage.style.display = 'none';
    submitBtn.disabled = true;
    submitBtn.textContent = 'Loading...';

    try {
        const response = await fetch('http://localhost:3000/opportunities', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: title.value,
                closingDate: closingDate.value,
            }),
        });

        if (response.status === 201) {
            const data = await response.json();
            window.location.href = `/opportunities/view.html?id=${data.id}`;
        }
    } catch (error) {
        errorMessage.style.display = 'block';
        errorMessage.innerHTML = 'An error occurred! Please try again later';
        console.error('Create opportunity error:', error);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit for review';
    }
});
