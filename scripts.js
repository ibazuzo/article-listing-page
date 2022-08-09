console.log('bing2');
let url = 'https://blogapp.bitdefender.com/hotforsecurity/ghost/api/v3/content/posts/?key=64578fbe66af3aee68c8947a0f&limit=10&include=tags&page=10';
// let jsonData;

const response = fetch(url)
    .then((response) => { return response.json(); })
    .then((data) => {

        console.log(data);
        // jsonData = data;

        let postsDataArr = data.posts;
        console.log(postsDataArr);

        fillFilterDropdown(postsDataArr);
        fillArticlesList(postsDataArr);

        selectFilterOptionEvent(postsDataArr);

    })
    // .then(() => {

    //     console.log('jsonData:');
    //     console.log(jsonData);


    // })
    .catch((err) => { console.log('Request failed!', err) });




function generatePostTagsListHtml(tagsData) {

    let htmlEl = '';

    for (let j in tagsData) {

        if (tagsData[j].visibility == 'public') {

            htmlEl += `<a href="${tagsData[j].url}" class="tags-item">${tagsData[j].name}</a>`

        }

    }

    return htmlEl;

}

function fillFilterDropdown(postsDataArr) {

    let tagsArr = [];
    addDropdownOption('All');

    for (let i in postsDataArr) {

        let tagsData = postsDataArr[i].tags;

        for (let i in tagsData) {

            if (tagsData[i].visibility == 'public' && !tagsArr.includes(tagsData[i].name)) {

                tagsArr.push(tagsData[i].name);
                addDropdownOption(tagsData[i].name);

            }

        }

    }

    return tagsArr;

}

function addDropdownOption(tagName) {

    let option = document.createElement('option');
    option.value = tagName;
    option.innerHTML = tagName;

    document.getElementById('filter-dropdown').appendChild(option);

}

function fillArticlesList(postsDataArr) {

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

function selectFilterOptionEvent(postsDataArr) {

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
        fillArticlesList(displayedPosts);


    });

}

function clearPostsList() {

    const parent = document.getElementById('articles-container');

    while (parent.lastChild) {
        parent.removeChild(parent.lastChild)
    }

}