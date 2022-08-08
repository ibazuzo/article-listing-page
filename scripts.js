console.log('bing2');
let url = 'https://blogapp.bitdefender.com/hotforsecurity/ghost/api/v3/content/posts/?key=64578fbe66af3aee68c8947a0f&limit=10&include=tags&page=10';
let ul = 

fetch(url)
    .then( (response) => {
        return response.json();
    })
    .then( (data) => {
        console.log(data);
    });