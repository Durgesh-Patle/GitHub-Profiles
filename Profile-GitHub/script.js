const APIURL = 'https://api.github.com/users/'   // Base URL for the GitHub API

const main = document.getElementById('main')
const form = document.getElementById('form')
const search = document.getElementById('search')

// fetch user data from the GitHub API.
async function getUser(username) {
    try {
        const { data } = await axios(APIURL + username)

        createUserCard(data)  // Create User Card to All Info
        
        getRepos(username)
    } catch(err) {
        if(err.response.status == 404) {
            createErrorCard('No Profile with This Username') // User Name Are not Found.
        }
    }
}

// Fetch a user's repositories from the GitHub API
async function getRepos(username) {
    try {
        const { data } = await axios(APIURL + username + '/repos?sort=created')

        addReposToCard(data)
    } catch(err) {
        createErrorCard('Problem fetching repos') // If an error occurs while fetching repos, create an error card with a message
    }
}

function createUserCard(user) {
    const userID = user.name || user.login
    
    const userBio = user.bio ? `<p>${user.bio}</p>` : ''
    
    const cardHTML = `
    <div class="card">
        <div>
            <img src="${user.avatar_url}" alt="${user.name}" class="avatar">
        </div>
        <div class="user-info">
            <h2>${userID}</h2>
            ${userBio}
            <ul>
                <li>${user.followers} <strong>Followers</strong></li>
                <li>${user.following} <strong>Following</strong></li>
                <li>${user.public_repos} <strong>Repos</strong></li>
            </ul>
            <div id="repos"></div> <!-- Container for the user's repositories -->
        </div>
    </div>
    `
    main.innerHTML = cardHTML
}

function createErrorCard(msg) {
    const cardHTML = `
        <div class="card">
            <h1>${msg}</h1>
        </div>
    `
    main.innerHTML = cardHTML
}

function addReposToCard(repos) {
    const reposEl = document.getElementById('repos')

    repos
        .slice(0, 5)
        .forEach(repo => {
            const repoEl = document.createElement('a')
            repoEl.classList.add('repo')
            repoEl.href = repo.html_url
            repoEl.target = '_blank'
            repoEl.innerText = repo.name
            reposEl.appendChild(repoEl)
        })
}

form.addEventListener('submit', (e) => {
    e.preventDefault()

    const user = search.value

    if(user) {
        getUser(user)
        search.value = ''
    }
})
