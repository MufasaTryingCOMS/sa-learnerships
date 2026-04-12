const opportunitiesNav = document.getElementById('opportunities-nav');
const opportunitiesNavOptions = document.getElementById('opportunities-nav-options');
const opportunitiesNavImage = document.getElementById('opportunities-nav-image');
const sidebarOptions = document.getElementById('sidebar-options');

document.addEventListener('DOMContentLoaded', async () => {
    // Load the opportunities options on the sidebar based on the role of the user
    const applicantOptions = `<ul>
        <li><a href="/opportunities/index.html">All Opportunities</a></li>
        <li><a href="/opportunities/analytics.html">Analytics</a></li>
    </ul>`;

    const providerOptions = `<ul>
        <li><a href="/opportunities/index.html">All Opportunities</a></li>
        <li><a href="/opportunities/mine.html">Your Opportunities</a></li>
        <li><a href="/opportunities/create.html">Create</a></li>
        <li><a href="/opportunities/analytics.html">Analytics</a></li>
    </ul>`;

    const adminOptions = `<ul>
        <li><a href="/opportunities/index.html">All Opportunities</a></li>
        <li><a href="/opportunities/mine.html">Your Opportunities</a></li>
        <li><a href="/opportunities/approved.html">Approved</a></li>
        <li><a href="/opportunities/pending.html">Pending</a></li>
        <li><a href="/opportunities/rejected.html">Rejected</a></li>
        <li><a href="/opportunities/create.html">Create</a></li>
        <li><a href="/opportunities/analytics.html">Analytics</a></li>
    </ul>`;

    const strongUserRole = 'admin';

    if (strongUserRole === 'applicant') opportunitiesNavOptions.innerHTML = applicantOptions;
    else if (strongUserRole === 'provider') opportunitiesNavOptions.innerHTML = providerOptions;
    else if (strongUserRole === 'admin') {
        opportunitiesNavOptions.innerHTML = adminOptions;

        // Add a control center navigation option on the sidebar
        sidebarOptions.insertAdjacentHTML(
            'beforeend',
            `<li><section class="heading">
                <p>Control Center</p>
                <img src="/assets/right-arrow.png" />
            </section></li>`,
        );
    }
});

opportunitiesNav.addEventListener('click', () => {
    const optionsDisplay = window.getComputedStyle(opportunitiesNavOptions).display;
    if (optionsDisplay !== 'none') {
        opportunitiesNav.style.backgroundColor = '#ffffff';
        opportunitiesNavImage.src = '../assets/right-arrow.png';
        opportunitiesNavOptions.style.display = 'none';
    } else {
        opportunitiesNav.style.backgroundColor = '#dfdfdf';
        opportunitiesNavImage.src = '../assets/down-arrow.png';
        opportunitiesNavOptions.style.display = 'block';
    }
});
