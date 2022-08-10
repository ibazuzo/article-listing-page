let url = 'https://blogapp.bitdefender.com/hotforsecurity/ghost/api/v3/content/posts/?key=64578fbe66af3aee68c8947a0f&limit=10&include=tags&page=10';

const response = fetch(url)
    .then((response) => { return response.json(); })
    .then((data) => {

        let postsDataArr = data.posts;

        createUniqueTagsList(postsDataArr);
        generatePostsList(postsDataArr);

        filterDropdownEvent(postsDataArr);
        searchEvent(postsDataArr);

    })
    .catch((err) => { console.log('Request failed!', err) });

// #### Execute the search function as inputs are made in the search field. Displays the posts that have the search term.
function searchEvent(postsDataArr) {

    document.getElementById('searchBar').addEventListener('input', event => {

        let filteredPosts = searchPosts(event.target.value, postsDataArr);

        clearPostsList();
        generatePostsList(filteredPosts);

    });

}

// #### Search for the term in the post title, excerpt and in the html content of the post
function searchPosts(searchString, postsDataArr) {

    let searchLower = searchString.toLowerCase();

    let filteredPosts = postsDataArr.filter(post => {
        if (post.title.toLowerCase().includes(searchLower)) {
            return true;
        }

        if (post.excerpt.toLowerCase().includes(searchLower)) {
            return true;
        }

        // Search in the html property is not a good solution, as it contains html tags and links that can contain the search term. I included here to make the search work in the article content too, not only in the title and excerpt
        if (post.html.toLowerCase().includes(searchLower)) {
            return true;
        }

        return false;
    });

    return filteredPosts;


}

// #### Generate the list of tags for a post
function generatePostTagsListHtml(tagsData) {

    let htmlEl = '';

    for (let j in tagsData) {

        if (tagsData[j].visibility == 'public') {

            htmlEl += `<a href="${tagsData[j].url}" class="tags-item">${tagsData[j].name}</a>`

        }

    }

    return htmlEl;

}

// #### Create the list with the unique tags from all posts
function createUniqueTagsList(postsDataArr) {

    let tagsArr = [];
    addDropdownOption('All');

    for (let i in postsDataArr) {

        let tagsData = postsDataArr[i].tags;

        for (let i in tagsData) {

            if (tagsData[i].visibility == 'public' && !tagsArr.includes(tagsData[i].name)) {

                tagsArr.push(tagsData[i].name);

            }

        }

    }

    tagsArr.sort();

    for (let i in tagsArr) {

        addDropdownOption(tagsArr[i]);

    }

}

// #### Add each tag to the dropdown/select element in page
function addDropdownOption(tagName) {

    let option = document.createElement('option');
    option.value = tagName;
    option.innerHTML = tagName;

    document.getElementById('filter-dropdown').appendChild(option);

}

// #### Display the list of valid posts in the page
function generatePostsList(postsDataArr) {

    for (let i in postsDataArr) {

        let postData = postsDataArr[i];

        let postRow = `
            <!-- Post -->
            <div class="row align-items-center flex-wrap mb-5">
                <div class="col-md-3 col-12 entry-img">
                    <a href="${postData.url}"><img src="${postData.feature_image}" alt="${postData.title}" class="img-fluid" /> </a>
                </div>
                <div class="col-md-9 col-12 ps-md-4 pt-lg-0 pt-3 entry-content">
                    <div class="entry-tags">${generatePostTagsListHtml(postData.tags)}</div>
                    <h3 class="entry-title">
                        <a href="${postData.url}">${postData.title}</a>
                    </h3>
                    <a href="${postData.url}">
                        <p class="entry-desc">
                            ${postData.excerpt}
                        </p>
                    </a>
                </div>
            </div>`;

        document.getElementById('articles-container').innerHTML += postRow;

    }

}

// #### Show only the posts that have the selected tag from the dropdown list
function filterDropdownEvent(postsDataArr) {

    document.getElementById('filter-dropdown').addEventListener('change', event => {

        let selectedOption = event.target.value;

        let displayedPosts = (selectedOption == 'All') ? postsDataArr : postsDataArr.filter(post => {

            let filteredPosts = post.tags.find(tag => {
                if (tag.name == event.target.value) {
                    return true;
                }

                return false;
            });

            return filteredPosts;


        })

        clearPostsList();
        generatePostsList(displayedPosts);


    });

}

// #### Remove the posts from the page
function clearPostsList() {

    const parent = document.getElementById('articles-container');

    while (parent.lastChild) {
        parent.removeChild(parent.lastChild)
    }

}