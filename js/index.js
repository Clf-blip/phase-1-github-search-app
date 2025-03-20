document.addEventListener("DOMContentLoaded", () => {
    const searchForm = document.getElementById("github-form");
    const searchInput = document.getElementById("search");
    const userList = document.getElementById("user-list");
    const reposList = document.getElementById("repos-list");

    let searchType = "users"; // Default search type

    // Create and insert toggle button
    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = "Search Repositories";
    toggleBtn.style.marginLeft = "10px";
    searchForm.appendChild(toggleBtn);

    toggleBtn.addEventListener("click", (event) => {
        event.preventDefault();
        searchType = searchType === "users" ? "repos" : "users";
        searchInput.placeholder = `Search GitHub ${searchType}...`;
        toggleBtn.textContent = `Search ${searchType === "users" ? "Repositories" : "Users"}`;
        userList.innerHTML = ""; // Clear previous results
        reposList.innerHTML = ""; // Clear repo results
    });

    searchForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const query = searchInput.value.trim();
        if (!query) return;

        if (searchType === "users") {
            searchUsers(query);
        } else {
            searchRepositories(query);
        }
    });

    function searchUsers(query) {
        fetch(`https://api.github.com/search/users?q=${query}`, {
            headers: { "Accept": "application/vnd.github.v3+json" }
        })
        .then(response => response.json())
        .then(data => {
            userList.innerHTML = "";
            reposList.innerHTML = ""; // Clear repos list
            displayUsers(data.items);
        })
        .catch(error => console.error("Error fetching users:", error));
    }

    function searchRepositories(query) {
        fetch(`https://api.github.com/search/repositories?q=${query}`, {
            headers: { "Accept": "application/vnd.github.v3+json" }
        })
        .then(response => response.json())
        .then(data => {
            userList.innerHTML = ""; // Clear users list
            reposList.innerHTML = "";
            displayRepos(data.items);
        })
        .catch(error => console.error("Error fetching repositories:", error));
    }

    function displayUsers(users) {
        users.forEach(user => {
            const userItem = document.createElement("li");
            userItem.innerHTML = `
                <img src="${user.avatar_url}" alt="Avatar" width="50" height="50">
                <a href="${user.html_url}" target="_blank">${user.login}</a>
                <button class="repo-btn" data-username="${user.login}">View Repos</button>
            `;
            userList.appendChild(userItem);

            userItem.querySelector(".repo-btn").addEventListener("click", (event) => {
                const username = event.target.dataset.username;
                fetchUserRepos(username);
            });
        });
    }

    function fetchUserRepos(username) {
        fetch(`https://api.github.com/users/${username}/repos`, {
            headers: { "Accept": "application/vnd.github.v3+json" }
        })
        .then(response => response.json())
        .then(repos => {
            reposList.innerHTML = `<h3>Repositories of ${username}</h3>`;
            displayRepos(repos);
        })
        .catch(error => console.error("Error fetching repos:", error));
    }

    function displayRepos(repos) {
        repos.forEach(repo => {
            const repoItem = document.createElement("li");
            repoItem.innerHTML = `
                <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                <p>${repo.description || "No description available"}</p>
            `;
            reposList.appendChild(repoItem);
        });
    }
});
